import React from 'react';
import { 
  Sparkles, 
  Layers, 
  Film, 
  Compass, 
  Coins, 
  Plus, 
  AlertTriangle
} from 'lucide-react';
import { useStudioStore, type ViewType } from '../../store/useStudioStore';

export const Navbar: React.FC = () => {
  const { 
    currentView, 
    setView, 
    userCredits, 
    simulateFailureNext, 
    setSimulateFailureNext,
    activeGeneratingTask,
    addToast
  } = useStudioStore();

  const navItems: { id: ViewType; label: string; icon: React.ElementType }[] = [
    { id: 'landing', label: 'Explore', icon: Compass },
    { id: 'dashboard', label: 'Dashboard', icon: Layers },
    { id: 'create', label: 'Create Studio', icon: Sparkles },
    { id: 'library', label: 'My Library', icon: Film },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#07080c]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <button 
            onClick={() => setView('landing')} 
            className="group flex items-center gap-2.5 text-left focus:outline-none"
          >
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 via-brand-600 to-brand-accent p-0.5 shadow-glow-brand transition-transform duration-300 group-hover:scale-105">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#0d0e15]">
                <Sparkles className="h-5 w-5 text-brand-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-lg font-bold tracking-tight text-white group-hover:text-brand-300 transition-colors">
                  HIGGSFIELD
                </span>
                <span className="rounded-full bg-brand-500/20 px-2 py-0.5 text-[10px] font-semibold text-brand-300 border border-brand-500/30">
                  STUDIO v2.5
                </span>
              </div>
              <p className="text-[11px] font-medium text-zinc-400 -mt-0.5">
                Neural Video Synthesizer
              </p>
            </div>
          </button>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setView(item.id)}
                  className={`relative flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-white/10 text-white shadow-inner-glow'
                      : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-brand-400' : 'text-zinc-400'}`} />
                  {item.label}
                  {item.id === 'create' && activeGeneratingTask && (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-accent"></span>
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-gradient-to-r from-brand-500 to-brand-accent rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center gap-3">
          
          {/* Simulated Pipeline Failure Toggle (For QA & Verification) */}
          <button
            onClick={() => {
              const nextVal = !simulateFailureNext;
              setSimulateFailureNext(nextVal);
              addToast(
                nextVal 
                  ? 'Simulate Failure enabled: next generation will test failure & retry flow.' 
                  : 'Simulate Failure disabled: standard pipeline active.',
                nextVal ? 'info' : 'success'
              );
            }}
            title="Click to toggle pipeline error simulation for QA verification"
            className={`hidden lg:flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-mono transition-all border ${
              simulateFailureNext
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
                : 'bg-white/[0.03] text-zinc-400 border-white/10 hover:text-zinc-300 hover:border-white/20'
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>Simulate Error: {simulateFailureNext ? 'ON' : 'OFF'}</span>
          </button>

          {/* Credits Badge */}
          <div 
            onClick={() => addToast('Creator Plan: 240/500 monthly fast GPU credits available.', 'info')}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-zinc-900 to-zinc-800 px-3.5 py-1.5 border border-white/10 shadow-sm cursor-pointer hover:border-brand-500/40 transition-colors"
          >
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-500/20 text-brand-400">
              <Coins className="h-3.5 w-3.5" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-zinc-100 flex items-center gap-1">
                {userCredits} <span className="text-[10px] font-normal text-zinc-400">Credits</span>
              </div>
            </div>
          </div>

          {/* Primary Create Button */}
          <button
            onClick={() => setView('create')}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 via-brand-500 to-brand-accent px-4 py-2 text-sm font-semibold text-white shadow-glow-brand hover:brightness-110 active:scale-95 transition-all duration-200"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span className="hidden sm:inline">New Generation</span>
          </button>

          {/* User Avatar */}
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-700 to-pink-600 p-0.5">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-zinc-950 text-xs font-bold text-zinc-200">
              HF
            </div>
          </div>

        </div>

      </div>

      {/* Mobile Nav Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-white/5 bg-[#0a0b10] py-2 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`flex flex-col items-center gap-1 px-3 py-1 text-xs font-medium ${
                isActive ? 'text-brand-400' : 'text-zinc-400'
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
