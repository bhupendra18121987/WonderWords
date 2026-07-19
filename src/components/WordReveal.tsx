import { motion } from 'framer-motion';
import AnimatedScene from './AnimatedScene';
import { letterBreakdown } from '../core/letters';
import { getScene } from '../core/scenes';
import { t } from '../core/i18n';
import type { Language } from '../core/types';

interface RevealItem {
  word: string;
  emoji: string;
  meaning: string;
  category?: string;
}

interface WordRevealProps {
  word: RevealItem | null;
  language?: Language;
  onClose: () => void;
}

export default function WordReveal({ word, language = 'en', onClose }: WordRevealProps) {
  if (!word) return null;
  const scene = getScene({ word: word.word, category: word.category });
  const strings = t(language);
  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-label={`Found ${word.word}`}>
      <motion.div
        className="modal"
        initial={{ scale: 0.6, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 240, damping: 18 }}
      >
        <AnimatedScene
          emoji={word.emoji}
          scene={scene}
          label={`${word.word} — animated illustration`}
        />
        <h2>{word.word}</h2>
        <p className="small">{letterBreakdown(word.word, language)}</p>
        <p>{word.meaning}</p>
        <div className="button-row">
          <button className="btn primary" onClick={onClose}>{strings.keepPlaying}</button>
        </div>
      </motion.div>
    </div>
  );
}
