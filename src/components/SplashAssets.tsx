/* Illustrated assets for the SplashScreen. */

/**
 * Full-scene backdrop: sky gradient, clouds, rainbow, hills, trees,
 * mushrooms, small house, flowers.
 */
export function SplashBackdrop() {
  return (
    <svg
      viewBox="0 0 360 640"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className="splash-backdrop-svg"
    >
      <defs>
        <linearGradient id="sp-sky" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#8ed6ff" />
          <stop offset="55%" stopColor="#bfe6ff" />
          <stop offset="100%" stopColor="#eaf7ff" />
        </linearGradient>
        <linearGradient id="sp-hill-back" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#8fda56" />
          <stop offset="100%" stopColor="#5ea82c" />
        </linearGradient>
        <linearGradient id="sp-hill-front" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#7ecf3d" />
          <stop offset="100%" stopColor="#4e952a" />
        </linearGradient>
      </defs>

      {/* sky */}
      <rect x="0" y="0" width="360" height="640" fill="url(#sp-sky)" />

      {/* fluffy clouds */}
      <g fill="#ffffff" opacity="0.95">
        <ellipse cx="60" cy="110" rx="34" ry="12" />
        <ellipse cx="86" cy="102" rx="22" ry="10" />
        <ellipse cx="290" cy="80" rx="30" ry="11" />
        <ellipse cx="270" cy="72" rx="18" ry="8" />
        <ellipse cx="184" cy="60" rx="24" ry="9" />
      </g>

      {/* rainbow arc */}
      <g fill="none" strokeLinecap="round" opacity="0.85">
        <path d="M40 220 A 140 140 0 0 1 320 220" stroke="#ff5c5c" strokeWidth="10" />
        <path d="M52 220 A 128 128 0 0 1 308 220" stroke="#ff9a3c" strokeWidth="10" />
        <path d="M64 220 A 116 116 0 0 1 296 220" stroke="#ffd23c" strokeWidth="10" />
        <path d="M76 220 A 104 104 0 0 1 284 220" stroke="#4ecb46" strokeWidth="10" />
        <path d="M88 220 A 92 92 0 0 1 272 220" stroke="#4a9df1" strokeWidth="10" />
        <path d="M100 220 A 80 80 0 0 1 260 220" stroke="#9c5cff" strokeWidth="10" />
      </g>

      {/* distant hills */}
      <path
        d="M-10 470
           C 40 420 100 420 160 460
           C 220 420 280 420 370 460
           L 370 640 L -10 640 Z"
        fill="url(#sp-hill-back)"
      />
      {/* front grass mound */}
      <path
        d="M-10 520
           C 60 470 130 470 200 510
           C 260 480 320 480 370 510
           L 370 640 L -10 640 Z"
        fill="url(#sp-hill-front)"
      />

      {/* big trees left */}
      <g transform="translate(0,380)">
        <rect x="22" y="90" width="12" height="36" fill="#7a4626" />
        <circle cx="28" cy="58" r="38" fill="#67b530" />
        <circle cx="0" cy="70" r="26" fill="#4f9925" />
        <circle cx="52" cy="72" r="28" fill="#8fdc55" />
        <circle cx="22" cy="32" r="22" fill="#8fdc55" />
      </g>
      <g transform="translate(66,436)">
        <rect x="6" y="48" width="8" height="24" fill="#7a4626" />
        <circle cx="10" cy="24" r="22" fill="#67b530" />
        <circle cx="-6" cy="34" r="16" fill="#4f9925" />
        <circle cx="24" cy="34" r="18" fill="#8fdc55" />
      </g>

      {/* small house right */}
      <g transform="translate(280,440)">
        {/* body */}
        <rect x="0" y="30" width="52" height="46" fill="#f4e0b5" stroke="#a97b3d" strokeWidth="1.5" />
        {/* roof */}
        <path d="M-6 32 L26 4 L58 32 Z" fill="#e04835" stroke="#a71c1c" strokeWidth="1.5" strokeLinejoin="round" />
        {/* window */}
        <rect x="16" y="42" width="14" height="14" rx="2" fill="#7ecafc" stroke="#3d94d6" strokeWidth="1.5" />
        <line x1="23" y1="42" x2="23" y2="56" stroke="#3d94d6" strokeWidth="1.2" />
        <line x1="16" y1="49" x2="30" y2="49" stroke="#3d94d6" strokeWidth="1.2" />
        {/* door */}
        <rect x="36" y="56" width="10" height="20" rx="2" fill="#7a4626" />
        {/* chimney */}
        <rect x="42" y="8" width="6" height="14" fill="#a71c1c" />
      </g>

      {/* red mushrooms */}
      <g>
        <MushroomShape cx={30} cy={560} />
        <MushroomShape cx={62} cy={572} small />
      </g>

      {/* flowers scattered on grass */}
      <g>
        <Flower cx={170} cy={560} color="#ff9dc1" />
        <Flower cx={210} cy={572} color="#ffffff" />
        <Flower cx={310} cy={572} color="#c7b7ff" />
        <Flower cx={126} cy={572} color="#ffd45c" />
      </g>

      {/* small butterfly */}
      <g transform="translate(240,240)">
        <ellipse cx="-6" cy="0" rx="7" ry="5" fill="#ffd451" />
        <ellipse cx="6" cy="0" rx="7" ry="5" fill="#ffd451" />
        <circle r="1.4" fill="#4c2b0d" />
      </g>
    </svg>
  );
}

function MushroomShape({ cx, cy, small = false }: { cx: number; cy: number; small?: boolean }) {
  const s = small ? 0.7 : 1;
  return (
    <g transform={`translate(${cx},${cy}) scale(${s})`}>
      {/* stem */}
      <rect x="-4" y="0" width="8" height="14" rx="2" fill="#fff8ec" stroke="#d5c19c" strokeWidth="1" />
      {/* cap */}
      <path d="M-14 0 Q0 -18 14 0 Z" fill="#e04835" stroke="#a71c1c" strokeWidth="1" strokeLinejoin="round" />
      {/* spots */}
      <circle cx="-4" cy="-4" r="2" fill="#fff" />
      <circle cx="6" cy="-2" r="1.6" fill="#fff" />
    </g>
  );
}

function Flower({ cx, cy, color }: { cx: number; cy: number; color: string }) {
  return (
    <g transform={`translate(${cx},${cy})`}>
      <circle r="3" fill={color} />
      <circle r="1.4" fill="#ffcf3f" />
    </g>
  );
}

/**
 * The mascot: a friendly panda in a purple hoodie holding a book and waving.
 */
export function SplashPanda() {
  return (
    <svg viewBox="0 0 260 300" width="220" height="260" aria-hidden="true">
      {/* backpack strap behind body */}
      <path d="M100 130 Q98 168 112 200" fill="none" stroke="#f2a63a" strokeWidth="7" strokeLinecap="round" />
      {/* body (hoodie) */}
      <path
        d="M70 160
           Q60 220 90 260
           L170 260
           Q200 220 190 160
           Q170 148 130 148
           Q90 148 70 160 Z"
        fill="#7a3ee8"
        stroke="#4a1eae"
        strokeWidth="2"
      />
      {/* hoodie neck darker */}
      <path
        d="M92 156 Q130 176 168 156 Q170 168 168 174 Q130 190 92 174 Q90 168 92 156 Z"
        fill="#5a24bd"
      />
      {/* pants */}
      <path
        d="M90 260 L110 300 L128 300 L128 262 Z
           M170 260 L150 300 L132 300 L132 262 Z"
        fill="#2e4173"
        stroke="#1c2851"
        strokeWidth="2"
      />
      {/* shoes */}
      <ellipse cx="115" cy="298" rx="12" ry="6" fill="#1c1330" />
      <ellipse cx="145" cy="298" rx="12" ry="6" fill="#1c1330" />

      {/* left arm holding book */}
      <ellipse cx="76" cy="196" rx="14" ry="20" fill="#fff" stroke="#d0d0d8" strokeWidth="1" />
      {/* book */}
      <g transform="translate(56,196)">
        <rect x="0" y="0" width="46" height="34" rx="3" fill="#3d7dd6" stroke="#26568f" strokeWidth="1.5" />
        <rect x="4" y="4" width="18" height="26" rx="2" fill="#f5e08a" />
        <rect x="24" y="4" width="18" height="26" rx="2" fill="#fff" stroke="#d0d0d8" strokeWidth="0.8" />
        <line x1="23" y1="4" x2="23" y2="30" stroke="#26568f" strokeWidth="1" />
      </g>

      {/* right arm waving */}
      <g transform="translate(190,150) rotate(20)">
        <ellipse cx="0" cy="10" rx="10" ry="18" fill="#7a3ee8" stroke="#4a1eae" strokeWidth="2" />
        <circle cx="0" cy="-4" r="10" fill="#fff" stroke="#d0d0d8" strokeWidth="1" />
      </g>

      {/* ears */}
      <circle cx="82" cy="52" r="20" fill="#1e1b3a" />
      <circle cx="178" cy="52" r="20" fill="#1e1b3a" />
      <circle cx="82" cy="52" r="10" fill="#3b3452" />
      <circle cx="178" cy="52" r="10" fill="#3b3452" />

      {/* head */}
      <circle cx="130" cy="92" r="60" fill="#fff" stroke="#d0d0d8" strokeWidth="1" />

      {/* eye patches */}
      <ellipse cx="106" cy="90" rx="18" ry="22" fill="#1e1b3a" transform="rotate(-10 106 90)" />
      <ellipse cx="154" cy="90" rx="18" ry="22" fill="#1e1b3a" transform="rotate(10 154 90)" />
      {/* eyes */}
      <circle cx="107" cy="94" r="8" fill="#fff" />
      <circle cx="153" cy="94" r="8" fill="#fff" />
      <circle cx="107" cy="94" r="4" fill="#111" />
      <circle cx="153" cy="94" r="4" fill="#111" />
      <circle cx="109" cy="92" r="1.6" fill="#fff" />
      <circle cx="155" cy="92" r="1.6" fill="#fff" />

      {/* nose */}
      <ellipse cx="130" cy="114" rx="6" ry="4" fill="#1e1b3a" />
      {/* mouth open smile */}
      <path
        d="M120 124 Q130 140 140 124 Q136 132 130 132 Q124 132 120 124 Z"
        fill="#c93f5f"
        stroke="#1e1b3a"
        strokeWidth="1.5"
      />
      <path d="M124 128 Q130 132 136 128" fill="#fff" opacity="0.7" />

      {/* cheeks */}
      <circle cx="94" cy="120" r="6" fill="#ffc0d3" opacity="0.85" />
      <circle cx="166" cy="120" r="6" fill="#ffc0d3" opacity="0.85" />

      {/* hoodie hood detail behind head */}
      <path
        d="M76 152 Q80 106 130 100 Q180 106 184 152"
        fill="none"
        stroke="#4a1eae"
        strokeWidth="3"
      />
    </svg>
  );
}

/** Small round music-note button used in the top-right of the splash. */
export function MusicNoteIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path
        d="M9 18 V6 L18 4 V16"
        fill="none"
        stroke="#fff"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <ellipse cx="7" cy="18" rx="3" ry="2.4" fill="#fff" />
      <ellipse cx="16" cy="16" rx="3" ry="2.4" fill="#fff" />
    </svg>
  );
}

/** Small right-arrow used inside the Let's Play button. */
export function PlayArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
      <path
        d="M9 6 L15 12 L9 18"
        fill="none"
        stroke="#fff"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
