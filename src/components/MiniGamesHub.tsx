import { t } from '../core/i18n';
import type { Language } from '../core/types';
import PandaIllustration from './PandaIllustration';
import ThemedScreen from './ThemedScreen';

export type MiniGameId =
  | 'letterHunt'
  | 'tapColor'
  | 'missingLetter'
  | 'antonymPairs'
  | 'karaoke'
  | 'twoPlayer'
  | 'trace'
  | 'tictactoe';

interface MiniGamesHubProps {
  language: Language;
  onBack: () => void;
  onPick: (id: MiniGameId) => void;
  enabled: Record<MiniGameId, boolean>;
  lastPlayed?: MiniGameId | null;
}

interface TileDef {
  id: MiniGameId;
  emoji: string;
  tint: string;
  nameKey?: 'letterHuntName' | 'tapColorName' | 'missingLetterName' | 'antonymName' | 'karaokeName' | 'twoPlayerName' | 'traceName' | 'ticTacToeName';
  subKey?: 'letterHuntSub' | 'tapColorSub' | 'missingLetterSub' | 'antonymSub' | 'karaokeSub' | 'twoPlayerSub' | 'traceSub' | 'ticTacToeSub';
  fallbackName?: string;
}

const TILES: TileDef[] = [
  { id: 'letterHunt',    emoji: '🔤', tint: 'tint-coral',    nameKey: 'letterHuntName',    subKey: 'letterHuntSub' },
  { id: 'tapColor',      emoji: '🎨', tint: 'tint-teal',     nameKey: 'tapColorName',      subKey: 'tapColorSub' },
  { id: 'missingLetter', emoji: '✏️', tint: 'tint-mint',     nameKey: 'missingLetterName', subKey: 'missingLetterSub' },
  { id: 'antonymPairs',  emoji: '🔁', tint: 'tint-lavender', nameKey: 'antonymName',       subKey: 'antonymSub' },
  { id: 'karaoke',       emoji: '🎤', tint: 'tint-yellow',   nameKey: 'karaokeName',       subKey: 'karaokeSub' },
  { id: 'twoPlayer',     emoji: '🤝', tint: 'tint-yellow',   nameKey: 'twoPlayerName',     subKey: 'twoPlayerSub' },
  { id: 'trace',         emoji: '✍️', tint: 'tint-mint',     nameKey: 'traceName',         subKey: 'traceSub' },
  { id: 'tictactoe',     emoji: '⭕', tint: 'tint-coral',    nameKey: 'ticTacToeName',     subKey: 'ticTacToeSub' }
];

export default function MiniGamesHub({ language, onBack, onPick, enabled, lastPlayed }: MiniGamesHubProps) {
  const strings = t(language);
  return (
    <ThemedScreen
      title={strings.miniGamesTitle.replace(/^[\p{Emoji}\s]+/u, '')}
      titleIcon={<PandaIllustration size={32} />}
      onBack={onBack}
      className="minigames-themed"
    >
      <div className="mini-map">
        <div className="mini-map-line" aria-hidden="true" />
        {TILES.map((tile, idx) => {
          const isOn = enabled[tile.id];
          const isLast = lastPlayed === tile.id;
          const name = tile.nameKey ? strings[tile.nameKey] : (tile.fallbackName ?? '');
          const sub = tile.subKey ? strings[tile.subKey] : strings.comingSoon;
          const right = idx % 2 === 1;
          return (
            <div key={tile.id} className={`mini-node ${right ? 'right' : ''}`}>
              <span className={`mini-dot ${isOn ? 'on' : 'off'}`} aria-hidden="true" />
              <button
                className={`mini-card ${tile.tint} ${isLast ? 'last' : ''}`}
                onClick={() => isOn && onPick(tile.id)}
                disabled={!isOn}
                aria-label={name}
                title={sub}
              >
                <span className="icon" aria-hidden="true">{tile.emoji}</span>
                <span className="copy">
                  <span className="name">{name}</span>
                </span>
                {isLast && <span className="badge">LAST</span>}
                {!isOn && <span className="badge muted">{strings.comingSoon}</span>}
              </button>
            </div>
          );
        })}
      </div>
    </ThemedScreen>
  );
}
