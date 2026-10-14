// Khushilo brand marks live in /public/brand. Campaign imagery (A) is placeholder until the product catalogue is loaded.
const A = 'https://nauppqeqhnyfluvcxtxw.supabase.co/storage/v1/object/public/product-images/upload-77d43a5f14d071ed5da6acbf/';
export const BRAND = {
  logo: '/brand/logo.png', logoLight: '/brand/logo.png', mark: '/brand/icon-192.png', icon: '/brand/icon-512.png',
  promoGifting: `${A}promo-gifting.webp`, promoWellness: `${A}promo-wellness.webp`, heroCollection: `${A}hero-collection.webp`,
};
// Photo used for each "Shop by concern" tile
export const CONCERN_IMG: Record<string, string> = {
  'sleep-calm': `${A}lavender-essential-oil.webp`, 'focus-energy': `${A}peppermint-essential-oil.webp`, 'stress-relief': `${A}bergamot-essential-oil.webp`,
  'hair-scalp': `${A}rosemary-essential-oil.webp`, 'skin-care': `${A}tea-tree-essential-oil.webp`, diffusers: `${A}concern-diffuser.webp`,
};
