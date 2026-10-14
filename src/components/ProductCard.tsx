'use client';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { inr, pctOff } from '@/lib/format';
import { useCart } from '@/lib/cart';
import { Bottle } from './Bottle';
import { Stars } from './Stars';
import { CartIcon, HeartIcon } from './Icons';

const TYPE: Record<string, string> = { masalas: 'Masala blend', 'spice-powders': 'Spice powder' };

export function ProductCard({ p, list = 'grid' }: { p: Product; list?: string }) {
  const { add, wishlist, toggleWish } = useCart();
  const v = p.variants.find(x => x.stock > 0 || x.allow_backorder) ?? p.variants[0];
  if (!v) return null;
  const off = pctOff(v.price, v.compare_at);
  const allOut = p.variants.every(x => x.stock <= 0 && !x.allow_backorder);
  const low = !allOut && v.stock > 0 && v.stock <= v.low_stock_threshold;
  const wished = wishlist.includes(p.slug);
  const photo = p.images[0];
  const addIt = () => add({ variant_id: v.id, product_slug: p.slug, name: p.name, label: v.label, price: v.price, color: p.color, image: photo });
  return (
    <article className="card kcard" style={{ ['--spice' as string]: p.color }}>
      {allOut ? <span className="tag out">Sold out</span> : low ? <span className="tag low">Only {v.stock} left</span> : p.is_bestseller ? <span className="tag sig">Signature</span> : p.is_new ? <span className="tag">New</span> : null}
      <button className="icon-btn wish" aria-pressed={wished} aria-label={wished ? `Remove ${p.name} from wishlist` : `Save ${p.name} to wishlist`} onClick={() => toggleWish(p.slug)}><HeartIcon size={20} /></button>
      <Link href={`/product/${p.slug}`} className={`card-media${photo ? ' has-photo' : ''}`} data-list={list}>
        {photo ? <img src={photo} alt={p.name} loading="lazy" /> : <Bottle color={p.color} label={p.name} title={p.name} />}
      </Link>
      <div className="card-body">
        <span className="card-eyebrow"><i aria-hidden />{TYPE[p.category] ?? 'Spices'} · {v.label}</span>
        <Link href={`/product/${p.slug}`} className="card-title">{p.name}</Link>
        <p className="card-sub">{p.tagline}</p>
        {p.aroma && <p className="card-taste">{p.aroma}</p>}
        <Stars rating={p.rating} count={p.review_count} />
        <div className="card-foot">
          <div className="price-row">
            <span className="price">{inr(v.price)}</span>
            {off > 0 && <><span className="cmp">{inr(v.compare_at!)}</span><span className="off">{off}% OFF</span></>}
          </div>
          {allOut
            ? <Link className="btn btn-ghost btn-sm" href={`/product/${p.slug}#notify`}>Notify me</Link>
            : <button className="btn btn-primary btn-sm card-add" onClick={addIt} aria-label={`Add ${p.name} ${v.label} to cart`}><CartIcon size={17} /> Add</button>}
        </div>
      </div>
    </article>
  );
}
