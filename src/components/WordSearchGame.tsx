import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Grid from './Grid';
import WordList from './WordList';
import WordReveal from './WordReveal';
import Celebration from './Celebration';
import {
  BackArrowIcon,
  ClockIcon,
  CoinIcon,
  GameGrass,
  LightbulbIcon,
  SpeakerIcon,
  SpeakerMuteIcon,
  colorForWordIndex
} from './GameAssets';
import type {
  AgeGroupKey,
  Cell,
  FoundWord,
  Language,
  Progress,
  Puzzle,
  Settings,
  WordEntry
} from '../core/types';
import { getWordsData, getAllWords } from '../core/data';
import { buildPuzzleForLevel } from '../core/puzzleGenerator';
import { getLanguageConfig } from '../core/languages';
import { splitGraphemes } from '../core/grapheme';
import { t } from '../core/i18n';
import {
  computeStars,
  pickEncouragement,
  pickPraise,
  progressAfterPuzzle
} from '../core/gameLogic';

interface WordSearchGameProps {
  ageGroup: AgeGroupKey;
  level: number;
  language: Language;
  settings: Settings;
  progress: Progress;
  onProgressUpdate: (patch: Progress) => void;
  onExit: () => void;
  onSpeakLetter: (letter: string) => void;
  onSpeakText: (text: string) => void;
  onPlaySuccess: () => void;
  onPlayCelebration: () => void;
  onPlayError: () => void;
  onSetMascotMessage: (msg: string) => void;
}

/**
 * Main word-search screen. Owns per-puzzle UI state (found cells, hints,
 * mistakes) but delegates all rule-based logic to the pure helpers in `core/`.
 */
export default function WordSearchGame({
  ageGroup,
  level,
  language,
  settings,
  progress,
  onProgressUpdate,
  onExit,
  onSpeakLetter,
  onSpeakText,
  onPlaySuccess,
  onPlayCelebration,
  onPlayError,
  onSetMascotMessage
}: WordSearchGameProps) {
  const wordsData = getWordsData(language);
  const bank = getAllWords(language);
  const langCfg = getLanguageConfig(language);
  const strings = t(language);
  const group = wordsData.ageGroups[ageGroup];

  // `activeLevel` is a local snapshot of the level being played. It is
  // intentionally NOT re-synced from the `level` prop, because
  // `onProgressUpdate` bumps `progress.level` on completion and we don't want
  // that to instantly regenerate the puzzle underneath the celebration modal.
  const [activeLevel, setActiveLevel] = useState<number>(level);
  const [seed, setSeed] = useState(0);

  const puzzle: Puzzle = useMemo(() => {
    const learned = (progress.learnedWords || []).map((w) => w.word);
    // Bump grid size gently as levels rise, capped at group.gridSize + 2
    const gridSize = Math.min(
      group.gridSize + Math.floor((activeLevel - 1) / 3),
      Math.max(group.gridSize + 2, 10)
    );
    return buildPuzzleForLevel({
      bank,
      ageGroup,
      gridSize,
      wordsPerPuzzle: group.wordsPerPuzzle,
      minLength: group.minLength,
      maxLength: group.maxLength,
      directions: group.directions,
      excludeWords: learned,
      fillChars: langCfg.fillChars
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ageGroup, activeLevel, seed, language]);

  const [foundWords, setFoundWords] = useState<FoundWord[]>([]);
  const [wrongCells, setWrongCells] = useState<Cell[]>([]);
  const [hintCells, setHintCells] = useState<Cell[]>([]);
  const [reveal, setReveal] = useState<{
    word: string;
    emoji: string;
    meaning: string;
    category?: string;
  } | null>(null);
  const [completion, setCompletion] = useState<
    { wordsFound: number; stars: 1 | 2 | 3; praise: string } | null
  >(null);
  const [mistakes, setMistakes] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const startTimeRef = useRef<number>(Date.now());
  const MAX_HINTS = 3;
  const streakRef = useRef(0);
  // Synchronous guard so the completion effect only fires ONCE per puzzle.
  // State updates are async, so relying on `completion` alone lets React
  // re-run this effect several times in the same tick (each triggering
  // another celebration jingle) before setCompletion actually takes effect.
  const completingRef = useRef(false);
  // Remember the randomly-picked praise word so both the auto-timer AND the
  // fast-forward path (user dismisses the reveal early) use the same one.
  const completionPraiseRef = useRef<string>('');
  // Timer id for the delayed celebration modal. Held in a ref so an effect
  // re-run (triggered by `progress` changing after onProgressUpdate) does
  // NOT cancel the pending timer via a cleanup return. We only cancel it
  // when the puzzle resets or the component unmounts.
  const completionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Cancel any pending celebration from the previous puzzle.
    if (completionTimerRef.current) {
      clearTimeout(completionTimerRef.current);
      completionTimerRef.current = null;
    }
    setFoundWords([]);
    setWrongCells([]);
    setHintCells([]);
    setReveal(null);
    setCompletion(null);
    setMistakes(0);
    setHintsUsed(0);
    setElapsed(0);
    startTimeRef.current = Date.now();
    streakRef.current = 0;
    completingRef.current = false;
    completionPraiseRef.current = '';
    onSetMascotMessage(strings.findWordsMsg(puzzle.items.length));
  }, [puzzle, onSetMascotMessage, strings]);

  // Tick the play timer once per second while the game is active. Stops
  // when a completion modal is showing to freeze the final elapsed time.
  useEffect(() => {
    if (completion) return;
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, [completion, puzzle]);

  // Cancel any pending celebration if the game screen unmounts (e.g. user
  // navigates Home mid-completion).
  useEffect(() => {
    return () => {
      if (completionTimerRef.current) {
        clearTimeout(completionTimerRef.current);
        completionTimerRef.current = null;
      }
    };
  }, []);

  const allFoundCells = useMemo(
    () => foundWords.flatMap((f) => f.cells),
    [foundWords]
  );

  const foundWordStrings = useMemo(
    () => foundWords.map((f) => f.word),
    [foundWords]
  );

  const handleLetterEnter = useCallback(
    (letter: string) => {
      if (settings.letterSpeech) onSpeakLetter(letter);
    },
    [settings.letterSpeech, onSpeakLetter]
  );

  const handleSelectionAttempt = useCallback(
    ({ word, cells, isStraight }: { word: string; cells: Cell[]; isStraight: boolean }) => {
      if (!isStraight || !word) return;
      // Grapheme-array comparison. Works for both English (each letter is
      // one grapheme) and Hindi (each akshara like "गा" is one grapheme,
      // even though it's multiple Unicode code points). Comparing the
      // arrays directly avoids any subtle string-join / normalization
      // quirks and matches whether the child dragged forwards OR
      // backwards along the placement.
      const dragged = splitGraphemes(word);
      const target = puzzle.placements.find((p) => {
        if (foundWordStrings.includes(p.word)) return false;
        const placed = splitGraphemes(p.word);
        if (placed.length !== dragged.length) return false;
        const forward = placed.every((g, i) => g === dragged[i]);
        if (forward) return true;
        const reversed = placed.every((g, i) => g === dragged[placed.length - 1 - i]);
        return reversed;
      });

      if (target) {
        const item = puzzle.items.find((w) => w.word === target.word);
        streakRef.current += 1;
        onPlaySuccess();
        // Note: don't speak the word here — the WordReveal modal that
        // opens next auto-speaks it, so speaking again would double up.
        setFoundWords((prev) => [
          ...prev,
          { word: target.word, cells: target.cells, meta: item }
        ]);
        setReveal(item ?? { word: target.word, emoji: '🎉', meaning: target.word });
        onSetMascotMessage(pickPraise(language));
      } else {
        streakRef.current = 0;
        setMistakes((m) => m + 1);
        setWrongCells(cells);
        onPlayError();
        onSetMascotMessage(pickEncouragement(language));
        setTimeout(() => setWrongCells([]), 450);
      }
    },
    [puzzle, foundWordStrings, language, onPlaySuccess, onSpeakText, onPlayError, onSetMascotMessage]
  );

  // Detect puzzle completion — compute new progress via pure helper.
  // We snapshot the win state (`completion`) so the celebration modal shows
  // the correct word count even if progress updates trigger a re-render.
  useEffect(() => {
    if (
      completingRef.current ||
      puzzle.items.length === 0 ||
      foundWords.length !== puzzle.items.length ||
      completion !== null
    ) {
      return;
    }
    completingRef.current = true;
    const stars = computeStars(mistakes, hintsUsed);
    const wordsFound = foundWords.length;
    const praise = pickPraise(language);
    completionPraiseRef.current = praise;
    const foundMeta: WordEntry[] = foundWords
      .map((f) => f.meta)
      .filter((m): m is WordEntry => Boolean(m));
    const next = progressAfterPuzzle({
      current: progress,
      level: activeLevel,
      stars,
      foundWords: foundMeta,
      currentStreak: streakRef.current
    });
    onProgressUpdate(next);
    // Give the child ~10 seconds to enjoy the last WordReveal's animated
    // scene before we bring up the celebration modal. The reveal is
    // dismissible by button, so a curious kid can move on sooner if they
    // want. When the timer finally fires, we auto-close the reveal so the
    // two modals don't stack.
    // NOTE: we do NOT return a cleanup that clears this timer. React would
    // otherwise cancel it whenever this effect re-runs (e.g. after the
    // `progress` prop updates), and the modal would never appear.
    completionTimerRef.current = setTimeout(() => {
      completionTimerRef.current = null;
      setReveal(null);
      onPlayCelebration();
      onSpeakText(praise);
      setCompletion({ wordsFound, stars, praise });
    }, 10000);
  }, [
    foundWords,
    puzzle.items.length,
    completion,
    mistakes,
    hintsUsed,
    progress,
    activeLevel,
    language,
    onProgressUpdate,
    onPlayCelebration,
    onSpeakText
  ]);

  const useHint = useCallback(() => {
    if (hintsUsed >= MAX_HINTS) return;
    const remaining = puzzle.placements.filter(
      (p) => !foundWordStrings.includes(p.word)
    );
    if (remaining.length === 0) return;
    const target = remaining[Math.floor(Math.random() * remaining.length)]!;
    setHintCells([target.cells[0]!]);
    setHintsUsed((n) => n + 1);
    onSpeakText(target.word);
    setTimeout(() => setHintCells([]), 2400);
  }, [puzzle.placements, foundWordStrings, onSpeakText, hintsUsed]);

  const newPuzzle = () => setSeed((s) => s + 1);
  void newPuzzle; // retained for future "New puzzle" affordance
  const nextLevel = () => {
    setActiveLevel((l) => l + 1);
    setSeed((s) => s + 1);
  };

  const progressPct =
    puzzle.items.length === 0
      ? 0
      : Math.round((foundWords.length / puzzle.items.length) * 100);

  // Colour each found word with the same palette entry the WordList chip uses
  // so both surfaces read as the same "team".
  const foundGroups = useMemo(
    () =>
      foundWords.map((f) => {
        const idx = puzzle.items.findIndex((it) => it.word === f.word);
        return {
          cells: f.cells,
          color: colorForWordIndex(idx >= 0 ? idx : 0)
        };
      }),
    [foundWords, puzzle.items]
  );

  const timerLabel = useMemo(() => {
    const mm = String(Math.floor(elapsed / 60)).padStart(2, '0');
    const ss = String(elapsed % 60).padStart(2, '0');
    return `${mm}:${ss}`;
  }, [elapsed]);

  const hintsRemaining = Math.max(0, MAX_HINTS - hintsUsed);
  const hintDisabled = hintsRemaining === 0;

  return (
    <section className="screen wordsearch-screen">
      <header className="ws-topbar">
        <button
          type="button"
          className="ws-back"
          onClick={onExit}
          aria-label={strings.home}
        >
          <BackArrowIcon />
        </button>
        <span className="ws-timer" aria-label={`Time ${timerLabel}`}>
          <ClockIcon />
          <strong>{timerLabel}</strong>
        </span>
        <span className="ws-coins" aria-label={`Score ${progress.stars}`}>
          <CoinIcon />
          <strong>{progress.stars}</strong>
        </span>
      </header>

      <div className="ws-card">
        <h2 className="ws-title">{strings.wordsToFind}</h2>

        <div className="ws-chips">
          <WordList items={puzzle.items} foundWords={foundWordStrings} />
        </div>

        <div className="ws-grid-wrap">
          <div
            className="ws-progress"
            aria-label={`Progress ${progressPct}%`}
          >
            <span style={{ width: `${progressPct}%` }} />
          </div>
          <Grid
            grid={puzzle.grid}
            foundCells={allFoundCells}
            foundGroups={foundGroups}
            hintCells={hintCells}
            wrongCells={wrongCells}
            highlightVowels={settings.highlightVowels}
            language={language}
            onLetterEnter={handleLetterEnter}
            onSelectionAttempt={handleSelectionAttempt}
          />
        </div>
      </div>

      <footer className="ws-bottom">
        <button
          type="button"
          className="ws-audio"
          onClick={() => {/* sound toggle handled by parent settings; no-op UI feedback */}}
          aria-label="Toggle sound"
        >
          {settings.sound ? <SpeakerIcon /> : <SpeakerMuteIcon />}
        </button>

        <div className="ws-bottom-spacer" />

        <button
          type="button"
          className={`ws-hint ${hintDisabled ? 'disabled' : ''}`}
          onClick={useHint}
          disabled={hintDisabled}
          aria-label={`${strings.hint} — ${hintsRemaining} left`}
        >
          <span className="ws-hint-icon"><LightbulbIcon /></span>
          <span className="ws-hint-label">{strings.hint.replace(/^[💡\s]+/, '')}</span>
          <span className="ws-hint-badge">{hintsRemaining}</span>
        </button>
      </footer>

      <div className="ws-grass" aria-hidden="true">
        <GameGrass />
      </div>

      {reveal && (
        <WordReveal
          word={reveal}
          language={language}
          onClose={() => {
            setReveal(null);
            // If the child dismisses the last-word reveal early, don't make
            // them wait the full 10s for the celebration — fast-forward it.
            if (completingRef.current && completionTimerRef.current) {
              clearTimeout(completionTimerRef.current);
              completionTimerRef.current = null;
              onPlayCelebration();
              onSpeakText(completionPraiseRef.current);
              setCompletion({
                wordsFound: foundWords.length,
                stars: computeStars(mistakes, hintsUsed),
                praise: completionPraiseRef.current
              });
            }
          }}
        />
      )}

      {completion && (
        <Celebration
          praise={completion.praise}
          stars={completion.stars}
          wordsFound={completion.wordsFound}
          onNext={() => { setCompletion(null); nextLevel(); }}
          onHome={() => { setCompletion(null); onExit(); }}
        />
      )}
    </section>
  );
}
