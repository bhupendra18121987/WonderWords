import { t } from '../core/i18n';
import type { Language } from '../core/types';

export type NavScreen = 'home' | 'levels' | 'rewards' | 'profile' | 'age';

interface BottomNavProps {
  active: NavScreen | null;
  language: Language;
  onNavigate: (screen: NavScreen) => void;
}

export default function BottomNav({ active, language, onNavigate }: BottomNavProps) {
  const strings = t(language);

  const items: { key: NavScreen; icon: string; label: string }[] = [
    { key: 'home', icon: '🏠', label: strings.navHome },
    { key: 'levels', icon: '🗺️', label: strings.navLevels },
    { key: 'rewards', icon: '🏆', label: strings.navRewards },
    { key: 'age', icon: '🎂', label: strings.navAge },
    { key: 'profile', icon: '👤', label: strings.navProfile }
  ];

  return (
    <nav className="bottom-nav" role="navigation" aria-label="Main navigation">
      {items.map((item) => {
        const isActive = active === item.key;
        return (
          <button
            key={item.key}
            type="button"
            className={`bottom-nav-item ${isActive ? 'active' : ''}`}
            onClick={() => onNavigate(item.key)}
            aria-current={isActive ? 'page' : undefined}
          >
            <span className="bottom-nav-icon" aria-hidden="true">{item.icon}</span>
            <span className="bottom-nav-label">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
