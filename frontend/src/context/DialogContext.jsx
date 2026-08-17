import { createContext, useCallback, useContext, useRef, useState } from 'react';
import ConfirmDialog from '../components/layout/ConfirmDialog';

const DialogContext = createContext(null);

const defaultState = {
  isOpen: false,
  title: '',
  message: '',
  confirmLabel: 'Confirm',
  cancelLabel: 'Cancel',
  variant: 'danger',
  alertOnly: false,
};

export function DialogProvider({ children }) {
  const [dialog, setDialog] = useState(defaultState);
  const resolverRef = useRef(null);

  const close = useCallback(() => {
    setDialog((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const showAlert = useCallback((message, title = 'Notice') => {
    return new Promise((resolve) => {
      resolverRef.current = resolve;
      setDialog({
        ...defaultState,
        isOpen: true,
        title,
        message,
        alertOnly: true,
        variant: 'info',
        confirmLabel: 'OK',
      });
    });
  }, []);

  const showConfirm = useCallback((message, options = {}) => {
    const {
      title = 'Confirm',
      confirmLabel = 'Confirm',
      cancelLabel = 'Cancel',
      variant = 'danger',
    } = options;

    return new Promise((resolve) => {
      resolverRef.current = resolve;
      setDialog({
        ...defaultState,
        isOpen: true,
        title,
        message,
        confirmLabel,
        cancelLabel,
        variant,
        alertOnly: false,
      });
    });
  }, []);

  const handleConfirm = useCallback(() => {
    const resolve = resolverRef.current;
    resolverRef.current = null;
    resolve?.(true);
  }, []);

  const handleClose = useCallback(() => {
    const resolve = resolverRef.current;
    resolverRef.current = null;
    if (resolve) {
      resolve(dialog.alertOnly);
    }
    close();
  }, [close, dialog.alertOnly]);

  return (
    <DialogContext.Provider value={{ showAlert, showConfirm }}>
      {children}
      <ConfirmDialog
        isOpen={dialog.isOpen}
        onClose={handleClose}
        title={dialog.title}
        message={dialog.message}
        confirmLabel={dialog.confirmLabel}
        cancelLabel={dialog.cancelLabel}
        variant={dialog.variant}
        alertOnly={dialog.alertOnly}
        onConfirm={dialog.alertOnly ? undefined : handleConfirm}
      />
    </DialogContext.Provider>
  );
}

export function useDialog() {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error('useDialog must be used within DialogProvider');
  return ctx;
}
