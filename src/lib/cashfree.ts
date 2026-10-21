import crypto from 'crypto';
import { adminClient } from '@/lib/server';
import { sendOrderConfirmation } from '@/lib/email';
import { autoShip } from '@/lib/shiprocket';

// Cashfree Payment Gateway (PG API). Keys live only in Vercel env:
//   CASHFREE_APP_ID, CASHFREE_SECRET_KEY, CASHFREE_ENV = production | sandbox (default production)
const VERSION = '2025-01-01';
export const cfMode = () => (process.env.CASHFREE_ENV === 'sandbox' ? 'sandbox' : 'production') as 'sandbox' | 'production';
const base = () => (cfMode() === 'sandbox' ? 'https://sandbox.cashfree.com/pg' : 'https://api.cashfree.com/pg');
export const cfConfigured = () => !!(process.env.CASHFREE_APP_ID && process.env.CASHFREE_SECRET_KEY);

async function cf(path: string, init: { method?: string; body?: unknown } = {}) {
  const r = await fetch(base() + path, {
    method: init.method ?? 'GET', cache: 'no-store',
    headers: { 'Content-Type': 'application/json', 'x-api-version': VERSION, 'x-client-id': process.env.CASHFREE_APP_ID!, 'x-client-secret': process.env.CASHFREE_SECRET_KEY! },
    body: init.body ? JSON.stringify(init.body) : undefined,
  });
  const j = await r.json().catch(() => ({}));
  return { ok: r.ok, status: r.status, j: j as Record<string, any> };
}

export const getCfOrder = (id: string) => cf(`/orders/${encodeURIComponent(id)}`);

type Ord = { order_no: string; total: number | string; email: string | null; phone: string | null; full_name: string | null; access_token: string };

/** Returns a payment session for this shop order, re-using the live Cashfree order on retries and
 *  opening a fresh one (KH10001_2, _3 …) only when the previous one expired or was terminated. */
export async function cfSession(o: Ord, prevRef: string | null, origin: string) {
  if (prevRef) {
    const g = await getCfOrder(prevRef);
    if (g.ok && g.j.order_status === 'ACTIVE' && g.j.payment_session_id) return { ref: prevRef, session: g.j.payment_session_id as string };
    if (g.ok && g.j.order_status === 'PAID') return { ref: prevRef, paid: true as const };
  }
  const phone = String(o.phone ?? '').replace(/\D/g, '').slice(-10);
  const expiry = new Date(Date.now() + 40 * 60 * 1000).toISOString().replace(/\.\d{3}Z$/, 'Z'); // stock is released after 45 min
  for (let n = prevRef ? Number(prevRef.split('_')[1] ?? 1) + 1 : 1; n < 10; n++) {
    const id = n === 1 ? o.order_no : `${o.order_no}_${n}`;
    const c = await cf('/orders', { method: 'POST', body: {
      order_id: id, order_amount: Number(Number(o.total).toFixed(2)), order_currency: 'INR', order_note: `Khushilo order ${o.order_no}`,
      order_expiry_time: expiry,
      customer_details: { customer_id: `c${phone || o.order_no.replace(/\W/g, '')}`, customer_phone: phone, customer_email: o.email ?? undefined, customer_name: o.full_name ?? undefined },
      order_meta: { return_url: `${origin}/order/${o.order_no}?t=${o.access_token}&cf=1`, notify_url: `${origin}/api/cashfree/webhook` },
    } });
    if (c.ok) return { ref: id, session: c.j.payment_session_id as string };
    if (c.status !== 409) throw new Error(c.j.message ?? 'Payment gateway error');
    const g = await getCfOrder(id); // id already used: reuse if still payable
    if (g.ok && g.j.order_status === 'ACTIVE') return { ref: id, session: g.j.payment_session_id as string };
    if (g.ok && g.j.order_status === 'PAID') return { ref: id, paid: true as const };
  }
  throw new Error('Could not start payment, please try again');
}

/** Marks an order paid exactly once, then sends the confirmation email and books the shipment. */
export async function markPaid(orderNo: string, ref: string, note: string, origin: string) {
  const db = adminClient();
  const { data } = await db.from('orders').update({ payment_status: 'paid', status: 'confirmed', payment_ref: ref, notes: note, updated_at: new Date().toISOString() })
    .eq('order_no', orderNo).neq('payment_status', 'paid').select('id');
  if (!data?.length) return false; // already handled (verify and webhook can both arrive)
  await sendOrderConfirmation(orderNo, origin).catch(e => console.error('[email]', e));
  await autoShip(orderNo);
  return true;
}

/** Asks Cashfree for the real status of an order — the browser's word is never trusted. */
export async function cfSuccessfulPayment(ref: string) {
  const g = await getCfOrder(ref);
  if (!g.ok || g.j.order_status !== 'PAID') return null;
  const p = await cf(`/orders/${encodeURIComponent(ref)}/payments`);
  const ok = Array.isArray(p.j) ? (p.j as Record<string, any>[]).find(x => x.payment_status === 'SUCCESS') : null;
  return { amount: Number(g.j.order_amount), payment_id: ok?.cf_payment_id ? String(ok.cf_payment_id) : '', group: ok?.payment_group ?? '' };
}

export function cfSignatureOk(raw: string, ts: string | null, sig: string | null) {
  if (!ts || !sig || !process.env.CASHFREE_SECRET_KEY) return false;
  const exp = crypto.createHmac('sha256', process.env.CASHFREE_SECRET_KEY).update(ts + raw).digest('base64');
  return exp.length === sig.length && crypto.timingSafeEqual(Buffer.from(exp), Buffer.from(sig));
}

/** Shop order number from a Cashfree order id (KH10001 or KH10001_2). */
export const shopOrderNo = (ref: string) => ref.split('_')[0];
