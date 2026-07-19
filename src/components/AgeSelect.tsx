import { useEffect, useState } from 'react';
import { getWordsData } from '../core/data';
import type { AgeGroupKey, Language } from '../core/types';
import {
  BearAvatar,
  BunnyAvatar,
  HillsScene,
  LionAvatar,
  RibbonBanner,
  StarMascot,
  TopSparkles
} from './AgeAssets';

interface AgeSelectProps {
  selected: AgeGroupKey | null;
  language?: Language;
  step?: { current: number; total: number };
  onSelect: (key: AgeGroupKey) => void;
  onStart: () => void;
  /** Optional back handler. Shown as a top-left circular button when set. */
  onBack?: () => void;
}

const AVATARS = [<BearAvatar />, <BunnyAvatar />, <LionAvatar />];
const TINTS = ['age-pill-green', 'age-pill-yellow', 'age-pill-blue'];
const RANGES = ['3 – 4', '5 – 6', '7 – 8'];

export default function AgeSelect({
  selected,
  language = 'en',
  onSelect,
  onStart,
  onBack
}: AgeSelectProps) {
  const wordsData = getWordsData(language);
  const groups = Object.entries(wordsData.ageGroups) as [
    AgeGroupKey,
    typeof wordsData.ageGroups[AgeGroupKey]
  ][];
  const isHi = language === 'hi';
  const [pendingStart, setPendingStart] = useState<AgeGroupKey | null>(null);

  const onPick = (key: AgeGroupKey) => {
    setPendingStart(key);
    onSelect(key);
  };

  useEffect(() => {
    if (pendingStart && selected === pendingStart) {
      setPendingStart(null);
      onStart();
    }
  }, [pendingStart, selected, onStart]);

  return (
    <section className="screen age-screen-match">
      <div className="age-focus-shell">
        {onBack && (
          <button
            type="button"
            className="age-back-btn"
            onClick={onBack}
            aria-label="Back"
          >
            ←
          </button>
        )}
        <TopSparkles />
        <div className="age-focus-star">
          <StarMascot />
        </div>

        <RibbonBanner>{isHi ? 'चलो शुरू करें!' : "Let's Get Started!"}</RibbonBanner>

        <p className="age-focus-prompt">{isHi ? 'अपनी उम्र चुनो' : 'Choose your age group'}</p>

        <div className="age-focus-stack">
          {groups.map(([key], idx) => (
            <button
              key={key}
              type="button"
              className={`age-focus-pill ${TINTS[idx % TINTS.length]} ${selected === key ? 'selected' : ''}`}
              onClick={() => onPick(key)}
              aria-pressed={selected === key}
              aria-label={`${RANGES[idx % RANGES.length]} Years`}
            >
              <span className="age-focus-avatar">{AVATARS[idx % AVATARS.length]}</span>
              <span className="age-focus-meta">
                <strong>{RANGES[idx % RANGES.length]}</strong>
                <em>{isHi ? 'साल' : 'Years'}</em>
              </span>
              <span className="age-focus-chevron" aria-hidden="true">›</span>
            </button>
          ))}
        </div>

        <div className="age-focus-scene" aria-hidden="true">
          <HillsScene />
        </div>

        <div className="age-focus-dots" aria-hidden="true">
          <span />
          <span className="on" />
          <span />
        </div>
      </div>
    </section>
  );
}
