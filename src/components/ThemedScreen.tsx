/**
 * Reusable themed shell that gives every secondary screen the same purple-gradient
 * top + white rounded content card look introduced by the redesigned Word Search
 * game. Use this instead of the raw <section className="screen"> wrapper to keep
 * the whole app visually consistent.
 *
 * Structure:
 *   ┌───── purple gradient background ─────┐
 *   │  [back]  timer/coin chips (right)    │
 *   │  ┌──── white rounded card ────┐      │
 *   │  │   <children>                │     │
 *   │  └────────────────────────────┘     │
 *   │           (optional grass)          │
 *   └──────────────────────────────────────┘
 */
import type { ReactNode } from 'react';
import BackButton from './BackButton';
import { GameGrass } from './GameAssets';

interface ThemedScreenProps {
  title?: string;
  /** Optional decoration/icon rendered next to the title (e.g. a small mascot). */
  titleIcon?: ReactNode;
  /** Extra chips/actions rendered in the top-right of the purple header. */
  headerRight?: ReactNode;
  /** Called by the top-left back button. When omitted, no back button renders. */
  onBack?: () => void;
  /** Optional class hook so callers can tweak spacing per screen. */
  className?: string;
  /** Toggle the illustrated green grass at the very bottom. */
  showGrass?: boolean;
  children: ReactNode;
}

export default function ThemedScreen({
  title,
  titleIcon,
  headerRight,
  onBack,
  className = '',
  showGrass = true,
  children
}: ThemedScreenProps) {
  return (
    <section className={`themed-screen ${className}`}>
      <header className="themed-topbar">
        {onBack ? <BackButton onClick={onBack} variant="light" /> : <span className="themed-topbar-spacer" />}
        <div className="themed-title-wrap">
          {titleIcon && <span className="themed-title-icon" aria-hidden="true">{titleIcon}</span>}
          {title && <h1 className="themed-title">{title}</h1>}
        </div>
        <div className="themed-topbar-right">{headerRight}</div>
      </header>

      <div className="themed-card">{children}</div>

      {showGrass && (
        <div className="themed-grass" aria-hidden="true">
          <GameGrass />
        </div>
      )}
    </section>
  );
}
