import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { WordEntry } from '../core/types';
import { colorForWordIndex } from './GameAssets';

interface WordListProps {
  items: WordEntry[];
  foundWords: string[];
}

function WordList({ items, foundWords }: WordListProps) {
  const foundSet = new Set(foundWords.map((w) => w.toUpperCase()));
  return (
    <div className="word-list" role="list" aria-label="Words to find">
      <AnimatePresence initial={false}>
        {items.map((item, idx) => {
          const found = foundSet.has(item.word.toUpperCase());
          const color = colorForWordIndex(idx);
          return (
            <motion.span
              key={item.word}
              className={`word-chip ${found ? 'found' : ''}`}
              role="listitem"
              aria-label={`${item.word}${found ? ', found' : ''}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              style={{
                background: color.bg,
                borderColor: color.dark,
                color: '#fff'
              }}
            >
              {item.word}
            </motion.span>
          );
        })}
      </AnimatePresence>
    </div>
  );
}


export default memo(WordList);
