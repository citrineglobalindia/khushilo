import Link from 'next/link';
import { getConcerns, getProducts, getSettings } from '@/lib/data';
import { getPromotions } from '@/lib/growth';
import { PromoBanner } from '@/components/PromoBanner';
import { ProductCard } from '@/components/ProductCard';
import { BannerHero, type Banner } from '@/components/BannerHero';
import { LeadForm } from '@/components/LeadForm';
import { Bottle, Sprig } from '@/components/Bottle';

// Photos for the "Shop by dish" tiles (public/dishes).
const DISH_IMG: Record<string, string> = { 'south-indian': '/dishes/south-indian.webp', 'biryani-non-veg': '/dishes/biryani-non-veg.webp', everyday: '/dishes/everyday.webp', 'snacks-chaat': '/dishes/snacks-chaat.webp' };

export default async function Home() {
  const [products, concerns, settings, promos] = await Promise.all([getProducts(), getConcerns(), getSettings(), getPromotions()]);
  const banner = promos.find(x => x.kind === 'banner');
  const on = (k: string) => settings.sections[k] !== false;
  const best = products.filter(p => p.is_bestseller).slice(0, 4);
  const fresh = [...products].filter(p => p.is_new).sort((a, b) => (b.created_at ?? '').localeCompare(a.created_at ?? '')).slice(0, 4);
  // Lifestyle shots: any product whose second image is a scene photo (biryani first for the big tile).
  const spots = [...products].filter(p => p.images[1]).sort((a, b) => Number(b.slug.includes('biryani')) - Number(a.slug.includes('biryani'))).slice(0, 3);
  // Desktop banners supplied by Khushilo (2048×768); phones use the taller versions.
  const banners: Banner[] = [
    { id: 'bn-donne', desktop: '/banners/donne-biryani-v2.webp', mobile: '/banners/donne-biryani-m.webp', href: '/product/donne-biryani-masala', alt: 'Donne Biryani, now at home — Khushilo Donne Biryani Masala, warm, peppery and aromatic. ₹98 for a 100 g pack. Shop now.' },
    { id: 'bn-turmeric', desktop: '/banners/turmeric-v2.webp', mobile: '/banners/turmeric-m.webp', href: '/product/turmeric-powder', alt: 'Pure Turmeric, Golden Goodness — Khushilo Turmeric Powder, ₹45 for a 100 g pack. Shop now.' },
    { id: 'bn-chaat', desktop: '/banners/chaat-masala-v2.webp', mobile: '/banners/chaat-masala-m.webp', href: '/product/chaat-masala', alt: 'Chaat time, every time — Khushilo Chaat Masala for snacks and street food, ₹89 for a 100 g pack. Shop now.' },
  ];
  return <>
    <BannerHero banners={banners} title="Khushilo — Pure Spices, Perfect Taste" />
    <div className="trustbar"><div className="wrap"><span>FSSAI licensed</span><span>100 g packs</span><span>UPI · Cards · COD</span><span>Free delivery above ₹999</span></div></div>
    {banner && <PromoBanner p={banner} />}

    {on('concerns') && <section className="section wrap" aria-labelledby="concern-h">
      <div className="section-head"><div><h2 id="concern-h">Shop by Dish</h2><p className="muted">Find the right masala for what you’re cooking today.</p></div><Link className="btn btn-ghost btn-pill" href="/shop">View all</Link></div>
      <div className="concerns">
        {concerns.map(c => <Link key={c.slug} href={`/concern/${c.slug}`} className="concern"><div className="art">{DISH_IMG[c.slug] ? <img src={DISH_IMG[c.slug]} alt="" loading="lazy" /> : <Sprig color={c.color} />}</div><span>{c.name}</span></Link>)}
      </div>
    </section>}

    {spots.length > 0 && <section className="section wrap" aria-labelledby="spot-h" style={{ paddingTop: 0 }}>
      <div className="section-head"><div><h2 id="spot-h">From the Khushilo kitchen</h2><p className="muted">Our packs, and what they turn into.</p></div></div>
      <div className="spotlight">{spots.map((p, i) => (
        <Link key={p.id} href={`/product/${p.slug}`} className="spot">
          <img src={p.images[1]} alt={`${p.name} with a finished dish`} loading={i ? 'lazy' : 'eager'} />
          <div className="spot-copy"><span className="hero-eyebrow">{p.category === 'masalas' ? 'MASALA BLEND' : 'SPICE POWDER'} · 100 G</span><h3>{p.name}</h3><p>{p.tagline}</p><span className="btn btn-sm">Shop · ₹{p.variants[0]?.price}</span></div>
        </Link>))}</div>
    </section>}

    {on('bestsellers') && <section className="section wrap" aria-labelledby="best-h" style={{ paddingTop: 0 }}>
      <div className="section-head"><div><h2 id="best-h">Signature Masalas</h2><p className="muted">The Khushilo blends to start with.</p></div><Link className="btn btn-ghost btn-pill" href="/shop?sort=best">View all</Link></div>
      <div className="grid">{best.map(p => <ProductCard key={p.id} p={p} list="best_sellers" />)}</div>
    </section>}

    {on('promos') && <section className="wrap promos">
      <div className="promo bundle"><div><h2>Stock your masala dabba</h2><p className="muted" style={{ marginTop: 6 }}>Turmeric, coriander, red chilli and cumin — the everyday four, 100 g each.</p><Link className="btn btn-primary" href="/shop?category=spice-powders">Shop spice powders</Link></div>
        <div className="promo-art" aria-hidden><Bottle color="#e0a10b" label="Turmeric Powder" /><Bottle color="#c22a14" label="Red Chilli Powder" /></div></div>
      <div className="promo learn"><div><h2>Taste of Karnataka</h2><p className="muted" style={{ marginTop: 6 }}>Sambar, rasam and bisi bele bath powders, from Bengaluru.</p><Link className="btn btn-primary" href="/concern/south-indian">Shop South Indian</Link></div>
        <div className="promo-art" aria-hidden><Bottle color="#a8431e" label="Sambar Powder" /><Bottle color="#9c4a22" label="Bisi Bele Bath Powder" /></div></div>
    </section>}

    {on('new_arrivals') && fresh.length > 0 && <section className="section wrap" aria-labelledby="new-h">
      <div className="section-head"><div><h2 id="new-h">New Arrivals</h2><p className="muted">The latest additions to our collection.</p></div><Link className="btn btn-ghost btn-pill" href="/shop?sort=new">View all</Link></div>
      <div className="grid">{fresh.map(p => <ProductCard key={p.id} p={p} list="new_arrivals" />)}</div>
    </section>}

    {on('newsletter') && <div className="wrap section" style={{ paddingTop: 0 }}><LeadForm /></div>}
  </>;
}
