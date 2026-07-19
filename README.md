# WonderWords 🌟

An interactive **word search learning application** for children aged **3–8**, built with React + TypeScript + Vite. WonderWords uses colorful visuals, animations, and text-to-speech to help young learners with vocabulary, letter recognition, and word association.

The project is structured so that a future **React Native mobile app** can reuse all game logic, types, data, and rules without duplication.

## ✨ Features

- **Age-appropriate puzzles** — pick 3–4, 5–6, or 7–8 to get the right grid size, word length, and directions (older kids also get diagonals).
- **Drag-to-select** on mouse *and* touch (tablets & phones).
- **Letter pronunciation** as the child drags across cells (Web Speech API).
- **Word pronunciation + meaning reveal** with an animated emoji and a child-friendly explanation.
- **Celebrations** with confetti, praise voice-over, and star awards.
- **Progression** across levels — grid grows and more words are added.
- **Progress tracking** stored in `localStorage` (no database): stars, level, puzzles completed, learned words, badges.
- **Word review** — revisit every word learned and hear it again.
- **Badges** for milestones (first word, 5 puzzles, streaks, etc.).
- **Onboarding tour** for first-time users.
- **Friendly mascot** (Ollie the Owl) that reacts to your play.
- **Settings**: sound on/off, background music, letter speech, reset progress.
- **Accessibility**: keyboard navigation, ARIA labels, large touch targets, reduced-motion support.
- **Data-driven** — words, categories, and age mappings live in [src/core/data/words.json](src/core/data/words.json).

## 🧰 Tech Stack

- **React 18 + TypeScript** (strict mode) + **Vite**
- **Framer Motion** — animations (web)
- **canvas-confetti** — celebration bursts (web)
- **Web Speech API** — text-to-speech (web)
- **Web Audio API** — lightweight tone-based sound effects (web, no audio files)
- **LocalStorage** — persistent progress (web)

## 🚀 Getting Started

```bash
npm install
npm run dev        # start Vite dev server
npm run typecheck  # tsc --noEmit
npm run build      # typecheck + production build
npm run preview    # preview production build
```

## 🗂 Project Structure

```
src/
├── core/                       # SHARED with mobile — pure TS, no DOM/RN APIs
│   ├── types.ts                # AgeGroup, Progress, Settings, Puzzle, Cell, …
│   ├── constants.ts            # DEFAULT_SETTINGS, DEFAULT_PROGRESS, STORAGE_KEYS
│   ├── data.ts                 # Typed re-exports of the JSON bundles
│   ├── data/
│   │   ├── words.json          # Word bank keyed by age + category
│   │   └── rewards.json        # Praise phrases + badge catalog
│   ├── puzzleGenerator.ts      # generatePuzzle, readSelection, lineBetween,
│   │                           # selectWordsForLevel, buildPuzzleForLevel
│   ├── gameLogic.ts            # computeStars, computeBadges,
│   │                           # progressAfterPuzzle, pickPraise/Encouragement
│   └── index.ts                # barrel export
│
├── hooks/                      # Web adapters (mobile provides RN equivalents)
│   ├── useLocalStorage.ts      # → AsyncStorage on RN
│   ├── useSpeech.ts            # → expo-speech / react-native-tts on RN
│   └── useSound.ts             # → expo-av on RN
│
├── components/                 # Web-only React DOM UI
│   ├── AgeSelect.tsx           # first-run age picker
│   ├── HomeScreen.tsx          # dashboard with stats & badges
│   ├── WordSearchGame.tsx      # main puzzle screen (uses core game logic)
│   ├── Grid.tsx                # drag-selectable puzzle grid
│   ├── WordList.tsx            # words-to-find chips
│   ├── WordReveal.tsx          # post-find popup with meaning
│   ├── Celebration.tsx         # end-of-puzzle celebration (confetti)
│   ├── Mascot.tsx              # bouncing owl mascot
│   ├── Onboarding.tsx          # first-run tutorial
│   ├── SettingsPanel.tsx       # sound / music / reset
│   └── WordReview.tsx          # revisit learned words
│
├── styles/global.css           # theme, layout, animations
├── App.tsx                     # top-level screen router & state wiring
└── main.tsx                    # React entry point
```

### The rule of thumb

> **`src/core/` is portable. Everything else is platform-specific.**

- `core/` never imports React, framer-motion, canvas-confetti, DOM APIs, `window`, `localStorage`, or `SpeechSynthesis`. It's plain TypeScript.
- `hooks/` and `components/` are the **web adapters + web UI**. The mobile app will implement its own equivalents with the same signatures.

## 📱 Sharing with the Future Mobile App

Two recommended strategies — pick one when the mobile project starts:

### Option A — Monorepo (recommended)

Move `src/core/` up into a shared workspace package (`packages/core`) and consume it from both:

```
packages/
├── core/             ← src/core moves here (published as @wonderwords/core)
├── web/              ← this Vite app, depends on @wonderwords/core
└── mobile/           ← new Expo / React Native app, depends on @wonderwords/core
```

Both apps `import { buildPuzzleForLevel, progressAfterPuzzle, wordsData } from '@wonderwords/core'`. Adding a word or tweaking a rule updates both apps at once.

### Option B — Git submodule / internal npm package

Keep `src/core/` where it is and publish it as an internal npm package (or reference it via a git submodule). Same import pattern.

### On mobile, provide platform adapters with the same hook signatures

| Web hook (this repo)        | React Native equivalent                                         |
| --------------------------- | --------------------------------------------------------------- |
| `useLocalStorage`           | `@react-native-async-storage/async-storage`                     |
| `useSpeech`                 | `expo-speech` (or `react-native-tts`)                           |
| `useSound`                  | `expo-av` (or `react-native-sound`)                             |
| `framer-motion`             | `moti` / `react-native-reanimated`                              |
| `canvas-confetti`           | `react-native-confetti-cannon`                                  |
| DOM `<Grid>` w/ pointer     | RN `View` + `PanResponder` (or Reanimated `Gesture.Pan()`)      |

The **types, data, puzzle generation, word selection, star/badge/progress rules, praise phrases** — all reused unchanged.

## ➕ Adding More Words

Edit [src/core/data/words.json](src/core/data/words.json):

```json
{
  "word": "APPLE",
  "category": "Fruits",
  "ageGroups": ["5-6", "7-8"],
  "emoji": "🍎",
  "meaning": "An apple is a sweet crunchy fruit."
}
```

Age-group tuning (grid size, word length range, allowed directions) lives in the `ageGroups` block at the top of the same file.

## 🔒 Privacy

WonderWords stores **no data on any server**. All progress lives in the browser's `localStorage` on this device. The mobile app will use device-local `AsyncStorage`.

## 📱 Works on

- Desktop browsers (Chrome, Edge, Firefox, Safari)
- Tablets & phones (touch drag supported)
- iOS & Android (via the future React Native app sharing `core/`)

## 🧭 Ideas for Next Steps

- Convert web to a **PWA** for offline installability
- **Daily Challenge** puzzle (deterministic seed per date — belongs in `core/`)
- Optional theme picker (jungle, ocean, space) unlocked by badges
- Parent dashboard showing weekly learning stats
- Import custom word packs from JSON files
"# WonderWords" 
