import React, { useState, useRef } from 'react';
import { 
  Sparkles, 
  Repeat, 
  Download, 
  Share2, 
  Heart, 
  Copy, 
  Check, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Clock, 
  ChevronLeft,
  FileCode2,
  CheckCircle2
} from 'lucide-react';
import { useStudioStore } from '../../store/useStudioStore';

export const ResultView: React.FC = () => {
  const { 
    generations, 
    activeGenerationId, 
    recreateFromGeneration, 
    toggleFavorite, 
    setView,
    addToast 
  } = useStudioStore();

  const activeGen = generations.find((g) => g.id === activeGenerationId) || generations[0];

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedSeed, setCopiedSeed] = useState(false);

  if (!activeGen) {
    return (
      <div className="min-h-screen bg-[#07080c] flex items-center justify-center text-white">
        <div className="text-center">
          <p className="text-zinc-400">No generation selected.</p>
          <button
            onClick={() => setView('create')}
            className="mt-4 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold"
          >
            Create New Video
          </button>
        </div>
      </div>
    );
  }

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleSpeedChange = (speed: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setPlaybackSpeed(speed);
      addToast(`Playback speed: ${speed}x`, 'info');
    }
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(activeGen.prompt);
    setCopiedPrompt(true);
    addToast('Prompt copied to clipboard!', 'success');
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleCopySeed = () => {
    navigator.clipboard.writeText(String(activeGen.seed));
    setCopiedSeed(true);
    addToast(`Seed ${activeGen.seed} copied!`, 'success');
    setTimeout(() => setCopiedSeed(false), 2000);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    addToast('Public recipe link copied to clipboard!', 'success');
  };

  const handleDownloadVideo = () => {
    // Trigger video file download
    const link = document.createElement('a');
    link.href = activeGen.videoUrl;
    link.download = `higgsfield-${activeGen.id}.mp4`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Video download started!', 'success');
  };

  const handleExportRecipeJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(activeGen, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `generation-recipe-${activeGen.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addToast('Generation Recipe JSON exported!', 'success');
  };

  return (
    <div className="min-h-screen bg-[#07080c] text-white pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Top Back Navigation & Status */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <button
            onClick={() => setView('library')}
            className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Back to Library</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-mono font-bold text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Generation Ready</span>
            </span>
          </div>
        </div>

        {/* Main Grid: Video Player + Generation Recipe Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Cinematic Player & Immediate Actions */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            
            {/* Player Container */}
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/15 bg-black shadow-2xl group">
              <video
                ref={videoRef}
                src={activeGen.videoUrl}
                poster={activeGen.thumbnailUrl}
                className="h-full w-full object-cover"
                autoPlay
                loop
                muted={isMuted}
                playsInline
              />

              {/* Custom Overlay Controls */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={togglePlay}
                      className="rounded-full bg-white/20 hover:bg-white/30 p-2 backdrop-blur-md transition-colors"
                    >
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={toggleMute}
                      className="rounded-full bg-white/20 hover:bg-white/30 p-2 backdrop-blur-md transition-colors"
                    >
                      {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </button>
                    <div className="text-xs font-mono text-zinc-300">
                      {activeGen.duration}s • {activeGen.resolution}
                    </div>
                  </div>

                  {/* Speed buttons */}
                  <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md rounded-lg p-1 border border-white/10">
                    {[0.5, 1.0, 1.5, 2.0].map((s) => (
                      <button
                        key={s}
                        onClick={() => handleSpeedChange(s)}
                        className={`px-2 py-0.5 text-[10px] font-mono rounded ${
                          playbackSpeed === s ? 'bg-brand-500 text-white font-bold' : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        {s}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Top Overlay Badges */}
              <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none">
                <span className="rounded-md bg-black/70 backdrop-blur-md px-2.5 py-1 text-xs font-mono font-semibold text-brand-300 border border-white/10">
                  {activeGen.model}
                </span>
                <span className="rounded-md bg-brand-500/30 backdrop-blur-md px-2 py-1 text-xs font-semibold text-white">
                  {activeGen.style}
                </span>
              </div>
            </div>

            {/* Primary Action Buttons Bar */}
            <div className="rounded-2xl border border-white/10 bg-[#10121d] p-4 flex flex-wrap items-center justify-between gap-3">
              
              {/* The Key Differentiating Recreate Button */}
              <button
                onClick={() => recreateFromGeneration(activeGen)}
                className="flex-1 min-w-[200px] flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 via-brand-500 to-brand-accent px-5 py-3 text-sm font-bold text-white shadow-glow-brand hover:brightness-110 active:scale-95 transition-all"
              >
                <Repeat className="h-4 w-4" />
                <span>Recreate in Composer</span>
              </button>

              <div className="flex items-center gap-2">
                {/* Favorite */}
                <button
                  onClick={() => toggleFavorite(activeGen.id)}
                  className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-3 text-xs font-semibold transition-all ${
                    activeGen.isFavorite
                      ? 'border-rose-500/50 bg-rose-500/20 text-rose-300'
                      : 'border-white/10 bg-white/[0.04] text-zinc-300 hover:bg-white/[0.08]'
                  }`}
                  title="Favorite this generation"
                >
                  <Heart className={`h-4 w-4 ${activeGen.isFavorite ? 'fill-rose-500' : ''}`} />
                  <span className="hidden sm:inline">Favorite</span>
                </button>

                {/* Download MP4 */}
                <button
                  onClick={handleDownloadVideo}
                  className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-3 text-xs font-semibold text-zinc-300 hover:bg-white/[0.08] hover:text-white transition-colors"
                  title="Download MP4 Video"
                >
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Download</span>
                </button>

                {/* Share */}
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-3 text-xs font-semibold text-zinc-300 hover:bg-white/[0.08] hover:text-white transition-colors"
                  title="Share Recipe Link"
                >
                  <Share2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Share</span>
                </button>

                {/* Export JSON Recipe */}
                <button
                  onClick={handleExportRecipeJSON}
                  className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-xs font-semibold text-zinc-300 hover:bg-white/[0.08] hover:text-white transition-colors"
                  title="Export Recipe JSON"
                >
                  <FileCode2 className="h-4 w-4 text-brand-accent" />
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: Generation Recipe (Differentiating Feature) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            
            {/* Generation Recipe Card */}
            <div className="rounded-2xl border border-brand-500/30 bg-[#10121d] p-6 shadow-glow-brand relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-500/20 text-brand-400">
                    <Sparkles className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="text-base font-bold font-display text-white">
                      Generation Recipe
                    </h3>
                    <p className="text-[11px] text-brand-300">Deterministic Parameters & Latents</p>
                  </div>
                </div>

                <button
                  onClick={() => recreateFromGeneration(activeGen)}
                  className="flex items-center gap-1 rounded-lg bg-brand-500/20 hover:bg-brand-500/30 text-brand-300 border border-brand-500/30 px-2.5 py-1 text-xs font-semibold transition-colors"
                >
                  <Repeat className="h-3 w-3" />
                  <span>Use Recipe</span>
                </button>
              </div>

              {/* Prompt Box */}
              <div className="rounded-xl border border-white/10 bg-black/40 p-3.5 mb-4">
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 mb-1.5">
                  <span className="uppercase font-bold text-brand-300">Prompt</span>
                  <button
                    onClick={handleCopyPrompt}
                    className="flex items-center gap-1 text-zinc-400 hover:text-white transition-colors"
                  >
                    {copiedPrompt ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedPrompt ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-xs text-zinc-200 leading-relaxed font-sans select-all">
                  "{activeGen.prompt}"
                </p>
              </div>

              {/* Negative Prompt if present */}
              {activeGen.negativePrompt && (
                <div className="rounded-xl border border-white/5 bg-black/30 p-3 mb-4">
                  <div className="text-[10px] font-mono uppercase font-bold text-zinc-500 mb-1">
                    Negative Prompt
                  </div>
                  <p className="text-xs text-zinc-400 font-sans">
                    {activeGen.negativePrompt}
                  </p>
                </div>
              )}

              {/* Reference Image Used */}
              {activeGen.referenceImage && (
                <div className="rounded-xl border border-white/10 bg-black/30 p-3 mb-4 flex items-center gap-3">
                  <img
                    src={activeGen.referenceImage}
                    alt="Reference"
                    className="h-12 w-12 rounded-lg object-cover border border-white/10"
                  />
                  <div>
                    <div className="text-[11px] font-mono uppercase text-zinc-400">Reference Conditioning</div>
                    <div className="text-xs font-bold text-white">{activeGen.referenceName || 'Custom Reference'}</div>
                    <div className="text-[10px] font-mono text-brand-300">
                      Adherence Weight: {Math.round((activeGen.referenceWeight || 0.8) * 100)}%
                    </div>
                  </div>
                </div>
              )}

              {/* Recipe Spec Matrix */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                  <div className="text-[10px] font-mono uppercase text-zinc-500">AI Model</div>
                  <div className="font-bold text-white mt-0.5 truncate">{activeGen.model}</div>
                </div>

                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                  <div className="text-[10px] font-mono uppercase text-zinc-500">Style Preset</div>
                  <div className="font-bold text-brand-300 mt-0.5 truncate">{activeGen.style}</div>
                </div>

                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                  <div className="text-[10px] font-mono uppercase text-zinc-500">Aspect & Res</div>
                  <div className="font-bold text-white mt-0.5">{activeGen.aspectRatio} • {activeGen.resolution}</div>
                </div>

                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                  <div className="text-[10px] font-mono uppercase text-zinc-500">Duration & FPS</div>
                  <div className="font-bold text-white mt-0.5">{activeGen.duration}s @ {activeGen.fps}fps</div>
                </div>

                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                  <div className="text-[10px] font-mono uppercase text-zinc-500">Camera Motion</div>
                  <div className="font-bold text-white mt-0.5 truncate">{activeGen.cameraMotion}</div>
                </div>

                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                  <div className="flex items-center justify-between text-[10px] font-mono uppercase text-zinc-500">
                    <span>Seed</span>
                    <button onClick={handleCopySeed} className="hover:text-white">
                      {copiedSeed ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    </button>
                  </div>
                  <div className="font-mono font-bold text-brand-accent mt-0.5 truncate">
                    {activeGen.seed}
                  </div>
                </div>

              </div>

              {/* Timestamp & Credits Footer */}
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{activeGen.createdAt}</span>
                </div>
                <div>{activeGen.creditsUsed} Credits Burned</div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
