import { motion, AnimatePresence } from 'framer-motion';
import type { WordEntry } from '../core/types';

interface WordListProps {
  items: WordEntry[];
  foundWords: string[];
}

export default function WordList({ items, foundWords }: WordListProps) {
  const foundSet = new Set(foundWords.map((w) => w.toUpperCase()));
  return (
    <div className="word-list" role="list" aria-label="Words to find">
      <AnimatePresence initial={false}>
        {items.map((item) => {
          const found = foundSet.has(item.word.toUpperCase());
          return (
            <motion.span
              key={item.word}
              className={`word-chip ${found ? 'found' : ''}`}
              role="listitem"
              aria-label={`${item.word}${found ? ', found' : ''}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <span className="em" aria-hidden="true">{item.emoji}</span>
              {item.word}
            </motion.span>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
