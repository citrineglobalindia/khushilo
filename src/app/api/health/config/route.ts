import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Which server keys are present in this deployment — true/false only, never the values.
export async function GET(req: Request) {
  const has = (k: string) => !!process.env[k];
  // ?check=brevo asks Brevo whether the API key is accepted (no email is sent).
  let brevo_check: string | undefined;
  if (new URL(req.url).searchParams.get('check') === 'brevo' && process.env.BREVO_API_KEY) {
    const k = process.env.BREVO_API_KEY.trim();
    const r = await fetch('https://api.brevo.com/v3/account', { headers: { 'api-key': k, accept: 'application/json' }, cache: 'no-store' }).catch(() => null);
    const j = r ? await r.json().catch(() => ({})) : {};
    brevo_check = !r ? 'unreachable' : r.ok ? `ok (${(j as { email?: string }).email?.replace(/^(.{2}).*@/, '$1…@') ?? 'account'})` : `rejected ${r.status}: ${(j as { message?: string }).message ?? ''}`;
    brevo_check += k.startsWith('xsmtpsib-') ? ' — this is an SMTP key, not an API key' : '';
  }
  return NextResponse.json({
    supabase_service: has('SUPABASE_SERVICE_ROLE_KEY'),
    cashfree: has('CASHFREE_APP_ID') && has('CASHFREE_SECRET_KEY'),
    cashfree_env: (process.env.CASHFREE_APP_ID ?? '').trim().toUpperCase().startsWith('TEST') ? 'sandbox' : 'production',
    razorpay: has('RAZORPAY_KEY_ID') && has('RAZORPAY_KEY_SECRET'),
    brevo: has('BREVO_API_KEY'),
    shiprocket: has('SHIPROCKET_EMAIL') && has('SHIPROCKET_PASSWORD'),
    brevo_check,
    deployed: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? null,
  }, { headers: { 'cache-control': 'no-store' } });
}
