import { useEffect, useMemo, useRef, useState } from 'react';
import { t } from '../core/i18n';
import ThemedScreen from './ThemedScreen';
import type { Language } from '../core/types';
import { LANGUAGE_CONFIG } from '../core/languages';

interface AlphabetKaraokeProps {
  language: Language;
  onExit: () => void;
  speakText: (text: string) => void;
}

const LETTER_INTERVAL_MS = 900;

export default function AlphabetKaraoke({ language, onExit, speakText }: AlphabetKaraokeProps) {
  const strings = t(language);
  const cfg = LANGUAGE_CONFIG[language];
  const letters = useMemo(() => [...cfg.vowels, ...cfg.consonants], [cfg]);

  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!playing) return;
    const letter = letters[index];
    if (letter) speakText(letter);
    timerRef.current = setTimeout(() => {
      if (index + 1 >= letters.length) {
        setPlaying(false);
        setIndex(0);
      } else {
        setIndex((i) => i + 1);
      }
    }, LETTER_INTERVAL_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, index]);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const togglePlay = () => setPlaying((p) => !p);
  const restart = () => {
    setIndex(0);
    setPlaying(true);
  };
  const jumpTo = (i: number) => {
    setIndex(i);
    const letter = letters[i];
    if (letter) speakText(letter);
  };

  return (
    <ThemedScreen
      title={strings.karaokeName}
      onBack={onExit}
      className="minigame-themed karaoke-themed"
      headerRight={<span className="minigame-meta">{index + 1} / {letters.length}</span>}
    >
      <div className="karaoke-grid">
        {letters.map((letter, i) => {
          const isCurrent = i === index;
          const isDone = i < index;
          return (
            <button
              key={`${i}-${letter}`}
              className={`karaoke-card ${isDone ? 'done' : ''} ${isCurrent ? 'current' : ''}`}
              onClick={() => jumpTo(i)}
              aria-label={letter}
              aria-current={isCurrent ? 'true' : undefined}
            >
              <span>{letter}</span>
            </button>
          );
        })}
      </div>

      <div className="karaoke-controls">
        <button className="btn primary" onClick={togglePlay}>
          {playing ? strings.karaokePause : strings.karaokePlay}
        </button>
        <button className="btn ghost" onClick={restart}>
          {strings.karaokeRestart}
        </button>
      </div>
    </ThemedScreen>
  );
}
