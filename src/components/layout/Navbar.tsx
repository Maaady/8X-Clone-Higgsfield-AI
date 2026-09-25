import React from 'react';
import { useStudioStore } from '../../store/useStudioStore';
import {
  Film,
  Layers,
  Sparkles,
  Server,
  Coins,
  Activity,
  PlusCircle,
  Video
} from 'lucide-react';
import type { ActiveView } from '../../types';

export const Navbar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    userProfile,
    stats,
    setTopUpModalOpen
  } = useStudioStore();

  const navItems: { id: ActiveView; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'composer', label: 'Studio Composer', icon: Film },
    { id: 'pipeline', label: 'GPU Pipeline', icon: Activity },
    { id: 'vault', label: 'Production Vault', icon: Layers },
    { id: 'styles', label: 'Style DNA Lab', icon: Sparkles },
    { id: 'cluster', label: 'Cluster Telemetry', icon: Server }
  ];

  const activeJobsCount = stats?.active_pipeline_jobs || 0;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#08090e]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand & Identity */}
        <div className="flex items-center gap-6">
          <div
            onClick={() => setActiveView('composer')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-cyan-500 p-[1px] shadow-glow-amber transition-transform duration-300 group-hover:scale-105">
              <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-[#090b12]">
                <Video className="h-5 w-5 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-wider text-sm sm:text-base text-white font-mono">
                  SYNAPSE<span className="text-amber-400"> // </span>AETHER-8
                </span>
                <span className="rounded bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-mono font-semibold text-amber-400 border border-amber-500/30">
                  CINEMA ENGINE
                </span>
              </div>
              <p className="text-[10px] text-zinc-400 font-mono tracking-tight hidden sm:block">
                Autonomous Latent Video Synthesis
              </p>
            </div>
          </div>

          {/* GPU Cluster Live Telemetry Badge */}
          <div className="hidden xl:flex items-center gap-2 rounded-full bg-white/[0.04] border border-white/10 px-3 py-1 text-xs text-zinc-300 font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-zinc-400">Node:</span>
            <span className="text-white font-semibold">16x H100 SXM</span>
            <span className="text-zinc-600">|</span>
            <span className="text-amber-400">{stats?.gpu_utilization_pct || 38}% Load</span>
          </div>
        </div>

        {/* Central View Navigation */}
        <nav className="flex items-center gap-1 sm:gap-1.5 rounded-xl bg-black/40 p-1 border border-white/10">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`relative flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-amber-400' : 'text-zinc-400'}`} />
                <span className="hidden md:inline">{item.label}</span>

                {item.id === 'pipeline' && activeJobsCount > 0 && (
                  <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-black animate-pulse">
                    {activeJobsCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Deck: Credits, Top-up, User Profile */}
        <div className="flex items-center gap-3">
          
          {/* Credit Meter */}
          <div className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 px-3 py-1.5">
            <Coins className="h-4 w-4 text-amber-400" />
            <div className="text-left">
              <span className="block text-[10px] uppercase font-mono text-zinc-400 leading-none">GPU Tokens</span>
              <span className="font-mono text-xs sm:text-sm font-bold text-amber-300 leading-none">
                {userProfile?.credits_balance ?? 2480}
              </span>
            </div>
            <button
              onClick={() => setTopUpModalOpen(true)}
              className="ml-1 flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500 hover:text-black transition-all"
              title="Top up GPU compute credits"
            >
              <PlusCircle className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* User Tier Avatar */}
          <div className="hidden sm:flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-amber-500 to-purple-600 font-bold text-xs text-white">
              DP
            </div>
            <div className="text-left leading-tight">
              <span className="block text-xs font-semibold text-white">Director Prime</span>
              <span className="block text-[10px] font-mono text-amber-400">PRO STUDIO</span>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
};
