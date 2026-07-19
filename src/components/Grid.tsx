import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Cell, Language } from '../core/types';
import { lineBetween, readSelection } from '../core/puzzleGenerator';
import { isVowelForLang } from '../core/languages';

interface GridProps {
  grid: string[][];
  foundCells?: Cell[];
  hintCells?: Cell[];
  wrongCells?: Cell[];
  /** When true, vowel cells get a subtle color tint. */
  highlightVowels?: boolean;
  /** Which language's vowels to highlight. Defaults to English. */
  language?: Language;
  onLetterEnter?: (letter: string) => void;
  onSelectionAttempt?: (result: { word: string; cells: Cell[]; isStraight: boolean }) => void;
}

/**
 * Interactive word-search grid. Supports mouse & touch drag selection,
 * keyboard activation, and highlights for found / hint / wrong cells.
 */
export default function Grid({
  grid,
  foundCells = [],
  hintCells = [],
  wrongCells = [],
  highlightVowels = false,
  language = 'en',
  onLetterEnter,
  onSelectionAttempt
}: GridProps) {
  const size = grid.length;
  const gridRef = useRef<HTMLDivElement | null>(null);
  const [start, setStart] = useState<Cell | null>(null);
  const [current, setCurrent] = useState<Cell | null>(null);
  const [selecting, setSelecting] = useState(false);
  const lastLetterKeyRef = useRef<string | null>(null);

  const activeLine: Cell[] = useMemo(() => {
    if (!selecting || !start) return [];
    return lineBetween(start, current || start) || [start];
  }, [selecting, start, current]);

  const foundKeySet = useMemo(() => {
    const s = new Set<string>();
    for (const c of foundCells) s.add(`${c.r},${c.c}`);
    return s;
  }, [foundCells]);

  const hintKeySet = useMemo(() => {
    const s = new Set<string>();
    for (const c of hintCells) s.add(`${c.r},${c.c}`);
    return s;
  }, [hintCells]);

  const wrongKeySet = useMemo(() => {
    const s = new Set<string>();
    for (const c of wrongCells) s.add(`${c.r},${c.c}`);
    return s;
  }, [wrongCells]);

  const selectingKeySet = useMemo(() => {
    const s = new Set<string>();
    for (const c of activeLine) s.add(`${c.r},${c.c}`);
    return s;
  }, [activeLine]);

  const cellFromPoint = useCallback((clientX: number, clientY: number): Cell | null => {
    const el = document.elementFromPoint(clientX, clientY);
    if (!el) return null;
    const cellEl = (el as Element).closest('[data-cell]') as HTMLElement | null;
    if (!cellEl || !gridRef.current?.contains(cellEl)) return null;
    const r = Number(cellEl.getAttribute('data-r'));
    const c = Number(cellEl.getAttribute('data-c'));
    if (Number.isNaN(r) || Number.isNaN(c)) return null;
    return { r, c };
  }, []);

  const beginAt = useCallback(
    (cell: Cell) => {
      setStart(cell);
      setCurrent(cell);
      setSelecting(true);
      lastLetterKeyRef.current = `${cell.r},${cell.c}`;
      onLetterEnter?.(grid[cell.r]![cell.c]!);
    },
    [grid, onLetterEnter]
  );

  const updateTo = useCallback(
    (cell: Cell | null) => {
      if (!cell) return;
      setCurrent((prev) => (prev && prev.r === cell.r && prev.c === cell.c ? prev : cell));
      const key = `${cell.r},${cell.c}`;
      if (lastLetterKeyRef.current !== key) {
        lastLetterKeyRef.current = key;
        onLetterEnter?.(grid[cell.r]![cell.c]!);
      }
    },
    [grid, onLetterEnter]
  );

  const finish = useCallback(() => {
    if (!selecting || !start) {
      setSelecting(false);
      setStart(null);
      setCurrent(null);
      return;
    }
    const cells = lineBetween(start, current || start) || [start];
    const { word, isStraight } = readSelection(grid, cells);
    onSelectionAttempt?.({ word, cells, isStraight });
    setSelecting(false);
    setStart(null);
    setCurrent(null);
    lastLetterKeyRef.current = null;
  }, [selecting, start, current, grid, onSelectionAttempt]);

  // Global pointer handlers so the drag continues if the pointer briefly leaves cells
  useEffect(() => {
    if (!selecting) return;
    const move = (e: MouseEvent | TouchEvent) => {
      const point = 'touches' in e ? e.touches[0] : (e as MouseEvent);
      if (!point) return;
      const cell = cellFromPoint(point.clientX, point.clientY);
      if (cell) updateTo(cell);
    };
    const up = () => finish();
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    window.addEventListener('touchmove', move, { passive: false });
    window.addEventListener('touchend', up);
    window.addEventListener('touchcancel', up);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
      window.removeEventListener('touchmove', move);
      window.removeEventListener('touchend', up);
      window.removeEventListener('touchcancel', up);
    };
  }, [selecting, cellFromPoint, updateTo, finish]);

  const handleMouseDown = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    beginAt({ r, c });
  };
  const handleTouchStart = (_: React.TouchEvent, r: number, c: number) => {
    beginAt({ r, c });
  };
  const handleKeyDown = (e: React.KeyboardEvent, r: number, c: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!selecting) beginAt({ r, c });
      else finish();
    }
  };

  return (
    <div
      ref={gridRef}
      className="grid"
      style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
      role="grid"
      aria-label="Word search puzzle"
    >
      {grid.map((row, r) =>
        row.map((letter, c) => {
          const key = `${r},${c}`;
          const isFound = foundKeySet.has(key);
          const isHint = hintKeySet.has(key);
          const isWrong = wrongKeySet.has(key);
          const isSelecting = selectingKeySet.has(key);
          const classes = ['cell'];
          if (highlightVowels && isVowelForLang(letter, language)) classes.push('vowel-hint');
          if (isFound) classes.push('found');
          if (isHint && !isFound) classes.push('hint');
          if (isWrong) classes.push('wrong');
          if (isSelecting && !isFound) classes.push('selecting');
          return (
            <div
              key={key}
              className={classes.join(' ')}
              data-cell
              data-r={r}
              data-c={c}
              role="gridcell"
              tabIndex={0}
              aria-label={`Row ${r + 1} column ${c + 1}: letter ${letter}${highlightVowels && isVowelForLang(letter, language) ? ' (vowel)' : ''}`}
              onMouseDown={(e) => handleMouseDown(e, r, c)}
              onTouchStart={(e) => handleTouchStart(e, r, c)}
              onKeyDown={(e) => handleKeyDown(e, r, c)}
            >
              {letter}
            </div>
          );
        })
      )}
    </div>
  );
}
