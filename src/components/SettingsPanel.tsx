import type { Settings, Language } from '../core/types';
import { LANGUAGE_CONFIG } from '../core/languages';

interface SettingsPanelProps {
  settings: Settings;
  onChange: (next: Settings) => void;
  onClose: () => void;
  onReset: () => void;
  onResetScores: () => void;
  /** False when the OS has no installed voice for the active language. */
  hasMatchingVoice: boolean;
}

interface ToggleRowProps {
  emoji: string;
  label: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}

/**
 * Big tap-anywhere card. NOT a slider — sliders need fine motor control
 * that 3–4-year-olds don't have. A single poke anywhere on the row flips it.
 */
function ToggleRow({ emoji, label, checked, onChange }: ToggleRowProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={`${label} — ${checked ? 'on' : 'off'}, tap to change`}
      className={`toggle-row ${checked ? 'on' : 'off'}`}
      onClick={() => onChange(!checked)}
    >
      <span className="toggle-label">
        <span className="toggle-emoji" aria-hidden="true">{emoji}</span>
        {label}
      </span>
      <span className={`toggle-badge ${checked ? 'on' : 'off'}`} aria-hidden="true">
        {checked ? '✓ ON' : 'OFF'}
      </span>
    </button>
  );
}

export default function SettingsPanel({
  settings,
  onChange,
  onClose,
  onReset,
  onResetScores,
  hasMatchingVoice
}: SettingsPanelProps) {
  const update = (patch: Partial<Settings>) => onChange({ ...settings, ...patch });
  const languages = Object.entries(LANGUAGE_CONFIG) as [Language, typeof LANGUAGE_CONFIG[Language]][];
  const activeCfg = LANGUAGE_CONFIG[settings.language];
  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-label="Settings">
      <div className="modal settings-modal">
        <div className="settings-header">
          <h2>Settings</h2>
          <button
            type="button"
            className="settings-close"
            onClick={onClose}
            aria-label="Close settings"
          >
            ×
          </button>
        </div>

        <div className="settings-content">
          <div className="settings-group">
            <div className="settings-group-title">🌐 Language</div>
            <div className="settings-lang-row">
              {languages.map(([key, cfg]) => (
                <button
                  key={key}
                  type="button"
                  className={`settings-lang-btn ${settings.language === key ? 'active' : ''}`}
                  onClick={() => update({ language: key })}
                  aria-pressed={settings.language === key}
                >
                  {cfg.displayName}
                </button>
              ))}
            </div>
            {settings.sound && !hasMatchingVoice && (
              <div className="settings-voice-hint" role="note">
                🌐 No {activeCfg.displayName} voice is installed on this
                device, so we're using an <strong>online</strong> voice for
                pronunciation (needs internet). For faster, offline speech,
                install the language pack for {activeCfg.displayName} in
                your OS settings, then restart the browser.
              </div>
            )}
          </div>

          <div className="settings-group">
            <ToggleRow
              emoji="🔊"
              label="Voice & sound effects"
              checked={settings.sound}
              onChange={(v) => update({ sound: v })}
            />
            <ToggleRow
              emoji="🎵"
              label="Background music"
              checked={settings.music}
              onChange={(v) => update({ music: v })}
            />
            <ToggleRow
              emoji="🗣️"
              label="Say letters when I drag"
              checked={settings.letterSpeech}
              onChange={(v) => update({ letterSpeech: v })}
            />
            <ToggleRow
              emoji="🔤"
              label={'Announce "vowel" / "consonant"'}
              checked={settings.announceLetterType}
              onChange={(v) => update({ announceLetterType: v })}
            />
            <ToggleRow
              emoji="🌸"
              label="Highlight vowels in the puzzle"
              checked={settings.highlightVowels}
              onChange={(v) => update({ highlightVowels: v })}
            />
            <ToggleRow
              emoji="🌈"
              label="High-contrast colors"
              checked={settings.highContrast}
              onChange={(v) => update({ highContrast: v })}
            />
          </div>
        </div>

        <div className="settings-footer">
          <div className="settings-footer-row">
            <button className="btn primary" onClick={onClose}>Done</button>
            <button className="btn ghost small-btn" onClick={onResetScores}>Reset scores</button>
            <button className="btn ghost small-btn" onClick={onReset}>Reset all</button>
          </div>
          <p className="small settings-footer-hint">
            "Reset scores" keeps learned words &amp; badges. "Reset all" clears everything.
          </p>
        </div>
      </div>
    </div>
  );
}
