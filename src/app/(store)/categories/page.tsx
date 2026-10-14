import type { Metadata } from 'next';
import Link from 'next/link';
import { GUIDES, CATEGORIES, PUBLISHED, guideCounts } from '@/lib/guides';
import { LibraryDirectory } from '@/components/LibraryDirectory';

export const metadata: Metadata = {
  title: { absolute: 'Spice Library — Guides, Recipes & Kitchen Basics | Khushilo' },
  description: 'The Khushilo Spice Library: guides to sambar powder, rasam powder, donne biryani masala, chaat masala and more, with recipes for sambar, bisi bele bath, donne biryani and chicken kabab.',
  alternates: { canonical: '/categories' },
};

export default function SpiceLibrary() {
  const entries = GUIDES.map(g => ({ slug: g.slug, title: g.title, category: g.category, summary: g.summary, minutes: g.minutes, image: g.image, recipe: !!g.recipe }));
  return <>
    <LibraryDirectory entries={entries} categories={CATEGORIES} counts={guideCounts()} published={PUBLISHED} />
    <nav className="wrap wiki-allindex" aria-label="All guides" style={{ paddingBottom: 32 }}>
      <details><summary>A–Z index of all {entries.length} guides</summary>
        <ul>{[...entries].sort((a, b) => a.title.localeCompare(b.title)).map(e => <li key={e.slug}><Link href={`/guides/${e.slug}`}>{e.title}</Link></li>)}</ul>
      </details>
    </nav>
  </>;
}
