import { motion, AnimatePresence } from 'framer-motion';

interface MascotProps {
  face?: string;
  message?: string;
}

/** Bouncing bottom-right mascot with an optional speech bubble. */
export default function Mascot({ face = '🦉', message }: MascotProps) {
  return (
    <div className="mascot" aria-live="polite">
      <AnimatePresence>
        {message && (
          <motion.div
            key={message}
            className="bubble"
            initial={{ opacity: 0, x: 10, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        className="face"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden="true"
      >
        {face}
      </motion.div>
    </div>
  );
}
