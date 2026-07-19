/* Small reusable back-button used on secondary/immersive screens. */

interface BackButtonProps {
  onClick: () => void;
  label?: string;
  variant?: 'light' | 'dark';
}

export default function BackButton({ onClick, label = 'Back', variant = 'dark' }: BackButtonProps) {
  return (
    <button
      type="button"
      className={`back-fab ${variant}`}
      onClick={onClick}
      aria-label={label}
    >
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
        <path
          d="M14 6 L8 12 L14 18 M8 12 L20 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
