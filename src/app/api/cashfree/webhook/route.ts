import { NextResponse } from 'next/server';
import { adminClient } from '@/lib/server';
import { cfSignatureOk, cfSuccessfulPayment, markPaid, shopOrderNo } from '@/lib/cashfree';

// Backup confirmation in case the customer closes the tab before /verify runs.
// Cashfree sends this to the notify_url set on each order (…/api/cashfree/webhook) — no dashboard setup needed,
// though it can also be added under Developers → Webhooks for payment success / failed / user dropped.
export async function POST(req: Request) {
  const raw = await req.text();
  if (!cfSignatureOk(raw, req.headers.get('x-webhook-timestamp'), req.headers.get('x-webhook-signature')))
    return NextResponse.json({ error: 'Bad signature' }, { status: 400 });
  const evt = JSON.parse(raw);
  const ref: string | undefined = evt?.data?.order?.order_id;
  if (!ref) return NextResponse.json({ ok: true });
  const db = adminClient();
  const { data: o } = await db.from('orders').select('order_no, total, payment_status').eq('order_no', shopOrderNo(ref)).maybeSingle();
  if (!o) return NextResponse.json({ ok: true });
  if (evt.type === 'PAYMENT_SUCCESS_WEBHOOK') {
    const p = await cfSuccessfulPayment(ref); // double-check with Cashfree before marking paid
    if (p && Math.abs(p.amount - Number(o.total)) <= 0.01)
      await markPaid(o.order_no, ref, `cashfree_payment_id=${p.payment_id}${p.group ? ` (${p.group})` : ''}`, new URL(req.url).origin);
  } else if (evt.type === 'PAYMENT_FAILED_WEBHOOK' || evt.type === 'PAYMENT_USER_DROPPED_WEBHOOK') {
    await db.from('orders').update({ payment_status: 'failed' }).eq('order_no', o.order_no).eq('payment_status', 'pending');
  }
  return NextResponse.json({ ok: true });
}
