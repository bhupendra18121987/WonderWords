import { useCallback, useEffect, useMemo, useState } from 'react';
import SplashScreen from './components/SplashScreen';
import LanguageSelect from './components/LanguageSelect';
import AgeSelect from './components/AgeSelect';
import HomeScreen from './components/HomeScreen';
import WordSearchGame from './components/WordSearchGame';
import WordReview from './components/WordReview';
import AlphabetScreen from './components/AlphabetScreen';
import TicTacToeGame from './components/TicTacToeGame';
import MiniGamesHub, { type MiniGameId } from './components/MiniGamesHub';
import LetterHuntGame from './components/LetterHuntGame';
import TapColorGame from './components/TapColorGame';
import MissingLetterGame from './components/MissingLetterGame';
import AntonymPairsGame from './components/AntonymPairsGame';
import AlphabetKaraoke from './components/AlphabetKaraoke';
import TwoPlayerGame from './components/TwoPlayerGame';
import TraceLetterGame from './components/TraceLetterGame';
import Onboarding from './components/Onboarding';
import SettingsPanel from './components/SettingsPanel';
import ConfirmDialog from './components/ConfirmDialog';
import BottomNav from './components/BottomNav';
import TopBar from './components/TopBar';
import RewardsScreen from './components/RewardsScreen';
import ProfileScreen from './components/ProfileScreen';
import useLocalStorage from './hooks/useLocalStorage';
import useSpeech from './hooks/useSpeech';
import useSound from './hooks/useSound';
import {
  DEFAULT_PROGRESS,
  DEFAULT_SETTINGS,
  DEFAULT_PROFILE_NAME,
  DEFAULT_PROFILE_AVATAR,
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
  | 'tictactoe'
  | 'miniGames'
  | 'letterHunt'
  | 'tapColor'
  | 'missingLetter'
  | 'antonymPairs'
  | 'karaoke'
  | 'twoPlayer'
  | 'trace'
  | 'rewards'
  | 'profile';

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
  const [lastMiniGame, setLastMiniGame] =
    useLocalStorage<MiniGameId | null>('ww:lastMiniGame', null);

  const [profileName, setProfileName] = useLocalStorage<string>(
    STORAGE_KEYS.profileName,
    DEFAULT_PROFILE_NAME
  );
  const [profileAvatar, setProfileAvatar] = useLocalStorage<string>(
    STORAGE_KEYS.profileAvatar,
    DEFAULT_PROFILE_AVATAR
  );

  const [pendingAge, setPendingAge] = useState<AgeGroupKey | null>(ageGroup);
  const [pendingLang, setPendingLang] = useState<Language | null>(
    ageGroup ? settings.language : null
  );
  // Every launch starts on the splash — the tap also unlocks audio autoplay.
  const [screen, setScreen] = useState<Screen>('splash');
  // When the child taps a specific level tile on the map we play THAT level
  // rather than the default `progress.level` (which is the highest unlocked).
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [, setMascotMessage] = useState<string>('Hi! Ready to play?');

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

  const handlePlay = (level?: number) => {
    if (typeof level === 'number' && level > 0) setSelectedLevel(level);
    else setSelectedLevel(null);
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

  // Fully-immersive screens hide both the app TopBar AND the BottomNav.
  // Themed screens hide only the TopBar (they render their own purple
  // header) but keep the BottomNav for tab-switching.
  const isFullImmersive =
    screen === 'splash' ||
    screen === 'review' ||
    screen === 'game' ||
    screen === 'letterHunt' ||
    screen === 'tapColor' ||
    screen === 'missingLetter' ||
    screen === 'antonymPairs' ||
    screen === 'karaoke' ||
    screen === 'twoPlayer' ||
    screen === 'trace' ||
    screen === 'tictactoe' ||
    (screen === 'languageSelect' && !setupComplete) ||
    (screen === 'ageSelect' && !setupComplete);

  const hasThemedHeader =
    screen === 'alphabet' ||
    screen === 'miniGames' ||
    screen === 'rewards' ||
    screen === 'profile' ||
    (screen === 'ageSelect' && setupComplete);

  const hideTopBar = isFullImmersive || hasThemedHeader;
  const hideBottomNav = isFullImmersive;
  const isImmersive = isFullImmersive;

  const navActive =
    screen === 'miniGames' || screen === 'game' || screen === 'alphabet' ? 'levels' :
    screen === 'rewards' ? 'rewards' :
    screen === 'profile' ? 'profile' :
    screen === 'ageSelect' ? 'age' :
    'home';

  return (
    <div className={`app ${settings.highContrast ? 'high-contrast' : ''} ${isImmersive ? 'app-immersive' : ''}`}>
      {!hideTopBar && (
        <TopBar
          language={settings.language}
          stars={progress.stars}
          onStarsPress={() => setScreen('rewards')}
          onOpenSettings={() => setShowSettings(true)}
          onOpenTour={() => setShowOnboarding(true)}
        />
      )}

      {screen === 'splash' && (
        <SplashScreen
          onStart={handleSplashStart}
          onParents={() => setShowSettings(true)}
          onToggleSound={() => setSettings((s) => ({ ...s, music: !s.music }))}
        />
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
          onBack={setupComplete ? () => setScreen('home') : undefined}
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
          onMiniGames={() => setScreen('miniGames')}
          onChangeAge={() => setScreen('ageSelect')}
          onOnboarding={() => setShowOnboarding(true)}
          onRestartLevel={handleRestartFromLevelOne}
        />
      )}

      {screen === 'rewards' && (
        <RewardsScreen
          language={settings.language}
          progress={progress}
          onBack={() => setScreen('home')}
        />
      )}

      {screen === 'profile' && (
        <ProfileScreen
          ageGroup={ageGroup}
          language={settings.language}
          progress={progress}
          profileName={profileName}
          profileAvatar={profileAvatar}
          onBack={() => setScreen('home')}
          onChangeAge={() => setScreen('ageSelect')}
          onProfileNameChange={setProfileName}
          onProfileAvatarChange={setProfileAvatar}
        />
      )}

      {screen === 'game' && ageGroup && (
        <WordSearchGame
          ageGroup={ageGroup}
          level={selectedLevel ?? progress.level}
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
            if (settings.announceLetterType && type) {
              speak(type, { rate: 0.9, pitch: 1.15, interrupt: false });
            }
          }}
        />
      )}

      {screen === 'tictactoe' && ageGroup && (
        <TicTacToeGame
          ageGroup={ageGroup}
          language={settings.language}
          onExit={() => setScreen('miniGames')}
          onSpeakText={speakText}
          onPlaySuccess={playSuccess}
          onPlayCelebration={playCelebration}
          onPlayError={playError}
          onSetMascotMessage={setMascotMessage}
        />
      )}

      {screen === 'miniGames' && (
        <MiniGamesHub
          language={settings.language}
          lastPlayed={lastMiniGame}
          enabled={{
            letterHunt: true,
            tapColor: true,
            missingLetter: true,
            antonymPairs: true,
            karaoke: true,
            twoPlayer: true,
            trace: true,
            tictactoe: true
          }}
          onBack={() => setScreen('home')}
          onPick={(id: MiniGameId) => {
            setLastMiniGame(id);
            if (id === 'letterHunt') setScreen('letterHunt');
            else if (id === 'tapColor') setScreen('tapColor');
            else if (id === 'missingLetter') setScreen('missingLetter');
            else if (id === 'antonymPairs') setScreen('antonymPairs');
            else if (id === 'karaoke') setScreen('karaoke');
            else if (id === 'twoPlayer') setScreen('twoPlayer');
            else if (id === 'trace') setScreen('trace');
            else if (id === 'tictactoe') setScreen('tictactoe');
          }}
        />
      )}

      {screen === 'letterHunt' && ageGroup && (
        <LetterHuntGame
          ageGroup={ageGroup}
          language={settings.language}
          onExit={() => setScreen('miniGames')}
          speakText={speakText}
        />
      )}

      {screen === 'tapColor' && ageGroup && (
        <TapColorGame
          ageGroup={ageGroup}
          language={settings.language}
          onExit={() => setScreen('miniGames')}
          speakText={speakText}
        />
      )}

      {screen === 'missingLetter' && ageGroup && (
        <MissingLetterGame
          ageGroup={ageGroup}
          language={settings.language}
          onExit={() => setScreen('miniGames')}
          speakText={speakText}
        />
      )}

      {screen === 'antonymPairs' && ageGroup && (
        <AntonymPairsGame
          ageGroup={ageGroup}
          language={settings.language}
          onExit={() => setScreen('miniGames')}
          speakText={speakText}
        />
      )}

      {screen === 'karaoke' && (
        <AlphabetKaraoke
          language={settings.language}
          onExit={() => setScreen('miniGames')}
          speakText={speakText}
        />
      )}

      {screen === 'twoPlayer' && ageGroup && (
        <TwoPlayerGame
          ageGroup={ageGroup}
          language={settings.language}
          onExit={() => setScreen('miniGames')}
          speakLetter={speakLetter}
          speakText={speakText}
        />
      )}

      {screen === 'trace' && ageGroup && (
        <TraceLetterGame
          ageGroup={ageGroup}
          language={settings.language}
          onExit={() => setScreen('miniGames')}
          speakText={speakText}
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

      {ageGroup && !hideBottomNav && (screen !== 'ageSelect' || setupComplete) && (
        <BottomNav
          active={navActive}
          language={settings.language}
          onNavigate={(target) => {
            if (target === 'home') setScreen('home');
            else if (target === 'levels') setScreen('miniGames');
            else if (target === 'rewards') setScreen('rewards');
            else if (target === 'profile') setScreen('profile');
            else if (target === 'age') setScreen('ageSelect');
          }}
        />
      )}
    </div>
  );
}
