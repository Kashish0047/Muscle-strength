import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Confirm', 
  cancelText = 'Cancel', 
  variant = 'danger' 
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md glass-panel p-8 md:p-10 rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden"
          >
            {/* Decorative background glow */}
            <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[80px] group-hover:scale-150 transition-transform duration-700 ${variant === 'danger' ? 'bg-red-500/10' : 'bg-blue-500/10'}`} />

            <div className="relative z-10 text-center">
              {/* Icon */}
              <div className={`w-20 h-20 rounded-[2rem] mx-auto mb-8 flex items-center justify-center border transition-all duration-500 ${
                variant === 'danger' 
                  ? 'bg-red-500/10 border-red-500/20 text-red-500 shadow-[0_0_30px_rgba(239,68,68,0.1)]' 
                  : 'bg-blue-500/10 border-blue-500/20 text-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.1)]'
              }`}>
                {variant === 'danger' ? (
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                ) : (
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>

              {/* Text */}
              <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-4 leading-tight">{title}</h3>
              <p className="text-gray-400 font-bold text-sm mb-10 leading-relaxed px-4">{message}</p>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 px-2">
                <button
                  onClick={onClose}
                  className="flex-1 order-2 sm:order-1 py-4 px-6 rounded-2xl bg-white/5 text-white font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all border border-white/5 active:scale-95"
                >
                  {cancelText}
                </button>
                <button
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className={`flex-1 order-1 sm:order-2 py-4 px-6 rounded-2xl font-black uppercase tracking-widest text-[10px] text-white transition-all shadow-xl active:scale-95 ${
                    variant === 'danger' 
                      ? 'bg-red-600 hover:bg-red-700 shadow-red-500/30' 
                      : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/30'
                  }`}
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
