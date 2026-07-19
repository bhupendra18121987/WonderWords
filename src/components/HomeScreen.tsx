import { t } from '../core/i18n';
import type { AgeGroupKey, Language, Progress } from '../core/types';
import {
  LevelMapScene,
  LevelStar,
  LockIcon,
  UnlockedIcon
} from './HomeMapAssets';

interface HomeScreenProps {
  ageGroup: AgeGroupKey;
  progress: Progress;
  language: Language;
  onPlay: (level?: number) => void;
  onReview: () => void;
  onAlphabet: () => void;
  onMiniGames: () => void;
  onChangeAge: () => void;
  onOnboarding: () => void;
  onRestartLevel: () => void;
}

// Positions of each level tile on the map (percentage of the SVG viewBox).
// Ordered LEVEL_1 -> LEVEL_4 following the winding path from bottom-right to top-left.
const LEVEL_POSITIONS = [
  { top: '86%', left: '78%', color: 'orange' }, // 1 — start of path (bottom-right)
  { top: '66%', left: '18%', color: 'green' },  // 2
  { top: '46%', left: '68%', color: 'blue' },   // 3
  { top: '20%', left: '30%', color: 'purple' }  // 4 — top island
] as const;

export default function HomeScreen({
  ageGroup,
  progress,
  language,
  onPlay,
  onReview,
  onAlphabet,
  onMiniGames,
  onRestartLevel
}: HomeScreenProps) {
  const strings = t(language);
  void ageGroup;
  const learnedCount = progress.learnedWords.length;

  return (
    <section className="screen home-map-screen">
      <div className="home-hero">
        <div className="home-hero-copy">
          <h1>Hello, Little Explorer!</h1>
          <p>Let's start your word adventure!</p>
        </div>
        <div className="home-hero-mascot" aria-hidden="true">
          <PandaMascot />
        </div>
      </div>

      <div className="home-level-map">
        <div className="home-level-map-bg">
          <LevelMapScene />
        </div>

        <div className="home-level-tiles">
          {LEVEL_POSITIONS.map((pos, idx) => {
            const level = idx + 1;
            const unlocked = progress.level >= level;
            // Compute stars per level from stored progress (max 3 per level).
            const earned = Math.max(0, Math.min(3, progress.stars - (level - 1) * 3));
            return (
              <button
                key={level}
                type="button"
                className={`home-level-tile ${pos.color} ${unlocked ? 'unlocked' : 'locked'}`}
                style={{ top: pos.top, left: pos.left }}
                onClick={unlocked ? () => onPlay(level) : undefined}
                disabled={!unlocked}
                aria-label={`Level ${level}${unlocked ? '' : ' — locked'}`}
              >
                <span className="home-level-icon" aria-hidden="true">
                  {unlocked ? <UnlockedIcon /> : <LockIcon />}
                </span>
                <strong>Level {level}</strong>
                <span className="home-level-stars" aria-hidden="true">
                  <LevelStar filled={earned >= 1} />
                  <LevelStar filled={earned >= 2} />
                  <LevelStar filled={earned >= 3} />
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="home-shortcut-row three">
        <button className="home-shortcut yellow" onClick={onMiniGames}>
          <span aria-hidden="true">🎮</span>
          <strong>{strings.miniGamesTile}</strong>
        </button>
        <button className="home-shortcut blue" onClick={onReview}>
          <span aria-hidden="true">📚</span>
          <strong>{strings.learned(learnedCount)}</strong>
        </button>
        <button className="home-shortcut pink" onClick={onAlphabet}>
          <span aria-hidden="true">🔤</span>
          <strong>{strings.navLetters}</strong>
        </button>
      </div>

      {progress.level > 1 && (
        <button className="btn ghost home-restart" onClick={onRestartLevel}>
          {strings.restartLevel}
        </button>
      )}
    </section>
  );
}

/** Small kawaii panda mascot for the hero card. */
function PandaMascot() {
  return (
    <svg viewBox="0 0 120 120" width="88" height="88" aria-hidden="true">
      {/* ears */}
      <circle cx="34" cy="26" r="16" fill="#1e1b3a" />
      <circle cx="86" cy="26" r="16" fill="#1e1b3a" />
      {/* head */}
      <circle cx="60" cy="60" r="42" fill="#ffffff" />
      {/* eye patches */}
      <ellipse cx="46" cy="60" rx="12" ry="14" fill="#1e1b3a" transform="rotate(-8 46 60)" />
      <ellipse cx="74" cy="60" rx="12" ry="14" fill="#1e1b3a" transform="rotate(8 74 60)" />
      {/* eyes */}
      <circle cx="46" cy="62" r="5" fill="#fff" />
      <circle cx="74" cy="62" r="5" fill="#fff" />
      <circle cx="46" cy="62" r="2.5" fill="#111" />
      <circle cx="74" cy="62" r="2.5" fill="#111" />
      {/* nose */}
      <ellipse cx="60" cy="74" rx="4" ry="3" fill="#1e1b3a" />
      {/* mouth */}
      <path d="M56 82 Q60 88 64 82" fill="none" stroke="#1e1b3a" strokeWidth="2.2" strokeLinecap="round" />
      {/* cheeks */}
      <circle cx="32" cy="76" r="4" fill="#ffc0d3" opacity="0.85" />
      <circle cx="88" cy="76" r="4" fill="#ffc0d3" opacity="0.85" />
      {/* little body suggestion */}
      <ellipse cx="60" cy="112" rx="30" ry="10" fill="#1e1b3a" />
    </svg>
  );
}
