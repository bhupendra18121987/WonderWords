import { motion } from 'framer-motion';
import { getWordsData, getRewardsData } from '../core/data';
import { t } from '../core/i18n';
import type { AgeGroupKey, Language, Progress } from '../core/types';

interface HomeScreenProps {
  ageGroup: AgeGroupKey;
  progress: Progress;
  language: Language;
  onPlay: () => void;
  onReview: () => void;
  onAlphabet: () => void;
  onTicTacToe: () => void;
  onChangeAge: () => void;
  onOnboarding: () => void;
  onRestartLevel: () => void;
}

// Little colored-tile config so each home action gets its own personality.
const TILE_TINTS = {
  play:      { tint: 'tint-coral',    icon: '🧩' },
  review:    { tint: 'tint-teal',     icon: '📖' },
  alphabet:  { tint: 'tint-lavender', icon: '🔤' },
  ticTacToe: { tint: 'tint-yellow',   icon: '⭕' },
  tour:      { tint: 'tint-yellow',   icon: '👋' },
  age:       { tint: 'tint-mint',     icon: '🎂' }
} as const;

export default function HomeScreen({
  ageGroup,
  progress,
  language,
  onPlay,
  onReview,
  onAlphabet,
  onTicTacToe,
  onChangeAge,
  onOnboarding,
  onRestartLevel
}: HomeScreenProps) {
  const wordsData = getWordsData(language);
  const rewardsData = getRewardsData(language);
  const strings = t(language);
  const group = wordsData.ageGroups[ageGroup];
  const learnedCount = progress.learnedWords.length;
  const earnedBadges = new Set(progress.badges);

  return (
    <section className="screen home-screen">
      {/* ---------- Hero banner ---------- */}
      <motion.div
        className="hero-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 22 }}
      >
        <div className="hero-copy">
          <h1>{strings.welcomeBack}!</h1>
          <p>{strings.readyMsg}</p>
          <div className="hero-stats">
            <span className="stat-pill" title="Stars earned">{strings.starsFmt(progress.stars)}</span>
            <span className="stat-pill" title="Puzzles completed">{strings.puzzlesFmt(progress.puzzlesCompleted)}</span>
            <span className="stat-pill" title="Words learned">{strings.wordsFmt(learnedCount)}</span>
          </div>
          <button className="btn primary big hero-cta" onClick={onPlay}>
            {strings.playNow}
          </button>
        </div>
        <motion.div
          className="hero-mascot"
          aria-hidden="true"
          animate={{ y: [0, -8, 0], rotate: [-4, 4, -4] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          {group?.emoji ?? '🦉'}
        </motion.div>
      </motion.div>

      {/* ---------- Colored quick-action tiles ---------- */}
      <div className="home-grid">
        <button className={`home-tile ${TILE_TINTS.play.tint}`} onClick={onPlay}>
          <span className="icon" aria-hidden="true">{TILE_TINTS.play.icon}</span>
          <span className="name">{strings.playPuzzle}</span>
          <span className="sub">{strings.level} {progress.level}</span>
        </button>
        <button
          className={`home-tile ${TILE_TINTS.review.tint}`}
          onClick={onReview}
          disabled={learnedCount === 0}
        >
          <span className="icon" aria-hidden="true">{TILE_TINTS.review.icon}</span>
          <span className="name">{strings.wordReview}</span>
          <span className="sub">{strings.learned(learnedCount)}</span>
        </button>
        <button className={`home-tile ${TILE_TINTS.alphabet.tint}`} onClick={onAlphabet}>
          <span className="icon" aria-hidden="true">{TILE_TINTS.alphabet.icon}</span>
          <span className="name">{strings.alphabetTile}</span>
          <span className="sub">A · अ</span>
        </button>
        <button className={`home-tile ${TILE_TINTS.ticTacToe.tint}`} onClick={onTicTacToe}>
          <span className="icon" aria-hidden="true">{TILE_TINTS.ticTacToe.icon}</span>
          <span className="name">{strings.ticTacToeName}</span>
          <span className="sub">{strings.ticTacToeSub}</span>
        </button>
        <button className={`home-tile ${TILE_TINTS.tour.tint}`} onClick={onOnboarding}>
          <span className="icon" aria-hidden="true">{TILE_TINTS.tour.icon}</span>
          <span className="name">{strings.howToPlay}</span>
          <span className="sub">{strings.quickTour}</span>
        </button>
        <button className={`home-tile ${TILE_TINTS.age.tint}`} onClick={onChangeAge}>
          <span className="icon" aria-hidden="true">{TILE_TINTS.age.icon}</span>
          <span className="name">{strings.changeAge}</span>
          <span className="sub">{group?.label ?? 'Not set'}</span>
        </button>
      </div>

      {progress.level > 1 && (
        <button
          className="btn ghost"
          onClick={onRestartLevel}
          aria-label="Restart from level 1"
        >
          {strings.restartLevel}
        </button>
      )}

      <div className="card" style={{ width: '100%', maxWidth: 900 }}>
        <h3>Badges</h3>
        <div className="badge-row">
          {rewardsData.badges.map((b) => (
            <span
              key={b.id}
              className={`badge ${earnedBadges.has(b.id) ? 'earned' : ''}`}
              title={b.description}
            >
              <span aria-hidden="true">{b.emoji}</span>
              {b.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
