'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useToast, ToastType } from '@/context/ToastContext';

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="w-5 h-5 text-success" />,
  error: <AlertCircle className="w-5 h-5 text-error" />,
  info: <Info className="w-5 h-5 text-tan" />,
};

const bgColors: Record<ToastType, string> = {
  success: 'bg-success/10 border-success/30',
  error: 'bg-error/10 border-error/30',
  info: 'bg-tan/10 border-tan/30',
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-card ${bgColors[toast.type]}`}
          >
            <span className="shrink-0 mt-0.5">{icons[toast.type]}</span>
            <p className="text-sm text-dark-brown flex-1">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 p-1 rounded-lg hover:bg-warm-beige/50 transition-colors text-medium-brown cursor-pointer"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
