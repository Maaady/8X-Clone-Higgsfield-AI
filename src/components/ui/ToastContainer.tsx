import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useStudioStore } from '../../store/useStudioStore';

export const ToastContainer: React.FC = () => {
  const { notifications, removeToast } = useStudioStore();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
      {notifications.map((toast) => {
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 rounded-2xl border p-4 shadow-2xl backdrop-blur-xl transition-all duration-300 animate-slide-in ${
              toast.type === 'success'
                ? 'border-emerald-500/40 bg-[#0d1c14]/90 text-emerald-200'
                : toast.type === 'error'
                ? 'border-rose-500/40 bg-[#210e12]/90 text-rose-200'
                : 'border-brand-500/40 bg-[#121324]/90 text-brand-200'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              {toast.type === 'success' && <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0" />}
              {toast.type === 'error' && <AlertCircle className="h-5 w-5 text-rose-400 flex-shrink-0" />}
              {toast.type === 'info' && <Info className="h-5 w-5 text-brand-400 flex-shrink-0" />}
              
              <p className="text-xs font-semibold leading-snug">{toast.message}</p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-zinc-400 hover:text-white flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
