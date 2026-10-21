// Which online payment gateway new orders use. Cashfree by default; set NEXT_PUBLIC_PAYMENT_GATEWAY=razorpay in Vercel to switch back.
export type Gateway = 'cashfree' | 'razorpay';
export const GATEWAY: Gateway = process.env.NEXT_PUBLIC_PAYMENT_GATEWAY === 'razorpay' ? 'razorpay' : 'cashfree';
export const gatewayName = (m: string) => (m === 'razorpay' ? 'Razorpay' : m === 'cashfree' ? 'Cashfree' : 'Cash on delivery');
