import React, { useState } from 'react';
import { useStudioStore } from '../../store/useStudioStore';
import {
  Sparkles,
  Zap,
  Sliders,
  Compass,
  Camera,
  Film,
  Dice5,
  Eye,
  Flame,
  Cpu,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Radio
} from 'lucide-react';
import type { AspectRatioType } from '../../types';

export const ComposerView: React.FC = () => {
  const {
    prompt,
    setPrompt,
    negativePrompt,
    setNegativePrompt,
    selectedModelId,
    setSelectedModelId,
    selectedStyleId,
    setSelectedStyleId,
    aspectRatio,
    setAspectRatio,
    durationSec,
    setDurationSec,
    motionMode,
    setMotionMode,
    seed,
    setSeed,
    randomizeSeed,
    steps,
    setSteps,
    cfgScale,
    setCfgScale,
    focalLength,
    setFocalLength,
    aperture,
    setAperture,
    simulateFailure,
    setSimulateFailure,
    isEnhancingPrompt,
    isSubmitting,
    enhancePrompt,
    submitGeneration,
    models,
    styles,
    cameraPresets,
    generations,
    activeGenerationId,
    userProfile
  } = useStudioStore();

  const [showNegative, setShowNegative] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showSafeFrames, setShowSafeFrames] = useState(true);

  // Active running generation if any
  const activeGen = generations.find(g => g.id === activeGenerationId && g.status !== 'completed' && g.status !== 'failed');

  // Selected Style Info
  const currentStyle = styles.find(s => s.id === selectedStyleId) || styles[0];
  const currentModel = models.find(m => m.id === selectedModelId) || models[0];
  const currentCamera = cameraPresets.find(c => c.id === motionMode) || cameraPresets[0];

  // Token estimate
  const tokenCount = Math.max(12, Math.floor(prompt.trim().split(/\s+/).filter(Boolean).length * 1.3));
  const creditCost = (currentModel?.cost_per_sec || 3) * durationSec;

  // Quick Inspiration Presets
  const DIRECTOR_PRESETS = [
    {
      title: 'Neon Cyberpunk Ronin',
      prompt: 'A cybernetic neon samurai standing on a rain-soaked rooftop in Neo-Tokyo 2099, holographic kanji reflections on wet carbon armor, 35mm anamorphic lens, shallow depth of field, 8k cinematic lighting.',
      style: 'cyberpunk-2099',
      camera: 'cam-orbit-360',
      aspect: '16:9' as AspectRatioType
    },
    {
      title: 'Dunes of Arrakis Titan',
      prompt: 'Massive obsidian alien monolith rising out of immense shifting desert sand dunes at golden hour, tiny exploratory rover in foreground with headlights on, swirling dust storm with sunbeams piercing through particulate haze.',
      style: 'anamorphic-35mm',
      camera: 'cam-crane-ascend',
      aspect: '21:9' as AspectRatioType
    },
    {
      title: 'Abyssal Ethereal Leviathan',
      prompt: 'Gargantuan bioluminescent ethereal whale swimming through dark crystalline underwater trench, emitting pulsating cyan and emerald light particles, volumetric god rays from above water surface.',
      style: 'hyper-surreal-dream',
      camera: 'cam-steadicam-push',
      aspect: '16:9' as AspectRatioType
    },
    {
      title: 'Orbital Atmospheric Re-Entry',
      prompt: 'Space capsule cutting through the upper atmosphere during fiery re-entry, glowing plasma sheath wrapping around heat shield, Earth curvature with glowing aurora borealis below, stars above.',
      style: 'imax-documentary',
      camera: 'cam-fpv-drone',
      aspect: '16:9' as AspectRatioType
    }
  ];

  const aspectRatios: { id: AspectRatioType; label: string; ratio: string; iconSize: string }[] = [
    { id: '16:9', label: '16:9 Widescreen', ratio: 'aspect-video', iconSize: 'w-6 h-3.5' },
    { id: '21:9', label: '21:9 CinemaScope', ratio: 'aspect-[21/9]', iconSize: 'w-7 h-3' },
    { id: '9:16', label: '9:16 Vertical Story', ratio: 'aspect-[9/16]', iconSize: 'w-3.5 h-6' },
    { id: '1:1', label: '1:1 Square Format', ratio: 'aspect-square', iconSize: 'w-4 h-4' },
    { id: '4:5', label: '4:5 Editorial Portrait', ratio: 'aspect-[4/5]', iconSize: 'w-4 h-5' }
  ];

  const focalLengths = ['18mm Ultra-Wide', '24mm Wide Prime', '35mm Storyteller', '50mm Standard Master', '85mm Cinematic Portrait'];
  const apertures = ['f/1.4 Dream Bokeh', 'f/1.8 Cinematic Prime', 'f/2.8 Sharp Depth', 'f/4.0 Balanced', 'f/8.0 Deep Focus'];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#07080d] bg-grid-holo bg-radial-cinema py-6 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        
        {/* Top Header Bar with Quick Inspiration */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white font-mono flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-full bg-amber-400 animate-pulse"></span>
                STUDIO COMPOSER
              </h1>
              <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-[11px] font-mono text-amber-300">
                Directorial Command Deck
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Direct spatiotemporal neural diffusion with precision lens framing, style conditioning & 3D camera choreography.
            </p>
          </div>

          {/* Quick Recipe Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
            <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider whitespace-nowrap flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-amber-400" /> Presets:
            </span>
            {DIRECTOR_PRESETS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setPrompt(p.prompt);
                  setSelectedStyleId(p.style);
                  setMotionMode(p.camera);
                  setAspectRatio(p.aspect);
                }}
                className="whitespace-nowrap rounded-lg bg-white/5 hover:bg-amber-500/20 hover:border-amber-500/40 border border-white/10 px-2.5 py-1 text-xs font-medium text-zinc-300 hover:text-amber-200 transition-all"
              >
                {p.title}
              </button>
            ))}
          </div>
        </div>

        {/* Main 3-Column Studio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* LEFT COLUMN: Prompt & Neural Conditioning (Cols 4) */}
          <div className="lg:col-span-4 space-y-5">

            {/* Prompt Card */}
            <div className="glass-panel-elevated rounded-2xl p-4 sm:p-5 shadow-glow-card relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <Film className="h-3.5 w-3.5" />
                  Visual Scene Directing
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-zinc-400 bg-black/40 px-2 py-0.5 rounded border border-white/5">
                    ~{tokenCount} Tokens
                  </span>
                </div>
              </div>

              {/* Textarea */}
              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your cinematic scene, atmosphere, lighting, camera motion, and action..."
                  rows={5}
                  className="w-full rounded-xl bg-black/50 border border-white/10 p-3.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/40 focus:outline-none transition-all resize-none font-sans leading-relaxed"
                />

                {/* Magic Enhance Action Button */}
                <div className="mt-2 flex items-center justify-between">
                  <button
                    onClick={enhancePrompt}
                    disabled={isEnhancingPrompt || !prompt.trim()}
                    className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-semibold text-xs px-3 py-1.5 shadow-glow-amber transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Sparkles className={`h-3.5 w-3.5 ${isEnhancingPrompt ? 'animate-spin' : ''}`} />
                    {isEnhancingPrompt ? 'Synthesizing Optical Conditioning...' : '✨ Magic AI Enhance'}
                  </button>

                  <button
                    onClick={() => setShowNegative(!showNegative)}
                    className="text-xs font-mono text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
                  >
                    Negative Prompt {showNegative ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  </button>
                </div>
              </div>

              {/* Negative Prompt Accordion */}
              {showNegative && (
                <div className="mt-3 pt-3 border-t border-white/10 space-y-2 animate-fadeIn">
                  <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="h-3 w-3 text-red-400" />
                    Negative Conditioning (Exclude Artifacts)
                  </label>
                  <textarea
                    value={negativePrompt}
                    onChange={(e) => setNegativePrompt(e.target.value)}
                    placeholder="Exclude blurry, oversaturated, deformed hands, cartoonish look..."
                    rows={2}
                    className="w-full rounded-lg bg-black/40 border border-red-500/20 p-2 text-xs text-zinc-300 placeholder-zinc-600 focus:border-red-500/40 focus:outline-none resize-none"
                  />
                  <div className="flex flex-wrap gap-1">
                    {['plastic skin', 'jittery camera', 'low bitrate', 'temporal flicker', 'blurry background'].map((tag) => (
                      <button
                        key={tag}
                        onClick={() => {
                          if (!negativePrompt.includes(tag)) {
                            setNegativePrompt(negativePrompt ? `${negativePrompt}, ${tag}` : tag);
                          }
                        }}
                        className="rounded bg-white/5 hover:bg-red-500/20 hover:text-red-300 border border-white/5 px-2 py-0.5 text-[10px] text-zinc-400 transition-colors"
                      >
                        +{tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* AI Foundation Model Selector */}
            <div className="glass-panel-elevated rounded-2xl p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                  <Cpu className="h-3.5 w-3.5" />
                  Neural Synthesis Model
                </label>
                <span className="text-[10px] font-mono text-zinc-400">
                  {currentModel?.vram_req}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {models.map((m) => {
                  const isSelected = selectedModelId === m.id;
                  return (
                    <div
                      key={m.id}
                      onClick={() => setSelectedModelId(m.id)}
                      className={`cursor-pointer rounded-xl p-3 border transition-all duration-200 ${
                        isSelected
                          ? 'bg-cyan-950/30 border-cyan-500/60 shadow-glow-cyan'
                          : 'bg-black/30 border-white/5 hover:border-white/20 hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`h-2 w-2 rounded-full ${isSelected ? 'bg-cyan-400 animate-ping' : 'bg-zinc-600'}`} />
                          <span className="font-mono font-bold text-xs text-white">{m.name}</span>
                        </div>
                        <span className="rounded bg-white/10 px-1.5 py-0.5 text-[9px] font-mono font-bold text-amber-300 border border-white/10">
                          {m.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-1 leading-snug line-clamp-1">{m.description}</p>
                      <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-zinc-500 border-t border-white/5 pt-1.5">
                        <span>Max: {m.max_resolution}</span>
                        <span className="text-amber-400 font-semibold">{m.cost_per_sec} tokens/sec</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Style DNA Selector */}
            <div className="glass-panel-elevated rounded-2xl p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5" />
                  Cinematic Style DNA
                </label>
                <span className="text-[10px] font-mono text-zinc-400">{styles.length} Styles</span>
              </div>

              <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                {styles.map((s) => {
                  const isSelected = selectedStyleId === s.id;
                  return (
                    <div
                      key={s.id}
                      onClick={() => setSelectedStyleId(s.id)}
                      className={`group relative cursor-pointer overflow-hidden rounded-xl border transition-all duration-200 ${
                        isSelected
                          ? 'border-purple-500 shadow-glow-brand ring-1 ring-purple-500'
                          : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      <div className="relative h-16 w-full bg-zinc-900">
                        <img
                          src={s.preview_image}
                          alt={s.name}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                        <div className="absolute bottom-1.5 left-2 right-2">
                          <span className="block font-mono text-[11px] font-bold text-white leading-tight truncate">
                            {s.name}
                          </span>
                          <span className="block text-[9px] text-purple-300 font-mono">{s.category}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* CENTER STAGE: Directorial Viewport & Interactive HUD (Cols 5) */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* Directorial Viewport Card */}
            <div className="glass-panel-elevated rounded-2xl p-4 sm:p-5 shadow-glow-card flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Camera className="h-4 w-4 text-amber-400" />
                  <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    Virtual Director Viewport
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400">
                  <button
                    onClick={() => setShowSafeFrames(!showSafeFrames)}
                    className={`px-2 py-0.5 rounded border transition-colors ${
                      showSafeFrames ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-black/30 border-white/5 text-zinc-500'
                    }`}
                  >
                    Framing Grid
                  </button>
                  <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10 text-zinc-300">
                    {aspectRatio}
                  </span>
                </div>
              </div>

              {/* Viewport Frame Container */}
              <div className="relative w-full rounded-xl overflow-hidden bg-black border border-white/15 flex items-center justify-center min-h-[320px] max-h-[440px]">
                
                {/* Background Ambient & Noise or Active Video */}
                {activeGen ? (
                  <div className="relative w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-b from-black via-zinc-950 to-black">
                    {/* Animated Neural Lattice */}
                    <div className="absolute inset-0 bg-grid-holo opacity-40 animate-pulse" />
                    
                    {/* Scanning Telemetry Ring */}
                    <div className="relative flex items-center justify-center h-28 w-28 rounded-full border-2 border-dashed border-amber-500/60 animate-spin">
                      <div className="h-20 w-20 rounded-full border border-cyan-400/50 animate-ping opacity-50" />
                      <Cpu className="absolute h-8 w-8 text-amber-400 animate-pulse" />
                    </div>

                    {/* Stage Telemetry */}
                    <div className="mt-4 text-center z-10 space-y-1.5 max-w-xs">
                      <span className="inline-block rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-0.5 text-[11px] font-mono font-bold animate-pulse">
                        {activeGen.status.toUpperCase()} • {Math.round(activeGen.progress)}%
                      </span>
                      <p className="text-xs text-white font-medium">{activeGen.current_stage}</p>
                      <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mt-2 border border-white/10">
                        <div
                          className="bg-gradient-to-r from-amber-500 via-orange-500 to-cyan-400 h-full transition-all duration-300"
                          style={{ width: `${activeGen.progress}%` }}
                        />
                      </div>
                      <p className="text-[10px] font-mono text-zinc-500 mt-1">GPU Latent Tensor Array #14</p>
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full h-full flex items-center justify-center group">
                    <img
                      src={currentStyle.preview_image}
                      alt="Director Canvas"
                      className="w-full h-full object-cover opacity-60 filter saturate-125 transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60" />

                    {/* Safe Framing Overlay */}
                    {showSafeFrames && (
                      <div className="absolute inset-4 pointer-events-none border border-amber-400/20 border-dashed rounded-lg flex flex-col justify-between p-2">
                        <div className="flex justify-between text-[9px] font-mono text-amber-400/60">
                          <span>SAFE TITLE 90%</span>
                          <span>{aspectRatio}</span>
                        </div>
                        {/* Center Crosshair */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                          <div className="w-6 h-[1px] bg-amber-400/40" />
                          <div className="h-6 w-[1px] bg-amber-400/40 -mt-3 ml-3" />
                        </div>
                        <div className="flex justify-between text-[9px] font-mono text-amber-400/60">
                          <span>FOCAL: {focalLength.split(' ')[0]}</span>
                          <span>{aperture.split(' ')[0]}</span>
                        </div>
                      </div>
                    )}

                    {/* HUD Lens Overlay on Viewport */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-black/60 backdrop-blur-md rounded-lg p-2 border border-white/10 text-[11px] font-mono text-zinc-300">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-white font-semibold">DIRECTOR PREVIEW</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-amber-400">{currentCamera.name}</span>
                        <span className="text-zinc-600">|</span>
                        <span>{durationSec}s @ 60fps</span>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Lens & Optical Controls */}
              <div className="mt-4 grid grid-cols-2 gap-3 pt-3 border-t border-white/10">
                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 mb-1.5 flex items-center gap-1">
                    <Eye className="h-3 w-3 text-amber-400" />
                    Lens Focal Length
                  </label>
                  <select
                    value={focalLength}
                    onChange={(e) => setFocalLength(e.target.value)}
                    className="w-full rounded-xl bg-black/50 border border-white/10 px-3 py-2 text-xs text-white focus:border-amber-500/60 focus:outline-none font-mono"
                  >
                    {focalLengths.map((f) => (
                      <option key={f} value={f} className="bg-zinc-900 text-white">
                        {f}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 mb-1.5 flex items-center gap-1">
                    <Sliders className="h-3 w-3 text-cyan-400" />
                    Optical Aperture
                  </label>
                  <select
                    value={aperture}
                    onChange={(e) => setAperture(e.target.value)}
                    className="w-full rounded-xl bg-black/50 border border-white/10 px-3 py-2 text-xs text-white focus:border-cyan-500/60 focus:outline-none font-mono"
                  >
                    {apertures.map((a) => (
                      <option key={a} value={a} className="bg-zinc-900 text-white">
                        {a}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

            </div>

            {/* Quick Status / Recent Generation Preview Mini */}
            <div className="glass-panel rounded-2xl p-4 flex items-center justify-between border border-white/10">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  <Flame className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-xs font-mono font-bold text-white block">Cluster Render Quota</span>
                  <p className="text-[11px] text-zinc-400">
                    Remaining GPU Balance: <span className="text-amber-400 font-bold">{userProfile?.credits_balance}</span> credits
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-[10px] font-mono text-emerald-400 font-semibold">
                GPU ONLINE
              </span>
            </div>

          </div>

          {/* RIGHT COLUMN: Camera Choreography & Dispatch (Cols 3) */}
          <div className="lg:col-span-3 space-y-5">
            
            {/* Camera Motion & Choreography */}
            <div className="glass-panel-elevated rounded-2xl p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <Compass className="h-3.5 w-3.5" />
                  3D Camera Choreography
                </label>
              </div>

              <div className="space-y-2">
                {cameraPresets.map((c) => {
                  const isSelected = motionMode === c.id;
                  return (
                    <div
                      key={c.id}
                      onClick={() => setMotionMode(c.id)}
                      className={`cursor-pointer rounded-xl p-2.5 border transition-all duration-200 flex items-center justify-between ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-500/60 shadow-glow-amber text-amber-200'
                          : 'bg-black/30 border-white/5 hover:border-white/20 hover:bg-white/5 text-zinc-400'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Radio className={`h-3.5 w-3.5 shrink-0 ${isSelected ? 'text-amber-400' : 'text-zinc-600'}`} />
                        <div>
                          <span className="block font-mono text-xs font-bold text-white truncate">{c.name}</span>
                          <span className="block text-[10px] text-zinc-400">{c.type} • {c.speed}x speed</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Aspect Ratio & Duration */}
            <div className="glass-panel-elevated rounded-2xl p-4 sm:p-5 space-y-4">
              
              {/* Aspect Ratio Pills */}
              <div>
                <label className="block text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider mb-2">
                  Aspect Ratio
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {aspectRatios.map((ar) => {
                    const isSelected = aspectRatio === ar.id;
                    return (
                      <button
                        key={ar.id}
                        type="button"
                        onClick={() => setAspectRatio(ar.id)}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${
                          isSelected
                            ? 'bg-amber-500/20 border-amber-500/60 text-amber-300'
                            : 'bg-black/30 border-white/10 text-zinc-400 hover:border-white/30'
                        }`}
                        title={ar.label}
                      >
                        <div className={`border-2 border-current rounded-sm mb-1 ${ar.iconSize}`} />
                        <span className="text-[10px] font-mono font-bold">{ar.id}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Duration Pills */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider">
                    Duration & Cost
                  </label>
                  <span className="text-[11px] font-mono text-amber-400 font-bold">
                    {creditCost} Credits
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[5, 10, 15].map((sec) => {
                    const isSelected = durationSec === sec;
                    return (
                      <button
                        key={sec}
                        type="button"
                        onClick={() => setDurationSec(sec)}
                        className={`py-2 px-3 rounded-xl border text-xs font-mono font-bold transition-all ${
                          isSelected
                            ? 'bg-amber-500/20 border-amber-500/60 text-amber-300'
                            : 'bg-black/30 border-white/10 text-zinc-400 hover:border-white/20'
                        }`}
                      >
                        {sec} Seconds
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Advanced Parameters Accordion */}
              <div className="border-t border-white/10 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="w-full flex items-center justify-between text-xs font-mono text-zinc-400 hover:text-white"
                >
                  <span className="flex items-center gap-1.5">
                    <Sliders className="h-3 w-3" />
                    Advanced Diffusion Controls
                  </span>
                  {showAdvanced ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </button>

                {showAdvanced && (
                  <div className="mt-3 space-y-3 animate-fadeIn">
                    {/* Guidance Scale */}
                    <div>
                      <div className="flex justify-between text-[11px] font-mono text-zinc-400 mb-1">
                        <span>CFG Guidance Scale</span>
                        <span className="text-amber-400 font-bold">{cfgScale}</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="20"
                        step="0.5"
                        value={cfgScale}
                        onChange={(e) => setCfgScale(parseFloat(e.target.value))}
                        className="w-full accent-amber-500 h-1.5 bg-black rounded-lg"
                      />
                    </div>

                    {/* Sampling Steps */}
                    <div>
                      <div className="flex justify-between text-[11px] font-mono text-zinc-400 mb-1">
                        <span>Diffusion Steps</span>
                        <span className="text-amber-400 font-bold">{steps}</span>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="80"
                        step="5"
                        value={steps}
                        onChange={(e) => setSteps(parseInt(e.target.value))}
                        className="w-full accent-amber-500 h-1.5 bg-black rounded-lg"
                      />
                    </div>

                    {/* Seed Randomizer */}
                    <div>
                      <div className="flex justify-between text-[11px] font-mono text-zinc-400 mb-1">
                        <span>Entropy Seed</span>
                        <button
                          type="button"
                          onClick={randomizeSeed}
                          className="text-[10px] text-amber-400 hover:underline flex items-center gap-1"
                        >
                          <Dice5 className="h-3 w-3" /> Randomize
                        </button>
                      </div>
                      <input
                        type="number"
                        value={seed}
                        onChange={(e) => setSeed(parseInt(e.target.value) || 0)}
                        className="w-full rounded-lg bg-black/40 border border-white/10 px-2.5 py-1 text-xs text-white font-mono"
                      />
                    </div>

                    {/* QA Failure Simulator Toggle */}
                    <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                      <label className="text-[10px] font-mono text-zinc-400 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3 text-amber-500" />
                        Simulate GPU OOM Failure
                      </label>
                      <input
                        type="checkbox"
                        checked={simulateFailure}
                        onChange={(e) => setSimulateFailure(e.target.checked)}
                        className="accent-amber-500 h-3.5 w-3.5 rounded"
                      />
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Primary Submit CTA */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={submitGeneration}
                disabled={isSubmitting || !prompt.trim()}
                className="w-full relative group overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-[1px] shadow-glow-amber transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <div className="relative flex items-center justify-center gap-3 rounded-[15px] bg-[#0c0e17] px-6 py-4 transition-colors group-hover:bg-transparent">
                  <Zap className={`h-5 w-5 ${isSubmitting ? 'animate-bounce text-amber-400' : 'text-amber-400 group-hover:text-black'}`} />
                  <div className="text-left">
                    <span className="block font-mono font-extrabold text-sm text-white group-hover:text-black tracking-wide">
                      {isSubmitting ? 'ENQUEUING IN GPU CLUSTER...' : 'DISPATCH DIFFUSION RENDER'}
                    </span>
                    <span className="block text-[10px] font-mono text-amber-400 group-hover:text-black/80">
                      Est. Latency: ~5.8s • Deducts {creditCost} Tokens
                    </span>
                  </div>
                </div>
              </button>

              <p className="text-center text-[10px] font-mono text-zinc-500">
                Connected to SQLite Engine & US-East H100 Tensor Array
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
