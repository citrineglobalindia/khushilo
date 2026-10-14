/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { remotePatterns: [{ protocol: 'https', hostname: '**.supabase.co' }] },
  async redirects() {
    return [
      { source: '/pages/about', destination: '/about', permanent: true },
      { source: '/products', destination: '/shop', permanent: true },
      // The essential-oil encyclopedia from the template was removed for Khushilo.
      { source: '/wiki/:path*', destination: '/shop', permanent: true },
      { source: '/categories', destination: '/shop', permanent: true },
      ...['/login', '/signup', '/profile'].map(source => ({ source, destination: '/account', permanent: true })),
      ...[['shipping', '/shipping'], ['returns', '/shipping'], ['refund', '/shipping'], ['contact', '/contact'], ['privacy', '/privacy'], ['terms', '/terms']].map(([s, d]) => ({ source: `/pages/${s}`, destination: d, permanent: true })),
    ];
  },
  async headers() {
    return [{ source: '/(.*)', headers: [
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' }
    ]}];
  }
};
export default nextConfig;
