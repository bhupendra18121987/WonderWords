import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useSpeech from '../hooks/useSpeech';
import type { LearnedWord } from '../core/types';
import {
  AppleScene,
  AudioIcon,
  BackArrow,
  ChevronIcon,
  EmojiScene
} from './WordMeaningAssets';

interface WordReviewProps {
  learnedWords: LearnedWord[];
  onBack: () => void;
  onSpeak: (word: LearnedWord) => void;
}

/** Pick the color for the word title (rotates through a friendly palette). */
const WORD_COLORS = ['#e94b6b', '#f0863a', '#3faf46', '#4a8fd4', '#b34dc7'];

/** Pick a custom scene when available; otherwise render an emoji scene. */
function sceneFor(word: LearnedWord) {
  const w = word.word.trim().toLowerCase();
  if (w === 'apple') return <AppleScene />;
  return <EmojiScene emoji={word.emoji} />;
}

export default function WordReview({ learnedWords, onBack, onSpeak }: WordReviewProps) {
  const { speak } = useSpeech({ lang: 'en-US' });
  const [index, setIndex] = useState(0);

  const items = useMemo(() => learnedWords, [learnedWords]);
  const count = items.length;
  const current = count > 0 ? items[index % count] : null;

  useEffect(() => {
    // Auto-speak the word whenever it changes (subtle, single utterance).
    if (current) speak(current.word);
  }, [current, speak]);

  if (count === 0) {
    return (
      <section className="screen word-meaning-screen">
        <div className="wm-topbar">
          <button type="button" className="wm-back" onClick={onBack} aria-label="Back">
            <BackArrow />
          </button>
          <h1 className="wm-title">Word Meaning</h1>
          <span className="wm-back-placeholder" aria-hidden="true" />
        </div>
        <div className="wm-empty">
          <p>No words yet — go find some!</p>
          <button className="btn primary" onClick={onBack}>← Back home</button>
        </div>
      </section>
    );
  }

  const goPrev = () => setIndex((i) => (i - 1 + count) % count);
  const goNext = () => setIndex((i) => (i + 1) % count);

  return (
    <section className="screen word-meaning-screen">
      <div className="wm-topbar">
        <button type="button" className="wm-back" onClick={onBack} aria-label="Back">
          <BackArrow />
        </button>
        <h1 className="wm-title">Word Meaning</h1>
        <span className="wm-back-placeholder" aria-hidden="true" />
      </div>

      <div className="wm-card">
        <div className="wm-word-row">
          <AnimatePresence mode="wait">
            <motion.h2
              key={current!.word + '-title'}
              className="wm-word"
              style={{ color: WORD_COLORS[index % WORD_COLORS.length] }}
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -8, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {current!.word.toUpperCase()}
            </motion.h2>
          </AnimatePresence>
          <button
            type="button"
            className="wm-audio"
            aria-label={`Speak ${current!.word}`}
            onClick={() => {
              speak(current!.word);
              onSpeak(current!);
            }}
          >
            <AudioIcon />
          </button>
        </div>

        <div className="wm-scene">
          <AnimatePresence mode="wait">
            <motion.div
              key={current!.word + '-scene'}
              className="wm-scene-inner"
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {sceneFor(current!)}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="wm-meaning-panel">
          <AnimatePresence mode="wait">
            <motion.p
              key={current!.word + '-meaning'}
              className="wm-meaning"
              initial={{ y: 6, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -6, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {current!.meaning}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="wm-pager">
          <button
            type="button"
            className="wm-nav"
            onClick={goPrev}
            aria-label="Previous word"
          >
            <ChevronIcon dir="left" />
          </button>
          <div className="wm-dots" aria-hidden="true">
            {items.slice(0, Math.min(count, 3)).map((_, i) => {
              const active = (index % count) % 3 === i;
              const highlight = i === 0 ? 'pink' : i === 1 ? 'yellow' : 'gray';
              return (
                <span
                  key={i}
                  className={`wm-dot ${highlight}${active ? ' on' : ''}`}
                />
              );
            })}
          </div>
          <button
            type="button"
            className="wm-nav"
            onClick={goNext}
            aria-label="Next word"
          >
            <ChevronIcon dir="right" />
          </button>
        </div>
      </div>
    </section>
  );
}
