import { useEffect, useMemo, useState } from 'react';
import { t } from '../core/i18n';
import ThemedScreen from './ThemedScreen';
import Celebration from './Celebration';
import type { AgeGroupKey, Language } from '../core/types';
import { shuffleInPlace } from '../core/miniGames';
import { pickPairsForAge, type AntonymPair } from '../core/data/antonyms';

interface AntonymPairsGameProps {
  ageGroup: AgeGroupKey;
  language: Language;
  onExit: () => void;
  speakText: (text: string) => void;
}

interface Card {
  cardId: string;
  pairId: string;
  label: string;
  emoji?: string;
}

function buildDeck(pairs: AntonymPair[], lang: Language): Card[] {
  const cards: Card[] = [];
  pairs.forEach((p) => {
    const [a, b] = p.labels[lang];
    const [ea, eb] = p.emoji ?? [undefined, undefined];
    cards.push({ cardId: `${p.id}-0`, pairId: p.id, label: a, emoji: ea });
    cards.push({ cardId: `${p.id}-1`, pairId: p.id, label: b, emoji: eb });
  });
  return shuffleInPlace(cards);
}

export default function AntonymPairsGame({
  ageGroup,
  language,
  onExit,
  speakText
}: AntonymPairsGameProps) {
  const strings = t(language);
  const initialPairs = useMemo(() => pickPairsForAge(ageGroup), [ageGroup]);
  const initialDeck = useMemo(
    () => buildDeck(initialPairs, language),
    [initialPairs, language]
  );

  const [deck, setDeck] = useState<Card[]>(initialDeck);
  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [wrongPair, setWrongPair] = useState<string[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (matched.size === initialPairs.length && initialPairs.length > 0) {
      setDone(true);
      speakText(strings.correctFeedback);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matched]);

  const isFaceUp = (card: Card) =>
    matched.has(card.pairId) ||
    flipped.includes(card.cardId) ||
    wrongPair.includes(card.cardId);

  const handleTap = (card: Card) => {
    if (matched.has(card.pairId)) return;
    if (flipped.includes(card.cardId)) return;
    if (wrongPair.length > 0) return;
    speakText(card.label);

    if (flipped.length === 0) {
      setFlipped([card.cardId]);
      return;
    }
    const firstId = flipped[0]!;
    const firstCard = deck.find((c) => c.cardId === firstId);
    setAttempts((a) => a + 1);
    if (firstCard && firstCard.pairId === card.pairId && firstCard.cardId !== card.cardId) {
      setFlipped([]);
      setMatched((m) => new Set(m).add(card.pairId));
    } else {
      setWrongPair([firstId, card.cardId]);
      setFlipped([]);
      setTimeout(() => setWrongPair([]), 900);
    }
  };

  const restart = () => {
    const nextPairs = pickPairsForAge(ageGroup);
    setDeck(buildDeck(nextPairs, language));
    setFlipped([]);
    setMatched(new Set());
    setWrongPair([]);
    setAttempts(0);
    setDone(false);
  };

  if (done) {
    const perfect = attempts <= initialPairs.length * 2;
    return (
      <Celebration
        praise={strings.correctFeedback}
        stars={perfect ? 3 : attempts <= initialPairs.length * 3 ? 2 : 1}
        wordsFound={initialPairs.length}
        pointsEarned={initialPairs.length * 10}
        coinsEarned={initialPairs.length * 4}
        nextLabel={strings.playAgain}
        onNext={restart}
        onHome={onExit}
      />
    );
  }

  return (
    <ThemedScreen
      title={strings.antonymName}
      onBack={onExit}
      className="minigame-themed"
      headerRight={<span className="minigame-meta">{matched.size} / {initialPairs.length}</span>}
    >
      <p className="antonym-prompt">{strings.antonymPrompt}</p>

      <div className="antonym-grid">
        {deck.map((card) => {
          const faceUp = isFaceUp(card);
          const isMatched = matched.has(card.pairId);
          const isWrong = wrongPair.includes(card.cardId);
          return (
            <button
              key={card.cardId}
              className={`antonym-card ${faceUp ? 'face' : ''} ${isMatched ? 'matched' : ''} ${isWrong ? 'wrong' : ''}`}
              onClick={() => handleTap(card)}
              aria-label={faceUp ? card.label : 'hidden card'}
            >
              {faceUp ? (
                <>
                  {card.emoji && <span className="antonym-emoji" aria-hidden="true">{card.emoji}</span>}
                  <span className="antonym-text">{card.label}</span>
                </>
              ) : (
                <span className="antonym-back">?</span>
              )}
            </button>
          );
        })}
      </div>
    </ThemedScreen>
  );
}
