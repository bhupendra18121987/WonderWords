import { useEffect, useMemo, useState } from 'react';
import { t } from '../core/i18n';
import { starsFromScore } from '../core/gameLogic';
import ThemedScreen from './ThemedScreen';
import Celebration from './Celebration';
import type { AgeGroupKey, Language } from '../core/types';
import { buildChoices, pickOne, ROUNDS_PER_SESSION } from '../core/miniGames';
import { CHOICE_COUNT_BY_AGE, letterPool } from '../core/data/letterHunt';

interface LetterHuntGameProps {
  ageGroup: AgeGroupKey;
  language: Language;
  onExit: () => void;
  speakText: (text: string) => void;
}

export default function LetterHuntGame({ ageGroup, language, onExit, speakText }: LetterHuntGameProps) {
  const strings = t(language);
  const pool = useMemo(() => letterPool(language, ageGroup), [language, ageGroup]);
  const choiceCount = CHOICE_COUNT_BY_AGE[ageGroup];

  const [target, setTarget] = useState<string>(() => pickOne(pool) ?? pool[0]!);
  const [choices, setChoices] = useState<string[]>(() => buildChoices(target, pool, choiceCount));
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [wrongId, setWrongId] = useState<string | null>(null);
  const [correctId, setCorrectId] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    speakText(strings.letterHuntPrompt(target));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  const nextRound = () => {
    if (round >= ROUNDS_PER_SESSION) {
      setDone(true);
      return;
    }
    const next = pickOne(pool) ?? pool[0]!;
    setTarget(next);
    setChoices(buildChoices(next, pool, choiceCount));
    setRound((r) => r + 1);
    setWrongId(null);
  };

  const handleTap = (letter: string) => {
    if (letter === target) {
      setScore((s) => s + 1);
      setCorrectId(letter);
      speakText(strings.correctFeedback);
      setTimeout(() => {
        setCorrectId(null);
        nextRound();
      }, 900);
    } else {
      setWrongId(letter);
      speakText(letter);
      setTimeout(() => setWrongId(null), 500);
    }
  };

  const restart = () => {
    setScore(0);
    setRound(1);
    setDone(false);
    const t0 = pickOne(pool) ?? pool[0]!;
    setTarget(t0);
    setChoices(buildChoices(t0, pool, choiceCount));
  };

  if (done) {
    return (
      <Celebration
        praise={strings.correctFeedback}
        stars={starsFromScore(score, ROUNDS_PER_SESSION)}
        wordsFound={score}
        pointsEarned={score * 10}
        coinsEarned={score * 4}
        nextLabel={strings.playAgain}
        onNext={restart}
        onHome={onExit}
      />
    );
  }

  return (
    <ThemedScreen
      title={strings.letterHuntName}
      onBack={onExit}
      className="minigame-themed"
      headerRight={<span className="minigame-meta">{strings.roundLabel(round, ROUNDS_PER_SESSION)} • {strings.scoreLabel(score)}</span>}
    >
      <button
        className="minigame-prompt"
        onClick={() => speakText(strings.letterHuntPrompt(target))}
        aria-label={strings.letterHuntPrompt(target)}
      >
        <span className="prompt-text">{strings.letterHuntPrompt(target)}</span>
        <span className="prompt-hint" aria-hidden="true">🔊</span>
      </button>

      <div className="minigame-grid letter-hunt-grid">
        {choices.map((letter) => (
          <button
            key={letter}
            className={`letter-card ${wrongId === letter ? 'wrong' : ''} ${correctId === letter ? 'right' : ''}`}
            onClick={() => handleTap(letter)}
            aria-label={letter}
          >
            <span className="letter-glyph">{letter}</span>
            {correctId === letter && <span className="letter-check" aria-hidden="true">✓</span>}
          </button>
        ))}
      </div>
    </ThemedScreen>
  );
}
