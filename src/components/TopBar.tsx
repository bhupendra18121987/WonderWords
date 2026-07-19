import { t } from '../core/i18n';
import type { Language } from '../core/types';

interface TopBarProps {
  language: Language;
  stars: number;
  onStarsPress?: () => void;
  onOpenSettings: () => void;
  onOpenTour?: () => void;
}

export default function TopBar({
  language,
  stars,
  onStarsPress,
  onOpenSettings,
  onOpenTour
}: TopBarProps) {
  const strings = t(language);

  return (
    <header className="topbar-shell" role="banner">
      <button
        type="button"
        className="topbar-stars"
        onClick={onStarsPress}
        aria-label={`${stars} ${strings.navRewards}`}
      >
        <span aria-hidden="true">⭐</span>
        <strong>{stars}</strong>
      </button>

      <div className="topbar-actions">
        {onOpenTour && (
          <button
            type="button"
            className="topbar-tour"
            onClick={onOpenTour}
            aria-label={strings.quickTour}
            title={strings.quickTour}
          >
            🎬
          </button>
        )}
        <button
          type="button"
          className="topbar-settings"
          onClick={onOpenSettings}
          aria-label={strings.navSettings}
        >
          ⚙️
        </button>
      </div>
    </header>
  );
}
