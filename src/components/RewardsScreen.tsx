import { useState } from 'react';
import { getRewardsData } from '../core/data';
import { t } from '../core/i18n';
import type { Language, Progress } from '../core/types';
import ThemedScreen from './ThemedScreen';

interface RewardsScreenProps {
  language: Language;
  progress: Progress;
  onBack: () => void;
}

type Tab = 'badges' | 'stars' | 'stickers';

export default function RewardsScreen({ language, progress, onBack }: RewardsScreenProps) {
  const strings = t(language);
  void strings;
  const rewards = getRewardsData(language);
  const [tab, setTab] = useState<Tab>('badges');
  const earned = new Set(progress.badges);

  const tabs: { id: Tab; label: string; emoji: string }[] = [
    { id: 'badges', label: 'Badges', emoji: '🏅' },
    { id: 'stars', label: 'Stars', emoji: '⭐' },
    { id: 'stickers', label: 'Stickers', emoji: '🎨' }
  ];

  return (
    <ThemedScreen title="My Rewards" onBack={onBack} className="rewards-themed">
      <div className="rewards-tabs" role="tablist" aria-label="Reward categories">
        {tabs.map((item) => {
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className={`rewards-tab ${active ? 'active' : ''}`}
              onClick={() => setTab(item.id)}
              role="tab"
              aria-selected={active}
            >
              {item.emoji} {item.label}
            </button>
          );
        })}
      </div>

      {tab === 'badges' && (
        <div className="rewards-grid">
          {rewards.badges.map((badge) => {
            const gotIt = earned.has(badge.id);
            return (
              <div key={badge.id} className={`rewards-tile ${gotIt ? '' : 'locked'}`}>
                <div className="rewards-icon">{gotIt ? badge.emoji : '🔒'}</div>
                <div className="rewards-label">{badge.label}</div>
              </div>
            );
          })}
        </div>
      )}

      {tab === 'stars' && (
        <div className="rewards-empty">
          <div className="rewards-big">⭐ {progress.stars}</div>
          <p>Total Stars</p>
        </div>
      )}

      {tab === 'stickers' && (
        <div className="rewards-empty">
          <div className="rewards-big">🎨</div>
          <p>Sticker collection coming soon.</p>
        </div>
      )}
    </ThemedScreen>
  );
}
