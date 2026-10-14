import type { Metadata, Viewport } from 'next';
import { BRAND } from '@/lib/brand';
import { Baloo_2, Instrument_Sans } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { CartProvider } from '@/lib/cart';
import { SITE_URL } from '@/lib/format';

const display = Baloo_2({ subsets: ['latin'], variable: '--f-display', display: 'swap', weight: ['500', '600', '700'] });
const sans = Instrument_Sans({ subsets: ['latin'], variable: '--f-sans', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'Khushilo — Pure Spices, Perfect Taste', template: '%s | Khushilo' },
  description: 'Pure, GC-MS tested essential and carrier oils made in India. Shop lavender, rosemary, tea tree, peppermint and more.',
  openGraph: { siteName: 'Khushilo', type: 'website', locale: 'en_IN' },
  icons: { icon: [{ url: '/favicon.png', sizes: '48x48' }, { url: BRAND.icon, sizes: '512x512' }], apple: '/brand/icon-192.png' },
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#e53624' };

const GTM = process.env.NEXT_PUBLIC_GTM_ID;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${display.variable} ${sans.variable}`}>
      <body>
        {GTM && <Script id="gtm" strategy="afterInteractive">{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM}');`}</Script>}
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
