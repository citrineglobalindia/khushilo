import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Which server keys are present in this deployment — true/false only, never the values.
export function GET() {
  const has = (k: string) => !!process.env[k];
  return NextResponse.json({
    supabase_service: has('SUPABASE_SERVICE_ROLE_KEY'),
    cashfree: has('CASHFREE_APP_ID') && has('CASHFREE_SECRET_KEY'),
    cashfree_env: process.env.CASHFREE_ENV === 'sandbox' ? 'sandbox' : 'production',
    razorpay: has('RAZORPAY_KEY_ID') && has('RAZORPAY_KEY_SECRET'),
    brevo: has('BREVO_API_KEY'),
    shiprocket: has('SHIPROCKET_EMAIL') && has('SHIPROCKET_PASSWORD'),
    deployed: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? null,
  }, { headers: { 'cache-control': 'no-store' } });
}
