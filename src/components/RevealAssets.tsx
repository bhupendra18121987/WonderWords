/* Illustrated SVG assets for the WordReveal celebration screen. */
import type { ReactNode } from 'react';

/**
 * Top mascot with a smiling star + two side stars — inspired by the reference.
 */
export function GreatJobStarCluster() {
  return (
    <svg viewBox="0 0 220 90" width="220" height="90" aria-hidden="true">
      <defs>
        <linearGradient id="gj-star-main" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#ffe268" />
          <stop offset="100%" stopColor="#f5a91e" />
        </linearGradient>
        <linearGradient id="gj-star-alt" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#ffcf5c" />
          <stop offset="100%" stopColor="#f28a1e" />
        </linearGradient>
      </defs>
      {/* left star */}
      <g transform="translate(48,52) rotate(-18)">
        <path
          d="M0 -18 L6 -6 L20 -4 L10 6 L14 20 L0 12 L-14 20 L-10 6 L-20 -4 L-6 -6 Z"
          fill="url(#gj-star-alt)"
          stroke="#c86a10"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </g>
      {/* right star */}
      <g transform="translate(172,50) rotate(20)">
        <path
          d="M0 -18 L6 -6 L20 -4 L10 6 L14 20 L0 12 L-14 20 L-10 6 L-20 -4 L-6 -6 Z"
          fill="url(#gj-star-alt)"
          stroke="#c86a10"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </g>
      {/* main star */}
      <g transform="translate(110,44)">
        <path
          d="M0 -32 L10 -10 L34 -6 L16 8 L22 32 L0 20 L-22 32 L-16 8 L-34 -6 L-10 -10 Z"
          fill="url(#gj-star-main)"
          stroke="#c98816"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* face */}
        <circle cx="-8" cy="-4" r="2.4" fill="#1e1b3a" />
        <circle cx="8" cy="-4" r="2.4" fill="#1e1b3a" />
        <path d="M-6 6 Q0 12 6 6" fill="none" stroke="#1e1b3a" strokeWidth="2" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/**
 * Orange fabric banner used behind the "Great Job!" text.
 */
export function GreatJobBanner({ children }: { children: ReactNode }) {
  return (
    <div className="gj-banner">
      <svg
        className="gj-banner-bg"
        viewBox="0 0 380 90"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="gj-banner-fill" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#ffb545" />
            <stop offset="100%" stopColor="#ee7a10" />
          </linearGradient>
        </defs>
        {/* left tail */}
        <path
          d="M0 30 L22 20 L46 34 L46 60 L22 74 L0 66 L14 48 Z"
          fill="#c95a0d"
        />
        {/* right tail */}
        <path
          d="M380 30 L358 20 L334 34 L334 60 L358 74 L380 66 L366 48 Z"
          fill="#c95a0d"
        />
        {/* main banner */}
        <path
          d="M32 14
             Q80 8 130 16
             Q200 26 260 16
             Q310 10 348 14
             L348 78
             Q310 84 260 76
             Q200 66 130 76
             Q80 84 32 78 Z"
          fill="url(#gj-banner-fill)"
          stroke="#c95a0d"
          strokeWidth="1"
        />
        {/* highlight */}
        <path
          d="M50 22 Q140 16 200 26 Q260 36 330 24"
          fill="none"
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="1.6"
        />
      </svg>
      <span className="gj-banner-text">{children}</span>
    </div>
  );
}

/** Rounded speaker/sound button — matches the target's purple round audio button. */
export function SpeakerIcon() {
  return (
    <svg viewBox="0 0 32 32" width="18" height="18" aria-hidden="true">
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

/**
 * Illustrated cat character used for the "CAT" word reveal.
 * (Additional characters can be added and mapped in wordCharacterFor().)
 */
export function CatCharacter() {
  return (
    <svg viewBox="0 0 220 220" width="180" height="180" aria-hidden="true">
      {/* tail */}
      <path
        d="M172 168 Q198 150 200 122 Q200 98 176 108"
        fill="none"
        stroke="#e07f2c"
        strokeWidth="18"
        strokeLinecap="round"
      />
      <path
        d="M172 168 Q198 150 200 122 Q200 98 176 108"
        fill="none"
        stroke="#f2a44a"
        strokeWidth="10"
        strokeLinecap="round"
      />
      {/* body */}
      <ellipse cx="108" cy="170" rx="52" ry="34" fill="#f2a44a" />
      <ellipse cx="108" cy="176" rx="38" ry="22" fill="#fbd39e" />
      {/* front legs */}
      <ellipse cx="86" cy="192" rx="12" ry="14" fill="#f2a44a" />
      <ellipse cx="126" cy="192" rx="12" ry="14" fill="#f2a44a" />
      <ellipse cx="86" cy="200" rx="8" ry="5" fill="#fbd39e" />
      <ellipse cx="126" cy="200" rx="8" ry="5" fill="#fbd39e" />
      {/* head */}
      <ellipse cx="108" cy="112" rx="54" ry="48" fill="#f2a44a" />
      {/* ears */}
      <path d="M60 82 L54 40 L92 74 Z" fill="#f2a44a" />
      <path d="M156 82 L162 40 L124 74 Z" fill="#f2a44a" />
      <path d="M66 76 L64 52 L86 72 Z" fill="#f7b8c7" />
      <path d="M150 76 L152 52 L130 72 Z" fill="#f7b8c7" />
      {/* stripes */}
      <path d="M84 62 Q88 74 92 62" fill="none" stroke="#c96f1c" strokeWidth="3" strokeLinecap="round" />
      <path d="M108 56 Q112 68 116 56" fill="none" stroke="#c96f1c" strokeWidth="3" strokeLinecap="round" />
      <path d="M130 62 Q134 74 138 62" fill="none" stroke="#c96f1c" strokeWidth="3" strokeLinecap="round" />
      {/* cheeks */}
      <ellipse cx="76" cy="126" rx="10" ry="7" fill="#f7b8c7" opacity="0.7" />
      <ellipse cx="140" cy="126" rx="10" ry="7" fill="#f7b8c7" opacity="0.7" />
      {/* muzzle */}
      <ellipse cx="108" cy="128" rx="24" ry="18" fill="#fbe3c0" />
      {/* eyes */}
      <ellipse cx="90" cy="108" rx="8" ry="10" fill="#1c1330" />
      <ellipse cx="126" cy="108" rx="8" ry="10" fill="#1c1330" />
      <circle cx="93" cy="104" r="2.4" fill="#fff" />
      <circle cx="129" cy="104" r="2.4" fill="#fff" />
      {/* nose */}
      <path d="M100 124 Q108 132 116 124 Q112 128 108 128 Q104 128 100 124 Z" fill="#f47a99" stroke="#c4506e" strokeWidth="1.4" />
      {/* mouth */}
      <path
        d="M108 128 L108 134 M108 134 Q102 140 98 138 M108 134 Q114 140 118 138"
        fill="none"
        stroke="#1c1330"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* whiskers */}
      <path d="M66 128 L84 128 M66 134 L84 132 M132 128 L150 128 M132 132 L150 134" stroke="#c96f1c" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Generic illustrated frame: a soft-fill circle with the emoji at large size.
 * Used as a graceful fallback for words that don't yet have a custom character.
 */
export function EmojiCharacter({ emoji }: { emoji: string }) {
  return (
    <div className="reveal-emoji-frame" aria-hidden="true">
      <span>{emoji}</span>
    </div>
  );
}

/**
 * Confetti/star decorations scattered around the modal.
 */
export function RevealDecor() {
  return (
    <svg
      className="reveal-decor"
      viewBox="0 0 400 700"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <g>
        {/* stars */}
        <g fill="#f5a91e" stroke="#c86a10" strokeWidth="1.6" strokeLinejoin="round">
          <path d="M30 210 l4 -12 l4 12 l12 4 l-12 4 l-4 12 l-4 -12 l-12 -4 z" transform="rotate(-12 30 210)" />
          <path d="M50 470 l4 -12 l4 12 l12 4 l-12 4 l-4 12 l-4 -12 l-12 -4 z" transform="rotate(18 50 470)" />
          <path d="M360 260 l4 -12 l4 12 l12 4 l-12 4 l-4 12 l-4 -12 l-12 -4 z" transform="rotate(24 360 260)" />
          <path d="M370 480 l4 -12 l4 12 l12 4 l-12 4 l-4 12 l-4 -12 l-12 -4 z" transform="rotate(-18 370 480)" />
        </g>
        {/* dot confetti */}
        <g>
          <circle cx="18" cy="300" r="4" fill="#ff7ba4" />
          <circle cx="40" cy="360" r="3" fill="#5ac8fa" />
          <circle cx="20" cy="420" r="3" fill="#a9e34b" />
          <circle cx="380" cy="330" r="4" fill="#ff7ba4" />
          <circle cx="386" cy="400" r="3" fill="#5ac8fa" />
          <circle cx="362" cy="440" r="3" fill="#a9e34b" />
        </g>
        {/* soft cloud puffs */}
        <g fill="#e1c6ff" opacity="0.55">
          <ellipse cx="-10" cy="360" rx="50" ry="28" />
          <ellipse cx="410" cy="380" rx="52" ry="30" />
        </g>
      </g>
    </svg>
  );
}
