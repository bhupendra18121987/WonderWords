import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { LETTER_EXAMPLES, buildBarahkhadi } from '../core/data/alphabetExamples';
import { t } from '../core/i18n';
import type { Language } from '../core/types';

interface BarahkhadiViewProps {
  language: Language;
  onSpeak: (akshara: string) => void;
}

/**
 * "Focused" barahkhadi view — pick a consonant at the top (horizontal
 * scroller), see its 12 vowel-combinations as large tappable cards.
 * Kid-friendlier than showing all 33 × 12 = 396 cells at once.
 */
export default function BarahkhadiView({ language, onSpeak }: BarahkhadiViewProps) {
  const entry = LETTER_EXAMPLES[language];
  const strings = t(language);
  const consonants = entry.consonants;
  const matras = entry.matras ?? [];
  const pickerRef = useRef<HTMLDivElement | null>(null);
  const [selectedIdx, setSelectedIdx] = useState(0);

  if (!entry.hasBarahkhadi || matras.length === 0) {
    return (
      <p className="lead">Barahkhadi is only available in Hindi mode.</p>
    );
  }

  const selected = consonants[selectedIdx]!;
  const combos = buildBarahkhadi(selected.letter, matras);

  return (
    <div className="barah-wrap">
      <p className="lead" style={{ marginBottom: 8 }}>
        {strings.chooseLetter}
      </p>
      <div className="barah-picker" ref={pickerRef} role="tablist">
        {consonants.map((c, i) => (
          <button
            key={c.letter}
            type="button"
            role="tab"
            aria-selected={i === selectedIdx}
            className={`barah-picker-btn ${i === selectedIdx ? 'active' : ''}`}
            onClick={() => {
              setSelectedIdx(i);
              onSpeak(c.letter);
            }}
          >
            {c.letter}
          </button>
        ))}
      </div>

      <motion.div
        key={selected.letter}
        className="barah-selected"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <span className="barah-selected-letter">{selected.letter}</span>
        {selected.transliteration && (
          <span className="barah-selected-trans">{selected.transliteration}</span>
        )}
      </motion.div>

      <div
        className="barah-grid"
        role="list"
        aria-label={`Barahkhadi for ${selected.letter}`}
      >
        {combos.map((akshara, i) => {
          const m = matras[i]!;
          return (
            <motion.button
              key={m.label}
              type="button"
              role="listitem"
              className="barah-cell"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03, type: 'spring', stiffness: 260, damping: 18 }}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => onSpeak(akshara)}
              aria-label={`${akshara}, ${selected.transliteration ?? ''}${m.transliteration}`}
            >
              <span className="barah-cell-akshara">{akshara}</span>
              <span className="barah-cell-matra">{m.label}</span>
              <span className="barah-cell-trans">
                {(selected.transliteration ?? '').replace(/a$/, '')}{m.transliteration}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
