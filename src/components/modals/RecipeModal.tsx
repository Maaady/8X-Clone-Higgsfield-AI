import React from 'react';
import { useStudioStore } from '../../store/useStudioStore';
import {
  X,
  RotateCcw,
  GitFork,
  Download,
  Copy,
  Heart,
  Check
} from 'lucide-react';

export const RecipeModal: React.FC = () => {
  const {
    selectedGeneration,
    setSelectedGeneration,
    applyRecipeToComposer,
    forkGeneration,
    toggleFavorite,
    addToast
  } = useStudioStore();

  const [copiedPrompt, setCopiedPrompt] = React.useState(false);

  if (!selectedGeneration) return null;

  const gen = selectedGeneration;
  let parsedCamera: any = {};
  try {
    parsedCamera = JSON.parse(gen.camera_data);
  } catch (_) {}

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(gen.prompt);
    setCopiedPrompt(true);
    addToast('Prompt Copied', 'Copied full prompt text to clipboard.', 'info');
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleDownloadJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(gen, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `synapse-recipe-${gen.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addToast('Recipe Exported', 'Saved complete generation recipe as JSON.', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto glass-panel-elevated rounded-3xl border border-white/20 shadow-2xl p-6 sm:p-8 space-y-6">
        
        {/* Close Button */}
        <button
          onClick={() => setSelectedGeneration(null)}
          className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4 pr-12">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 text-[10px] font-mono font-bold">
                RECIPE INSPECTOR
              </span>
              <span className="text-xs font-mono text-zinc-500">{gen.id}</span>
            </div>
            <h2 className="text-xl font-bold font-mono text-white mt-1">{gen.title}</h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleFavorite(gen.id)}
              className={`p-2 rounded-xl border transition-colors ${
                gen.is_favorite === 1
                  ? 'bg-red-500/20 text-red-400 border-red-500/40'
                  : 'bg-white/5 text-zinc-400 border-white/10 hover:text-white'
              }`}
            >
              <Heart className={`h-4 w-4 ${gen.is_favorite === 1 ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={handleDownloadJson}
              className="flex items-center gap-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-2 text-xs font-mono text-zinc-300 transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              Export JSON
            </button>
          </div>
        </div>

        {/* Video & Main Prompt Stage */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Video Preview */}
          <div className="md:col-span-6 aspect-video rounded-2xl overflow-hidden bg-black border border-white/15 relative flex items-center justify-center">
            {gen.video_url ? (
              <video
                src={gen.video_url}
                controls
                autoPlay
                loop
                className="h-full w-full object-cover"
              />
            ) : (
              <img src={gen.thumbnail_url} alt={gen.title} className="h-full w-full object-cover" />
            )}
          </div>

          {/* Prompt Breakdown */}
          <div className="md:col-span-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="rounded-2xl bg-black/50 border border-white/10 p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider">
                    Full Prompt Directing
                  </span>
                  <button
                    onClick={handleCopyPrompt}
                    className="text-[10px] font-mono text-zinc-400 hover:text-white flex items-center gap-1"
                  >
                    {copiedPrompt ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    {copiedPrompt ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <p className="text-xs text-zinc-200 leading-relaxed font-sans">{gen.prompt}</p>
              </div>

              {gen.negative_prompt && (
                <div className="rounded-xl bg-black/30 border border-red-500/20 p-3 space-y-1">
                  <span className="text-[10px] font-mono text-red-400 uppercase tracking-wider block">
                    Negative Conditioning
                  </span>
                  <p className="text-xs text-zinc-400 leading-relaxed font-sans">{gen.negative_prompt}</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => applyRecipeToComposer(gen)}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black py-3 text-xs font-mono font-bold transition-all shadow-glow-amber"
              >
                <RotateCcw className="h-4 w-4" />
                Apply Recipe to Composer
              </button>
              <button
                onClick={() => {
                  forkGeneration(gen.id);
                  setSelectedGeneration(null);
                }}
                className="flex items-center gap-2 rounded-xl bg-purple-500/20 hover:bg-purple-500 hover:text-white border border-purple-500/40 text-purple-300 px-4 py-3 text-xs font-mono font-bold transition-all"
              >
                <GitFork className="h-4 w-4" />
                Fork Branch
              </button>
            </div>

          </div>

        </div>

        {/* Recipe Technical Parameters Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10 text-xs font-mono">
          <div className="rounded-xl bg-black/40 border border-white/5 p-3">
            <span className="text-[10px] text-zinc-500 uppercase block">Model ID</span>
            <span className="text-amber-300 font-bold">{gen.model_id}</span>
          </div>

          <div className="rounded-xl bg-black/40 border border-white/5 p-3">
            <span className="text-[10px] text-zinc-500 uppercase block">Style DNA</span>
            <span className="text-purple-300 font-bold">{gen.style_id}</span>
          </div>

          <div className="rounded-xl bg-black/40 border border-white/5 p-3">
            <span className="text-[10px] text-zinc-500 uppercase block">Aspect & Res</span>
            <span className="text-cyan-300 font-bold">{gen.aspect_ratio} ({gen.width}x{gen.height})</span>
          </div>

          <div className="rounded-xl bg-black/40 border border-white/5 p-3">
            <span className="text-[10px] text-zinc-500 uppercase block">Entropy Seed</span>
            <span className="text-white font-bold">#{gen.seed}</span>
          </div>

          <div className="rounded-xl bg-black/40 border border-white/5 p-3">
            <span className="text-[10px] text-zinc-500 uppercase block">Camera Path</span>
            <span className="text-white font-bold">{gen.motion_mode}</span>
          </div>

          <div className="rounded-xl bg-black/40 border border-white/5 p-3">
            <span className="text-[10px] text-zinc-500 uppercase block">Focal & Aperture</span>
            <span className="text-white font-bold">{parsedCamera.focal_length || '35mm'} @ {parsedCamera.aperture || 'f/1.8'}</span>
          </div>

          <div className="rounded-xl bg-black/40 border border-white/5 p-3">
            <span className="text-[10px] text-zinc-500 uppercase block">CFG & Steps</span>
            <span className="text-white font-bold">{gen.cfg_scale} scale / {gen.steps} steps</span>
          </div>

          <div className="rounded-xl bg-black/40 border border-white/5 p-3">
            <span className="text-[10px] text-zinc-500 uppercase block">GPU Execution</span>
            <span className="text-emerald-400 font-bold">{(gen.execution_time_ms / 1000).toFixed(1)}s Latency</span>
          </div>
        </div>

      </div>
    </div>
  );
};
