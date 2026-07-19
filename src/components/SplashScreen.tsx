import { motion } from 'framer-motion';

interface SplashScreenProps {
  onStart: () => void;
}

/**
 * Full-screen splash. Also serves as the child's very first tap — which
 * unlocks browser autoplay policies for our Web Speech and Web Audio
 * calls, so the game's sound "just works" from screen 2 onward.
 */
export default function SplashScreen({ onStart }: SplashScreenProps) {
  return (
    <section className="splash-screen">
      <div className="splash-sparkles" aria-hidden="true">
        <motion.span
          style={{ top: '18%', left: '14%' }}
          animate={{ opacity: [0, 1, 0], scale: [0.4, 1.2, 0.4], rotate: [0, 120, 240] }}
          transition={{ duration: 2.4, repeat: Infinity }}
        >✨</motion.span>
        <motion.span
          style={{ top: '22%', right: '18%' }}
          animate={{ opacity: [0, 1, 0], scale: [0.4, 1.1, 0.4], rotate: [0, -120, -240] }}
          transition={{ duration: 2.6, delay: 0.6, repeat: Infinity }}
        >⭐</motion.span>
        <motion.span
          style={{ bottom: '28%', left: '20%' }}
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1.15, 0.5] }}
          transition={{ duration: 2.2, delay: 1.1, repeat: Infinity }}
        >🎈</motion.span>
        <motion.span
          style={{ bottom: '24%', right: '16%' }}
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1.15, 0.5], rotate: [0, 90, 0] }}
          transition={{ duration: 2.4, delay: 1.5, repeat: Infinity }}
        >🌟</motion.span>
      </div>

      <motion.div
        className="splash-mascot"
        aria-hidden="true"
        animate={{ y: [0, -14, 0], rotate: [-6, 6, -6] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        🦉
      </motion.div>

      <motion.h1
        className="splash-title"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        WonderWords
      </motion.h1>

      <motion.p
        className="splash-tagline"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        Learn words the fun way!<br />
        <span className="splash-tagline-hi">शब्दों की जादुई दुनिया</span>
      </motion.p>

      <motion.button
        type="button"
        className="btn primary big splash-start"
        onClick={onStart}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: 1,
          scale: [1, 1.06, 1]
        }}
        transition={{
          opacity: { duration: 0.4, delay: 0.6 },
          scale:   { duration: 1.6, repeat: Infinity, ease: 'easeInOut' }
        }}
        whileTap={{ scale: 0.92 }}
        aria-label="Tap to start"
      >
        🎈 Tap to start · शुरू करें
      </motion.button>
    </section>
  );
}
