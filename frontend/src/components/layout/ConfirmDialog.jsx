import Modal from './Modal';

export default function ConfirmDialog({
  isOpen,
  onClose,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  variant = 'danger',
  alertOnly = false,
}) {
  const confirmClass =
    variant === 'primary' ? 'btn-primary' : variant === 'info' ? 'btn-primary' : 'btn-danger';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <p className="text-sm leading-relaxed text-slate-300">{message}</p>
      <div className="mt-6 flex justify-end gap-3 border-t border-slate-700/60 pt-4">
        {!alertOnly && (
          <button type="button" onClick={onClose} className="btn-secondary">
            {cancelLabel}
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            if (onConfirm) onConfirm();
            onClose();
          }}
          className={alertOnly ? 'btn-primary' : confirmClass}
        >
          {alertOnly ? 'OK' : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
