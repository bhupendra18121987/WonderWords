import { useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';

interface CelebrationProps {
  praise: string;
  stars: number;
  wordsFound: number;
  /** Overrides the default "You found N words!" line. */
  subtitle?: string;
  /** Text on the primary button. Defaults to "Next puzzle →". */
  nextLabel?: string;
  /** Set to false to hide the 3-star row (useful for non-puzzle wins). */
  showStars?: boolean;
  onNext: () => void;
  onHome: () => void;
}

// Bright, kid-friendly palette used for all confetti + firework bursts.
const PARTY_COLORS = [
  '#ff8fab', // pink
  '#ffcf5c', // gold
  '#58c896', // green
  '#6ec9ff', // blue
  '#d19cff', // purple
  '#ff9f43', // orange
  '#ffffff'  // white sparkle
];

// The stars that rain down behind the modal. Emoji is easier than SVG
// for varied shapes (⭐ 🌟 ✨ 🎊 🎉) and looks great across devices.
const RAINING_EMOJIS = ['⭐', '🌟', '✨', '🎊', '🎉', '💫'];

interface RainingStar {
  emoji: string;
  left: string;
  delay: number;
  duration: number;
  size: number;
  drift: number;
}

/**
 * Build a randomised set of falling stars ONCE per mount, so their
 * positions don't jitter between renders.
 */
function buildRainingStars(count: number): RainingStar[] {
  const out: RainingStar[] = [];
  for (let i = 0; i < count; i++) {
    out.push({
      emoji: RAINING_EMOJIS[i % RAINING_EMOJIS.length]!,
      left: `${(i * 7 + Math.random() * 6) % 100}%`,
      delay: Math.random() * 2.5,
      duration: 3 + Math.random() * 2,
      size: 20 + Math.random() * 22,
      drift: (Math.random() * 40) - 20
    });
  }
  return out;
}

export default function Celebration({
  praise,
  stars,
  wordsFound,
  subtitle,
  nextLabel = 'Next puzzle →',
  showStars = true,
  onNext,
  onHome
}: CelebrationProps) {
  const rainingStars = useMemo(() => buildRainingStars(24), []);

  useEffect(() => {
    // ── Continuous side cannons for 2.5s ──
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

    // ── Discrete firework bursts at random points in the top half ──
    const timers = [200, 750, 1300, 1900, 2400].map((delay) =>
      setTimeout(() => {
        confetti({
          particleCount: 90,
          startVelocity: 32,
          spread: 360,
          ticks: 90,
          gravity: 0.9,
          scalar: 1.1,
          origin: {
            x: 0.15 + Math.random() * 0.7,
            y: 0.15 + Math.random() * 0.35
          },
          colors: PARTY_COLORS,
          shapes: ['circle', 'square']
        });
      }, delay)
    );

    // ── Grand finale burst ──
    const finale = setTimeout(() => {
      confetti({
        particleCount: 200,
        spread: 160,
        startVelocity: 55,
        origin: { y: 0.5 },
        colors: PARTY_COLORS
      });
    }, 2800);

    return () => {
      cancelAnimationFrame(frameId);
      timers.forEach(clearTimeout);
      clearTimeout(finale);
    };
  }, []);

  return (
    <div className="overlay celebrate-overlay" role="dialog" aria-modal="true" aria-label="Level complete">
      {/* Raining stars behind the modal */}
      <div className="celebrate-stars" aria-hidden="true">
        {rainingStars.map((s, i) => (
          <motion.span
            key={i}
            className="celebrate-star"
            style={{
              left: s.left,
              fontSize: s.size
            }}
            initial={{ y: '-15%', opacity: 0, rotate: 0 }}
            animate={{
              y: '115%',
              x: [0, s.drift, 0, -s.drift, 0],
              opacity: [0, 1, 1, 0.9, 0],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: s.duration,
              delay: s.delay,
              repeat: Infinity,
              ease: 'linear'
            }}
          >
            {s.emoji}
          </motion.span>
        ))}
      </div>

      <motion.div
        className="modal celebrate-modal"
        initial={{ scale: 0.4, opacity: 0, rotate: -8 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 14 }}
      >
        <motion.div
          className="celebrate-hero"
          animate={{
            scale: [1, 1.15, 1, 1.12, 1],
            rotate: [0, 12, -12, 8, 0]
          }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden="true"
        >
          🏆
        </motion.div>

        <motion.h2
          className="celebrate-praise"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {praise}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          {subtitle ?? `You found ${wordsFound} ${wordsFound === 1 ? 'word' : 'words'}!`}
        </motion.p>

        {showStars && (
          <div
            className="celebrate-stars-row"
            aria-label={`Earned ${stars} out of 3 stars`}
          >
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className={`celebrate-star-badge ${i < stars ? 'won' : ''}`}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  delay: 0.5 + i * 0.25,
                  type: 'spring',
                  stiffness: 260,
                  damping: 12
                }}
              >
                {i < stars ? '⭐' : '☆'}
              </motion.span>
            ))}
          </div>
        )}

        <motion.div
          className="button-row"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <button className="btn primary big" onClick={onNext}>{nextLabel}</button>
          <button className="btn ghost" onClick={onHome}>Home</button>
        </motion.div>
      </motion.div>
    </div>
  );
}
