import React from 'react';
import { useStudioStore } from '../../store/useStudioStore';
import {
  X,
  Coins,
  ShieldCheck
} from 'lucide-react';

export const TopUpModal: React.FC = () => {
  const {
    isTopUpModalOpen,
    setTopUpModalOpen,
    topUpCreditsAction,
    userProfile
  } = useStudioStore();

  if (!isTopUpModalOpen) return null;

  const TIERS = [
    {
      tokens: 500,
      title: 'Indie Creator Pack',
      desc: '~15 High-res 4K renders',
      badge: 'STARTER',
      color: 'border-white/10'
    },
    {
      tokens: 2000,
      title: 'Director Studio Pro',
      desc: '~65 High-res 4K renders with priority H100 GPU queue',
      badge: 'MOST POPULAR',
      color: 'border-amber-500/60 bg-amber-500/10 shadow-glow-amber'
    },
    {
      tokens: 6000,
      title: 'VFX Production Cluster',
      desc: '~200 High-res renders, unlimited 3D camera trajectory runs',
      badge: 'UNLIMITED SPEED',
      color: 'border-cyan-500/60 bg-cyan-500/10 shadow-glow-cyan'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl glass-panel-elevated rounded-3xl border border-white/20 shadow-2xl p-6 sm:p-8 space-y-6">
        
        {/* Close Button */}
        <button
          onClick={() => setTopUpModalOpen(false)}
          className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-amber-400" />
            <h2 className="text-xl font-bold font-mono text-white">Top Up GPU Compute Tokens</h2>
          </div>
          <p className="text-xs text-zinc-400 font-mono">
            Direct allocation to your persistent SQLite profile. Instant token balance reload.
          </p>
        </div>

        {/* Tier Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {TIERS.map((tier) => (
            <div
              key={tier.tokens}
              className={`rounded-2xl p-5 border flex flex-col justify-between space-y-4 ${tier.color}`}
            >
              <div>
                <span className="inline-block rounded-full bg-black/50 px-2 py-0.5 text-[9px] font-mono font-bold text-amber-400 border border-white/10 mb-2">
                  {tier.badge}
                </span>
                <h3 className="font-mono font-bold text-sm text-white">{tier.title}</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-2xl font-mono font-bold text-amber-300">+{tier.tokens}</span>
                  <span className="text-[10px] font-mono text-zinc-400">Tokens</span>
                </div>
                <p className="text-[11px] text-zinc-400 mt-2 leading-snug">{tier.desc}</p>
              </div>

              <button
                onClick={() => topUpCreditsAction(tier.tokens)}
                className="w-full rounded-xl bg-amber-500 hover:bg-amber-400 text-black py-2.5 text-xs font-mono font-bold transition-all shadow-glow-amber"
              >
                Instant Top Up
              </button>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 pt-4 border-t border-white/10">
          <span className="flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            Zero latency credit synchronization
          </span>
          <span>Current Balance: {userProfile?.credits_balance}</span>
        </div>

      </div>
    </div>
  );
};
