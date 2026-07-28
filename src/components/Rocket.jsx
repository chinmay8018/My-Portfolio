/**
 * Rocket.jsx
 * Properly detailed SVG rocket — nose cone, cylindrical body, swept fins,
 * porthole, exhaust nozzle, and layered flame.
 *
 * Props:
 *   size      — display width in px (height auto-scaled to aspect ratio)
 *   rotation  — CSS rotate in deg  (0 = nose pointing up, -45 = diagonal top-right)
 *   color     — primary accent color (used for nose + fins)
 *   opacity   — overall wrapper opacity
 *   style     — extra inline styles on wrapper
 *   className — CSS class on wrapper
 */
export default function Rocket({
  size      = 36,
  rotation  = -45,
  color     = '#4f8ef7',
  opacity   = 1,
  style     = {},
  className = '',
}) {
  // Unique id suffix so multiple rockets don't share gradient IDs
  const uid = color.replace(/[^a-z0-9]/gi, '').slice(0, 6)

  return (
    <span
      className={className}
      aria-hidden="true"
      style={{
        display:       'inline-block',
        width:         size,
        height:        size * 1.65,  // ~5:3 aspect
        transform:     `rotate(${rotation}deg)`,
        opacity,
        pointerEvents: 'none',
        flexShrink:    0,
        ...style,
      }}
    >
      {/* ViewBox: 60 wide × 100 tall — nose at top, flame at bottom */}
      <svg
        viewBox="0 0 60 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        overflow="visible"
      >
        <defs>
          {/* ── Nose cone gradient: accent → deeper violet ── */}
          <linearGradient id={`nose-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="35%"  stopColor={color} />
            <stop offset="100%" stopColor="#5040c0" />
          </linearGradient>

          {/* ── Body gradient: white center, shaded edges ── */}
          <linearGradient id={`body-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#8ab0d8" />
            <stop offset="30%"  stopColor="#e8f2ff" />
            <stop offset="60%"  stopColor="#ffffff" />
            <stop offset="100%" stopColor="#9ab0cc" />
          </linearGradient>

          {/* ── Fin gradient: accent → darker ── */}
          <linearGradient id={`fin-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor={color} />
            <stop offset="100%" stopColor="#5040c0" />
          </linearGradient>

          {/* ── Porthole: bright center, deep blue edge ── */}
          <radialGradient id={`port-${uid}`} cx="35%" cy="35%" r="60%">
            <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="45%"  stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0a1628" />
          </radialGradient>

          {/* ── Flame outer glow ── */}
          <radialGradient id={`flo-${uid}`} cx="50%" cy="15%" r="55%">
            <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="30%"  stopColor="#ffd700" stopOpacity="0.9" />
            <stop offset="65%"  stopColor="#ff5e1a" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#7c2af7" stopOpacity="0" />
          </radialGradient>

          {/* ── Flame inner ── */}
          <radialGradient id={`fli-${uid}`} cx="50%" cy="10%" r="50%">
            <stop offset="0%"   stopColor="#ffffff" />
            <stop offset="45%"  stopColor="#ffe566" />
            <stop offset="100%" stopColor="#ff7a00" stopOpacity="0.6" />
          </radialGradient>

          {/* ── Window outer ring gradient ── */}
          <linearGradient id={`wring-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#f0a030" />
            <stop offset="100%" stopColor="#c06010" />
          </linearGradient>
        </defs>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            FLAME — rendered first (behind body / fins)
           ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/* Outer glow blob */}
        <ellipse cx="30" cy="88" rx="13" ry="16" fill={`url(#flo-${uid})`} opacity="0.55" />
        {/* Mid flame */}
        <ellipse cx="30" cy="86" rx="8"  ry="12" fill={`url(#flo-${uid})`} opacity="0.85" />
        {/* Inner bright core */}
        <ellipse cx="30" cy="84" rx="4"  ry="7"  fill={`url(#fli-${uid})`} />
        {/* White tip */}
        <ellipse cx="30" cy="82" rx="2"  ry="3.5" fill="#ffffff" opacity="0.95" />

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            LEFT FIN — large swept back
           ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <path
          d="M18,54 L2,80 L14,76 L16,62 Z"
          fill={`url(#fin-${uid})`}
        />
        {/* Left fin highlight */}
        <path
          d="M17,55 L5,78 L14,74 L16,63 Z"
          fill="rgba(255,255,255,0.15)"
        />

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            RIGHT FIN — mirror
           ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <path
          d="M42,54 L58,80 L46,76 L44,62 Z"
          fill={`url(#fin-${uid})`}
        />
        {/* Right fin highlight */}
        <path
          d="M43,55 L55,78 L46,74 L44,63 Z"
          fill="rgba(255,255,255,0.12)"
        />

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            BODY — cylindrical, white/silver gradient
           ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/* Drop shadow behind body */}
        <rect x="16" y="34" width="30" height="46" rx="5"
          fill="#000" opacity="0.2" transform="translate(2,2)" />
        {/* Main body */}
        <rect x="15" y="32" width="30" height="46" rx="5"
          fill={`url(#body-${uid})`} />

        {/* Body center stripe (accent color band) */}
        <rect x="15" y="60" width="30" height="4" rx="0"
          fill={color} opacity="0.25" />

        {/* Left body edge shading */}
        <rect x="15" y="32" width="5" height="46" rx="3"
          fill="rgba(0,20,60,0.18)" />
        {/* Right body edge shading */}
        <rect x="40" y="32" width="5" height="46" rx="3"
          fill="rgba(0,20,60,0.14)" />

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            ACCENT RING — dark band separating nose from body
           ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <rect x="15" y="31" width="30" height="4" rx="1"
          fill="#0a1628" />
        <rect x="15" y="32" width="30" height="1.5"
          fill={color} opacity="0.6" />

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            NOSE CONE — pointed, accent-colored
           ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/* Nose shadow */}
        <path
          d="M30,4 C22,4 16,14 15,32 L45,32 C44,14 38,4 30,4 Z"
          fill="#000" opacity="0.2" transform="translate(1.5,1.5)"
        />
        {/* Nose fill */}
        <path
          d="M30,4 C22,4 16,14 15,32 L45,32 C44,14 38,4 30,4 Z"
          fill={`url(#nose-${uid})`}
        />
        {/* Nose left highlight */}
        <path
          d="M30,5 C25,7 20,14 18,28 C22,18 27,10 30,7 Z"
          fill="rgba(255,255,255,0.45)"
        />

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            PORTHOLE — circular window
           ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/* Outer ring (gold/orange border like reference) */}
        <circle cx="30" cy="50" r="8.5"
          fill={`url(#wring-${uid})`} />
        {/* Dark inner bezel */}
        <circle cx="30" cy="50" r="7.2"
          fill="#0a1628" />
        {/* Porthole glass */}
        <circle cx="30" cy="50" r="6"
          fill={`url(#port-${uid})`} />
        {/* Glint — top-left bright spot */}
        <ellipse cx="27.5" cy="47" rx="2.2" ry="1.4"
          fill="white" opacity="0.75" />
        {/* Small secondary glint */}
        <circle cx="32" cy="53" r="0.8"
          fill="white" opacity="0.4" />

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            EXHAUST NOZZLE — dark ring at base of body
           ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/* Nozzle outer housing */}
        <rect x="18" y="74" width="24" height="7" rx="2.5"
          fill="#0a1628" />
        {/* Nozzle inner detail */}
        <rect x="20" y="75.5" width="20" height="4" rx="2"
          fill="#1a2a4e" />
        {/* Nozzle center hole */}
        <ellipse cx="30" cy="78" rx="7" ry="2"
          fill="#050b18" />
      </svg>
    </span>
  )
}
