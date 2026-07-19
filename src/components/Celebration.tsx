import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import {
  BigStar,
  Bunting,
  CheerPanda,
  ConfettiBits,
  HomeIcon,
  RefreshIcon,
  RewardCoin,
  RewardStar
} from './CelebrationAssets';

interface CelebrationProps {
  praise: string;
  stars: number;
  wordsFound: number;
  /** Overrides the default "You found N words!" line. */
  subtitle?: string;
  /** Text on the primary button. Defaults to "Awesome!". */
  nextLabel?: string;
  /** Text on the secondary (Home) button. Defaults to "Home". */
  homeLabel?: string;
  /** Set to false to hide the 3-star row (useful for non-puzzle wins). */
  showStars?: boolean;
  /** Points earned this level (default: stars × 20). */
  pointsEarned?: number;
  /** Coins earned this level (default: stars × 8 rounded). */
  coinsEarned?: number;
  onNext: () => void;
  onHome: () => void;
}

const PARTY_COLORS = ['#ff8fab', '#ffcf5c', '#7fe25a', '#6ec5ff', '#c088ff', '#ff9754'];

export default function Celebration({
  praise,
  stars,
  wordsFound,
  subtitle,
  nextLabel = 'Awesome!',
  homeLabel = 'Home',
  showStars = true,
  pointsEarned,
  coinsEarned,
  onNext,
  onHome
}: CelebrationProps) {
  void praise;
  void wordsFound;
  void homeLabel;
  void subtitle;
  const earnedPoints = pointsEarned ?? Math.max(10, stars * 20);
  const earnedCoins = coinsEarned ?? Math.max(4, stars * 8);

  useEffect(() => {
    // Continuous side cannons for a short victory burst.
    const duration = 2500;
    const end = Date.now() + duration;
    let frameId = 0;
    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        startVelocity: 50,
        origin: { x: 0, y: 0.75 },
        colors: PARTY_COLORS
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        startVelocity: 50,
        origin: { x: 1, y: 0.75 },
        colors: PARTY_COLORS
      });
      if (Date.now() < end) frameId = requestAnimationFrame(frame);
    };
    frame();

    const timers = [200, 750, 1300, 1900, 2400].map((delay) =>
      setTimeout(() => {
        confetti({
          particleCount: 90,
          startVelocity: 32,
          spread: 360,
          ticks: 90,
          gravity: 0.9,
          scalar: 1.1,
          origin: { x: 0.15 + Math.random() * 0.7, y: 0.15 + Math.random() * 0.35 },
          colors: PARTY_COLORS,
          shapes: ['circle', 'square']
        });
      }, delay)
    );

    const finale = setTimeout(() => {
      confetti({
        particleCount: 200,
        spread: 160,
        startVelocity: 55,
        origin: { y: 0.5 },
        colors: PARTY_COLORS
      });
    }, 2800);

    document.body.classList.add('modal-open');

    return () => {
      cancelAnimationFrame(frameId);
      timers.forEach(clearTimeout);
      clearTimeout(finale);
      document.body.classList.remove('modal-open');
    };
  }, []);

  return (
    <div className="overlay level-complete-overlay" role="dialog" aria-modal="true" aria-label="Level complete">
      <div className="lc-confetti" aria-hidden="true">
        <ConfettiBits />
      </div>
      <div className="lc-bunting-wrap" aria-hidden="true">
        <Bunting />
      </div>

      <motion.div
        className="lc-modal"
        initial={{ scale: 0.6, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 18 }}
      >
        <motion.h1
          className="lc-title"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.4 }}
        >
          Level<br />Complete!
        </motion.h1>

        <motion.div
          className="lc-panda"
          animate={{ y: [0, -6, 0], rotate: [-2, 2, -2] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden="true"
        >
          <CheerPanda />
        </motion.div>

        {showStars && (
          <div className="lc-stars" aria-label={`Earned ${stars} out of 3 stars`}>
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className={`lc-star ${i < stars ? 'won' : ''}`}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  delay: 0.4 + i * 0.2,
                  type: 'spring',
                  stiffness: 260,
                  damping: 12
                }}
              >
                <BigStar filled={i < stars} />
              </motion.span>
            ))}
          </div>
        )}

        <div className="lc-earned-chip">You earned</div>

        <div className="lc-rewards">
          <div className="lc-reward">
            <RewardStar />
            <strong>+{earnedPoints}</strong>
          </div>
          <div className="lc-reward">
            <RewardCoin />
            <strong>+{earnedCoins}</strong>
          </div>
        </div>

        <div className="lc-actions">
          <button
            type="button"
            className="lc-icon-btn"
            onClick={onHome}
            aria-label={homeLabel}
          >
            <HomeIcon />
          </button>
          <button
            type="button"
            className="lc-primary-btn"
            onClick={onNext}
          >
            {nextLabel}
          </button>
          <button
            type="button"
            className="lc-icon-btn"
            onClick={onNext}
            aria-label="Replay"
          >
            <RefreshIcon />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
