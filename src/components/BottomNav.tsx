import { t } from '../core/i18n';
import type { Language } from '../core/types';

export type NavScreen = 'home' | 'game' | 'review' | 'alphabet';

interface BottomNavProps {
  active: NavScreen | null;
  language: Language;
  learnedCount: number;
  onNavigate: (screen: NavScreen) => void;
  onOpenSettings: () => void;
}

interface NavItem {
  key: NavScreen | 'settings';
  icon: string;
  label: string;
  disabled?: boolean;
  onClick: () => void;
  active: boolean;
}

/**
 * Fixed bottom navigation bar. Kids naturally reach the bottom of the
 * screen, so all primary destinations live here — home, play, word review,
 * alphabet learning, and settings.
 */
export default function BottomNav({
  active,
  language,
  learnedCount,
  onNavigate,
  onOpenSettings
}: BottomNavProps) {
  const strings = t(language);
  const items: NavItem[] = [
    {
      key: 'home',
      icon: '🏠',
      label: strings.navHome,
      onClick: () => onNavigate('home'),
      active: active === 'home'
    },
    {
      key: 'game',
      icon: '🧩',
      label: strings.navPlay,
      onClick: () => onNavigate('game'),
      active: active === 'game'
    },
    {
      key: 'review',
      icon: '📖',
      label: strings.navWords,
      onClick: () => onNavigate('review'),
      disabled: learnedCount === 0,
      active: active === 'review'
    },
    {
      key: 'alphabet',
      icon: '🔤',
      label: strings.navLetters,
      onClick: () => onNavigate('alphabet'),
      active: active === 'alphabet'
    },
    {
      key: 'settings',
      icon: '⚙️',
      label: strings.navSettings,
      onClick: onOpenSettings,
      active: false
    }
  ];

  return (
    <nav className="bottom-nav" role="navigation" aria-label="Main navigation">
      {items.map((item) => (
        <button
          key={item.key}
          type="button"
          className={`bottom-nav-item ${item.active ? 'active' : ''}`}
          onClick={item.onClick}
          disabled={item.disabled}
          aria-current={item.active ? 'page' : undefined}
        >
          <span className="bottom-nav-icon" aria-hidden="true">{item.icon}</span>
          <span className="bottom-nav-label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
