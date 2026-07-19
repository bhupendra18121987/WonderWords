import { useCallback, useEffect, useRef, useState } from 'react';

interface SpeakOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  /** If false, don't cancel currently queued utterances. */
  interrupt?: boolean;
  /** BCP-47 tag e.g. "en-US" or "hi-IN". Overrides the hook's default. */
  lang?: string;
}

interface UseSpeechOptions {
  enabled?: boolean;
  rate?: number;
  pitch?: number;
  /** Preferred BCP-47 language tag. When set, we pick a matching voice. */
  lang?: string;
}

interface UseSpeechResult {
  speak: (text: string, opts?: SpeakOptions) => void;
  cancel: () => void;
  supported: boolean;
  voices: SpeechSynthesisVoice[];
  voice: SpeechSynthesisVoice | null;
  /** True if the OS/browser has a voice matching the requested `lang`. */
  hasMatchingVoice: boolean;
}

function langPrefixOf(lang: string): string {
  return (lang.split('-')[0] ?? lang).toLowerCase();
}

function findVoiceForLang(
  voices: SpeechSynthesisVoice[],
  lang: string
): SpeechSynthesisVoice | null {
  if (!voices.length) return null;
  const wanted = lang.toLowerCase();
  const prefix = langPrefixOf(lang);
  return (
    voices.find((v) => v.lang && v.lang.toLowerCase() === wanted) ||
    voices.find((v) => v.lang && v.lang.toLowerCase().startsWith(prefix)) ||
    null
  );
}

/**
 * Build a Google Translate TTS URL. This is an unofficial endpoint that
 * has been stable for years and is commonly used by free educational apps
 * as a Hindi (and other non-English) speech fallback when the OS lacks a
 * matching local voice. Response is a short MP3 that can be played via
 * an <audio> element without CORS headers.
 */
function googleTtsUrl(text: string, lang: string): string {
  const prefix = langPrefixOf(lang);
  return (
    'https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob' +
    `&q=${encodeURIComponent(text)}` +
    `&tl=${encodeURIComponent(prefix)}`
  );
}

/**
 * Web adapter around SpeechSynthesis with a network-backed fallback for
 * languages the OS doesn't have a voice for (typically Hindi on Windows
 * without the Language Pack).
 *
 *   1. Try Web Speech API + matching local voice   (best: fast + offline)
 *   2. Fall back to Google Translate TTS via <audio>  (network required)
 *
 * Mobile will implement the same shape using `expo-speech` (which uses
 * the OS TTS engine — same story, same fallback strategy if needed).
 */
export default function useSpeech({
  enabled = true,
  rate = 0.95,
  pitch = 1.15,
  lang = 'en-US'
}: UseSpeechOptions = {}): UseSpeechResult {
  const supportedRef = useRef<boolean>(
    typeof window !== 'undefined' && 'speechSynthesis' in window
  );
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [hasMatchingVoice, setHasMatchingVoice] = useState(false);
  const warnedRef = useRef<Set<string>>(new Set());
  // Audio element used by the network-fallback path. Kept in a ref so we
  // can pause/reset it before starting a new one (so overlapping taps
  // don't stack sounds).
  const fallbackAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!supportedRef.current) return;
    const loadVoices = () => {
      const list = window.speechSynthesis.getVoices();
      setVoices(list);
      const matched = findVoiceForLang(list, lang);
      setHasMatchingVoice(!!matched);
      if (matched) {
        setVoice(matched);
      } else {
        setVoice(null);
        if (list.length > 0 && !warnedRef.current.has(lang)) {
          warnedRef.current.add(lang);
          // eslint-disable-next-line no-console
          console.info(
            `[WonderWords] No installed voice for "${lang}" — using ` +
              `Google Translate TTS fallback. For fully offline speech, ` +
              `install the language pack for ${lang} on your OS.`
          );
        }
      }
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      if (window.speechSynthesis) window.speechSynthesis.onvoiceschanged = null;
    };
  }, [lang]);

  /** Play an MP3 from a URL as the speech fallback. */
  const speakViaAudio = useCallback(
    (text: string, targetLang: string, opts: SpeakOptions) => {
      try {
        // Stop the previous audio so a rapid tap doesn't stack sounds.
        if (fallbackAudioRef.current) {
          fallbackAudioRef.current.pause();
          fallbackAudioRef.current.src = '';
        }
        const audio = new Audio(googleTtsUrl(text, targetLang));
        audio.volume = opts.volume ?? 1;
        // Slight slowdown for kids; playbackRate 1 is default.
        audio.playbackRate = opts.rate ?? rate;
        audio.play().catch((err) => {
          // eslint-disable-next-line no-console
          console.warn(
            `[WonderWords] Fallback TTS failed for "${text}" (${targetLang}):`,
            err
          );
        });
        fallbackAudioRef.current = audio;
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn('[WonderWords] Fallback TTS error:', err);
      }
    },
    [rate]
  );

  const speak = useCallback(
    (text: string, opts: SpeakOptions = {}) => {
      if (!enabled || !text) return;
      const effectiveLang = opts.lang ?? lang;

      // Check for a matching OS voice at speak-time (not just on mount) —
      // some browsers finish loading voices after the initial render.
      const list = supportedRef.current
        ? window.speechSynthesis.getVoices()
        : [];
      const localVoice = findVoiceForLang(list, effectiveLang);

      if (localVoice && supportedRef.current) {
        // ─── Preferred path: use the OS voice via Web Speech API ───
        try {
          if (opts.interrupt !== false) {
            window.speechSynthesis.cancel();
          }
          // Also stop any pending fallback audio so we don't overlap.
          if (fallbackAudioRef.current) {
            fallbackAudioRef.current.pause();
          }
          const utter = new SpeechSynthesisUtterance(String(text));
          utter.rate = opts.rate ?? rate;
          utter.pitch = opts.pitch ?? pitch;
          utter.volume = opts.volume ?? 1;
          utter.lang = effectiveLang;
          utter.voice = localVoice;
          window.speechSynthesis.speak(utter);
        } catch {
          // If Web Speech throws for any reason, fall through to fallback.
          speakViaAudio(text, effectiveLang, opts);
        }
        return;
      }

      // ─── Fallback path: Google Translate TTS via <audio> ───
      if (opts.interrupt !== false && supportedRef.current) {
        // Also stop any queued Web Speech utterances so they don't fire
        // after the fallback.
        window.speechSynthesis.cancel();
      }
      speakViaAudio(text, effectiveLang, opts);
    },
    [enabled, rate, pitch, lang, speakViaAudio]
  );

  const cancel = useCallback(() => {
    if (supportedRef.current) window.speechSynthesis.cancel();
    if (fallbackAudioRef.current) {
      fallbackAudioRef.current.pause();
      fallbackAudioRef.current.src = '';
      fallbackAudioRef.current = null;
    }
  }, []);

  useEffect(() => () => cancel(), [cancel]);

  return {
    speak,
    cancel,
    supported: supportedRef.current,
    voices,
    voice,
    hasMatchingVoice
  };
}
