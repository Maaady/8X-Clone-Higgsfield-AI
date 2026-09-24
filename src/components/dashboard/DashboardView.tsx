import React from 'react';
import { 
  Sparkles, 
  Video, 
  Image as ImageIcon, 
  Camera, 
  Users, 
  Repeat, 
  Heart, 
  ArrowRight, 
  Coins, 
  Flame,
  Eye
} from 'lucide-react';
import { useStudioStore } from '../../store/useStudioStore';
import { PROMPT_TEMPLATES } from '../../data/mockData';

export const DashboardView: React.FC = () => {
  const { 
    generations, 
    userCredits, 
    setView, 
    recreateFromGeneration, 
    toggleFavorite,
    setActiveGenerationId,
    activeGeneratingTask,
    loadRecipe
  } = useStudioStore();

  const creationModes = [
    {
      title: 'Text to Video',
      tagline: 'Prompt to Cinematic 4K',
      description: 'Synthesize full scenes with deep lighting and camera control.',
      icon: Video,
      color: 'from-purple-600 to-indigo-600',
      action: () => setView('create')
    },
    {
      title: 'Image to Video',
      tagline: 'Animate Still Frames',
      description: 'Bring still concept art and character portraits to life.',
      icon: ImageIcon,
      color: 'from-cyan-500 to-blue-600',
      action: () => {
        setView('create');
      }
    },
    {
      title: 'Camera Choreography',
      tagline: 'Direct 3D Paths',
      description: 'Orbit, pan, zoom, tilt and FPV drone glide controls.',
      icon: Camera,
      color: 'from-emerald-500 to-teal-700',
      action: () => setView('create')
    },
    {
      title: 'Character Consistency',
      tagline: 'Multi-scene Identity',
      description: 'Strict facial and wardrobe lock across dynamic angles.',
      icon: Users,
      color: 'from-pink-500 to-rose-600',
      action: () => setView('create')
    }
  ];

  return (
    <div className="min-h-screen bg-[#07080c] text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-semibold text-emerald-400 font-mono">Neural GPU Cluster Connected</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-white mt-1">
              Creative Director Workspace
            </h1>
            <p className="text-sm text-zinc-400 mt-1">
              Welcome back. Synthesize new scenes, inspect generation recipes, or manage your media vault.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setView('create')}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 via-brand-500 to-brand-accent px-5 py-2.5 text-sm font-bold text-white shadow-glow-brand hover:brightness-110 active:scale-95 transition-all"
            >
              <Sparkles className="h-4 w-4" />
              <span>Launch Composer</span>
            </button>
          </div>
        </div>

        {/* Active Generation Alert Banner (If in progress) */}
        {activeGeneratingTask && (
          <div className="mt-6 rounded-2xl border border-brand-500/40 bg-gradient-to-r from-brand-950/60 via-purple-900/30 to-zinc-900 p-5 shadow-glow-brand animate-pulse-slow">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/20 text-brand-400 animate-spin">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-300">
                      Active Task: {activeGeneratingTask.status}
                    </span>
                    <span className="rounded-full bg-brand-500/30 px-2 py-0.5 text-[10px] font-bold text-white">
                      {activeGeneratingTask.progress}%
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-white mt-0.5 line-clamp-1">
                    {activeGeneratingTask.stageMessage}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setView('create')}
                  className="rounded-lg bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 text-xs font-semibold shadow transition-all"
                >
                  View Live Progress
                </button>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4 h-2 w-full rounded-full bg-black/40 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-500 via-brand-accent to-pink-500 transition-all duration-500"
                style={{ width: `${activeGeneratingTask.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Quick Stats Grid */}
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-medium uppercase tracking-wider">Fast Credits</span>
              <Coins className="h-4 w-4 text-brand-400" />
            </div>
            <div className="mt-2 text-2xl font-bold font-mono text-white">{userCredits}</div>
            <div className="mt-1 text-[11px] text-zinc-400">Renews in 18 days</div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-medium uppercase tracking-wider">Total Generations</span>
              <Video className="h-4 w-4 text-brand-accent" />
            </div>
            <div className="mt-2 text-2xl font-bold font-mono text-white">{generations.length}</div>
            <div className="mt-1 text-[11px] text-zinc-400">Across 5 AI models</div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-medium uppercase tracking-wider">Active Engine</span>
              <Sparkles className="h-4 w-4 text-pink-400" />
            </div>
            <div className="mt-2 text-lg font-bold text-white truncate">Higgsfield Cinema</div>
            <div className="mt-1 text-[11px] text-brand-400 font-mono">v2.5 Spatiotemporal</div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-medium uppercase tracking-wider">Favorites Saved</span>
              <Heart className="h-4 w-4 text-rose-400" />
            </div>
            <div className="mt-2 text-2xl font-bold font-mono text-white">
              {generations.filter((g) => g.isFavorite).length}
            </div>
            <div className="mt-1 text-[11px] text-zinc-400">Tagged in library</div>
          </div>
        </div>

        {/* Creation Modes Banner Grid */}
        <div className="mt-10">
          <h2 className="text-lg font-bold font-display text-white mb-4">
            Creative Generation Modes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {creationModes.map((mode, idx) => {
              const Icon = mode.icon;
              return (
                <div
                  key={idx}
                  onClick={mode.action}
                  className="group cursor-pointer rounded-2xl border border-white/10 bg-white/[0.02] p-5 hover:border-brand-500/50 hover:bg-white/[0.05] transition-all duration-300"
                >
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${mode.color} p-2 text-white shadow-md group-hover:scale-110 transition-transform`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="mt-4">
                    <span className="text-[11px] font-semibold text-brand-400 font-mono uppercase tracking-wider">
                      {mode.tagline}
                    </span>
                    <h3 className="text-base font-bold text-white mt-0.5 group-hover:text-brand-300 transition-colors">
                      {mode.title}
                    </h3>
                    <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
                      {mode.description}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-brand-400 group-hover:translate-x-1 transition-transform">
                    <span>Open Composer</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Generations Shelf */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold font-display text-white">
                Recent Generation History
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Inspect recipes, preview in high-definition, or recreate instantly in the composer.
              </p>
            </div>
            <button
              onClick={() => setView('library')}
              className="flex items-center gap-1.5 text-xs font-semibold text-brand-400 hover:text-brand-300 transition-colors"
            >
              <span>View All ({generations.length})</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {generations.slice(0, 3).map((gen) => (
              <div
                key={gen.id}
                className="group relative flex flex-col rounded-2xl border border-white/10 bg-[#0f111a] overflow-hidden transition-all duration-300 hover:border-brand-500/40 hover:shadow-glow-brand"
              >
                {/* Media Container */}
                <div className="relative aspect-video w-full overflow-hidden bg-zinc-950">
                  <video
                    src={gen.videoUrl}
                    poster={gen.thumbnailUrl}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

                  {/* Favorite Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(gen.id);
                    }}
                    className={`absolute top-3 right-3 rounded-full p-2 backdrop-blur-md transition-colors ${
                      gen.isFavorite
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                        : 'bg-black/50 text-zinc-400 hover:text-white border border-white/10'
                    }`}
                    title={gen.isFavorite ? 'Remove Favorite' : 'Add to Favorites'}
                  >
                    <Heart className={`h-3.5 w-3.5 ${gen.isFavorite ? 'fill-rose-500' : ''}`} />
                  </button>

                  {/* Model tag */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <span className="rounded-md bg-black/70 backdrop-blur-md px-2 py-0.5 text-[10px] font-mono text-brand-300 border border-white/10">
                      {gen.model}
                    </span>
                    <span className="rounded-md bg-brand-500/20 backdrop-blur-md px-2 py-0.5 text-[10px] font-semibold text-white">
                      {gen.duration}s • {gen.aspectRatio}
                    </span>
                  </div>
                </div>

                {/* Recipe snippet */}
                <div className="p-4 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white line-clamp-1 group-hover:text-brand-300 transition-colors">
                      {gen.title}
                    </h3>
                    <p className="mt-1 text-xs text-zinc-400 line-clamp-2">
                      {gen.prompt}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                    <button
                      onClick={() => recreateFromGeneration(gen)}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-brand-500/20 hover:bg-brand-500/30 text-brand-300 border border-brand-500/30 py-2 text-xs font-semibold transition-colors"
                    >
                      <Repeat className="h-3.5 w-3.5" />
                      <span>Recreate</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveGenerationId(gen.id);
                        setView('result');
                      }}
                      className="flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 px-3 py-2 text-xs font-medium border border-white/10 transition-colors"
                      title="Inspect Result & Recipe"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Prompt Recipe Showcase Shelf */}
        <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-amber-400" />
              <h2 className="text-lg font-bold font-display text-white">
                Trending Production Recipes
              </h2>
            </div>
            <span className="text-xs text-zinc-400">Click to load recipe into composer</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    seed: 77291044,
                    resolution: '4K UHD',
                    fps: 60,
                  });
                }}
                className="group flex items-start gap-4 rounded-xl border border-white/5 bg-white/[0.03] p-4 hover:border-brand-500/40 hover:bg-white/[0.06] cursor-pointer transition-all"
              >
                <div className="h-16 w-24 rounded-lg overflow-hidden flex-shrink-0 bg-zinc-900">
                  <img src={tpl.previewUrl} alt={tpl.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-semibold text-brand-400">{tpl.category}</span>
                    <span className="text-[10px] text-zinc-500 font-mono">{tpl.model}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white truncate mt-0.5 group-hover:text-brand-300">{tpl.title}</h4>
                  <p className="text-xs text-zinc-400 line-clamp-1 mt-1">{tpl.prompt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
