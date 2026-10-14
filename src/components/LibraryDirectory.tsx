'use client';
import Link from 'next/link';
import { useMemo, useRef, useState } from 'react';
import { SearchIcon } from './Icons';

type Card = { slug: string; title: string; category: string; summary: string; minutes: number; image: string; recipe: boolean };
type Cat = { name: string; blurb: string; image: string };
const QUICK = ['Sambar', 'Biryani', 'Chicken', 'Chaat', 'Turmeric', 'Tadka'];
const Clock = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>;
const matches = (e: Card, q: string) => { const h = `${e.title} ${e.category} ${e.summary}`.toLowerCase(); return q.toLowerCase().split(/\s+/).filter(Boolean).every(w => h.includes(w)); };

export function LibraryDirectory({ entries, categories, counts, published }: { entries: Card[]; categories: Cat[]; counts: Record<string, number>; published: string }) {
  const [q, setQ] = useState(''); const [cat, setCat] = useState('All');
  const results = useRef<HTMLElement>(null);
  const list = useMemo(() => entries.filter(e => (cat === 'All' || e.category === cat) && matches(e, q)), [q, cat, entries]);
  const toResults = () => setTimeout(() => results.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 30);
  const pick = (c: string) => { setCat(c); toResults(); };
  const recipes = entries.filter(e => e.recipe).length;

  return <>
    <section className="lib-hero">
      <img className="lib-hero-bg" src="/dishes/south-indian.webp" alt="" fetchPriority="high" />
      <div className="wrap lib-hero-in">
        <span className="hero-eyebrow">KHUSHILO SPICE LIBRARY</span>
        <h1>Cook better with <em>every spoon</em></h1>
        <p>Guides to every Khushilo masala, home-style recipes, and the kitchen basics of storing, tempering and measuring spices.</p>
        <form className="lib-search" role="search" onSubmit={e => { e.preventDefault(); toResults(); }}>
          <SearchIcon size={20} />
          <input type="search" aria-label="Search the spice library" placeholder="Search a spice, dish or tip — e.g. sambar, kabab, tadka" value={q} onChange={e => { setQ(e.target.value); setCat('All'); }} />
          <button aria-label="Search"><SearchIcon size={18} /></button>
        </form>
        <div className="lib-popular"><span>Popular:</span>{QUICK.map(t => <button key={t} type="button" aria-pressed={q.toLowerCase() === t.toLowerCase()} onClick={() => { setQ(t); setCat('All'); toResults(); }}>{t}</button>)}</div>
      </div>
    </section>

    <section className="lib-stats" aria-label="Library at a glance"><div className="wrap">
      <p><b>{entries.length}</b><span>Guides</span></p>
      <p><b>{counts['Spice Guides'] ?? 0}</b><span>Spices explained</span></p>
      <p><b>{recipes}</b><span>Recipes</span></p>
      <p><b>{counts['Kitchen Basics'] ?? 0}</b><span>Kitchen basics</span></p>
    </div></section>

    <section className="wrap lib-sec">
      <div className="lib-head"><div><span className="hero-eyebrow">BROWSE BY TOPIC</span><h2>What are you cooking?</h2></div>
        <button className="btn btn-ghost btn-pill" onClick={() => pick('All')}>View all guides →</button></div>
      <div className="lib-cats" role="group" aria-label="Filter by topic">
        {categories.map(c => (
          <button key={c.name} className="lib-cat" aria-pressed={cat === c.name} onClick={() => pick(c.name)}>
            <img src={c.image} alt="" loading="lazy" />
            <span><b>{c.name}</b><small>{c.blurb}</small><em>{counts[c.name] ?? 0} guides</em></span>
          </button>))}
      </div>
    </section>

    <section className="wrap lib-sec" ref={results} style={{ scrollMarginTop: 120 }}>
      <div className="lib-head">
        <div><span className="hero-eyebrow">{cat === 'All' ? 'ALL TOPICS' : cat.toUpperCase()}</span>
          <h2>{q ? `Results for “${q}”` : cat === 'All' ? 'Latest from the library' : cat}</h2></div>
        <div className="lib-head-r"><span aria-live="polite">Showing {list.length} of {entries.length} guides</span>
          {(cat !== 'All' || q) && <button className="link" onClick={() => { setCat('All'); setQ(''); }}>Clear filters</button>}</div>
      </div>
      {list.length ? (
        <div className="lib-grid">
          {list.map(e => (
            <Link key={e.slug} href={`/guides/${e.slug}`} className="lib-card">
              <div className="lib-card-img"><img src={e.image} alt="" loading="lazy" />{e.recipe && <span className="lib-badge">Recipe</span>}</div>
              <div className="lib-card-b">
                <div className="lib-card-top"><span className="lib-tag">{e.category}</span><span className="lib-time"><Clock />{e.minutes} min read</span></div>
                <h3>{e.title}</h3>
                <p>{e.summary}</p>
                <div className="lib-card-foot"><span>{published}</span><b>{e.recipe ? 'View recipe →' : 'Read guide →'}</b></div>
              </div>
            </Link>))}
        </div>
      ) : (
        <div className="empty panel"><h3>No guides match your search</h3><p className="muted">Try “sambar”, “chicken”, “chaat” or “storage”.</p><button className="btn btn-ghost" onClick={() => setQ('')}>Clear search</button></div>
      )}
    </section>

    <section className="wrap lib-sec">
      <div className="lib-cta"><div><span className="hero-eyebrow">FROM THE KHUSHILO KITCHEN</span><h2>Every recipe here uses Khushilo masalas</h2><p>Eight masala blends and four spice powders, all in 100 g packs.</p></div>
        <Link className="btn btn-primary btn-pill" href="/shop">Shop all spices →</Link></div>
    </section>
  </>;
}
