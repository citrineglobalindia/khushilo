import { NextResponse } from 'next/server';
import { adminClient } from '@/lib/server';
import { cfConfigured, cfSuccessfulPayment, markPaid } from '@/lib/cashfree';

// Called after the Cashfree window closes or the customer returns from a bank/UPI page.
// Status is read from Cashfree's server, never from the browser.
export async function POST(req: Request) {
  const { order_no, token } = await req.json().catch(() => ({}));
  if (!cfConfigured()) return NextResponse.json({ error: 'Not configured' }, { status: 503 });
  const db = adminClient();
  const { data: o } = await db.from('orders').select('id, order_no, total, payment_status, payment_ref').eq('order_no', order_no).eq('access_token', token).maybeSingle();
  if (!o) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  if (o.payment_status === 'paid') return NextResponse.json({ ok: true, paid: true });
  if (!o.payment_ref) return NextResponse.json({ ok: true, paid: false });
  const p = await cfSuccessfulPayment(o.payment_ref);
  if (!p) return NextResponse.json({ ok: true, paid: false });
  if (Math.abs(p.amount - Number(o.total)) > 0.01) { console.error('[cashfree] amount mismatch', o.order_no, p.amount, o.total); return NextResponse.json({ error: 'Amount mismatch' }, { status: 400 }); }
  await markPaid(o.order_no, o.payment_ref, `cashfree_payment_id=${p.payment_id}${p.group ? ` (${p.group})` : ''}`, new URL(req.url).origin);
  return NextResponse.json({ ok: true, paid: true });
}
