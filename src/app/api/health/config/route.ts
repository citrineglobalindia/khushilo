import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Which server keys are present in this deployment — true/false only, never the values.
export async function GET(req: Request) {
  const has = (k: string) => !!process.env[k];
  // ?check=brevo asks Brevo whether the API key is accepted (no email is sent).
  let brevo_check: string | undefined;
  if (new URL(req.url).searchParams.get('check') === 'brevo' && process.env.BREVO_API_KEY) {
    const k = process.env.BREVO_API_KEY.trim();
    if (k.startsWith('xsmtpsib-')) {
      try {
        const nodemailer = (await import('nodemailer')).default;
        await nodemailer.createTransport({ host: 'smtp-relay.brevo.com', port: 587, secure: false, auth: { user: (process.env.BREVO_SMTP_LOGIN || 'b3e721001@smtp-brevo.com').trim(), pass: k } }).verify();
        brevo_check = 'ok (SMTP key)';
      } catch (e) { brevo_check = `SMTP login rejected: ${e instanceof Error ? e.message.slice(0, 120) : 'error'}`; }
    } else {
      const r = await fetch('https://api.brevo.com/v3/account', { headers: { 'api-key': k, accept: 'application/json' }, cache: 'no-store' }).catch(() => null);
      brevo_check = !r ? 'unreachable' : r.ok ? 'ok (API key)' : `rejected ${r.status}`;
    }
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
