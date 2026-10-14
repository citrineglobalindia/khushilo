import type { Metadata } from 'next';
import Link from 'next/link';
import { LeafIcon, FlaskIcon, PinIcon, BoxIcon } from '@/components/Icons';
import { Bottle } from '@/components/Bottle';
import { SITE_URL } from '@/lib/format';

// Placeholder "Our story" — replace the copy with Khushilo's own story when ready (only facts supplied by the business are used here).
export const metadata: Metadata = {
  title: { absolute: 'About Khushilo — Pure Spices, Perfect Taste' },
  description: 'Khushilo makes masala blends and spice powders in Bengaluru — sambar, rasam, bisi bele bath, donne biryani, chicken masala and everyday spice powders in 100 g packs.',
  alternates: { canonical: '/about' },
};

const POINTS = [
  [PinIcon, 'From Bengaluru', 'Khushilo is a Bengaluru brand, starting with the flavours of Karnataka kitchens.'],
  [LeafIcon, 'FSSAI licensed', 'Licence no. 21225184000998. GSTIN 29AQYPD3713H1ZJ.'],
  [BoxIcon, '100 g packs', 'Every masala and spice powder comes in a 100 g pack, so it stays fresh in your dabba.'],
  [FlaskIcon, 'Twelve to start', 'Eight masala blends and four everyday spice powders — with more on the way.'],
] as const;

export default function About() {
  const ld = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'About Us', item: `${SITE_URL}/about` }] };
  return (
    <div className="wrap" style={{ paddingBottom: 48 }}>
      <nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden>/</span><span aria-current="page">About Us</span></nav>
      <section style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', alignItems: 'center', padding: '8px 0 32px' }}>
        <div style={{ display: 'grid', gap: 14 }}>
          <span className="hero-eyebrow">OUR STORY</span>
          <h1>Pure spices, perfect taste</h1>
          <p style={{ fontSize: 17, lineHeight: 1.7 }}>Khushilo brings you masala blends and spice powders for everyday Indian cooking — from a Sunday pot of sambar or bisi bele bath to a weekend donne biryani.</p>
          <p className="muted" style={{ lineHeight: 1.7 }}>Questions about a product, bulk orders or reselling? Write to <a className="link" href="mailto:khushiloindia@gmail.com">khushiloindia@gmail.com</a> or message us on WhatsApp.</p>
          <Link className="btn btn-primary" href="/shop" style={{ justifySelf: 'start' }}>Shop all spices</Link>
        </div>
        <div aria-hidden style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
          <div style={{ width: 120 }}><Bottle color="#a8431e" label="Sambar Powder" /></div>
          <div style={{ width: 120, marginTop: 32 }}><Bottle color="#5e3a1f" label="Donne Biryani Masala" /></div>
          <div style={{ width: 120 }}><Bottle color="#e0a10b" label="Turmeric Powder" /></div>
        </div>
      </section>
      <section style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))' }}>
        {POINTS.map(([Icon, h, t]) => (
          <div key={h} className="panel" style={{ display: 'grid', gap: 8, padding: 20 }}>
            <span style={{ color: 'var(--forest)' }}><Icon size={22} /></span>
            <h3>{h}</h3>
            <p className="muted" style={{ lineHeight: 1.6 }}>{t}</p>
          </div>))}
      </section>
      <p className="muted" style={{ marginTop: 28, fontSize: 13.5 }}>Khushilo · No 403, 12th Cross, 2nd Main, Hollywood Saloon, Kaveripura, Kamakshipalya, Bengaluru, Karnataka 560079</p>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </div>
  );
}
