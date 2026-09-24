import React from 'react';
import { useStudioStore } from './store/useStudioStore';
import { Navbar } from './components/layout/Navbar';
import { LandingView } from './components/landing/LandingView';
import { DashboardView } from './components/dashboard/DashboardView';
import { CreateView } from './components/create/CreateView';
import { ResultView } from './components/result/ResultView';
import { LibraryView } from './components/library/LibraryView';
import { ToastContainer } from './components/ui/ToastContainer';
import { Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  const { currentView, setView } = useStudioStore();

  return (
    <div className="min-h-screen bg-[#07080c] text-zinc-100 flex flex-col font-sans selection:bg-brand-600 selection:text-white">
      
      {/* Top Navigation */}
      <Navbar />

      {/* Main Studio Surfaces */}
      <main className="flex-1">
        {currentView === 'landing' && <LandingView />}
        {currentView === 'dashboard' && <DashboardView />}
        {currentView === 'create' && <CreateView />}
        {currentView === 'result' && <ResultView />}
        {currentView === 'library' && <LibraryView />}
      </main>

      {/* Modern Studio Footer */}
      <footer className="border-t border-white/10 bg-[#090a10] py-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/20 text-brand-400">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <span className="font-display font-bold text-sm text-white">HIGGSFIELD AI STUDIO</span>
              <p className="text-[11px] text-zinc-500">Autonomous Neural Video Synthesis Engine</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-400">
            <button onClick={() => setView('landing')} className="hover:text-white transition-colors">
              Explore
            </button>
            <button onClick={() => setView('dashboard')} className="hover:text-white transition-colors">
              Dashboard
            </button>
            <button onClick={() => setView('create')} className="hover:text-white transition-colors">
              Studio Composer
            </button>
            <button onClick={() => setView('library')} className="hover:text-white transition-colors">
              Library & History
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs text-zinc-500 font-mono">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span>GPU Cluster Online</span>
            </span>
            <span>•</span>
            <span>v2.5.0 Production Candidate</span>
          </div>
        </div>
      </footer>

      {/* Reactive Toasts */}
      <ToastContainer />

    </div>
  );
};

export default App;
