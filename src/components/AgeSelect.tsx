import { getWordsData } from '../core/data';
import type { AgeGroupKey, Language } from '../core/types';

interface AgeSelectProps {
  selected: AgeGroupKey | null;
  language?: Language;
  step?: { current: number; total: number };
  onSelect: (key: AgeGroupKey) => void;
  onStart: () => void;
}

export default function AgeSelect({
  selected,
  language = 'en',
  step,
  onSelect,
  onStart
}: AgeSelectProps) {
  const wordsData = getWordsData(language);
  const groups = Object.entries(wordsData.ageGroups) as [AgeGroupKey, typeof wordsData.ageGroups[AgeGroupKey]][];
  const isHi = language === 'hi';
  return (
    <section className="screen">
      {step && (
        <div className="wizard-progress" aria-label={`Step ${step.current} of ${step.total}`}>
          {Array.from({ length: step.total }).map((_, i) => (
            <span
              key={i}
              className={`wizard-dot ${i < step.current ? 'done' : i === step.current - 1 ? 'active' : ''}`}
              aria-hidden="true"
            />
          ))}
        </div>
      )}
      <h1>{isHi ? 'अपनी उम्र चुनो, स्टार!' : 'Pick your age, superstar!'}</h1>
      <p className="lead">
        {isHi
          ? 'हमें बताओ तुम कितने साल के हो, हम तुम्हारे लिए बिलकुल सही पहेलियाँ बनाएँगे।'
          : "Tell us how old you are and we'll make puzzles just right for you."}
      </p>
      <div className="age-grid">
        {groups.map(([key, group]) => (
          <button
            key={key}
            type="button"
            className={`age-card ${selected === key ? 'selected' : ''}`}
            onClick={() => onSelect(key)}
            aria-pressed={selected === key}
          >
            <span className="emoji" aria-hidden="true">{group.emoji}</span>
            <span className="label">{group.label}</span>
            <span className="desc">
              {group.gridSize}×{group.gridSize} · {group.wordsPerPuzzle} {isHi ? 'शब्द' : 'words'}
            </span>
          </button>
        ))}
      </div>
      <button
        className="btn primary big"
        onClick={onStart}
        disabled={!selected}
      >
        {isHi ? 'चलो खेलें! 🎈' : "Let's play! 🎈"}
      </button>
    </section>
  );
}
