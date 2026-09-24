import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Repeat, 
  Sliders, 
  ShieldCheck, 
  Eye, 
  Flame,
  Film
} from 'lucide-react';
import { useStudioStore } from '../../store/useStudioStore';
import { PROMPT_TEMPLATES, SEED_GENERATIONS } from '../../data/mockData';

export const LandingView: React.FC = () => {
  const { setView, recreateFromGeneration, loadRecipe } = useStudioStore();

  return (
    <div className="min-h-screen bg-[#07080c] text-white">
      {/* Background ambient lighting */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-gradient-to-tr from-brand-600/20 via-brand-accent/15 to-pink-500/10 blur-[130px]" />
        <div className="absolute top-[800px] -left-40 h-[500px] w-[600px] rounded-full bg-brand-500/10 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 pb-24">
        
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-xs font-semibold text-brand-300 shadow-glow-brand mb-8 animate-pulse-slow">
            <Sparkles className="h-3.5 w-3.5 text-brand-accent" />
            <span>Next-Generation Multi-Agent Cinema Model v2.5 is Live</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] text-white">
            Cinematic AI Video <br />
            <span className="creative-gradient-text">Engineered for Visionaries</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg lg:text-xl text-zinc-300 max-w-2xl leading-relaxed font-normal">
            Generate 4K cinema-grade video sequences with full spatiotemporal coherence, dynamic camera choreographies, and transparent <span className="text-brand-300 font-semibold underline decoration-brand-500/50 underline-offset-4">Generation Recipes</span> you can inspect and recreate.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setView('create')}
              className="flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-brand-600 via-brand-500 to-brand-accent px-8 py-4 text-base font-bold text-white shadow-glow-brand hover:brightness-110 active:scale-95 transition-all duration-200"
            >
              <Sparkles className="h-5 w-5" />
              <span>Launch Studio Free</span>
              <ArrowRight className="h-5 w-5" />
            </button>

            <button
              onClick={() => setView('dashboard')}
              className="flex items-center gap-2 rounded-2xl border border-white/15 bg-white/[0.05] px-7 py-4 text-base font-semibold text-zinc-200 hover:bg-white/10 hover:border-white/30 backdrop-blur-md transition-all duration-200"
            >
              <Film className="h-5 w-5 text-brand-400" />
              <span>Open Dashboard</span>
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-6 w-full max-w-3xl rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-6 backdrop-blur-md">
            <div>
              <div className="text-2xl font-bold font-mono text-white">4K UHD</div>
              <div className="text-xs text-zinc-400 mt-0.5">Native Resolution</div>
            </div>
            <div>
              <div className="text-2xl font-bold font-mono text-brand-accent">60 FPS</div>
              <div className="text-xs text-zinc-400 mt-0.5">Temporal Fluidity</div>
            </div>
            <div>
              <div className="text-2xl font-bold font-mono text-white">&lt; 5.8s</div>
              <div className="text-xs text-zinc-400 mt-0.5">GPU Render Speed</div>
            </div>
            <div>
              <div className="text-2xl font-bold font-mono text-brand-400">100%</div>
              <div className="text-xs text-zinc-400 mt-0.5">Recipe Recreate</div>
            </div>
          </div>
        </div>

        {/* Interactive Prompt Showcase Playground */}
        <div className="mt-20">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
                Featured Generation Recipes
              </h2>
              <p className="text-sm text-zinc-400 mt-1">
                Every video is paired with its full recipe parameters. Click <strong className="text-brand-300">Recreate</strong> to load it directly into the Studio Composer.
              </p>
            </div>
            <button
              onClick={() => setView('library')}
              className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-brand-400 hover:text-brand-300 transition-colors"
            >
              <span>View All Library</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SEED_GENERATIONS.slice(0, 3).map((gen) => (
              <div
                key={gen.id}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#10121a] transition-all duration-300 hover:border-brand-500/40 hover:shadow-glow-brand"
              >
                {/* Media Container */}
                <div className="relative aspect-video w-full overflow-hidden bg-zinc-950">
                  <video
                    src={gen.videoUrl}
                    poster={gen.thumbnailUrl}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    muted
                    loop
                    playsInline
                    onMouseEnter={(e) => (e.target as HTMLVideoElement).play().catch(() => {})}
                    onMouseLeave={(e) => {
                      const v = e.target as HTMLVideoElement;
                      v.pause();
                      v.currentTime = 0;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />
                  
                  {/* Model & Style Tag */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="rounded-md bg-black/60 backdrop-blur-md px-2.5 py-1 text-[11px] font-mono font-medium text-brand-300 border border-white/10">
                      {gen.model}
                    </span>
                    <span className="rounded-md bg-brand-500/30 backdrop-blur-md px-2 py-1 text-[11px] font-semibold text-white">
                      {gen.style}
                    </span>
                  </div>

                  {/* Duration Badge */}
                  <div className="absolute top-3 right-3 rounded-md bg-black/60 backdrop-blur-md px-2 py-0.5 text-[11px] font-mono text-zinc-300 border border-white/10">
                    {gen.duration}s • {gen.aspectRatio}
                  </div>
                </div>

                {/* Recipe Details */}
                <div className="p-5 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white line-clamp-1 group-hover:text-brand-300 transition-colors">
                      {gen.title}
                    </h3>
                    <p className="mt-2 text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                      "{gen.prompt}"
                    </p>

                    {/* Camera & Settings Pills */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      <span className="rounded bg-white/5 px-2 py-0.5 text-[10px] font-mono text-zinc-400 border border-white/5">
                        🎥 {gen.cameraMotion}
                      </span>
                      <span className="rounded bg-white/5 px-2 py-0.5 text-[10px] font-mono text-zinc-400 border border-white/5">
                        ⚡ Seed: {gen.seed}
                      </span>
                      {gen.referenceName && (
                        <span className="rounded bg-brand-500/10 px-2 py-0.5 text-[10px] font-mono text-brand-300 border border-brand-500/20">
                          🖼️ Ref: {gen.referenceName}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Recreate Button Action */}
                  <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between gap-3">
                    <button
                      onClick={() => recreateFromGeneration(gen)}
                      className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-brand-500/15 hover:bg-brand-500/30 text-brand-300 border border-brand-500/30 hover:border-brand-500/60 py-2 text-xs font-semibold transition-all duration-200"
                    >
                      <Repeat className="h-3.5 w-3.5" />
                      <span>Recreate Recipe</span>
                    </button>
                    <button
                      onClick={() => {
                        useStudioStore.getState().setActiveGenerationId(gen.id);
                        useStudioStore.getState().setView('result');
                      }}
                      className="flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 px-3 py-2 text-xs font-medium border border-white/10 transition-colors"
                      title="Inspect Generation Result & Recipe"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Why Higgsfield Core Pillars */}
        <div className="mt-28">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-white">
              Built for Creative Rigor
            </h2>
            <p className="mt-3 text-zinc-400 text-sm sm:text-base">
              Say goodbye to unpredictable lottery rollouts. Higgsfield brings deterministic precision, recipe repeatability, and studio-grade control to generative video.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-sm hover:border-brand-500/40 transition-colors">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20 mb-5">
                <Repeat className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Full Recipe Reproducibility</h3>
              <p className="mt-2 text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Every generated frame encodes its prompt, seed, guidance scale, reference weight, camera angle and tensor latents. One-click recreate lets you branch, remix, and iterate endlessly.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-sm hover:border-brand-accent/40 transition-colors">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-brand-accent border border-cyan-500/20 mb-5">
                <Sliders className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Virtual Camera Choreography</h3>
              <p className="mt-2 text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Control cinematic orbital paths, vertigo zooms, crane tilts, and high-speed drone glides with physical inertia and parallax geometry.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-sm hover:border-pink-500/40 transition-colors">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20 mb-5">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Character & Style Locking</h3>
              <p className="mt-2 text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Upload image references to maintain strict identity, wardrobe, facial proportions, and environmental lighting across all cutscenes.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Template Prompts Shelf */}
        <div className="mt-24 rounded-3xl border border-white/10 bg-gradient-to-b from-[#121422] to-[#0d0e17] p-8 sm:p-10 relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-400 mb-2">
                <Flame className="h-4 w-4" />
                <span>Prompt Inspiration</span>
              </div>
              <h3 className="text-2xl font-bold font-display text-white">
                Start with a curated director prompt
              </h3>
              <p className="text-sm text-zinc-400 mt-1 max-w-xl">
                Select any template to instantly load its prompt and camera configuration into the Studio Composer.
              </p>
            </div>

            <button
              onClick={() => setView('create')}
              className="rounded-xl bg-white text-zinc-950 px-6 py-3 text-sm font-bold hover:bg-zinc-200 transition-colors whitespace-nowrap shadow-md"
            >
              Open Composer
            </button>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
            {PROMPT_TEMPLATES.map((tpl) => (
              <div
                key={tpl.id}
                onClick={() => {
                  loadRecipe({
                    prompt: tpl.prompt,
                    model: tpl.model,
                    style: tpl.style,
                    aspectRatio: tpl.aspectRatio,
                    duration: tpl.duration,
                    cameraMotion: tpl.cameraMotion,
                    seed: 58291039,
                    resolution: '4K',
                    fps: 60,
                  });
                }}
                className="group cursor-pointer rounded-xl border border-white/10 bg-white/[0.03] p-4 hover:border-brand-500/50 hover:bg-white/[0.07] transition-all"
              >
                <div className="text-xs font-semibold text-brand-400 font-mono">{tpl.category}</div>
                <div className="text-sm font-bold text-white mt-1 group-hover:text-brand-300">{tpl.title}</div>
                <p className="text-xs text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
                  {tpl.prompt}
                </p>
                <div className="mt-3 flex items-center gap-1 text-[11px] font-medium text-zinc-400 group-hover:text-brand-300">
                  <span>Use Template</span>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
