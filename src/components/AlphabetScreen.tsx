import { useState } from 'react';
import { motion } from 'framer-motion';
import { getLanguageConfig } from '../core/languages';
import { LETTER_EXAMPLES, type LetterExample } from '../core/data/alphabetExamples';
import { t } from '../core/i18n';
import BarahkhadiView from './BarahkhadiView';
import type { Language } from '../core/types';

interface AlphabetScreenProps {
  language: Language;
  onBack: () => void;
  onSpeak: (letter: string, type: 'vowel' | 'consonant' | string) => void;
}

type Mode = 'letters' | 'barahkhadi';

export default function AlphabetScreen({ language, onBack, onSpeak }: AlphabetScreenProps) {
  const cfg = getLanguageConfig(language);
  const strings = t(language);
  const entry = LETTER_EXAMPLES[language];
  const [mode, setMode] = useState<Mode>('letters');

  return (
    <section className="screen">
      <h1>{strings.vowelsAndConsonants} 🔤</h1>

      {entry.hasBarahkhadi && (
        <div className="alphabet-mode-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'letters'}
            className={`alphabet-mode-tab ${mode === 'letters' ? 'active' : ''}`}
            onClick={() => setMode('letters')}
          >
            🔤 {strings.alphabetMode}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'barahkhadi'}
            className={`alphabet-mode-tab ${mode === 'barahkhadi' ? 'active' : ''}`}
            onClick={() => setMode('barahkhadi')}
          >
            📊 {strings.barahkhadiMode}
          </button>
        </div>
      )}

      {mode === 'letters' ? (
        <>
          <div className="row" aria-hidden="true">
            <span className="stat-pill">🌸 {strings.vowelsLabel(entry.vowels.length)}</span>
            <span className="stat-pill">🔵 {strings.consonantsLabel(entry.consonants.length)}</span>
          </div>

          <LetterSection
            title={cfg.vowelLabel === 'vowel' ? 'Vowels' : cfg.vowelLabel}
            letters={entry.vowels}
            tone="vowel"
            onSpeak={(l) => onSpeak(l.letter + (l.exampleWord ? '. ' + l.exampleWord : ''), 'vowel')}
          />
          <LetterSection
            title={cfg.consonantLabel === 'consonant' ? 'Consonants' : cfg.consonantLabel}
            letters={entry.consonants}
            tone="consonant"
            onSpeak={(l) => onSpeak(l.letter + (l.exampleWord ? '. ' + l.exampleWord : ''), 'consonant')}
          />
        </>
      ) : (
        <BarahkhadiView
          language={language}
          onSpeak={(akshara) => onSpeak(akshara, 'consonant')}
        />
      )}

      <button className="btn primary" onClick={onBack}>← {strings.home}</button>
    </section>
  );
}

interface LetterSectionProps {
  title: string;
  letters: LetterExample[];
  tone: 'vowel' | 'consonant';
  onSpeak: (letter: LetterExample) => void;
}

function LetterSection({ title, letters, tone, onSpeak }: LetterSectionProps) {
  return (
    <div style={{ width: '100%', maxWidth: 900 }}>
      <h3 style={{ textAlign: 'center', color: 'var(--primary-dark)', margin: '4px 0 10px' }}>
        {title}
      </h3>
      <div className="letter-example-grid">
        {letters.map((l, i) => (
          <motion.button
            key={l.letter}
            type="button"
            className={`letter-example ${tone}`}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.02, type: 'spring', stiffness: 260, damping: 18 }}
            whileHover={{ scale: 1.05, rotate: -1 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => onSpeak(l)}
            aria-label={`${l.letter}${l.exampleWord ? ' for ' + l.exampleWord : ''}`}
          >
            <div className="letter-example-top">
              <span className="letter-example-letter">{l.letter}</span>
              {l.transliteration && (
                <span className="letter-example-trans">{l.transliteration}</span>
              )}
            </div>
            {l.exampleWord ? (
              <div className="letter-example-bottom">
                <span className="letter-example-emoji" aria-hidden="true">{l.emoji}</span>
                <span className="letter-example-word">{l.exampleWord}</span>
              </div>
            ) : (
              <div className="letter-example-bottom letter-example-empty" aria-hidden="true">
                {tone === 'vowel' ? '🌸' : '🔵'}
              </div>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
