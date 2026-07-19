/* SVG background for the Home level-map. */

export function LevelMapScene() {
  return (
    <svg
      viewBox="0 0 320 460"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className="home-map-svg"
    >
      <defs>
        <linearGradient id="hm-sky" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#dff1ff" />
          <stop offset="100%" stopColor="#f5faff" />
        </linearGradient>
        <linearGradient id="hm-water" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#7bc4ff" />
          <stop offset="100%" stopColor="#4ea3e8" />
        </linearGradient>
        <linearGradient id="hm-land" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#b9e77c" />
          <stop offset="100%" stopColor="#7ec53a" />
        </linearGradient>
        <linearGradient id="hm-land-shadow" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#7ec53a" />
          <stop offset="100%" stopColor="#5a9d1e" />
        </linearGradient>
        <linearGradient id="hm-path" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#e0b57a" />
          <stop offset="100%" stopColor="#b98a4a" />
        </linearGradient>
      </defs>

      {/* sky */}
      <rect x="0" y="0" width="320" height="460" fill="url(#hm-sky)" />

      {/* far clouds */}
      <g fill="#ffffff" opacity="0.85">
        <ellipse cx="60" cy="24" rx="24" ry="8" />
        <ellipse cx="80" cy="20" rx="16" ry="7" />
        <ellipse cx="240" cy="30" rx="22" ry="7" />
        <ellipse cx="220" cy="26" rx="14" ry="6" />
      </g>

      {/* water on the left / bottom-left */}
      <path
        d="M0 380 L0 460 L320 460 L320 420
           Q260 402 210 420
           Q160 438 120 420
           Q80 402 40 418
           Q20 424 0 380 Z"
        fill="url(#hm-water)"
      />
      {/* water ripples */}
      <g stroke="rgba(255,255,255,0.55)" strokeWidth="1.4" fill="none" strokeLinecap="round">
        <path d="M20 430 q6 -4 12 0 q6 4 12 0" />
        <path d="M60 445 q6 -4 12 0 q6 4 12 0" />
        <path d="M150 434 q6 -4 12 0 q6 4 12 0" />
        <path d="M240 432 q6 -4 12 0 q6 4 12 0" />
      </g>

      {/* large main landmass */}
      <path
        d="M0 220
           Q40 170 100 190
           Q160 210 220 180
           Q280 150 320 190
           L320 420
           Q260 402 210 420
           Q160 438 120 420
           Q80 402 40 418
           Q20 424 0 380 Z"
        fill="url(#hm-land)"
      />
      {/* land shadow ridge */}
      <path
        d="M0 220
           Q40 170 100 190
           Q160 210 220 180
           Q280 150 320 190
           L320 210
           Q280 170 220 200
           Q160 230 100 210
           Q40 190 0 240 Z"
        fill="url(#hm-land-shadow)"
        opacity="0.55"
      />

      {/* small island near top-left for level 4 */}
      <path
        d="M60 60
           Q100 40 150 60
           Q170 70 160 90
           Q120 110 70 90
           Q40 80 60 60 Z"
        fill="url(#hm-land)"
      />
      <path
        d="M62 78
           Q100 62 150 76
           Q170 82 160 92
           Q120 106 70 92
           Q42 82 62 78 Z"
        fill="url(#hm-land-shadow)"
        opacity="0.45"
      />

      {/* winding path */}
      <path
        d="M60 90
           Q140 150 90 210
           Q40 260 130 300
           Q220 330 180 380
           Q160 405 260 420"
        fill="none"
        stroke="#e0b57a"
        strokeWidth="26"
        strokeLinecap="round"
      />
      <path
        d="M60 90
           Q140 150 90 210
           Q40 260 130 300
           Q220 330 180 380
           Q160 405 260 420"
        fill="none"
        stroke="#b98a4a"
        strokeWidth="26"
        strokeLinecap="round"
        strokeDasharray="1 12"
      />

      {/* trees scattered on land */}
      <g>
        <TreeBig cx={40} cy={230} />
        <TreeBig cx={280} cy={200} />
        <TreeBig cx={250} cy={260} />
        <TreeBig cx={20} cy={300} />
        <TreeSmall cx={230} cy={340} />
        <TreeSmall cx={60} cy={360} />
        <TreeSmall cx={110} cy={250} />
        <TreeSmall cx={170} cy={140} />
      </g>

      {/* mushrooms + flowers */}
      <g>
        <circle cx="200" cy="380" r="3" fill="#ffb0c0" />
        <circle cx="200" cy="380" r="1.2" fill="#ffcf3f" />
        <circle cx="150" cy="360" r="3" fill="#fff" />
        <circle cx="150" cy="360" r="1.2" fill="#ffcf3f" />
        <circle cx="90" cy="290" r="3" fill="#c7b7ff" />
        <circle cx="90" cy="290" r="1.2" fill="#ffcf3f" />
      </g>
    </svg>
  );
}

/** A rounded fluffy tree with a small brown trunk. */
function TreeBig({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g>
      <rect x={cx - 2} y={cy + 8} width="4" height="14" fill="#7a4626" />
      <circle cx={cx} cy={cy} r="18" fill="#7fc846" />
      <circle cx={cx - 12} cy={cy + 4} r="12" fill="#67b530" />
      <circle cx={cx + 12} cy={cy + 4} r="12" fill="#67b530" />
      <circle cx={cx} cy={cy - 6} r="10" fill="#8fdc55" />
    </g>
  );
}

function TreeSmall({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g>
      <rect x={cx - 1.5} y={cy + 5} width="3" height="10" fill="#7a4626" />
      <circle cx={cx} cy={cy} r="10" fill="#7fc846" />
      <circle cx={cx - 6} cy={cy + 2} r="7" fill="#67b530" />
      <circle cx={cx + 6} cy={cy + 2} r="7" fill="#67b530" />
    </g>
  );
}

export function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
      <path d="M8 10 V7 a4 4 0 0 1 8 0 v3" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
      <rect x="6" y="10" width="12" height="10" rx="2.5" fill="#fff" />
      <circle cx="12" cy="15" r="1.5" fill="#5a3ea1" />
    </svg>
  );
}

export function UnlockedIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
      <path d="M8 10 V7 a4 4 0 0 1 8 0" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
      <rect x="6" y="10" width="12" height="10" rx="2.5" fill="#fff" />
      <circle cx="12" cy="15" r="1.5" fill="#c96f1c" />
    </svg>
  );
}

/** Small star for the level star row (filled or empty). */
export function LevelStar({ filled = true }: { filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true">
      <path
        d="M12 3 L14.2 9.2 L20.8 9.6 L15.6 13.6 L17.4 20.2 L12 16.4 L6.6 20.2 L8.4 13.6 L3.2 9.6 L9.8 9.2 Z"
        fill={filled ? '#ffcf3f' : 'rgba(255,255,255,0.5)'}
        stroke={filled ? '#c98816' : 'rgba(255,255,255,0.35)'}
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}
