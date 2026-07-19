import { motion } from 'framer-motion';
import {
  MusicNoteIcon,
  PlayArrowIcon,
  SplashBackdrop,
  SplashPanda
} from './SplashAssets';

interface SplashScreenProps {
  onStart: () => void;
  /** Optional: parents flow (opens Settings when provided). */
  onParents?: () => void;
  /** Optional: mute/unmute music. */
  onToggleSound?: () => void;
}

/**
 * Full-screen splash. Also serves as the child's very first tap — which
 * unlocks browser autoplay policies for our Web Speech and Web Audio
 * calls, so the game's sound "just works" from screen 2 onward.
 */
export default function SplashScreen({
  onStart,
  onParents,
  onToggleSound
}: SplashScreenProps) {
  return (
    <section className="splash-screen splash-illustrated">
      <div className="splash-bg" aria-hidden="true">
        <SplashBackdrop />
      </div>

      {onToggleSound && (
        <button
          type="button"
          className="splash-music"
          onClick={onToggleSound}
          aria-label="Toggle music"
        >
          <MusicNoteIcon />
        </button>
      )}

      <div className="splash-title-wrap">
        <motion.h1
          className="splash-title"
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 180 }}
        >
          WonderWords
        </motion.h1>
        <motion.p
          className="splash-tagline"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Learn Words. Discover Worlds.
        </motion.p>
      </div>

      <motion.div
        className="splash-mascot-wrap"
        aria-hidden="true"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <SplashPanda />
      </motion.div>

      <div className="splash-buttons">
        <motion.button
          type="button"
          className="splash-play"
          onClick={onStart}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          whileTap={{ scale: 0.96 }}
          aria-label="Let's Play"
        >
          <span>Let's Play</span>
          <span className="splash-play-arrow">
            <PlayArrowIcon />
          </span>
        </motion.button>

        {onParents && (
          <motion.button
            type="button"
            className="splash-parents"
            onClick={onParents}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.8 }}
            whileTap={{ scale: 0.97 }}
            aria-label="For Parents"
          >
            For Parents
          </motion.button>
        )}
      </div>
    </section>
  );
}
