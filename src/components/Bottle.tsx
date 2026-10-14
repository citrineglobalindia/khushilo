// Khushilo stand-up spice pack — stands in for product photography until real images are uploaded.
// `color` is the spice colour shown in the window (turmeric yellow, chilli red…). Kept as `Bottle` so existing imports work.
export function Bottle({ color = '#c22a14', label, className = 'bottle', title }: { color?: string; label?: string; className?: string; title?: string }) {
  const words = (label ?? '').split(' ');
  const lines = label && label.length > 14 ? [words.slice(0, Math.ceil(words.length / 2)).join(' '), words.slice(Math.ceil(words.length / 2)).join(' ')] : [label ?? ''];
  return (
    <svg className={className} viewBox="0 0 140 200" role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      <defs>
        <linearGradient id="kh-pack" x1="0" x2="1"><stop offset="0" stopColor="#c62d1c" /><stop offset=".5" stopColor="#e53624" /><stop offset="1" stopColor="#b8261a" /></linearGradient>
      </defs>
      {/* pouch body with gusset curve at the bottom */}
      <path d="M18 22h104l-4 156c0 8-6 14-14 14H36c-8 0-14-6-14-14z" fill="url(#kh-pack)" />
      {/* zip seal + tear notch */}
      <rect x="18" y="14" width="104" height="12" rx="2" fill="#a8221a" />
      <rect x="18" y="30" width="104" height="2" fill="#f0c36e" opacity=".8" />
      {/* gold arch frame echoing the logo */}
      <path d="M32 46h76v68a10 10 0 0 1-10 10H42a10 10 0 0 1-10-10z" fill="#f0c36e" />
      <path d="M36 50h68v62a8 8 0 0 1-8 8H44a8 8 0 0 1-8-8z" fill="#fff8ee" />
      {/* spice heap in the window */}
      <path d="M44 112c6-18 18-30 26-30s20 12 26 30z" fill={color} />
      <path d="M58 92c4-6 8-9 12-9" stroke="#fff" strokeOpacity=".35" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M106 52c-6 2-9 7-8 12 5-1 8-6 8-12z" fill="#59b039" />
      <text x="70" y="66" textAnchor="middle" fontFamily="'Trebuchet MS', system-ui, sans-serif" fontSize="11" fontWeight="700" fill="#b5261a">Khushilo</text>
      {lines.map((l, i) => <text key={i} x="70" y={142 + i * 12} textAnchor="middle" fontFamily="'Trebuchet MS', system-ui, sans-serif" fontSize={l.length > 13 ? 9.5 : 11} fontWeight="700" fill="#fff">{l}</text>)}
      <text x="70" y={lines.length > 1 ? 170 : 160} textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="6.5" fill="#fff" opacity=".9">NET WT 100 g</text>
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
