import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Celebration from './Celebration';
import { TOKEN_PAIRS, randomTokenPairIndex, type Token } from '../core/data/tokens';
import {
  aiMove,
  availableMoves,
  emptyBoard,
  findWinner,
  isDraw,
  type TttCell,
  type Difficulty
} from '../core/ticTacToe';
import { t } from '../core/i18n';
import type { AgeGroupKey, Language } from '../core/types';

interface TicTacToeGameProps {
  ageGroup: AgeGroupKey;
  language: Language;
  onExit: () => void;
  onSpeakText: (text: string) => void;
  onPlaySuccess: () => void;
  onPlayCelebration: () => void;
  onPlayError: () => void;
  onSetMascotMessage: (msg: string) => void;
}

interface Result {
  outcome: 'win' | 'lose' | 'tie';
  line?: readonly [number, number, number];
}

const DIFFICULTY_BY_AGE: Record<AgeGroupKey, Difficulty> = {
  '3-4': 'easy',
  '5-6': 'medium',
  '7-8': 'hard'
};

/**
 * Word-token tic-tac-toe. Kid vs Ollie the Owl (AI). Each move speaks the
 * token's word — so kids hear "cat, cat, cat, owl, owl…" many times per
 * game. Repetition is how young children learn vocabulary.
 */
export default function TicTacToeGame({
  ageGroup,
  language,
  onExit,
  onSpeakText,
  onPlaySuccess,
  onPlayCelebration,
  onPlayError,
  onSetMascotMessage
}: TicTacToeGameProps) {
  const strings = t(language);
  const difficulty = DIFFICULTY_BY_AGE[ageGroup];

  const [pairIndex, setPairIndex] = useState<number>(() => randomTokenPairIndex());
  const [board, setBoard] = useState<TttCell[]>(() => emptyBoard());
  const [turn, setTurn] = useState<1 | -1>(1); // 1 = player, -1 = Ollie
  const [result, setResult] = useState<Result | null>(null);
  // Track who starts the next game so it alternates fairly.
  const [playerStarts, setPlayerStarts] = useState(true);
  const aiTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [playerToken, owlToken] = TOKEN_PAIRS[pairIndex]!;
  const playerLabel = playerToken.labels[language];
  const owlLabel = owlToken.labels[language];

  const winSet = useMemo(
    () => (result?.line ? new Set(result.line) : new Set<number>()),
    [result]
  );

  const finish = useCallback(
    (nextBoard: TttCell[]) => {
      const w = findWinner(nextBoard);
      if (w) {
        const outcome: Result['outcome'] = w.winner === 1 ? 'win' : 'lose';
        setResult({ outcome, line: w.line });
        if (outcome === 'win') {
          onPlayCelebration();
          onSetMascotMessage(strings.youWon);
          onSpeakText(strings.youWon);
        } else {
          onSetMascotMessage(strings.owlWon);
          onSpeakText(strings.owlWon);
        }
        return true;
      }
      if (isDraw(nextBoard)) {
        setResult({ outcome: 'tie' });
        onSetMascotMessage(strings.itsATie);
        onSpeakText(strings.itsATie);
        return true;
      }
      return false;
    },
    [onPlayCelebration, onSetMascotMessage, onSpeakText, strings]
  );

  const handleCellTap = (idx: number) => {
    if (result || turn !== 1 || board[idx] !== 0) {
      if (board[idx] !== 0) onPlayError();
      return;
    }
    const next = board.slice();
    next[idx] = 1;
    setBoard(next);
    onPlaySuccess();
    onSpeakText(playerLabel);
    if (!finish(next)) setTurn(-1);
  };

  // Ollie's turn — delay a beat so it feels like she's thinking.
  useEffect(() => {
    if (result || turn !== -1) return;
    aiTimerRef.current = setTimeout(() => {
      aiTimerRef.current = null;
      const move = aiMove(board, difficulty);
      if (move < 0 || availableMoves(board).length === 0) return;
      const next = board.slice();
      next[move] = -1;
      setBoard(next);
      onSpeakText(owlLabel);
      if (!finish(next)) setTurn(1);
    }, 700);
    return () => {
      if (aiTimerRef.current) {
        clearTimeout(aiTimerRef.current);
        aiTimerRef.current = null;
      }
    };
  }, [turn, board, result, difficulty, owlLabel, onSpeakText, finish]);

  // Announce whose turn it is (mascot bubble).
  useEffect(() => {
    if (result) return;
    onSetMascotMessage(turn === 1 ? strings.yourTurn : strings.owlTurn);
  }, [turn, result, strings.yourTurn, strings.owlTurn, onSetMascotMessage]);

  const startNewGame = () => {
    if (aiTimerRef.current) {
      clearTimeout(aiTimerRef.current);
      aiTimerRef.current = null;
    }
    setBoard(emptyBoard());
    setResult(null);
    setPairIndex((prev) => randomTokenPairIndex(prev));
    const nextPlayerStarts = !playerStarts;
    setPlayerStarts(nextPlayerStarts);
    setTurn(nextPlayerStarts ? 1 : -1);
  };

  return (
    <section className="screen ttt-screen">
      <div className="ttt-header">
        <TokenBadge who={strings.you}   token={playerToken} language={language} active={turn === 1 && !result} tone="player" />
        <span className="ttt-vs" aria-hidden="true">VS</span>
        <TokenBadge who={strings.owl}   token={owlToken}    language={language} active={turn === -1 && !result} tone="owl" />
      </div>

      <div className="ttt-board" role="grid" aria-label="Tic-tac-toe board">
        {board.map((cell, i) => {
          const isWinCell = winSet.has(i);
          const disabled = cell !== 0 || !!result || turn !== 1;
          return (
            <motion.button
              key={i}
              type="button"
              role="gridcell"
              className={`ttt-cell ${cell === 1 ? 'player' : cell === -1 ? 'owl' : ''} ${isWinCell ? 'win' : ''}`}
              onClick={() => handleCellTap(i)}
              disabled={disabled}
              whileTap={cell === 0 ? { scale: 0.92 } : undefined}
              animate={isWinCell ? { scale: [1, 1.1, 1] } : {}}
              transition={isWinCell ? { duration: 0.6, repeat: Infinity } : {}}
              aria-label={
                cell === 0
                  ? `Empty cell ${i + 1}`
                  : `${cell === 1 ? playerLabel : owlLabel}`
              }
            >
              {cell !== 0 && (
                <motion.span
                  className="ttt-cell-content"
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 18 }}
                >
                  <span className="ttt-cell-emoji" aria-hidden="true">
                    {cell === 1 ? playerToken.emoji : owlToken.emoji}
                  </span>
                  <span className="ttt-cell-word">
                    {cell === 1 ? playerLabel : owlLabel}
                  </span>
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </div>

      {result && result.outcome !== 'win' && (
        <motion.div
          className={`ttt-result ${result.outcome}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 240, damping: 20 }}
          role="status"
        >
          <span className="ttt-result-emoji" aria-hidden="true">
            {result.outcome === 'lose' ? '🦉' : '🤝'}
          </span>
          <strong>
            {result.outcome === 'lose' ? strings.owlWon : strings.itsATie}
          </strong>
        </motion.div>
      )}

      <div className="button-row">
        <button className="btn primary" onClick={startNewGame}>
          {result ? strings.playAgain : strings.newGame}
        </button>
        <button className="btn ghost" onClick={onExit}>{strings.home}</button>
      </div>

      {result?.outcome === 'win' && (
        <Celebration
          praise={strings.youWon}
          subtitle={strings.ticTacToeSub}
          stars={3}
          wordsFound={3}
          showStars={false}
          nextLabel={strings.playAgain}
          onNext={startNewGame}
          onHome={onExit}
        />
      )}
    </section>
  );
}

/* -------------------- Small helper -------------------- */

interface TokenBadgeProps {
  who: string;
  token: Token;
  language: Language;
  active: boolean;
  tone: 'player' | 'owl';
}

function TokenBadge({ who, token, language, active, tone }: TokenBadgeProps) {
  return (
    <motion.div
      className={`ttt-token-badge ${tone} ${active ? 'active' : ''}`}
      animate={active ? { scale: [1, 1.05, 1] } : { scale: 1 }}
      transition={{ duration: 1.2, repeat: active ? Infinity : 0 }}
    >
      <span className="ttt-token-emoji" aria-hidden="true">{token.emoji}</span>
      <div className="ttt-token-text">
        <span className="ttt-token-who">{who}</span>
        <span className="ttt-token-word">{token.labels[language]}</span>
      </div>
    </motion.div>
  );
}
