'use client';
import { GATEWAY, type Gateway } from './gateway';

type CfInstance = { checkout: (o: { paymentSessionId: string; redirectTarget: '_modal' | '_self' }) => Promise<{ error?: { message?: string }; redirect?: boolean; paymentDetails?: unknown }> };
declare global { interface Window {
  Razorpay?: new (o: Record<string, unknown>) => { open: () => void; on: (e: string, cb: (r: unknown) => void) => void };
  Cashfree?: (o: { mode: 'sandbox' | 'production' }) => CfInstance;
} }

function loadScript(src: string, ready: () => boolean) {
  return new Promise<void>((res, rej) => {
    if (ready()) return res();
    const s = document.createElement('script'); s.src = src;
    s.onload = () => res(); s.onerror = () => rej(new Error('Could not load payment window')); document.body.appendChild(s);
  });
}

/** Asks the server whether Cashfree has received the money for this order. */
export async function verifyCashfree(order_no: string, token: string): Promise<boolean> {
  const v = await fetch('/api/cashfree/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ order_no, token }) });
  return v.ok && !!(await v.json()).paid;
}

async function payCashfree(order_no: string, token: string): Promise<boolean> {
  await loadScript('https://sdk.cashfree.com/js/v3/cashfree.js', () => !!window.Cashfree);
  const r = await fetch('/api/cashfree/order', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ order_no, token }) });
  const o = await r.json();
  if (r.status === 409 && /already paid/i.test(o.error ?? '')) return true;
  if (!r.ok) throw new Error(o.error || 'Payment could not be started');
  const res = await window.Cashfree!({ mode: o.mode }).checkout({ paymentSessionId: o.session, redirectTarget: '_modal' });
  if (res.redirect) return false; // bank/UPI page took over; the order page verifies on return (?cf=1)
  // Window closed: success, failure or dismissed — Cashfree's server has the final word.
  return verifyCashfree(order_no, token).catch(() => false);
}

async function payRazorpay(order_no: string, token: string): Promise<boolean> {
  await loadScript('https://checkout.razorpay.com/v1/checkout.js', () => !!window.Razorpay);
  const r = await fetch('/api/razorpay/order', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ order_no, token }) });
  const o = await r.json();
  if (!r.ok) throw new Error(o.error || 'Payment could not be started');
  return new Promise(resolve => {
    const rz = new window.Razorpay!({
      key: o.key, order_id: o.razorpay_order_id, amount: o.amount, currency: 'INR', name: 'Khushilo', description: `Order ${order_no}`,
      prefill: { name: o.name, email: o.email, contact: o.phone }, theme: { color: '#b5261a' },
      handler: async (resp: Record<string, string>) => {
        const v = await fetch('/api/razorpay/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ order_no, token, ...resp }) });
        resolve(v.ok);
      },
      modal: { ondismiss: () => resolve(false) },
    });
    rz.on('payment.failed', () => resolve(false));
    rz.open();
  });
}

/** Opens the payment window for an existing order. Resolves true once the payment is confirmed server-side.
 *  Retries reuse the same gateway order (CHK-007). Older orders keep the gateway they were placed with. */
export function payOrder(order_no: string, token: string, method: string = GATEWAY): Promise<boolean> {
  return (method as Gateway) === 'razorpay' ? payRazorpay(order_no, token) : payCashfree(order_no, token);
}
