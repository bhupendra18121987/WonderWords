import { useCallback, useEffect, useMemo, useState } from 'react';
import SplashScreen from './components/SplashScreen';
import LanguageSelect from './components/LanguageSelect';
import AgeSelect from './components/AgeSelect';
import HomeScreen from './components/HomeScreen';
import WordSearchGame from './components/WordSearchGame';
import WordReview from './components/WordReview';
import AlphabetScreen from './components/AlphabetScreen';
import TicTacToeGame from './components/TicTacToeGame';
import Onboarding from './components/Onboarding';
import SettingsPanel from './components/SettingsPanel';
import ConfirmDialog from './components/ConfirmDialog';
import BottomNav from './components/BottomNav';
import Mascot from './components/Mascot';
import useLocalStorage from './hooks/useLocalStorage';
import useSpeech from './hooks/useSpeech';
import useSound from './hooks/useSound';
import {
  DEFAULT_PROGRESS,
  DEFAULT_SETTINGS,
  STORAGE_KEYS
} from './core/constants';
import { resetScoresOnly, restartAtLevelOne, sanitizeProgress } from './core/gameLogic';
import { isVowelForLang } from './core/languages';
import { getLanguageConfig } from './core/languages';
import { t } from './core/i18n';
import type { AgeGroupKey, Language, LearnedWord, Progress, Settings } from './core/types';

type Screen =
  | 'splash'
  | 'languageSelect'
  | 'ageSelect'
  | 'home'
  | 'game'
  | 'review'
  | 'alphabet'
  | 'tictactoe';

export default function App() {
  // Persisted settings might be from an older release missing newer fields
  // (e.g. `announceLetterType`, `highlightVowels`). We merge them with
  // DEFAULT_SETTINGS on every read so the app never sees undefined toggles.
  const [rawSettings, setRawSettings] = useLocalStorage<Partial<Settings>>(
    STORAGE_KEYS.settings,
    DEFAULT_SETTINGS
  );
  const settings = useMemo<Settings>(
    () => ({ ...DEFAULT_SETTINGS, ...rawSettings }),
    [rawSettings]
  );
  const setSettings = useCallback(
    (next: Settings | ((prev: Settings) => Settings)) => {
      setRawSettings((prev) => {
        const merged: Settings = { ...DEFAULT_SETTINGS, ...prev };
        return typeof next === 'function'
          ? (next as (p: Settings) => Settings)(merged)
          : next;
      });
    },
    [setRawSettings]
  );

  const [ageGroup, setAgeGroup] = useLocalStorage<AgeGroupKey | null>(
    STORAGE_KEYS.ageGroup,
    null
  );
  const [progress, setProgress, resetProgress] = useLocalStorage<Progress>(
    STORAGE_KEYS.progress,
    DEFAULT_PROGRESS
  );
  const [seenOnboarding, setSeenOnboarding] = useLocalStorage<boolean>(
    STORAGE_KEYS.seenOnboarding,
    false
  );
  // Only true after the child (or parent) has completed the splash →
  // language → age wizard. Kept separate from `ageGroup` so users who
  // already had an ageGroup set from a previous release still get to see
  // the new wizard once.
  const [setupComplete, setSetupComplete] = useLocalStorage<boolean>(
    STORAGE_KEYS.setupComplete,
    false
  );

  const [pendingAge, setPendingAge] = useState<AgeGroupKey | null>(ageGroup);
  const [pendingLang, setPendingLang] = useState<Language | null>(
    ageGroup ? settings.language : null
  );
  // Every launch starts on the splash — the tap also unlocks audio autoplay.
  const [screen, setScreen] = useState<Screen>('splash');
  const [showSettings, setShowSettings] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [mascotMessage, setMascotMessage] = useState<string>('Hi! Ready to play?');

  // A single ConfirmDialog is used for the reset / restart actions so kids
  // never see the flat OS `window.confirm` popup.
  type ConfirmAction = 'resetAll' | 'resetScores' | 'restartLevel';
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);

  const langCfg = getLanguageConfig(settings.language);
  const strings = t(settings.language);

  const { speak, hasMatchingVoice } = useSpeech({ enabled: settings.sound, lang: langCfg.bcp47 });
  const { playSuccess, playCelebration, playError, playBlip } = useSound({
    enabled: settings.sound,
    musicEnabled: settings.music
  });

  useEffect(() => {
    if (!seenOnboarding && ageGroup && setupComplete && screen === 'home') setShowOnboarding(true);
  }, [seenOnboarding, ageGroup, setupComplete, screen]);

  // One-time cleanup: silently repair impossibly-inflated stored values
  // (e.g. stars far greater than could ever be earned) that leaked in from
  // an earlier version of the completion effect. Runs only when the stored
  // value actually needs correcting.
  useEffect(() => {
    const clean = sanitizeProgress(progress);
    if (clean !== progress) setProgress(clean);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectAge = (key: AgeGroupKey) => {
    setPendingAge(key);
    playBlip();
  };

  const handleSelectLanguage = (lang: Language) => {
    setPendingLang(lang);
    // Apply immediately so the very next screen (age select) can already
    // render in the chosen language.
    setSettings((s) => ({ ...s, language: lang }));
    playBlip();
  };

  /** Called from the splash — either enter the setup wizard or jump home. */
  const handleSplashStart = () => {
    playBlip();
    if (!setupComplete) {
      setPendingLang(settings.language);
      setScreen('languageSelect');
    } else {
      setScreen('home');
    }
  };

  const handleStart = () => {
    if (!pendingAge) return;
    setAgeGroup(pendingAge);
    setSetupComplete(true);
    setScreen('home');
    if (!seenOnboarding) setShowOnboarding(true);
  };

  const handlePlay = () => {
    setScreen('game');
    setMascotMessage(strings.letsFind);
  };

  const handleExitGame = () => setScreen('home');

  const handleProgressUpdate = useCallback(
    (next: Progress) => setProgress(next),
    [setProgress]
  );

  const handleResetProgress = () => setConfirmAction('resetAll');
  const handleResetScores = () => setConfirmAction('resetScores');
  const handleRestartFromLevelOne = () => setConfirmAction('restartLevel');

  const confirmActionConfig: Record<ConfirmAction, {
    emoji: string;
    title: string;
    message: string;
    confirmLabel: string;
    tone?: 'primary' | 'danger';
    run: () => void;
  }> = {
    resetAll: {
      emoji: '🧹',
      title: 'Start completely fresh?',
      message: 'This will erase your stars, badges, learned words — everything.',
      confirmLabel: 'Yes, reset all',
      tone: 'danger',
      run: () => {
        resetProgress();
        setSetupComplete(false);
        setSeenOnboarding(false);
        setAgeGroup(null);
        setShowSettings(false);
        setScreen('splash');
      }
    },
    resetScores: {
      emoji: '⭐',
      title: 'Reset your scores?',
      message: 'Your stars and level will go back to 0. Your learned words and badges stay safe!',
      confirmLabel: 'Yes, reset scores',
      run: () => { setProgress((p) => resetScoresOnly(p)); setShowSettings(false); }
    },
    restartLevel: {
      emoji: '🔄',
      title: 'Start again from Level 1?',
      message: 'Your stars, badges and learned words will stay — only the level goes back to 1.',
      confirmLabel: 'Yes, restart',
      run: () => setProgress((p) => restartAtLevelOne(p))
    }
  };

  const speakLetter = useCallback(
    (letter: string) => {
      if (!letter) return;
      speak(letter, { rate: 0.9, pitch: 1.2, interrupt: true });
      if (settings.announceLetterType) {
        // Queue the type label right after the letter so it plays naturally.
        const label = isVowelForLang(letter, settings.language)
          ? langCfg.vowelLabel
          : langCfg.consonantLabel;
        speak(label, { rate: 0.9, pitch: 1.15, interrupt: false });
      }
    },
    [speak, settings.announceLetterType, settings.language, langCfg]
  );

  const speakText = useCallback(
    (text: string) => {
      if (!text) return;
      speak(text, { rate: 0.9, pitch: 1.15 });
    },
    [speak]
  );

  const speakLearned = (w: LearnedWord) => speakText(`${w.word}. ${w.meaning}`);

  const learnedWords = progress.learnedWords;

  // Splash and the setup-wizard steps are chrome-free — no top bar, no
  // bottom nav, no mascot. Once the child lands on Home the full shell
  // shows up.
  const isImmersive = screen === 'splash' || (screen === 'languageSelect' && !setupComplete) || (screen === 'ageSelect' && !setupComplete);

  return (
    <div className={`app ${settings.highContrast ? 'high-contrast' : ''} ${isImmersive ? 'app-immersive' : ''}`}>
      {!isImmersive && (
        <header className="top-bar">
          <div
            className="brand"
            onClick={() => setScreen(ageGroup ? 'home' : 'ageSelect')}
            role="button"
            tabIndex={0}
          >
            <span className="logo" aria-hidden="true">W</span>
            <span>WonderWords</span>
          </div>
          <div className="spacer" />
          <button
            className={`icon-btn ${settings.sound ? 'active' : ''}`}
            onClick={() => setSettings((s) => ({ ...s, sound: !s.sound }))}
            aria-label={settings.sound ? 'Mute sound' : 'Unmute sound'}
            title="Sound"
          >
            {settings.sound ? '🔊' : '🔇'}
          </button>
          <button
            className={`icon-btn ${settings.music ? 'active' : ''}`}
            onClick={() => setSettings((s) => ({ ...s, music: !s.music }))}
            aria-label={settings.music ? 'Stop music' : 'Play music'}
            title="Music"
          >
            🎵
          </button>
        </header>
      )}

      {screen === 'splash' && (
        <SplashScreen onStart={handleSplashStart} />
      )}

      {screen === 'languageSelect' && (
        <LanguageSelect
          selected={pendingLang}
          step={!setupComplete ? { current: 1, total: 2 } : undefined}
          onSelect={handleSelectLanguage}
          onNext={() => {
            // If we're in the setup wizard, continue to age select.
            // Otherwise (accessed later somehow), go back home.
            if (!setupComplete) setScreen('ageSelect');
            else setScreen('home');
          }}
        />
      )}

      {screen === 'ageSelect' && (
        <AgeSelect
          selected={pendingAge}
          language={settings.language}
          step={!setupComplete ? { current: 2, total: 2 } : undefined}
          onSelect={handleSelectAge}
          onStart={handleStart}
        />
      )}

      {screen === 'home' && ageGroup && (
        <HomeScreen
          ageGroup={ageGroup}
          progress={progress}
          language={settings.language}
          onPlay={handlePlay}
          onReview={() => setScreen('review')}
          onAlphabet={() => setScreen('alphabet')}
          onTicTacToe={() => setScreen('tictactoe')}
          onChangeAge={() => setScreen('ageSelect')}
          onOnboarding={() => setShowOnboarding(true)}
          onRestartLevel={handleRestartFromLevelOne}
        />
      )}

      {screen === 'game' && ageGroup && (
        <WordSearchGame
          ageGroup={ageGroup}
          level={progress.level}
          language={settings.language}
          settings={settings}
          progress={progress}
          onProgressUpdate={handleProgressUpdate}
          onExit={handleExitGame}
          onSpeakLetter={speakLetter}
          onSpeakText={speakText}
          onPlaySuccess={playSuccess}
          onPlayCelebration={playCelebration}
          onPlayError={playError}
          onSetMascotMessage={setMascotMessage}
        />
      )}

      {screen === 'review' && (
        <WordReview
          learnedWords={learnedWords}
          onBack={() => setScreen('home')}
          onSpeak={speakLearned}
        />
      )}

      {screen === 'alphabet' && (
        <AlphabetScreen
          language={settings.language}
          onBack={() => setScreen(ageGroup ? 'home' : 'ageSelect')}
          onSpeak={(letter, type) => {
            speak(letter, { rate: 0.9, pitch: 1.2, interrupt: true });
            speak(type, { rate: 0.9, pitch: 1.15, interrupt: false });
          }}
        />
      )}

      {screen === 'tictactoe' && ageGroup && (
        <TicTacToeGame
          ageGroup={ageGroup}
          language={settings.language}
          onExit={() => setScreen('home')}
          onSpeakText={speakText}
          onPlaySuccess={playSuccess}
          onPlayCelebration={playCelebration}
          onPlayError={playError}
          onSetMascotMessage={setMascotMessage}
        />
      )}

      {showOnboarding && (
        <Onboarding
          language={settings.language}
          onDone={() => {
            setShowOnboarding(false);
            setSeenOnboarding(true);
          }}
        />
      )}

      {showSettings && (
        <SettingsPanel
          settings={settings}
          onChange={setSettings}
          onClose={() => setShowSettings(false)}
          onReset={handleResetProgress}
          onResetScores={handleResetScores}
          hasMatchingVoice={hasMatchingVoice}
        />
      )}

      {confirmAction && (
        <ConfirmDialog
          open
          emoji={confirmActionConfig[confirmAction].emoji}
          title={confirmActionConfig[confirmAction].title}
          message={confirmActionConfig[confirmAction].message}
          confirmLabel={confirmActionConfig[confirmAction].confirmLabel}
          tone={confirmActionConfig[confirmAction].tone}
          onConfirm={() => {
            confirmActionConfig[confirmAction].run();
            setConfirmAction(null);
          }}
          onCancel={() => setConfirmAction(null)}
        />
      )}

      {!isImmersive && <Mascot face="🦉" message={mascotMessage} />}

      {ageGroup && !isImmersive && screen !== 'ageSelect' && (
        <BottomNav
          active={screen === 'game' ? 'game' : screen === 'review' ? 'review' : screen === 'alphabet' ? 'alphabet' : 'home'}
          language={settings.language}
          learnedCount={progress.learnedWords.length}
          onNavigate={(target) => {
            if (target === 'game') {
              handlePlay();
            } else {
              setScreen(target);
            }
          }}
          onOpenSettings={() => setShowSettings(true)}
        />
      )}
    </div>
  );
}
