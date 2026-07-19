import { motion } from 'framer-motion';

interface ConfirmDialogProps {
  open: boolean;
  emoji?: string;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** 'primary' (playful) or 'danger' (red, for irreversible actions) */
  tone?: 'primary' | 'danger';
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Friendly modal replacement for browser `window.confirm`.
 * Big emoji, big rounded buttons — reads like a question a kid can answer,
 * not a system dialog.
 */
export default function ConfirmDialog({
  open,
  emoji = '🤔',
  title,
  message,
  confirmLabel = 'Yes',
  cancelLabel = 'No',
  tone = 'primary',
  onConfirm,
  onCancel
}: ConfirmDialogProps) {
  if (!open) return null;
  const confirmClass = tone === 'danger' ? 'btn accent' : 'btn primary';
  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-label={title}>
      <motion.div
        className="modal confirm-modal"
        initial={{ scale: 0.6, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <motion.div
          className="big-emoji"
          animate={{ rotate: [0, -8, 8, -6, 6, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 1.2 }}
          aria-hidden="true"
        >
          {emoji}
        </motion.div>
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="button-row">
          <button className={confirmClass} onClick={onConfirm}>
            ✅ {confirmLabel}
          </button>
          <button className="btn ghost" onClick={onCancel}>
            ❌ {cancelLabel}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
