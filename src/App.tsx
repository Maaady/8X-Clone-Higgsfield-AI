import React, { useEffect } from 'react';
import { useStudioStore } from './store/useStudioStore';
import { Navbar } from './components/layout/Navbar';
import { ComposerView } from './components/composer/ComposerView';
import { PipelineView } from './components/pipeline/PipelineView';
import { VaultView } from './components/vault/VaultView';
import { StyleLabView } from './components/styles/StyleLabView';
import { ClusterView } from './components/cluster/ClusterView';
import { RecipeModal } from './components/modals/RecipeModal';
import { CompareModal } from './components/modals/CompareModal';
import { TopUpModal } from './components/modals/TopUpModal';
import { ToastContainer } from './components/ui/ToastContainer';
import { Video } from 'lucide-react';

export const App: React.FC = () => {
  const {
    activeView,
    setActiveView,
    loadInitialData,
    isLoading,
    stats
  } = useStudioStore();

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  if (isLoading && !stats) {
    return (
      <div className="min-h-screen bg-[#07080d] flex flex-col items-center justify-center text-white space-y-4 font-mono">
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-cyan-500 p-[2px] animate-spin">
          <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-[#090b12]">
            <Video className="h-7 w-7 text-amber-400" />
          </div>
        </div>
        <div className="text-center space-y-1">
          <h2 className="text-base font-bold tracking-wider text-amber-300">SYNAPSE CINEMA ENGINE</h2>
          <p className="text-xs text-zinc-500">Connecting to SQLite Storage & H100 GPU Cluster...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07080d] text-zinc-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      
      {/* Top Telemetry Header */}
      <Navbar />

      {/* Main Studio Views */}
      <main className="flex-1">
        {activeView === 'composer' && <ComposerView />}
        {activeView === 'pipeline' && <PipelineView />}
        {activeView === 'vault' && <VaultView />}
        {activeView === 'styles' && <StyleLabView />}
        {activeView === 'cluster' && <ClusterView />}
      </main>

      {/* Modern Studio Footer */}
      <footer className="border-t border-white/10 bg-[#08090e] py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono">
              <Video className="h-4 w-4" />
            </div>
            <div>
              <span className="font-mono font-bold text-xs text-white">SYNAPSE CINEMA // AETHER-8</span>
              <p className="text-[11px] text-zinc-500 font-mono">Autonomous Spatiotemporal Video Diffusion Engine</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-zinc-400">
            <button onClick={() => setActiveView('composer')} className="hover:text-amber-400 transition-colors">
              Studio Composer
            </button>
            <button onClick={() => setActiveView('pipeline')} className="hover:text-amber-400 transition-colors">
              GPU Pipeline
            </button>
            <button onClick={() => setActiveView('vault')} className="hover:text-amber-400 transition-colors">
              Production Vault
            </button>
            <button onClick={() => setActiveView('styles')} className="hover:text-amber-400 transition-colors">
              Style DNA Lab
            </button>
            <button onClick={() => setActiveView('cluster')} className="hover:text-amber-400 transition-colors">
              Cluster Telemetry
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs text-zinc-500 font-mono">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span>SQLite Persistent Store</span>
            </span>
            <span>•</span>
            <span>v2.5.0 Production Candidate</span>
          </div>

        </div>
      </footer>

      {/* Modals & Toasts */}
      <RecipeModal />
      <CompareModal />
      <TopUpModal />
      <ToastContainer />

    </div>
  );
};

export default App;
