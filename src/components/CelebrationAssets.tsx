/* Illustrated SVG assets for the Level Complete celebration. */

/** Colorful triangular bunting/garland strung across the top. */
export function Bunting() {
  const flags = [
    { color: '#ff8fab' },
    { color: '#ffcf5c' },
    { color: '#7fe25a' },
    { color: '#6ec5ff' },
    { color: '#c088ff' },
    { color: '#ff9754' },
    { color: '#ff8fab' },
    { color: '#ffcf5c' },
    { color: '#7fe25a' },
    { color: '#6ec5ff' }
  ];
  return (
    <svg
      viewBox="0 0 360 80"
      width="100%"
      height="100%"
      preserveAspectRatio="none"
      aria-hidden="true"
      className="celeb-bunting"
    >
      {/* string */}
      <path
        d="M0 26 Q90 6 180 26 Q270 46 360 26"
        fill="none"
        stroke="#fff8ec"
        strokeWidth="1.5"
        opacity="0.7"
      />
      {flags.map((f, i) => {
        const x = 8 + i * 34;
        const y = 14 + Math.sin((i / flags.length) * Math.PI) * -12 + i * 1.6;
        return (
          <g key={i} transform={`translate(${x},${y}) rotate(${(i - 4) * 4})`}>
            <path
              d="M0 0 L18 0 L9 22 Z"
              fill={f.color}
              stroke="rgba(0,0,0,0.15)"
              strokeWidth="1"
            />
            <path
              d="M2 3 L16 3"
              stroke="rgba(255,255,255,0.55)"
              strokeWidth="1"
            />
          </g>
        );
      })}
    </svg>
  );
}

/** Scattered confetti bits, positioned across the celebration area. */
export function ConfettiBits() {
  const bits: Array<{ x: number; y: number; c: string; r: number; type: 'ribbon' | 'square' | 'circle' }> = [
    { x: 30, y: 220, c: '#ff8fab', r: -20, type: 'ribbon' },
    { x: 70, y: 260, c: '#ffcf5c', r: 15, type: 'square' },
    { x: 40, y: 340, c: '#7fe25a', r: -8, type: 'circle' },
    { x: 60, y: 420, c: '#6ec5ff', r: 25, type: 'ribbon' },
    { x: 20, y: 480, c: '#c088ff', r: -32, type: 'square' },
    { x: 320, y: 240, c: '#ffcf5c', r: 12, type: 'ribbon' },
    { x: 340, y: 300, c: '#ff8fab', r: -22, type: 'square' },
    { x: 300, y: 380, c: '#7fe25a', r: 18, type: 'circle' },
    { x: 330, y: 440, c: '#6ec5ff', r: -14, type: 'ribbon' },
    { x: 310, y: 500, c: '#c088ff', r: 28, type: 'square' },
    { x: 90, y: 180, c: '#ff8fab', r: 40, type: 'ribbon' },
    { x: 260, y: 200, c: '#7fe25a', r: -34, type: 'square' }
  ];
  return (
    <svg
      viewBox="0 0 360 720"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className="celeb-confetti"
    >
      {bits.map((b, i) => (
        <g key={i} transform={`translate(${b.x},${b.y}) rotate(${b.r})`}>
          {b.type === 'ribbon' && (
            <rect x="-8" y="-2" width="16" height="4" rx="1.5" fill={b.c} />
          )}
          {b.type === 'square' && (
            <rect x="-4" y="-4" width="8" height="8" rx="1.5" fill={b.c} />
          )}
          {b.type === 'circle' && (
            <circle r="4" fill={b.c} />
          )}
        </g>
      ))}
    </svg>
  );
}

/** Star badge used in the row of 3 earned stars. */
export function BigStar({ filled = true }: { filled?: boolean }) {
  return (
    <svg viewBox="0 0 120 120" width="72" height="72" aria-hidden="true">
      <defs>
        <linearGradient id={`bg-star-${filled}`} x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor={filled ? '#ffe268' : '#dcd6ec'} />
          <stop offset="100%" stopColor={filled ? '#f5a91e' : '#a89ec4'} />
        </linearGradient>
      </defs>
      <path
        d="M60 8 L74 42 L110 46 L82 68 L92 104 L60 84 L28 104 L38 68 L10 46 L46 42 Z"
        fill={`url(#bg-star-${filled})`}
        stroke={filled ? '#c98816' : '#7f7796'}
        strokeWidth="4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Kawaii panda with arms raised in celebration. */
export function CheerPanda() {
  return (
    <svg viewBox="0 0 240 300" width="180" height="225" aria-hidden="true">
      {/* backpack strap */}
      <path d="M92 150 Q88 192 108 220" fill="none" stroke="#f2a63a" strokeWidth="7" strokeLinecap="round" />
      <ellipse cx="150" cy="220" rx="18" ry="14" fill="#e07f2c" />

      {/* body (hoodie) */}
      <path
        d="M72 180
           Q60 240 92 282
           L148 282
           Q180 240 168 180
           Q152 168 120 168
           Q88 168 72 180 Z"
        fill="#7a3ee8"
        stroke="#4a1eae"
        strokeWidth="2"
      />
      {/* hoodie neck darker */}
      <path
        d="M84 176 Q120 196 156 176 Q158 188 156 194 Q120 210 84 194 Q82 188 84 176 Z"
        fill="#5a24bd"
      />

      {/* ears */}
      <circle cx="72" cy="62" r="22" fill="#1e1b3a" />
      <circle cx="168" cy="62" r="22" fill="#1e1b3a" />
      <circle cx="72" cy="62" r="10" fill="#3b3452" />
      <circle cx="168" cy="62" r="10" fill="#3b3452" />

      {/* head */}
      <circle cx="120" cy="110" r="62" fill="#fff" stroke="#d0d0d8" strokeWidth="1" />

      {/* eye patches */}
      <ellipse cx="94" cy="110" rx="18" ry="22" fill="#1e1b3a" transform="rotate(-8 94 110)" />
      <ellipse cx="146" cy="110" rx="18" ry="22" fill="#1e1b3a" transform="rotate(8 146 110)" />
      {/* eyes */}
      <circle cx="95" cy="112" r="8" fill="#fff" />
      <circle cx="145" cy="112" r="8" fill="#fff" />
      <circle cx="95" cy="112" r="4" fill="#111" />
      <circle cx="145" cy="112" r="4" fill="#111" />
      <circle cx="97" cy="110" r="1.6" fill="#fff" />
      <circle cx="147" cy="110" r="1.6" fill="#fff" />
      <ellipse cx="150" cy="106" rx="3" ry="4" fill="#6ec5ff" opacity="0.5" />

      {/* nose */}
      <ellipse cx="120" cy="130" rx="6" ry="4" fill="#1e1b3a" />
      {/* open smile */}
      <path
        d="M108 142 Q120 160 132 142 Q128 152 120 152 Q112 152 108 142 Z"
        fill="#c93f5f"
        stroke="#1e1b3a"
        strokeWidth="1.5"
      />
      <ellipse cx="120" cy="148" rx="6" ry="3" fill="#e26a89" />

      {/* cheeks */}
      <circle cx="82" cy="138" r="6" fill="#ffc0d3" opacity="0.85" />
      <circle cx="158" cy="138" r="6" fill="#ffc0d3" opacity="0.85" />

      {/* arms raised (drawn last so they sit ON TOP of the head silhouette) */}
      <g transform="translate(38,70) rotate(-30)">
        <ellipse cx="0" cy="20" rx="13" ry="30" fill="#7a3ee8" stroke="#4a1eae" strokeWidth="2" />
        <circle cx="0" cy="-8" r="16" fill="#1e1b3a" stroke="#4a1eae" strokeWidth="1.5" />
        {/* paw pads */}
        <circle cx="-4" cy="-12" r="3" fill="#3b3452" />
        <circle cx="4" cy="-12" r="3" fill="#3b3452" />
        <circle cx="0" cy="-4" r="4" fill="#3b3452" />
      </g>
      <g transform="translate(202,70) rotate(30)">
        <ellipse cx="0" cy="20" rx="13" ry="30" fill="#7a3ee8" stroke="#4a1eae" strokeWidth="2" />
        <circle cx="0" cy="-8" r="16" fill="#1e1b3a" stroke="#4a1eae" strokeWidth="1.5" />
        <circle cx="-4" cy="-12" r="3" fill="#3b3452" />
        <circle cx="4" cy="-12" r="3" fill="#3b3452" />
        <circle cx="0" cy="-4" r="4" fill="#3b3452" />
      </g>
    </svg>
  );
}

export function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path
        d="M4 11 L12 4 L20 11 L20 20 L14 20 L14 14 L10 14 L10 20 L4 20 Z"
        fill="none"
        stroke="#7a3ee8"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function RefreshIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path
        d="M20 12 a8 8 0 1 1 -3 -6"
        fill="none"
        stroke="#7a3ee8"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M20 4 L20 10 L14 10"
        fill="none"
        stroke="#7a3ee8"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Small star icon used inside the "+50" reward chip. */
export function RewardStar() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path
        d="M12 3 L14.2 9.2 L20.8 9.6 L15.6 13.6 L17.4 20.2 L12 16.4 L6.6 20.2 L8.4 13.6 L3.2 9.6 L9.8 9.2 Z"
        fill="#ffcf3f"
        stroke="#c98816"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Small coin icon used inside the "+20" reward chip. */
export function RewardCoin() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#f5b820" stroke="#c98816" strokeWidth="1.5" />
      <path
        d="M12 6 L13.4 10.2 L18 10.4 L14.4 13 L15.7 17.4 L12 15 L8.3 17.4 L9.6 13 L6 10.4 L10.6 10.2 Z"
        fill="#fff8ec"
        stroke="#c98816"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}
