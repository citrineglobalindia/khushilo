'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { track } from '@/lib/attribution';

// Full-width image banners (desktop 1920×720, mobile 1080×1350) in /public/banners.
export type Banner = { id: string; desktop: string; mobile: string; alt: string; href: string };

export function BannerHero({ banners, title }: { banners: Banner[]; title: string }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = banners.length;
  useEffect(() => {
    if (paused || n < 2 || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => setI(x => (x + 1) % n), 6000);
    return () => clearInterval(t);
  }, [paused, n]);
  if (!n) return null;
  return (
    <section className="bhero" aria-roledescription="carousel" aria-label="Featured" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)}>
      <h1 className="sr-only">{title}</h1>
      <div className="bhero-track" style={{ transform: `translateX(-${i * 100}%)` }}>
        {banners.map((b, j) => (
          <Link key={b.id} href={b.href} className="bhero-slide" aria-hidden={i !== j} tabIndex={i === j ? 0 : -1}
            onClick={() => track('select_promotion', { promotion_id: b.id, promotion_name: b.alt })}>
            <picture>
              <source media="(max-width: 760px)" srcSet={b.mobile} />
              <img src={b.desktop} alt={b.alt} width={1920} height={720} fetchPriority={j === 0 ? 'high' : 'auto'} loading={j === 0 ? 'eager' : 'lazy'} />
            </picture>
          </Link>
        ))}
      </div>
      {n > 1 && <>
        <button className="bhero-nav prev" aria-label="Previous banner" onClick={() => setI(x => (x - 1 + n) % n)}>‹</button>
        <button className="bhero-nav next" aria-label="Next banner" onClick={() => setI(x => (x + 1) % n)}>›</button>
        <div className="bhero-dots">{banners.map((b, j) => <button key={b.id} aria-label={`Show banner ${j + 1}`} aria-current={i === j} onClick={() => setI(j)} />)}</div>
      </>}
    </section>
  );
}
