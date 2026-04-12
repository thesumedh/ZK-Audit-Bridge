import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ShieldAlert, X } from 'lucide-react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((title, message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => {
      // Deduplicate: if same title already showing, don't add another
      if (prev.some(t => t.title === title)) return prev;
      // Max 3 toasts at once
      const next = [...prev, { id, title, message, type }].slice(-3);
      return next;
    });
    setTimeout(() => removeToast(id), 5000);
  }, [removeToast]);

  const clearAll = useCallback(() => setToasts([]), []);

  return (
    <ToastContext.Provider value={{ addToast, clearAll }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 max-w-sm w-full">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, scale: 0.9, x: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: 50 }}
              className={`p-4 rounded-xl shadow-2xl border-l-4 flex gap-3 backdrop-blur-xl relative ${
                toast.type === 'success'
                  ? 'bg-surface-container-high/95 border-primary'
                  : 'bg-error-container/95 border-error'
              }`}
            >
              {/* Icon */}
              <div className="mt-0.5 flex-shrink-0">
                {toast.type === 'success' ? (
                  <CheckCircle2 className="text-primary" size={18} />
                ) : (
                  <ShieldAlert className="text-error" size={18} />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-on-surface mb-0.5 leading-tight">{toast.title}</h4>
                <p className="text-xs text-on-surface-variant font-mono truncate">{toast.message}</p>
              </div>

              {/* ✕ Close button */}
              <button
                onClick={() => removeToast(toast.id)}
                className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-200 hover:bg-slate-700/50 transition-colors mt-0.5"
                aria-label="Dismiss notification"
              >
                <X size={12} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Clear All button — only shows when ≥2 toasts */}
        <AnimatePresence>
          {toasts.length >= 2 && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              onClick={clearAll}
              className="self-end text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-300 transition-colors px-2 py-1 bg-slate-900/80 rounded border border-slate-800"
            >
              Clear All
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
