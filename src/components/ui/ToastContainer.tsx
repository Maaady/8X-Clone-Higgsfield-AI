import React from 'react';
import { useStudioStore } from '../../store/useStudioStore';
import {
  CheckCircle2,
  AlertTriangle,
  Info,
  XCircle,
  X
} from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useStudioStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => {
        let icon = <Info className="h-4 w-4 text-cyan-400" />;
        let borderClass = 'border-cyan-500/40 shadow-glow-cyan';

        if (t.type === 'success') {
          icon = <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
          borderClass = 'border-emerald-500/40 shadow-glow-brand';
        } else if (t.type === 'warning') {
          icon = <AlertTriangle className="h-4 w-4 text-amber-400" />;
          borderClass = 'border-amber-500/40 shadow-glow-amber';
        } else if (t.type === 'error') {
          icon = <XCircle className="h-4 w-4 text-red-400" />;
          borderClass = 'border-red-500/40';
        }

        return (
          <div
            key={t.id}
            className={`pointer-events-auto rounded-2xl glass-panel-elevated p-4 border ${borderClass} flex items-start justify-between gap-3 shadow-2xl animate-slideUp`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 shrink-0">{icon}</div>
              <div>
                <h4 className="text-xs font-mono font-bold text-white">{t.title}</h4>
                <p className="text-[11px] text-zinc-300 mt-0.5 leading-snug font-sans">{t.message}</p>
              </div>
            </div>

            <button
              onClick={() => removeToast(t.id)}
              className="text-zinc-500 hover:text-white p-1 rounded-lg transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
