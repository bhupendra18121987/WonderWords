import { useEffect, useMemo, useState } from 'react';
import { t } from '../core/i18n';
import { starsFromScore } from '../core/gameLogic';
import ThemedScreen from './ThemedScreen';
import Celebration from './Celebration';
import type { AgeGroupKey, Language } from '../core/types';
import { ROUNDS_PER_SESSION } from '../core/miniGames';
import { CHOICE_COUNT_BY_AGE } from '../core/data/letterHunt';
import {
  generateMissingLetter,
  type MissingLetterPuzzle
} from '../core/data/missingLetter';

interface MissingLetterGameProps {
  ageGroup: AgeGroupKey;
  language: Language;
  onExit: () => void;
  speakText: (text: string) => void;
}

export default function MissingLetterGame({
  ageGroup,
  language,
  onExit,
  speakText
}: MissingLetterGameProps) {
  const strings = t(language);
  const choiceCount = CHOICE_COUNT_BY_AGE[ageGroup];

  const [puzzle, setPuzzle] = useState<MissingLetterPuzzle | null>(() =>
    generateMissingLetter(language, ageGroup, choiceCount)
  );
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [wrongId, setWrongId] = useState<string | null>(null);
  const [correctId, setCorrectId] = useState<string | null>(null);
  const [revealAnswer, setRevealAnswer] = useState(false);
  const [done, setDone] = useState(false);

  const displayGraphemes = useMemo(() => {
    if (!puzzle) return [];
    return puzzle.graphemes.map((g, i) =>
      i === puzzle.blankIndex && !revealAnswer ? '_' : g
    );
  }, [puzzle, revealAnswer]);

  useEffect(() => {
    if (puzzle) speakText(puzzle.word.word);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [puzzle]);

  const nextRound = () => {
    if (round >= ROUNDS_PER_SESSION) {
      setDone(true);
      return;
    }
    setPuzzle(generateMissingLetter(language, ageGroup, choiceCount));
    setRound((r) => r + 1);
    setRevealAnswer(false);
    setWrongId(null);
    setCorrectId(null);
  };

  const handleTap = (choice: string) => {
    if (!puzzle) return;
    if (choice === puzzle.answer) {
      setScore((s) => s + 1);
      setCorrectId(choice);
      setRevealAnswer(true);
      speakText(strings.correctFeedback);
      setTimeout(nextRound, 1100);
    } else {
      setWrongId(choice);
      speakText(choice);
      setTimeout(() => setWrongId(null), 500);
    }
  };

  const restart = () => {
    setScore(0);
    setRound(1);
    setDone(false);
    setRevealAnswer(false);
    setPuzzle(generateMissingLetter(language, ageGroup, choiceCount));
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

  if (!puzzle) {
    return (
      <ThemedScreen title={strings.missingLetterName} onBack={onExit} className="minigame-themed">
        <p>…</p>
      </ThemedScreen>
    );
  }

  return (
    <ThemedScreen
      title={strings.missingLetterName}
      onBack={onExit}
      className="minigame-themed"
      headerRight={<span className="minigame-meta">{strings.roundLabel(round, ROUNDS_PER_SESSION)} • {strings.scoreLabel(score)}</span>}
    >
      <div className="missing-word-card">
        <div className="missing-emoji" aria-hidden="true">{puzzle.word.emoji ?? '❔'}</div>
        <div className="missing-word-row">
          {displayGraphemes.map((g, i) => {
            const isBlank = i === puzzle.blankIndex && !revealAnswer;
            const isFilled = i === puzzle.blankIndex && revealAnswer;
            return (
              <span
                key={`${i}-${g}`}
                className={`missing-glyph ${isBlank ? 'blank' : ''} ${isFilled ? 'filled' : ''}`}
              >
                {g}
              </span>
            );
          })}
        </div>
        <button
          className="missing-speak"
          onClick={() => speakText(puzzle.word.word)}
          aria-label="Speak word"
        >
          🔊
        </button>
      </div>

      <p className="missing-prompt">{strings.missingLetterPrompt}</p>

      <div className="minigame-grid missing-choices">
        {puzzle.choices.map((c) => (
          <button
            key={c}
            className={`choice-card ${wrongId === c ? 'wrong' : ''} ${correctId === c ? 'right' : ''}`}
            onClick={() => handleTap(c)}
            aria-label={c}
          >
            <span className="choice-glyph">{c}</span>
          </button>
        ))}
      </div>
    </ThemedScreen>
  );
}
