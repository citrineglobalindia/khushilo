// Khushilo catalogue — used when Supabase is not configured, and the source for supabase/seed.sql (scripts/gen-seed.mjs).
// Prices are the MRPs supplied by Khushilo (inclusive of GST). Opening stock is a placeholder: set real counts in Admin → Inventory.
// Ingredients are intentionally left blank — fill them in Admin → Products exactly as printed on each pack (FSSAI labelling).
import type { Product, Concern, Category } from './types';

export const categories: Category[] = [
  { slug: 'masalas', name: 'Masala Blends', intro: 'Ready-to-use blends for sambar, rasam, biryani, chicken and more.' },
  { slug: 'spice-powders', name: 'Spice Powders', intro: 'Single-spice powders for everyday cooking.' },
];

// "Shop by dish" groups (stored in the concerns table).
export const concerns: Concern[] = [
  { slug: 'south-indian', name: 'South Indian Classics', intro: 'Sambar, rasam and bisi bele bath, the Karnataka way.', color: '#b5261a' },
  { slug: 'biryani-non-veg', name: 'Biryani & Non-Veg', intro: 'Blends for biryani, chicken curry, fry and kababs.', color: '#7a3b1e' },
  { slug: 'everyday', name: 'Everyday Essentials', intro: 'The powders every Indian kitchen reaches for daily.', color: '#d4a017' },
  { slug: 'snacks-chaat', name: 'Snacks & Chaat', intro: 'Tangy, spicy finishing masalas for snacks and starters.', color: '#4f9a32' },
];

const STORAGE = 'Store in a cool, dry place away from sunlight. Close the pack tightly after use and always use a dry spoon.';

type Seed = {
  slug: string; name: string; price: number; category: 'masalas' | 'spice-powders'; concerns: string[]; color: string;
  tagline: string; taste: string; uses: string[]; pairs: string[]; signature?: boolean; hsn: string;
};
const rows: Seed[] = [
  { slug: 'sambar-powder', name: 'Sambar Powder', price: 79, category: 'masalas', concerns: ['south-indian'], color: '#a8431e', signature: true, hsn: '0910',
    tagline: 'For a thick, aromatic Karnataka-style sambar', taste: 'Roasted, tangy, mildly spicy',
    uses: ['Cook toor dal with vegetables and tamarind water', 'Add 2–3 teaspoons of sambar powder for 4 servings and simmer 5 minutes', 'Finish with a mustard, curry leaf and hing tadka'], pairs: ['Turmeric Powder', 'Red Chilli Powder'] },
  { slug: 'donne-biryani-masala', name: 'Donne Biryani Masala', price: 98, category: 'masalas', concerns: ['biryani-non-veg'], color: '#5e3a1f', signature: true, hsn: '0910',
    tagline: 'Bengaluru-style donne biryani at home', taste: 'Warm, peppery, aromatic',
    uses: ['Sauté onions, ginger-garlic paste, mint and coriander', 'Add the meat with 2–3 tablespoons of masala per 500 g and cook through', 'Layer with jeera samba or basmati rice and cook on dum'], pairs: ['Garam Masala', 'Red Chilli Powder'] },
  { slug: 'chaat-masala', name: 'Chaat Masala', price: 89, category: 'masalas', concerns: ['snacks-chaat'], color: '#8a6d3b', hsn: '0910',
    tagline: 'Tangy finishing sprinkle for chaat, fruit and snacks', taste: 'Tangy, salty, zesty',
    uses: ['Sprinkle over chaat, fruit salads or cut cucumber', 'Toss with fries, peanuts or makhana', 'Stir a pinch into buttermilk or lemonade'], pairs: ['Cumin Powder', 'Red Chilli Powder'] },
  { slug: 'chicken-masala', name: 'Chicken Masala', price: 96, category: 'masalas', concerns: ['biryani-non-veg'], color: '#8b2a12', signature: true, hsn: '0910',
    tagline: 'Rich, spicy masala for chicken curry and fry', taste: 'Bold, spicy, warm',
    uses: ['Sauté onions and tomatoes until soft', 'Add 2 tablespoons of chicken masala per 500 g chicken with a little water', 'Simmer covered until the chicken is cooked and the gravy thickens'], pairs: ['Garam Masala', 'Turmeric Powder'] },
  { slug: 'rasam-powder', name: 'Rasam Powder', price: 99, category: 'masalas', concerns: ['south-indian'], color: '#b04a1c', hsn: '0910',
    tagline: 'Peppery, comforting rasam in minutes', taste: 'Peppery, tangy, aromatic',
    uses: ['Boil tamarind water with tomatoes and salt', 'Add 1–2 teaspoons of rasam powder and a little cooked dal', 'Bring to a froth, then add a ghee and mustard tadka'], pairs: ['Turmeric Powder', 'Sambar Powder'] },
  { slug: 'chicken-kabab-powder', name: 'Chicken Kabab Powder', price: 86, category: 'masalas', concerns: ['biryani-non-veg', 'snacks-chaat'], color: '#c0301a', hsn: '0910',
    tagline: 'Crisp, red, restaurant-style chicken kababs', taste: 'Spicy, tangy, savoury',
    uses: ['Mix the powder with ginger-garlic paste, lemon juice and a little water', 'Coat 500 g chicken and marinate for at least 30 minutes', 'Deep-fry, shallow-fry or air-fry until crisp'], pairs: ['Chaat Masala', 'Garam Masala'] },
  { slug: 'bisi-bele-bath-powder', name: 'Bisi Bele Bath Powder', price: 89, category: 'masalas', concerns: ['south-indian'], color: '#9c4a22', signature: true, hsn: '0910',
    tagline: 'Karnataka’s favourite one-pot rice, made easy', taste: 'Spiced, tangy, roasted',
    uses: ['Pressure-cook rice and toor dal together until soft', 'Add vegetables, tamarind water and 3 tablespoons of powder for 4 servings', 'Simmer, then finish with a ghee tadka and cashews'], pairs: ['Sambar Powder', 'Red Chilli Powder'] },
  { slug: 'garam-masala', name: 'Garam Masala', price: 105, category: 'masalas', concerns: ['biryani-non-veg', 'everyday'], color: '#5a3a22', hsn: '0910',
    tagline: 'A warm whole-spice blend to finish curries and biryani', taste: 'Warm, sweet-spicy, fragrant',
    uses: ['Add ½–1 teaspoon at the end of cooking curries and dals', 'Use in marinades for meat and paneer', 'Sprinkle into biryani layers before dum'], pairs: ['Chicken Masala', 'Cumin Powder'] },
  { slug: 'turmeric-powder', name: 'Turmeric Powder', price: 45, category: 'spice-powders', concerns: ['everyday'], color: '#e0a10b', hsn: '0910',
    tagline: 'Bright, earthy haldi for daily cooking', taste: 'Earthy, warm, slightly bitter',
    uses: ['Add ¼ teaspoon to dals, sambar and curries while cooking', 'Use in marinades for colour and flavour', 'Stir a pinch into warm milk'], pairs: ['Coriander Powder', 'Red Chilli Powder'] },
  { slug: 'coriander-powder', name: 'Coriander Powder', price: 46, category: 'spice-powders', concerns: ['everyday'], color: '#9a7b3c', hsn: '0909',
    tagline: 'Ground dhania for curries, dals and gravies', taste: 'Citrusy, nutty, mild',
    uses: ['Add 1–2 teaspoons to onion-tomato bases', 'Use in dry vegetable stir-fries (palya)', 'Combine with cumin powder for a quick curry base'], pairs: ['Cumin Powder', 'Turmeric Powder'] },
  { slug: 'red-chilli-powder', name: 'Red Chilli Powder', price: 65, category: 'spice-powders', concerns: ['everyday'], color: '#c22a14', hsn: '0904',
    tagline: 'Vibrant colour and clean heat', taste: 'Hot, sharp, fruity',
    uses: ['Add to curries, chutneys and gravies to taste', 'Use in marinades for kababs and fries', 'Sprinkle on eggs, snacks and salads'], pairs: ['Turmeric Powder', 'Coriander Powder'] },
  { slug: 'cumin-powder', name: 'Cumin Powder', price: 90, category: 'spice-powders', concerns: ['everyday'], color: '#7a5528', hsn: '0909',
    tagline: 'Ground jeera for raita, curries and chaat', taste: 'Nutty, earthy, warm',
    uses: ['Stir into raita, buttermilk and chaat', 'Add to curries and dals towards the end of cooking', 'Dry-roast lightly for a deeper flavour'], pairs: ['Coriander Powder', 'Chaat Masala'] },
];

// Products with real photography in /public/products (square card shot + lifestyle scene).
const PHOTOS = ['chaat-masala', 'turmeric-powder', 'donne-biryani-masala'];

export const hsnFor = (slug: string) => rows.find(r => r.slug === slug)?.hsn ?? '0910';

export const products: Product[] = rows.map((r, i) => {
  const [first, ...rest] = r.slug.split('-');
  const code = (first.slice(0, 4) + rest.map(w => w[0]).join('')).toUpperCase();
  return {
    id: `p${i + 1}`, slug: r.slug, name: r.name, botanical_name: null, tagline: r.tagline,
    description: `Khushilo ${r.name}, packed in a 100 g pack. ${r.tagline}.`,
    category: r.category, concerns: r.concerns, aroma: r.taste, extraction: null, origin: 'India',
    uses: r.uses, suggested_blends: r.pairs, safety: STORAGE, purity: null, color: r.color, images: PHOTOS.includes(r.slug) ? [`/products/${r.slug}.webp`, `/products/${r.slug}-scene.webp`] : [],
    is_bestseller: !!r.signature, is_new: false, rating: 0, review_count: 0,
    seo_title: `${r.name} 100 g | Khushilo`, seo_description: `${r.tagline}. Buy Khushilo ${r.name.toLowerCase()} online — 100 g pack, MRP ₹${r.price}.`,
    created_at: new Date(Date.UTC(2026, 9, 1 + i)).toISOString(),
    variants: [{ id: `p${i + 1}v1`, sku: `KH-${code}-100G`, label: '100 g', price: r.price, compare_at: null, stock: 50, low_stock_threshold: 10, allow_backorder: false }],
  };
});
