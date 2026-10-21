import { NextResponse } from 'next/server';
import { adminClient } from '@/lib/server';
import { cfConfigured, cfMode, cfSession, markPaid } from '@/lib/cashfree';

// Starts (or resumes, for retries) a Cashfree payment for a Khushilo order. Amount always comes from the DB.
export async function POST(req: Request) {
  const { order_no, token } = await req.json().catch(() => ({}));
  if (!cfConfigured()) return NextResponse.json({ error: 'Online payments are not configured' }, { status: 503 });
  const db = adminClient();
  const { data: o } = await db.from('orders').select('id, order_no, total, payment_status, payment_ref, payment_method, status, email, phone, full_name, access_token')
    .eq('order_no', order_no).eq('access_token', token).maybeSingle();
  if (!o) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  if (o.payment_status === 'paid') return NextResponse.json({ error: 'Order already paid' }, { status: 409 });
  if (o.status === 'cancelled') return NextResponse.json({ error: 'This order was cancelled. Please place a new order.' }, { status: 409 });
  const origin = new URL(req.url).origin;
  try {
    const s = await cfSession(o, o.payment_method === 'cashfree' ? o.payment_ref : null, origin);
    if ('paid' in s) { await markPaid(o.order_no, s.ref, 'Cashfree: paid', origin); return NextResponse.json({ error: 'Order already paid' }, { status: 409 }); }
    if (s.ref !== o.payment_ref) await db.from('orders').update({ payment_ref: s.ref }).eq('id', o.id);
    return NextResponse.json({ session: s.session, mode: cfMode() });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Payment gateway error' }, { status: 502 });
  }
}
