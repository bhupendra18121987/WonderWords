import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getWordsData } from '../core/data';
import { t } from '../core/i18n';
import type { AgeGroupKey, Language, Progress } from '../core/types';
import { PROFILE_AVATAR_OPTIONS } from '../core/constants';
import ThemedScreen from './ThemedScreen';

interface ProfileScreenProps {
  ageGroup: AgeGroupKey | null;
  language: Language;
  progress: Progress;
  /** Persisted profile display name (defaults to "Little Explorer"). */
  profileName: string;
  /** Persisted profile avatar emoji (defaults to "🦁"). */
  profileAvatar: string;
  onBack: () => void;
  onChangeAge: () => void;
  onProfileNameChange: (name: string) => void;
  onProfileAvatarChange: (emoji: string) => void;
}

export default function ProfileScreen({
  ageGroup,
  language,
  progress,
  profileName,
  profileAvatar,
  onBack,
  onChangeAge,
  onProfileNameChange,
  onProfileAvatarChange
}: ProfileScreenProps) {
  const strings = t(language);
  void strings;
  const wordsData = getWordsData(language);
  const group = ageGroup ? wordsData.ageGroups[ageGroup] : null;
  const points = progress.stars * 10 + progress.puzzlesCompleted * 20;

  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(profileName);
  const [pickingAvatar, setPickingAvatar] = useState(false);

  const commitName = () => {
    const trimmed = nameDraft.trim();
    if (trimmed) onProfileNameChange(trimmed);
    else setNameDraft(profileName);
    setEditingName(false);
  };

  return (
    <ThemedScreen title="My Profile" onBack={onBack} className="profile-themed">
      <div className="profile-avatar-wrap">
        <div className="profile-avatar">{profileAvatar}</div>
        <button
          type="button"
          className="profile-avatar-camera"
          onClick={() => setPickingAvatar(true)}
          aria-label="Change avatar"
        >
          📷
        </button>
      </div>

      <div className="profile-name-row">
        {editingName ? (
          <input
            className="profile-name-input"
            value={nameDraft}
            onChange={(e) => setNameDraft(e.target.value)}
            onBlur={commitName}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commitName();
              if (e.key === 'Escape') {
                setNameDraft(profileName);
                setEditingName(false);
              }
            }}
            autoFocus
            maxLength={24}
            aria-label="Name"
          />
        ) : (
          <>
            <h2 className="profile-name">{profileName}</h2>
            <button
              type="button"
              className="profile-name-edit"
              onClick={() => {
                setNameDraft(profileName);
                setEditingName(true);
              }}
              aria-label="Edit name"
            >
              ✏️
            </button>
          </>
        )}
      </div>

      <button type="button" className="profile-age-chip" onClick={onChangeAge}>
        Age Group · {group?.label ?? '—'}
      </button>

      <div className="profile-stats">
        <div className="profile-stat">
          <em>Levels Completed</em>
          <div className="profile-stat-row">
            <span className="profile-stat-icon green">🟢</span>
            <strong>{progress.puzzlesCompleted}</strong>
          </div>
        </div>
        <div className="profile-stat">
          <em>Total Stars</em>
          <div className="profile-stat-row">
            <span className="profile-stat-icon yellow">⭐</span>
            <strong>{progress.stars}</strong>
          </div>
        </div>
        <div className="profile-stat">
          <em>Total Points</em>
          <div className="profile-stat-row">
            <span className="profile-stat-icon blue">💎</span>
            <strong>{points}</strong>
          </div>
        </div>
        <div className="profile-stat">
          <em>Words Found</em>
          <div className="profile-stat-row">
            <span className="profile-stat-icon coral">📖</span>
            <strong>{progress.learnedWords.length}</strong>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {pickingAvatar && (
          <motion.div
            className="profile-avatar-picker-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPickingAvatar(false)}
          >
            <motion.div
              className="profile-avatar-picker"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3>Pick your avatar</h3>
              <div className="profile-avatar-grid">
                {PROFILE_AVATAR_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    className={`profile-avatar-option ${emoji === profileAvatar ? 'selected' : ''}`}
                    onClick={() => {
                      onProfileAvatarChange(emoji);
                      setPickingAvatar(false);
                    }}
                    aria-label={emoji}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="profile-avatar-close"
                onClick={() => setPickingAvatar(false)}
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ThemedScreen>
  );
}
