import { useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import ThemedScreen from './ThemedScreen';
import type { AgeGroupKey, Language } from '../core/types';
import { t } from '../core/i18n';
import { tracePool, type TraceMode } from '../core/data/tracePool';

interface TraceLetterGameProps {
  ageGroup: AgeGroupKey;
  language: Language;
  onExit: () => void;
  speakText: (text: string) => void;
}

interface Point { x: number; y: number }

const MODES: { id: TraceMode; label: string }[] = [
  { id: 'caps',         label: 'A B C' },
  { id: 'small',        label: 'a b c' },
  { id: 'cursive',      label: '𝒜 ℬ 𝒞' },
  { id: 'hindiLetters', label: 'अ आ इ' },
  { id: 'hindiWords',   label: 'आम' }
];

function pointsToPath(pts: Point[]): string {
  if (pts.length === 0) return '';
  const [head, ...rest] = pts;
  let d = `M${head!.x.toFixed(1)} ${head!.y.toFixed(1)}`;
  for (const p of rest) d += ` L${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
  return d;
}

export default function TraceLetterGame({
  ageGroup,
  language,
  onExit,
  speakText
}: TraceLetterGameProps) {
  const strings = t(language);
  const [mode, setMode] = useState<TraceMode>('caps');
  const [index, setIndex] = useState(0);
  const [strokes, setStrokes] = useState<Point[][]>([]);
  const drawingRef = useRef(false);
  const canvasRef = useRef<SVGSVGElement | null>(null);

  const pool = useMemo(() => tracePool(mode, ageGroup), [mode, ageGroup]);
  const current = pool[index] ?? '';

  const changeMode = (m: TraceMode) => {
    setMode(m);
    setIndex(0);
    setStrokes([]);
  };
  const clear = () => setStrokes([]);
  const goNext = () => {
    if (index < pool.length - 1) {
      setIndex(index + 1);
      setStrokes([]);
      speakText(pool[index + 1]!);
    }
  };
  const goPrev = () => {
    if (index > 0) {
      setIndex(index - 1);
      setStrokes([]);
      speakText(pool[index - 1]!);
    }
  };

  const canvasPoint = (e: ReactPointerEvent<SVGSVGElement>): Point => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const onPointerDown = (e: ReactPointerEvent<SVGSVGElement>) => {
    e.preventDefault();
    drawingRef.current = true;
    const p = canvasPoint(e);
    setStrokes((s) => [...s, [p]]);
    // Capture so touch drag keeps producing events.
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: ReactPointerEvent<SVGSVGElement>) => {
    if (!drawingRef.current) return;
    const p = canvasPoint(e);
    setStrokes((s) => {
      const clone = s.slice();
      const last = clone[clone.length - 1];
      if (last) clone[clone.length - 1] = [...last, p];
      return clone;
    });
  };
  const onPointerUp = () => {
    drawingRef.current = false;
  };

  const isCursive = mode === 'cursive';

  const ghostClassName = [
    'trace-ghost',
    isCursive ? 'cursive' : '',
    mode === 'hindiWords' ? 'word' : ''
  ].filter(Boolean).join(' ');

  return (
    <ThemedScreen
      title={strings.traceName}
      onBack={onExit}
      className="minigame-themed trace-themed"
      headerRight={<span className="minigame-meta">{index + 1} / {pool.length}</span>}
    >
      <button
        className="trace-title"
        onClick={() => current && speakText(current)}
        aria-label={`speak ${current}`}
      >
        ✍️ {current || '—'}
      </button>

      <p className="trace-subtitle">{strings.traceSub}</p>

      <div className="trace-mode-row" role="tablist">
        {MODES.map((m) => (
          <button
            key={m.id}
            className={`trace-mode-btn ${mode === m.id ? 'active' : ''}`}
            onClick={() => changeMode(m.id)}
            role="tab"
            aria-selected={mode === m.id}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="trace-canvas">
        <span className={ghostClassName}>{current}</span>
        <svg
          ref={canvasRef}
          className="trace-svg"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {strokes.map((stroke, i) => (
            <path
              key={i}
              d={pointsToPath(stroke)}
              stroke="#e26a89"
              strokeWidth={8}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          ))}
        </svg>
      </div>

      <div className="trace-controls">
        <button className="btn ghost" onClick={goPrev} disabled={index === 0}>
          {strings.tracePrev}
        </button>
        <button className="btn primary" onClick={clear}>
          {strings.traceClear}
        </button>
        <button className="btn ghost" onClick={goNext} disabled={index >= pool.length - 1}>
          {strings.traceNext}
        </button>
      </div>
    </ThemedScreen>
  );
}
