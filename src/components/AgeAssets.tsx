/* Illustrated SVG assets for the AgeSelect screen. */

export function StarMascot() {
  return (
    <svg viewBox="0 0 120 120" width="72" height="72" aria-hidden="true">
      <defs>
        <linearGradient id="star-fill" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#ffe268" />
          <stop offset="100%" stopColor="#f5b820" />
        </linearGradient>
      </defs>
      <path
        d="M60 8 L74 42 L110 46 L82 68 L92 104 L60 84 L28 104 L38 68 L10 46 L46 42 Z"
        fill="url(#star-fill)"
        stroke="#c98816"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* cheeks */}
      <circle cx="46" cy="66" r="5" fill="#f79ba9" opacity="0.75" />
      <circle cx="74" cy="66" r="5" fill="#f79ba9" opacity="0.75" />
      {/* eyes */}
      <ellipse cx="50" cy="58" rx="3.4" ry="4.4" fill="#1e1b3a" />
      <ellipse cx="70" cy="58" rx="3.4" ry="4.4" fill="#1e1b3a" />
      <circle cx="51.4" cy="56.4" r="1.1" fill="#fff" />
      <circle cx="71.4" cy="56.4" r="1.1" fill="#fff" />
      {/* smile */}
      <path
        d="M52 70 Q60 78 68 70"
        fill="none"
        stroke="#1e1b3a"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function BearAvatar() {
  return (
    <svg viewBox="0 0 120 120" width="82" height="82" aria-hidden="true">
      {/* ears */}
      <circle cx="34" cy="34" r="14" fill="#a76a3a" />
      <circle cx="86" cy="34" r="14" fill="#a76a3a" />
      <circle cx="34" cy="34" r="7" fill="#e6b58a" />
      <circle cx="86" cy="34" r="7" fill="#e6b58a" />
      {/* head */}
      <circle cx="60" cy="64" r="36" fill="#c17e46" />
      {/* muzzle */}
      <ellipse cx="60" cy="78" rx="22" ry="17" fill="#f2d3af" />
      {/* eyes */}
      <ellipse cx="49" cy="60" rx="4" ry="5" fill="#1c1330" />
      <ellipse cx="71" cy="60" rx="4" ry="5" fill="#1c1330" />
      <circle cx="50.2" cy="58.2" r="1.3" fill="#fff" />
      <circle cx="72.2" cy="58.2" r="1.3" fill="#fff" />
      {/* nose */}
      <ellipse cx="60" cy="74" rx="4" ry="3" fill="#1c1330" />
      {/* mouth */}
      <path
        d="M55 82 Q60 87 65 82"
        fill="none"
        stroke="#1c1330"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* bowtie */}
      <path
        d="M46 100 L58 92 L58 108 Z M74 100 L62 92 L62 108 Z"
        fill="#3d9dfa"
      />
      <rect x="57" y="94" width="6" height="12" rx="1.5" fill="#2b7dd1" />
    </svg>
  );
}

export function BunnyAvatar() {
  return (
    <svg viewBox="0 0 120 120" width="82" height="82" aria-hidden="true">
      {/* ears */}
      <ellipse cx="44" cy="26" rx="9" ry="20" fill="#f4f0f2" stroke="#d9c9d0" strokeWidth="1.5" />
      <ellipse cx="76" cy="26" rx="9" ry="20" fill="#f4f0f2" stroke="#d9c9d0" strokeWidth="1.5" />
      <ellipse cx="44" cy="30" rx="4" ry="12" fill="#f7b8c7" />
      <ellipse cx="76" cy="30" rx="4" ry="12" fill="#f7b8c7" />
      {/* head */}
      <circle cx="60" cy="66" r="34" fill="#fbf5f7" stroke="#d9c9d0" strokeWidth="1.5" />
      {/* cheeks */}
      <circle cx="42" cy="76" r="6" fill="#f7b8c7" opacity="0.8" />
      <circle cx="78" cy="76" r="6" fill="#f7b8c7" opacity="0.8" />
      {/* eyes */}
      <ellipse cx="50" cy="66" rx="4" ry="5" fill="#1c1330" />
      <ellipse cx="70" cy="66" rx="4" ry="5" fill="#1c1330" />
      <circle cx="51.2" cy="64.2" r="1.3" fill="#fff" />
      <circle cx="71.2" cy="64.2" r="1.3" fill="#fff" />
      {/* nose */}
      <path d="M57 74 Q60 78 63 74 Q60 76 57 74" fill="#f47a99" stroke="#c4506e" strokeWidth="1" />
      {/* mouth */}
      <path
        d="M60 76 L60 80 M60 80 Q56 84 53 82 M60 80 Q64 84 67 82"
        fill="none"
        stroke="#1c1330"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* collar */}
      <path d="M28 100 Q60 116 92 100 L92 108 Q60 124 28 108 Z" fill="#f5c451" />
    </svg>
  );
}

export function LionAvatar() {
  return (
    <svg viewBox="0 0 120 120" width="82" height="82" aria-hidden="true">
      {/* mane */}
      <g fill="#c65f22">
        <circle cx="24" cy="52" r="12" />
        <circle cx="34" cy="30" r="12" />
        <circle cx="60" cy="20" r="13" />
        <circle cx="86" cy="30" r="12" />
        <circle cx="96" cy="52" r="12" />
        <circle cx="90" cy="78" r="12" />
        <circle cx="60" cy="94" r="14" />
        <circle cx="30" cy="78" r="12" />
      </g>
      {/* ears */}
      <circle cx="36" cy="44" r="8" fill="#c65f22" />
      <circle cx="84" cy="44" r="8" fill="#c65f22" />
      <circle cx="36" cy="44" r="4" fill="#f4d29b" />
      <circle cx="84" cy="44" r="4" fill="#f4d29b" />
      {/* head */}
      <circle cx="60" cy="62" r="30" fill="#f7c04a" />
      {/* muzzle */}
      <ellipse cx="60" cy="76" rx="18" ry="14" fill="#fbe6ba" />
      {/* eyes */}
      <ellipse cx="50" cy="60" rx="3.6" ry="4.6" fill="#1c1330" />
      <ellipse cx="70" cy="60" rx="3.6" ry="4.6" fill="#1c1330" />
      <circle cx="51.2" cy="58.4" r="1.2" fill="#fff" />
      <circle cx="71.2" cy="58.4" r="1.2" fill="#fff" />
      {/* nose */}
      <path d="M56 70 Q60 76 64 70 Z" fill="#1c1330" />
      {/* mouth */}
      <path
        d="M60 74 L60 78 M60 78 Q56 82 53 80 M60 78 Q64 82 67 80"
        fill="none"
        stroke="#1c1330"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function RibbonBanner({ children }: { children: React.ReactNode }) {
  return (
    <div className="ribbon-svg-wrap">
      <svg
        className="ribbon-svg-bg"
        viewBox="0 0 400 90"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {/* left tail */}
        <path
          d="M0 30 L18 22 L36 30 L36 62 L18 70 L0 62 L10 46 Z"
          fill="#5a24bd"
        />
        {/* right tail */}
        <path
          d="M400 30 L382 22 L364 30 L364 62 L382 70 L400 62 L390 46 Z"
          fill="#5a24bd"
        />
        {/* main banner body with wave curves */}
        <path
          d="M30 12
             Q60 8 90 14
             Q140 22 200 14
             Q260 6 310 14
             Q340 20 370 12
             L370 78
             Q340 82 310 76
             Q260 68 200 76
             Q140 84 90 76
             Q60 70 30 78 Z"
          fill="url(#ribbon-grad)"
          stroke="#4c1ea3"
          strokeWidth="1"
        />
        <defs>
          <linearGradient id="ribbon-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#9c5cff" />
            <stop offset="55%" stopColor="#7a37e6" />
            <stop offset="100%" stopColor="#5a24bd" />
          </linearGradient>
        </defs>
        {/* highlight */}
        <path
          d="M50 20 Q140 14 200 22 Q260 30 350 20"
          fill="none"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="1.6"
        />
      </svg>
      <span className="ribbon-svg-text">{children}</span>
    </div>
  );
}

export function HillsScene() {
  return (
    <svg
      className="hills-scene"
      viewBox="0 0 400 200"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="hill-back" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#c3ee8a" />
          <stop offset="100%" stopColor="#a7de5f" />
        </linearGradient>
        <linearGradient id="hill-front" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#b9ec52" />
          <stop offset="100%" stopColor="#7ecb32" />
        </linearGradient>
        <linearGradient id="cloud-fill" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#ffe3f5" />
          <stop offset="100%" stopColor="#f9c5e6" />
        </linearGradient>
      </defs>
      {/* pink cloud bank */}
      <path
        d="M-20 90
           C 20 60, 60 60, 100 88
           C 130 60, 180 60, 210 88
           C 240 62, 290 60, 320 86
           C 350 62, 400 66, 420 92
           L 420 130
           L -20 130 Z"
        fill="url(#cloud-fill)"
      />
      {/* back hills */}
      <path
        d="M-20 150
           C 40 110, 100 110, 160 150
           C 200 118, 260 118, 310 150
           C 350 122, 400 128, 420 150
           L 420 200 L -20 200 Z"
        fill="url(#hill-back)"
      />
      {/* front hills */}
      <path
        d="M-20 172
           C 40 140, 90 140, 140 172
           C 190 146, 250 146, 300 172
           C 340 150, 400 154, 420 172
           L 420 200 L -20 200 Z"
        fill="url(#hill-front)"
      />
      {/* grass tufts */}
      <g fill="#5faa26" opacity="0.9">
        <path d="M40 170 l-3 -6 l3 2 l3 -2 l-3 6z" />
        <path d="M120 176 l-3 -6 l3 2 l3 -2 l-3 6z" />
        <path d="M220 168 l-3 -6 l3 2 l3 -2 l-3 6z" />
        <path d="M310 174 l-3 -6 l3 2 l3 -2 l-3 6z" />
        <path d="M360 170 l-3 -6 l3 2 l3 -2 l-3 6z" />
      </g>
      {/* tiny flowers */}
      <g>
        <circle cx="60" cy="182" r="2" fill="#ffffff" />
        <circle cx="60" cy="182" r="0.9" fill="#ffcf3f" />
        <circle cx="180" cy="188" r="2" fill="#ffffff" />
        <circle cx="180" cy="188" r="0.9" fill="#ffcf3f" />
        <circle cx="330" cy="184" r="2" fill="#ffffff" />
        <circle cx="330" cy="184" r="0.9" fill="#ffcf3f" />
      </g>
    </svg>
  );
}

export function TopSparkles() {
  return (
    <svg
      className="age-sparkles"
      viewBox="0 0 320 40"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <g fill="rgba(255,255,255,0.85)">
        <path d="M20 20 l3 -7 l3 7 l7 3 l-7 3 l-3 7 l-3 -7 l-7 -3 z" />
        <path d="M60 12 l2 -5 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 z" opacity="0.7" />
        <path d="M256 12 l2 -5 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 z" opacity="0.7" />
        <path d="M296 20 l3 -7 l3 7 l7 3 l-7 3 l-3 7 l-3 -7 l-7 -3 z" />
      </g>
    </svg>
  );
}
