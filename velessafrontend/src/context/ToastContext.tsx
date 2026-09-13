import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'info' | 'warning' | 'error';

export interface Toast {
  id: string;
  title?: string;
  message: string;
  type?: ToastType;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (message: string, type?: ToastType, title?: string, duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((
    message: string,
    type: ToastType = 'success',
    title?: string,
    duration: number = 3800
  ) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: Toast = { id, message, type, title, duration };

    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      {/* Toast Render Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto bg-charcoal text-ivory border border-champagne/40 px-4 py-3.5 shadow-2xl rounded-sm flex items-start justify-between gap-3 animate-slide-up backdrop-blur-md transition-all duration-300"
          >
            <div className="flex items-start gap-3">
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-champagne shrink-0 mt-0.5" />}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-champagne shrink-0 mt-0.5" />}
              <div>
                {toast.title && (
                  <h4 className="font-serif tracking-wider text-champagne text-sm uppercase font-medium">
                    {toast.title}
                  </h4>
                )}
                <p className="text-xs text-ivory/90 leading-relaxed font-sans mt-0.5">
                  {toast.message}
                </p>
              </div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-ivory/50 hover:text-champagne transition-colors shrink-0"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
