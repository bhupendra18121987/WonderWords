interface PandaIllustrationProps {
  size?: number;
  className?: string;
}

export default function PandaIllustration({ size = 140, className }: PandaIllustrationProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 220 220"
      role="img"
      aria-label="Panda illustration"
      className={className}
    >
      <ellipse cx="110" cy="206" rx="62" ry="11" fill="rgba(76,29,149,0.18)" />

      <rect x="74" y="118" width="72" height="78" rx="28" fill="#7c3aed" />
      <rect x="78" y="122" width="64" height="46" rx="22" fill="#8b5cf6" />
      <path d="M102 122 h16 v20 h-16 z" fill="#f9fafb" />
      <circle cx="110" cy="132" r="4" fill="#1f2937" />

      <ellipse cx="62" cy="148" rx="16" ry="20" fill="#1f2937" />
      <ellipse cx="158" cy="148" rx="16" ry="20" fill="#1f2937" />
      <ellipse cx="47" cy="120" rx="15" ry="20" fill="#1f2937" transform="rotate(-24 47 120)" />
      <ellipse cx="173" cy="128" rx="16" ry="20" fill="#1f2937" transform="rotate(24 173 128)" />

      <circle cx="75" cy="64" r="23" fill="#1f2937" />
      <circle cx="145" cy="64" r="23" fill="#1f2937" />
      <circle cx="110" cy="86" r="58" fill="#ffffff" />

      <ellipse cx="84" cy="88" rx="19" ry="24" fill="#1f2937" />
      <ellipse cx="136" cy="88" rx="19" ry="24" fill="#1f2937" />
      <circle cx="87" cy="90" r="7" fill="#ffffff" />
      <circle cx="133" cy="90" r="7" fill="#ffffff" />

      <ellipse cx="110" cy="112" rx="15" ry="11" fill="#111827" />
      <path
        d="M95 126 C99 140, 121 140, 125 126"
        stroke="#111827"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />

      <ellipse cx="95" cy="182" rx="10" ry="8" fill="#111827" />
      <ellipse cx="125" cy="182" rx="10" ry="8" fill="#111827" />
    </svg>
  );
}
