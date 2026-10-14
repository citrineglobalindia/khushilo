// Khushilo carton — matches the real 100 g box style (logo badge, product name, spice window, side panel).
// Used wherever a product has no photo yet. `color` is the spice colour; the box face is a deep shade of it.
// Kept as `Bottle` so existing imports keep working.
function shade(hex: string, f: number) {
  const n = parseInt(hex.replace('#', '').padEnd(6, '0').slice(0, 6), 16);
  const c = [n >> 16, (n >> 8) & 255, n & 255].map(v => Math.max(0, Math.min(255, Math.round(v * f))));
  return `#${c.map(v => v.toString(16).padStart(2, '0')).join('')}`;
}

// Box colour per product, in the spirit of the real Khushilo range (black chaat, green turmeric, sage biryani…).
const BOX: Record<string, string> = {
  'Sambar Powder': '#6e1a12', 'Rasam Powder': '#123f3c', 'Bisi Bele Bath Powder': '#6b4512', 'Chicken Masala': '#1d1a18',
  'Chicken Kabab Powder': '#7a1414', 'Garam Masala': '#3b2416', 'Coriander Powder': '#3d4a1f', 'Red Chilli Powder': '#8c1010',
  'Cumin Powder': '#4a3220', 'Chaat Masala': '#151515', 'Turmeric Powder': '#1f4a2a', 'Donne Biryani Masala': '#4f5a2c',
};

export function Bottle({ color = '#c22a14', label, className = 'bottle', title }: { color?: string; label?: string; className?: string; title?: string }) {
  const base = BOX[label ?? ''];
  const face = base ?? shade(color, 0.42), side = base ? shade(base, 0.7) : shade(color, 0.3), top = base ? shade(base, 1.35) : shade(color, 0.55);
  const words = (label ?? '').split(' ');
  const lines = label && label.length > 13 ? [words.slice(0, Math.ceil(words.length / 2)).join(' '), words.slice(Math.ceil(words.length / 2)).join(' ')] : [label ?? ''];
  const id = (label ?? 'x').replace(/\W/g, '');
  const w = lines.length > 1 ? 104 : 94; // spice window top
  return (
    <svg className={className} viewBox="0 0 160 200" role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      <defs>
        <linearGradient id={`f-${id}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={base ? shade(base, 1.25) : shade(color, 0.5)} /><stop offset="1" stopColor={face} /></linearGradient>
      </defs>
      <path d="M18 28 L38 14 H146 L126 28 Z" fill={top} />
      <path d="M126 28 L146 14 V176 L126 192 Z" fill={side} />
      <rect x="18" y="28" width="108" height="164" fill={`url(#f-${id})`} />
      <rect x="22" y="32" width="100" height="156" fill="none" stroke="#f0c36e" strokeOpacity=".55" strokeWidth=".8" />
      <path d="M36 40h72l6 9-6 9H36l-6-9z" fill="#f0c36e" />
      <path d="M38 42.5h68l4.4 6.5-4.4 6.5H38l-4.4-6.5z" fill="#c3222f" />
      <text x="72" y="52.2" textAnchor="middle" fontFamily="'Trebuchet MS', system-ui, sans-serif" fontSize="9.5" fontWeight="700" fill="#fff">Khushilo</text>
      {lines.map((l, i) => <text key={i} x="72" y={78 + i * 13} textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontSize={l.length > 12 ? 10.5 : 12.5} fontWeight="700" fill="#fff6e6">{l}</text>)}
      <rect x="30" y={w} width="84" height="58" rx="6" fill="#fff8ee" />
      <ellipse cx="72" cy={w + 50} rx="32" ry="6" fill="#7a4a2a" opacity=".85" />
      <path d={`M42 ${w + 49}c5-16 18-28 30-28s25 12 30 28z`} fill={color} />
      <path d={`M60 ${w + 30}c3-4 7-6 11-7`} stroke="#fff" strokeOpacity=".4" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d={`M106 ${w + 6}c-6 2-9 7-8 12 5-1 8-6 8-12z`} fill="#59b039" />
      <text x="72" y="180" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="8" fontWeight="700" fill="#fff6e6" letterSpacing=".5">100GM</text>
      <path d="M130 40 L142 31 V44 L130 53 Z" fill="#c3222f" opacity=".9" />
    </svg>
  );
}

// Bowl of ground spice for the "shop by dish" tiles.
export function Sprig({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 120 90" width="100%" height="100%" aria-hidden>
      <ellipse cx="60" cy="78" rx="44" ry="6" fill="#000" opacity=".08" />
      <path d="M30 48c8-20 20-28 30-28s22 8 30 28z" fill={color} />
      <path d="M48 32c4-5 8-7 12-8" stroke="#fff" strokeOpacity=".35" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M18 46h84c0 18-18 30-42 30S18 64 18 46z" fill="#7a4a2a" />
      <path d="M18 46h84" stroke="#f0c36e" strokeWidth="3" strokeLinecap="round" />
      <path d="M92 18c-7 2-11 8-10 14 6-1 10-7 10-14z" fill="#59b039" />
    </svg>
  );
}
