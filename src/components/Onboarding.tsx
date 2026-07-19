import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { t } from '../core/i18n';
import type { Language } from '../core/types';

interface Step {
  emoji: string;
  title: string;
  text: string;
}

interface OnboardingProps {
  language?: Language;
  onDone: () => void;
}

export default function Onboarding({ language = 'en', onDone }: OnboardingProps) {
  const strings = t(language);
  const STEPS: Step[] = [
    { emoji: '👋', title: strings.onboardStep1Title, text: strings.onboardStep1Text },
    { emoji: '🖱️', title: strings.onboardStep2Title, text: strings.onboardStep2Text },
    { emoji: '🔊', title: strings.onboardStep3Title, text: strings.onboardStep3Text },
    { emoji: '⭐', title: strings.onboardStep4Title, text: strings.onboardStep4Text }
  ];
  const [i, setI] = useState(0);
  const step = STEPS[i]!;
  const last = i === STEPS.length - 1;
  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-label="How to play">
      <AnimatePresence mode="wait">
        <motion.div
          key={i}
          className="modal onboard-step"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.25 }}
        >
          <div className="big-emoji" aria-hidden="true">{step.emoji}</div>
          <h2>{step.title}</h2>
          <p>{step.text}</p>
          <div className="row">
            {STEPS.map((_, j) => (
              <span
                key={j}
                aria-hidden="true"
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 999,
                  background: j === i ? 'var(--primary)' : 'rgba(0,0,0,0.15)'
                }}
              />
            ))}
          </div>
          <div className="button-row">
            {i > 0 && (
              <button className="btn ghost" onClick={() => setI((v) => v - 1)}>
                {strings.onboardBack}
              </button>
            )}
            {!last ? (
              <button className="btn primary" onClick={() => setI((v) => v + 1)}>
                {strings.onboardNext}
              </button>
            ) : (
              <button className="btn primary big" onClick={onDone}>{strings.onboardStart}</button>
            )}
            <button className="btn ghost" onClick={onDone}>{strings.onboardSkip}</button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
