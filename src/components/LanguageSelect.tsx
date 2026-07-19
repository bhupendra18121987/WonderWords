import { motion } from 'framer-motion';
import { LANGUAGE_CONFIG } from '../core/languages';
import type { Language } from '../core/types';

interface LanguageSelectProps {
  selected: Language | null;
  step?: { current: number; total: number };
  onSelect: (lang: Language) => void;
  onNext: () => void;
}

// Small illustrative sample letters shown on each language card.
const SAMPLES: Record<Language, string> = {
  en: 'A B C',
  hi: 'क ख ग'
};

const FLAG: Record<Language, string> = {
  en: '🇺🇸',
  hi: '🇮🇳'
};

export default function LanguageSelect({
  selected,
  step,
  onSelect,
  onNext
}: LanguageSelectProps) {
  const languages = Object.entries(LANGUAGE_CONFIG) as [Language, typeof LANGUAGE_CONFIG[Language]][];
  return (
    <section className="screen">
      {step && (
        <div className="wizard-progress" aria-label={`Step ${step.current} of ${step.total}`}>
          {Array.from({ length: step.total }).map((_, i) => (
            <span
              key={i}
              className={`wizard-dot ${i < step.current ? 'done' : i === step.current - 1 ? 'active' : ''}`}
              aria-hidden="true"
            />
          ))}
        </div>
      )}

      <h1>Pick your language!<br /><span className="lead-hi">अपनी भाषा चुनें</span></h1>

      <div className="lang-grid">
        {languages.map(([key, cfg], i) => (
          <motion.button
            key={key}
            type="button"
            className={`lang-card ${selected === key ? 'selected' : ''}`}
            onClick={() => onSelect(key)}
            aria-pressed={selected === key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15, type: 'spring', stiffness: 240, damping: 20 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="lang-flag" aria-hidden="true">{FLAG[key]}</span>
            <span className="lang-name">{cfg.displayName}</span>
            <span className="lang-sample" aria-hidden="true">{SAMPLES[key]}</span>
          </motion.button>
        ))}
      </div>

      <button
        className="btn primary big"
        onClick={onNext}
        disabled={!selected}
      >
        Next →
      </button>
    </section>
  );
}
