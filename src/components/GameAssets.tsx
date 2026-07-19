/* Icons + fixed palette for the WordSearchGame redesign. */

/** Palette used to color the word chips + their matched cells in the grid. */
export const WORD_COLORS = [
  { bg: '#78d76c', dark: '#3d9c34' }, // green
  { bg: '#ff8fb5', dark: '#d95a83' }, // pink
  { bg: '#6ec5ff', dark: '#2f8ac9' }, // blue
  { bg: '#ffb648', dark: '#d1861b' }, // orange
  { bg: '#c088ff', dark: '#8342c9' }, // purple
  { bg: '#ffd66b', dark: '#c58e14' }, // yellow
  { bg: '#ff7a5c', dark: '#c94a2a' }  // coral
];

export function colorForWordIndex(index: number) {
  return WORD_COLORS[index % WORD_COLORS.length]!;
}

export function BackArrowIcon() {
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

export function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <circle cx="12" cy="13" r="8" fill="none" stroke="#7a3ee8" strokeWidth="2" />
      <path d="M12 9 V13 L15 15" fill="none" stroke="#7a3ee8" strokeWidth="2" strokeLinecap="round" />
      <path d="M9 4 L15 4" stroke="#7a3ee8" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function CoinIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#f5b820" stroke="#c98816" strokeWidth="1.5" />
      <path
        d="M12 5 L13.6 10 L18.5 10 L14.6 13 L16.2 18 L12 15 L7.8 18 L9.4 13 L5.5 10 L10.4 10 Z"
        fill="#fff8ec"
        stroke="#c98816"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SpeakerIcon() {
  return (
    <svg viewBox="0 0 32 32" width="22" height="22" aria-hidden="true">
      <path d="M6 12 L12 12 L18 7 L18 25 L12 20 L6 20 Z" fill="#fff" />
      <path d="M22 12 Q26 16 22 20" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M25 9 Q30 16 25 23" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

export function SpeakerMuteIcon() {
  return (
    <svg viewBox="0 0 32 32" width="22" height="22" aria-hidden="true">
      <path d="M6 12 L12 12 L18 7 L18 25 L12 20 L6 20 Z" fill="#fff" />
      <path d="M22 12 L28 20 M28 12 L22 20" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

export function LightbulbIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path
        d="M8 12 a4 4 0 1 1 8 0 c0 2 -1 3 -1.6 4 L9.6 16 C 9 15 8 14 8 12 Z"
        fill="#ffd66b"
        stroke="#fff"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <rect x="9.6" y="16" width="4.8" height="3" rx="0.8" fill="#fff" />
      <rect x="10.4" y="19" width="3.2" height="2" rx="0.8" fill="#fff" />
    </svg>
  );
}

/**
 * Simple grass strip at the very bottom of the game screen.
 */
export function GameGrass() {
  return (
    <svg
      viewBox="0 0 400 60"
      width="100%"
      height="100%"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="gg-fill" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#c7f85f" />
          <stop offset="100%" stopColor="#7ecb32" />
        </linearGradient>
      </defs>
      <path
        d="M-10 30 C60 4 140 4 200 26 C260 6 340 6 410 30 L410 60 L-10 60 Z"
        fill="url(#gg-fill)"
      />
      <g fill="#67b530" opacity="0.8">
        <path d="M40 42 l-3 -6 l3 2 l3 -2 l-3 6z" />
        <path d="M120 46 l-3 -6 l3 2 l3 -2 l-3 6z" />
        <path d="M240 42 l-3 -6 l3 2 l3 -2 l-3 6z" />
        <path d="M330 44 l-3 -6 l3 2 l3 -2 l-3 6z" />
      </g>
    </svg>
  );
}
