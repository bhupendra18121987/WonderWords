import { useCallback, useEffect, useMemo, useState } from 'react';
import Grid from './Grid';
import ThemedScreen from './ThemedScreen';
import Celebration from './Celebration';
import { getAllWords, getWordsData } from '../core/data';
import { buildPuzzleForLevel } from '../core/puzzleGenerator';
import { splitGraphemes } from '../core/grapheme';
import { getLanguageConfig } from '../core/languages';
import { t } from '../core/i18n';
import type { AgeGroupKey, Cell, Language, Puzzle } from '../core/types';

interface TwoPlayerGameProps {
  ageGroup: AgeGroupKey;
  language: Language;
  onExit: () => void;
  speakLetter: (letter: string) => void;
  speakText: (text: string) => void;
}

interface FoundEntry {
  word: string;
  cells: Cell[];
  player: 1 | 2;
}

const PLAYER_COLORS: Record<1 | 2, string> = {
  1: '#4b8bef',
  2: '#e26a89'
};

const PLAYER_CELL_COLORS: Record<1 | 2, { bg: string; dark: string }> = {
  1: { bg: '#6ec5ff', dark: '#2f8ac9' },
  2: { bg: '#ff8fb5', dark: '#d95a83' }
};

export default function TwoPlayerGame({
  ageGroup,
  language,
  onExit,
  speakLetter,
  speakText
}: TwoPlayerGameProps) {
  const strings = t(language);
  const langCfg = getLanguageConfig(language);
  const wordsData = getWordsData(language);
  const group = wordsData.ageGroups[ageGroup];
  const bank = getAllWords(language);

  const [seed, setSeed] = useState(0);
  const puzzle: Puzzle = useMemo(() => {
    return buildPuzzleForLevel({
      bank,
      ageGroup,
      gridSize: group.gridSize,
      wordsPerPuzzle: group.wordsPerPuzzle,
      minLength: group.minLength,
      maxLength: group.maxLength,
      directions: group.directions,
      excludeWords: [],
      fillChars: langCfg.fillChars
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ageGroup, seed, language]);

  const [found, setFound] = useState<FoundEntry[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
  const [wrongCells, setWrongCells] = useState<Cell[]>([]);
  const [lastFoundPlayer, setLastFoundPlayer] = useState<1 | 2 | null>(null);

  // Reset per-round state when the puzzle regenerates.
  useEffect(() => {
    setFound([]);
    setCurrentPlayer(1);
    setWrongCells([]);
    setLastFoundPlayer(null);
  }, [puzzle]);

  const foundWords = useMemo(() => found.map((f) => f.word), [found]);
  const allFoundCells = useMemo(() => found.flatMap((f) => f.cells), [found]);
  // Color each found word by the player that found it, so the grid clearly
  // shows who claimed which word.
  const foundGroups = useMemo(
    () => found.map((f) => ({ cells: f.cells, color: PLAYER_CELL_COLORS[f.player] })),
    [found]
  );
  const p1Score = found.filter((f) => f.player === 1).length;
  const p2Score = found.filter((f) => f.player === 2).length;
  const totalWords = puzzle.placements.length;
  const gameOver = found.length >= totalWords && totalWords > 0;

  const winnerText = useMemo(() => {
    if (!gameOver) return null;
    if (p1Score > p2Score) return strings.winnerAnnounce(strings.player1);
    if (p2Score > p1Score) return strings.winnerAnnounce(strings.player2);
    return strings.winnerTie;
  }, [gameOver, p1Score, p2Score, strings]);

  const handleSelectionAttempt = useCallback(
    ({ word, cells, isStraight }: { word: string; cells: Cell[]; isStraight: boolean }) => {
      if (!isStraight || !word || gameOver) return;
      if (cells.length < 2) return; // ignore single-tap without a real drag

      const dragged = splitGraphemes(word);
      const target = puzzle.placements.find((p) => {
        if (foundWords.includes(p.word)) return false;
        const placed = splitGraphemes(p.word);
        if (placed.length !== dragged.length) return false;
        const forward = placed.every((g, i) => g === dragged[i]);
        if (forward) return true;
        return placed.every((g, i) => g === dragged[placed.length - 1 - i]);
      });

      if (target) {
        // Correct word — award the point and pass the turn.
        speakText(target.word);
        setFound((prev) => [
          ...prev,
          { word: target.word, cells: target.cells, player: currentPlayer }
        ]);
        setLastFoundPlayer(currentPlayer);
        setCurrentPlayer((p) => (p === 1 ? 2 : 1));
      } else {
        // Wrong / unknown selection — briefly flash the cells red, then
        // pass the turn to the other player.
        setWrongCells(cells);
        setTimeout(() => setWrongCells([]), 500);
        setCurrentPlayer((p) => (p === 1 ? 2 : 1));
      }
    },
    [gameOver, puzzle.placements, foundWords, currentPlayer, speakText]
  );

  // Clear the "just found" flash a moment after it appears so the score
  // pulse animation resets.
  useEffect(() => {
    if (lastFoundPlayer == null) return;
    const id = setTimeout(() => setLastFoundPlayer(null), 700);
    return () => clearTimeout(id);
  }, [lastFoundPlayer, found.length]);

  const restart = () => {
    setSeed((s) => s + 1);
  };

  const currentName = currentPlayer === 1 ? strings.player1 : strings.player2;

  if (gameOver) {
    const winnerScore = Math.max(p1Score, p2Score);
    return (
      <Celebration
        praise={winnerText ?? strings.correctFeedback}
        stars={3}
        wordsFound={winnerScore}
        pointsEarned={winnerScore * 10}
        coinsEarned={winnerScore * 4}
        nextLabel={strings.playAgain}
        onNext={restart}
        onHome={onExit}
      />
    );
  }

  return (
    <ThemedScreen
      title={strings.twoPlayerName}
      onBack={onExit}
      className="minigame-themed twoplayer-themed"
      headerRight={<span className="minigame-meta">{found.length} / {totalWords}</span>}
    >
      <div className="twoplayer-scores">
        <div className={`tp-score-box p1 ${currentPlayer === 1 ? 'active' : ''} ${lastFoundPlayer === 1 ? 'just-found' : ''}`}>
          <span className="tp-name">{strings.player1}</span>
          <span className="tp-value">⭐ {p1Score}</span>
        </div>
        <div className={`tp-score-box p2 ${currentPlayer === 2 ? 'active' : ''} ${lastFoundPlayer === 2 ? 'just-found' : ''}`}>
          <span className="tp-name">{strings.player2}</span>
          <span className="tp-value">⭐ {p2Score}</span>
        </div>
      </div>

      <p
        className="twoplayer-turn"
        style={{ color: PLAYER_COLORS[currentPlayer] }}
      >
        {strings.playerTurn(currentName)}
      </p>

      <Grid
        grid={puzzle.grid}
        foundCells={allFoundCells}
        foundGroups={foundGroups}
        wrongCells={wrongCells}
        language={language}
        onLetterEnter={speakLetter}
        onSelectionAttempt={handleSelectionAttempt}
      />
    </ThemedScreen>
  );
}
