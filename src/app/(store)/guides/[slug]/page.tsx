import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { GUIDES, PUBLISHED, guideBySlug } from '@/lib/guides';
import { getProducts } from '@/lib/data';
import { ProductCard } from '@/components/ProductCard';
import { SITE_URL } from '@/lib/format';

export const dynamicParams = false;
export function generateStaticParams() { return GUIDES.map(g => ({ slug: g.slug })); }
export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const g = guideBySlug(params.slug); if (!g) return {};
  return { title: { absolute: `${g.title} | Khushilo Spice Library` }, description: g.summary, alternates: { canonical: `/guides/${g.slug}` },
    openGraph: { title: g.title, description: g.summary, images: [g.image], type: 'article' } };
}

const anchor = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export default async function GuidePage({ params }: { params: { slug: string } }) {
  const g = guideBySlug(params.slug); if (!g) notFound();
  const products = (await getProducts()).filter(p => g.products.includes(p.slug));
  const related = [...(g.related ?? []).map(guideBySlug).filter(Boolean), ...GUIDES.filter(x => x.slug !== g.slug && x.category === g.category)]
    .filter((x, i, a) => x && a.findIndex(y => y?.slug === x.slug) === i).slice(0, 3) as typeof GUIDES;
  const toc = [...(g.recipe ? [['Ingredients', 'ingredients'], ['Method', 'method']] : []), ...g.sections.map(s => [s.h, anchor(s.h)]), ...(g.tips ? [['Tips', 'tips']] : [])];
  const ld = { '@context': 'https://schema.org', '@graph': [
    g.recipe
      ? { '@type': 'Recipe', name: g.title, description: g.summary, image: `${SITE_URL}${g.image}`, author: { '@type': 'Organization', name: 'Khushilo' }, recipeYield: `${g.recipe.serves} servings`,
          recipeIngredient: g.recipe.ingredients, recipeInstructions: g.recipe.steps.map(t => ({ '@type': 'HowToStep', text: t })), recipeCuisine: 'Indian', recipeCategory: g.category }
      : { '@type': 'Article', headline: g.title, description: g.summary, image: `${SITE_URL}${g.image}`, author: { '@type': 'Organization', name: 'Khushilo' }, publisher: { '@type': 'Organization', name: 'Khushilo' }, mainEntityOfPage: `${SITE_URL}/guides/${g.slug}` },
    { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL }, { '@type': 'ListItem', position: 2, name: 'Spice Library', item: `${SITE_URL}/categories` }, { '@type': 'ListItem', position: 3, name: g.title }] },
  ] };

  return (
    <article className="guide">
      <header className="guide-hero">
        <img src={g.image} alt="" className="guide-hero-bg" />
        <div className="wrap guide-hero-in">
          <nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden>/</span><Link href="/categories">Spice Library</Link><span aria-hidden>/</span><span aria-current="page">{g.category}</span></nav>
          <span className="hero-eyebrow">{g.category.toUpperCase()}{g.recipe ? ' · RECIPE' : ''}</span>
          <h1>{g.title}</h1>
          <p className="guide-lede">{g.summary}</p>
          <div className="guide-meta"><span>Khushilo Kitchen</span><span>{PUBLISHED}</span><span>{g.minutes} min read</span></div>
          {g.recipe && <dl className="guide-facts"><div><dt>Serves</dt><dd>{g.recipe.serves}</dd></div><div><dt>Prep</dt><dd>{g.recipe.prep}</dd></div><div><dt>Cook</dt><dd>{g.recipe.cook}</dd></div></dl>}
        </div>
      </header>

      <div className="wrap guide-body">
        <aside className="guide-toc" aria-label="On this page"><b>On this page</b><ol>{toc.map(([t, id]) => <li key={id}><a href={`#${id}`}>{t}</a></li>)}</ol>
          {products[0] && <Link className="btn btn-primary btn-sm" href={`/product/${products[0].slug}`} style={{ marginTop: 14 }}>Shop {products[0].name}</Link>}</aside>
        <div className="guide-main">
          {g.recipe && <>
            <section id="ingredients" className="guide-card"><h2>Ingredients</h2><ul className="guide-ing">{g.recipe.ingredients.map(i => <li key={i}>{i}</li>)}</ul></section>
            <section id="method" className="guide-sec"><h2>Method</h2><ol className="guide-steps">{g.recipe.steps.map((s, i) => <li key={i}><span>{i + 1}</span><p>{s}</p></li>)}</ol></section>
          </>}
          {g.sections.map(s => (
            <section key={s.h} id={anchor(s.h)} className="guide-sec"><h2>{s.h}</h2>
              {s.list && <ul className="guide-list">{s.list.map(l => <li key={l}>{l}</li>)}</ul>}
              {s.p?.map(t => <p key={t}>{t}</p>)}</section>))}
          {g.tips && <section id="tips" className="guide-card tips"><h2>Tips</h2><ul className="guide-list">{g.tips.map(t => <li key={t}>{t}</li>)}</ul></section>}

          {products.length > 0 && <section className="guide-sec"><h2>Shop the spices</h2><div className="grid g3">{products.map(p => <ProductCard key={p.id} p={p} list={`guide_${g.slug}`} />)}</div></section>}
        </div>
      </div>

      {related.length > 0 && <section className="wrap lib-sec" style={{ paddingBottom: 40 }}>
        <div className="lib-head"><div><span className="hero-eyebrow">KEEP COOKING</span><h2>Related guides</h2></div><Link className="btn btn-ghost btn-pill" href="/categories">All guides →</Link></div>
        <div className="lib-grid">{related.map(r => (
          <Link key={r.slug} href={`/guides/${r.slug}`} className="lib-card">
            <div className="lib-card-img"><img src={r.image} alt="" loading="lazy" />{r.recipe && <span className="lib-badge">Recipe</span>}</div>
            <div className="lib-card-b"><div className="lib-card-top"><span className="lib-tag">{r.category}</span><span className="lib-time">{r.minutes} min read</span></div><h3>{r.title}</h3><p>{r.summary}</p></div>
          </Link>))}</div>
      </section>}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </article>
  );
}
