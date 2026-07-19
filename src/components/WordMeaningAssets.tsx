/* Illustrated scene assets for the Word Meaning viewer. */
import type { ReactNode } from 'react';

/** Speaker/audio icon (purple circle button contents). */
export function AudioIcon() {
  return (
    <svg viewBox="0 0 32 32" width="20" height="20" aria-hidden="true">
      <path
        d="M6 12 L12 12 L18 7 L18 25 L12 20 L6 20 Z"
        fill="#fff"
      />
      <path
        d="M22 12 Q26 16 22 20"
        fill="none"
        stroke="#fff"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M25 9 Q30 16 25 23"
        fill="none"
        stroke="#fff"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Left/right chevron for the paginator buttons. */
export function ChevronIcon({ dir = 'right' }: { dir?: 'left' | 'right' }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path
        d={dir === 'right' ? 'M9 6 L15 12 L9 18' : 'M15 6 L9 12 L15 18'}
        fill="none"
        stroke="#fff"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Back arrow (used in the top bar). */
export function BackArrow() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path
        d="M14 6 L8 12 L14 18 M8 12 L20 12"
        fill="none"
        stroke="#fff"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** A garden background scene: sky, distant trees, grass mound, flowers, butterflies. */
function GardenBackdrop({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 320 240"
      width="100%"
      height="100%"
      aria-hidden="true"
      className="wm-scene-svg"
    >
      <defs>
        <linearGradient id="wm-sky" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#e7f3ff" />
          <stop offset="100%" stopColor="#f8fbff" />
        </linearGradient>
        <linearGradient id="wm-hill-back" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#c5ea8b" />
          <stop offset="100%" stopColor="#a5da5a" />
        </linearGradient>
        <linearGradient id="wm-hill-front" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#b6ea63" />
          <stop offset="100%" stopColor="#7ec53a" />
        </linearGradient>
      </defs>

      {/* sky */}
      <rect x="0" y="0" width="320" height="240" fill="url(#wm-sky)" />

      {/* distant fluffy trees left */}
      <g>
        <circle cx="30" cy="130" r="26" fill="#8fcf5c" />
        <circle cx="52" cy="118" r="30" fill="#7fc846" />
        <circle cx="18" cy="150" r="20" fill="#7fc846" />
        <rect x="35" y="150" width="6" height="24" fill="#7a4626" />
      </g>
      {/* distant fluffy trees right */}
      <g>
        <circle cx="292" cy="128" r="28" fill="#8fcf5c" />
        <circle cx="270" cy="118" r="24" fill="#7fc846" />
        <circle cx="304" cy="146" r="20" fill="#7fc846" />
        <rect x="288" y="150" width="6" height="24" fill="#7a4626" />
      </g>

      {/* back hill */}
      <path
        d="M-10 200 C40 160 100 160 160 200 C210 168 280 168 330 200 L330 240 L-10 240 Z"
        fill="url(#wm-hill-back)"
      />
      {/* front grass mound */}
      <path
        d="M-10 224 C50 190 110 190 160 220 C210 194 270 194 330 224 L330 240 L-10 240 Z"
        fill="url(#wm-hill-front)"
      />

      {/* small flowers on grass */}
      <g>
        <g transform="translate(50,220)">
          <circle r="3" fill="#fff" />
          <circle r="1.4" fill="#ffcf3f" />
        </g>
        <g transform="translate(96,228)">
          <circle r="3" fill="#ffb6d1" />
          <circle r="1.4" fill="#ffcf3f" />
        </g>
        <g transform="translate(232,222)">
          <circle r="3" fill="#fff" />
          <circle r="1.4" fill="#ffcf3f" />
        </g>
        <g transform="translate(268,230)">
          <circle r="3" fill="#c7b7ff" />
          <circle r="1.4" fill="#ffcf3f" />
        </g>
      </g>

      {/* butterflies */}
      <g transform="translate(40,112)">
        <ellipse cx="-5" cy="0" rx="6" ry="4" fill="#ffd451" />
        <ellipse cx="5" cy="0" rx="6" ry="4" fill="#ffd451" />
        <circle r="1.4" fill="#4c2b0d" />
      </g>
      <g transform="translate(280,124)">
        <ellipse cx="-5" cy="0" rx="6" ry="4" fill="#ff9754" />
        <ellipse cx="5" cy="0" rx="6" ry="4" fill="#ff9754" />
        <circle r="1.4" fill="#4c2b0d" />
      </g>

      {/* character overlay */}
      {children}
    </svg>
  );
}

/** Cute apple character sitting on the grass. */
export function AppleScene() {
  return (
    <GardenBackdrop>
      <g transform="translate(160,168)">
        {/* shadow */}
        <ellipse cx="0" cy="42" rx="30" ry="6" fill="rgba(60,40,20,0.15)" />
        {/* apple body */}
        <path
          d="M0 -30
             C -34 -30 -40 0 -34 20
             C -28 40 -8 42 0 42
             C 8 42 28 40 34 20
             C 40 0 34 -30 0 -30 Z"
          fill="#e73535"
          stroke="#a71212"
          strokeWidth="2"
        />
        {/* highlight */}
        <ellipse cx="-14" cy="-8" rx="8" ry="14" fill="rgba(255,255,255,0.35)" transform="rotate(-20 -14 -8)" />
        {/* stem */}
        <path d="M0 -30 Q2 -40 6 -44" fill="none" stroke="#6b3d13" strokeWidth="4" strokeLinecap="round" />
        {/* leaf */}
        <path d="M6 -44 Q22 -46 24 -32 Q10 -30 6 -44 Z" fill="#58c53a" stroke="#3b8f1f" strokeWidth="1.5" />
        <path d="M8 -42 Q16 -38 22 -34" fill="none" stroke="#3b8f1f" strokeWidth="1" />
        {/* cheeks */}
        <circle cx="-12" cy="8" r="4" fill="#ff9db1" opacity="0.8" />
        <circle cx="12" cy="8" r="4" fill="#ff9db1" opacity="0.8" />
        {/* eyes */}
        <ellipse cx="-8" cy="-4" rx="4" ry="5" fill="#1c1330" />
        <ellipse cx="8" cy="-4" rx="4" ry="5" fill="#1c1330" />
        <circle cx="-6.6" cy="-6" r="1.4" fill="#fff" />
        <circle cx="9.4" cy="-6" r="1.4" fill="#fff" />
        {/* smile */}
        <path
          d="M-6 10 Q0 20 6 10"
          fill="#8e1522"
          stroke="#1c1330"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </g>
    </GardenBackdrop>
  );
}

/** Generic scene: garden with a large emoji standing on the grass. */
export function EmojiScene({ emoji }: { emoji: string }) {
  return (
    <GardenBackdrop>
      <g transform="translate(160,178)">
        <ellipse cx="0" cy="46" rx="34" ry="7" fill="rgba(60,40,20,0.15)" />
        <text
          x="0"
          y="20"
          textAnchor="middle"
          style={{ fontSize: 90, lineHeight: 1 }}
        >
          {emoji}
        </text>
      </g>
    </GardenBackdrop>
  );
}
