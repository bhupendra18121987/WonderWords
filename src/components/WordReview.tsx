import { motion } from 'framer-motion';
import type { LearnedWord } from '../core/types';

interface WordReviewProps {
  learnedWords: LearnedWord[];
  onBack: () => void;
  onSpeak: (word: LearnedWord) => void;
}

export default function WordReview({ learnedWords, onBack, onSpeak }: WordReviewProps) {
  return (
    <section className="screen">
      <h1>Your word treasure! 💎</h1>
      <p className="lead">Tap any word to hear it again and remember what it means.</p>
      {learnedWords.length === 0 ? (
        <p>No words yet — go find some!</p>
      ) : (
        <div className="home-grid" style={{ maxWidth: 1000 }}>
          {learnedWords.map((w) => (
            <motion.button
              key={w.word}
              className="home-tile"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSpeak(w)}
            >
              <span className="icon" aria-hidden="true">{w.emoji}</span>
              <span className="name">{w.word}</span>
              <span className="sub">{w.meaning}</span>
            </motion.button>
          ))}
        </div>
      )}
      <button className="btn primary" onClick={onBack}>← Back home</button>
    </section>
  );
}
