import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import useSpeech from '../hooks/useSpeech';
import { t } from '../core/i18n';
import type { Language } from '../core/types';
import {
  CatCharacter,
  EmojiCharacter,
  GreatJobBanner,
  GreatJobStarCluster,
  RevealDecor,
  SpeakerIcon
} from './RevealAssets';

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

const PARTY_COLORS = ['#ff8fab', '#ffcf5c', '#58c896', '#6ec9ff', '#d19cff', '#ff9f43'];

/** Pick a custom SVG character when we have one, otherwise fall back to emoji. */
function characterFor(word: string, emoji: string) {
  const w = word.trim().toLowerCase();
  if (w === 'cat') return <CatCharacter />;
  return <EmojiCharacter emoji={emoji} />;
}

export default function WordReveal({ word, language = 'en', onClose }: WordRevealProps) {
  const strings = t(language);
  const { speak } = useSpeech({ lang: language === 'hi' ? 'hi-IN' : 'en-US' });

  const character = useMemo(
    () => (word ? characterFor(word.word, word.emoji) : null),
    [word]
  );

  useEffect(() => {
    if (!word) return;
    // Prevent the background game page from showing a scrollbar behind the modal.
    document.body.classList.add('modal-open');
    // Small celebratory burst on open.
    confetti({
      particleCount: 90,
      spread: 70,
      startVelocity: 32,
      origin: { y: 0.4 },
      colors: PARTY_COLORS,
      scalar: 1.1
    });
    // Auto-speak the word on reveal.
    speak(word.word);
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [word, speak]);

  if (!word) return null;

  const praise = language === 'hi' ? 'शाबाश!' : 'Great Job!';
  const nextLabel = language === 'hi' ? 'अगला शब्द' : 'Next Word';

  return (
    <div
      className="overlay reveal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={`Found ${word.word}`}
    >
      <RevealDecor />

      <motion.div
        className="reveal-modal"
        initial={{ scale: 0.6, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 240, damping: 18 }}
      >
        <motion.div
          className="reveal-hero"
          initial={{ y: -12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.35 }}
        >
          <GreatJobStarCluster />
          <GreatJobBanner>{praise}</GreatJobBanner>
        </motion.div>

        <div className="reveal-card">
          <div className="reveal-header">
            <h2 className="reveal-word">{word.word.toUpperCase()}</h2>
            <button
              type="button"
              className="reveal-speaker"
              aria-label={`Speak ${word.word}`}
              onClick={() => speak(word.word)}
            >
              <SpeakerIcon />
            </button>
          </div>

          <div className="reveal-character">{character}</div>

          <p className="reveal-meaning">{word.meaning}</p>

          <button className="reveal-next" onClick={onClose}>
            {nextLabel}
            <span className="sr-only"> — {strings.keepPlaying}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
