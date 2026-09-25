import React, { useState, useRef } from 'react';
import { useStudioStore } from '../../store/useStudioStore';
import {
  X,
  Sliders,
  ArrowLeftRight
} from 'lucide-react';

export const CompareModal: React.FC = () => {
  const {
    compareA,
    compareB,
    isCompareModalOpen,
    closeCompareModal,
    setCompareGenerations,
    generations
  } = useStudioStore();

  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  if (!isCompareModalOpen || !compareA) return null;

  const completed = generations.filter(g => g.status === 'completed');
  const genB = compareB || completed.find(g => g.id !== compareA.id) || compareA;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const pct = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPos(pct);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current || e.touches.length === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.touches[0].clientX - rect.left, rect.width));
    const pct = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPos(pct);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto glass-panel-elevated rounded-3xl border border-white/20 shadow-2xl p-6 sm:p-8 space-y-6">
        
        {/* Close Button */}
        <button
          onClick={closeCompareModal}
          className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4 pr-12">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 text-[10px] font-mono font-bold flex items-center gap-1">
                <ArrowLeftRight className="h-3 w-3" />
                SPLIT-SCREEN COMPARISON
              </span>
            </div>
            <h2 className="text-xl font-bold font-mono text-white mt-1">Dual Director Re-Take Analyzer</h2>
          </div>

          {/* Quick Selectors for A and B */}
          <div className="flex items-center gap-3">
            <select
              value={compareA.id}
              onChange={(e) => {
                const found = completed.find(g => g.id === e.target.value);
                if (found) setCompareGenerations(found, genB);
              }}
              className="rounded-xl bg-black/60 border border-amber-500/40 text-amber-300 px-3 py-1.5 text-xs font-mono focus:outline-none"
            >
              {completed.map(g => (
                <option key={g.id} value={g.id}>A: {g.title}</option>
              ))}
            </select>

            <select
              value={genB.id}
              onChange={(e) => {
                const found = completed.find(g => g.id === e.target.value);
                if (found) setCompareGenerations(compareA, found);
              }}
              className="rounded-xl bg-black/60 border border-cyan-500/40 text-cyan-300 px-3 py-1.5 text-xs font-mono focus:outline-none"
            >
              {completed.map(g => (
                <option key={g.id} value={g.id}>B: {g.title}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Split Video Canvas Container */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-white/20 select-none cursor-ew-resize shadow-2xl"
        >
          {/* Video B (Background Full) */}
          <div className="absolute inset-0">
            <video
              src={genB.video_url || 'https://assets.mixkit.co/videos/preview/mixkit-cyber-city-with-traffic-and-neon-lights-at-night-42284-large.mp4'}
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-cover"
            />
            <div className="absolute bottom-4 right-4 z-10 rounded-lg bg-black/70 backdrop-blur-md px-3 py-1 border border-cyan-500/40 text-xs font-mono text-cyan-300">
              <span className="font-bold">TAKE B:</span> {genB.title} ({genB.model_id})
            </div>
          </div>

          {/* Video A (Clipped Overlay) */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ width: `${sliderPos}%` }}
          >
            <div className="relative w-full h-full" style={{ width: containerRef.current?.offsetWidth || '100%' }}>
              <video
                src={compareA.video_url || 'https://assets.mixkit.co/videos/preview/mixkit-sunset-over-the-sand-dunes-43224-large.mp4'}
                autoPlay
                loop
                muted
                playsInline
                className="h-full w-full object-cover"
              />
              <div className="absolute bottom-4 left-4 z-10 rounded-lg bg-black/70 backdrop-blur-md px-3 py-1 border border-amber-500/40 text-xs font-mono text-amber-300">
                <span className="font-bold">TAKE A:</span> {compareA.title} ({compareA.model_id})
              </div>
            </div>
          </div>

          {/* Split Divider Handle */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl z-20 pointer-events-none"
            style={{ left: `${sliderPos}%` }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-black font-bold shadow-glow-amber">
              <Sliders className="h-4 w-4" />
            </div>
          </div>

        </div>

        {/* Recipe Diff Side-by-Side Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="rounded-2xl bg-black/50 border border-amber-500/30 p-4 space-y-2">
            <span className="text-amber-400 font-bold block">TAKE A PARAMETERS:</span>
            <p className="text-zinc-300 text-[11px] font-sans">"{compareA.prompt}"</p>
            <div className="flex flex-wrap gap-2 text-[10px] text-zinc-400 pt-1 border-t border-white/5">
              <span>Model: {compareA.model_id}</span>
              <span>•</span>
              <span>Style: {compareA.style_id}</span>
              <span>•</span>
              <span>Seed: #{compareA.seed}</span>
            </div>
          </div>

          <div className="rounded-2xl bg-black/50 border border-cyan-500/30 p-4 space-y-2">
            <span className="text-cyan-400 font-bold block">TAKE B PARAMETERS:</span>
            <p className="text-zinc-300 text-[11px] font-sans">"{genB.prompt}"</p>
            <div className="flex flex-wrap gap-2 text-[10px] text-zinc-400 pt-1 border-t border-white/5">
              <span>Model: {genB.model_id}</span>
              <span>•</span>
              <span>Style: {genB.style_id}</span>
              <span>•</span>
              <span>Seed: #{genB.seed}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
