import React, { useState } from 'react';
import { 
  Sparkles, 
  Wand2, 
  Image as ImageIcon, 
  UploadCloud, 
  Trash2, 
  RotateCcw, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  AlertCircle, 
  Camera, 
  Coins, 
  Cpu, 
  RefreshCw,
  X,
  Zap
} from 'lucide-react';
import { useStudioStore } from '../../store/useStudioStore';
import { 
  MODEL_OPTIONS, 
  STYLE_PRESETS, 
  ASPECT_RATIOS, 
  CAMERA_MOTIONS, 
  REFERENCE_PRESETS
} from '../../data/mockData';

export const CreateView: React.FC = () => {
  const { 
    composer, 
    setComposerField, 
    resetComposer, 
    startGeneration, 
    activeGeneratingTask, 
    cancelGeneration, 
    retryGeneration,
    userCredits,
    addToast
  } = useStudioStore();

  const [showNegativePrompt, setShowNegativePrompt] = useState(Boolean(composer.negativePrompt));
  const [selectedReferencePreset, setSelectedReferencePreset] = useState<string | null>(null);

  const estimatedCost = composer.duration === 15 ? 15 : composer.duration === 10 ? 10 : 5;

  // AI Prompt Enhance Helper
  const handleEnhancePrompt = () => {
    const enhancers = [
      ', 35mm anamorphic lens, volumetric golden hour haze, ray-traced reflections, hyper-detailed textures, 8k masterwork',
      ', cinematic low-angle lighting, photorealistic subsurface scattering, dramatic atmosphere, color graded in DaVinci',
      ', intricate environmental details, macro focus, soft bokeh highlights, spatiotemporal fluid motion, ultra-sharp 4K',
      ', holographic volumetric fog, neon rim-light, octane render styling, cinematic slow motion 60fps'
    ];
    const picked = enhancers[Math.floor(Math.random() * enhancers.length)];
    setComposerField('prompt', composer.prompt.trim() + picked);
    addToast('Prompt magically enhanced with cinematic camera & lighting tokens! ✨', 'success');
  };

  // Quick Inspiration Tag Insertion
  const handleInsertTag = (tag: string) => {
    if (!composer.prompt.includes(tag)) {
      setComposerField('prompt', composer.prompt ? `${composer.prompt}, ${tag}` : tag);
    }
  };

  // Custom File Upload Simulation
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setComposerField('referenceImage', result);
        setComposerField('referenceName', file.name);
        setSelectedReferencePreset(null);
        addToast(`Uploaded reference "${file.name}"`, 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-[#07080c] text-white pb-24">
      
      {/* Active Generation Modal / Top Bar Overlay */}
      {activeGeneratingTask && (
        <div className="sticky top-16 z-40 border-b border-brand-500/40 bg-[#0d0e17]/95 backdrop-blur-xl px-4 py-4 shadow-glow-brand">
          <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4">
            
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-brand-500/20 text-brand-300">
                {activeGeneratingTask.status === 'failed' ? (
                  <AlertCircle className="h-6 w-6 text-rose-400" />
                ) : (
                  <Sparkles className="h-5 w-5 animate-spin text-brand-accent" />
                )}
              </div>
              
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-mono font-bold uppercase tracking-wider ${
                    activeGeneratingTask.status === 'failed' ? 'text-rose-400' : 'text-brand-300'
                  }`}>
                    {activeGeneratingTask.status === 'queued' && '1/3 Queued'}
                    {activeGeneratingTask.status === 'processing' && '2/3 Processing Tensors'}
                    {activeGeneratingTask.status === 'rendering' && '3/3 Neural Diffusion Rendering'}
                    {activeGeneratingTask.status === 'failed' && 'Generation Failed'}
                  </span>
                  <span className="rounded-full bg-brand-500/30 px-2 py-0.2 text-[11px] font-mono font-bold text-white">
                    {activeGeneratingTask.progress}%
                  </span>
                </div>
                <p className="text-xs text-zinc-300 truncate mt-0.5">
                  {activeGeneratingTask.stageMessage}
                </p>
              </div>
            </div>

            {/* Progress Bar & Buttons */}
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="h-2.5 w-full md:w-64 rounded-full bg-zinc-800 overflow-hidden relative">
                <div 
                  className={`h-full transition-all duration-500 rounded-full ${
                    activeGeneratingTask.status === 'failed'
                      ? 'bg-rose-500'
                      : 'bg-gradient-to-r from-brand-500 via-brand-accent to-pink-500'
                  }`}
                  style={{ width: `${activeGeneratingTask.progress}%` }}
                />
              </div>

              {activeGeneratingTask.status === 'failed' ? (
                <button
                  onClick={() => retryGeneration(activeGeneratingTask.id)}
                  className="flex items-center gap-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white px-3 py-1.5 text-xs font-bold transition-colors"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Retry</span>
                </button>
              ) : (
                <button
                  onClick={cancelGeneration}
                  className="flex items-center gap-1 rounded-lg bg-white/10 hover:bg-white/20 text-zinc-300 px-3 py-1.5 text-xs font-medium border border-white/10 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                  <span>Cancel</span>
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Studio Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-brand-500/20 px-2 py-0.5 text-[11px] font-mono font-bold text-brand-300 border border-brand-500/30">
                PRO COMPOSER
              </span>
              <span className="text-xs text-zinc-400">Higgsfield Multi-Modal Studio</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white mt-1">
              Neural Video Composer
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={resetComposer}
              className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset Defaults</span>
            </button>

            <div className="flex items-center gap-2 rounded-xl bg-zinc-900 px-3.5 py-2 border border-white/10 text-xs font-mono">
              <Coins className="h-3.5 w-3.5 text-brand-accent" />
              <span className="text-zinc-400">Estimated:</span>
              <span className="font-bold text-white">{estimatedCost} Credits</span>
            </div>
          </div>
        </div>

        {/* Studio Layout: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Prompt & Conditioning */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Prompt Editor Container */}
            <div className="rounded-2xl border border-white/10 bg-[#10121d] p-5 shadow-lg relative">
              <div className="flex items-center justify-between mb-2.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                  <Wand2 className="h-3.5 w-3.5 text-brand-400" />
                  <span>Scene Prompt</span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleEnhancePrompt}
                    className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-brand-600/30 to-brand-accent/30 hover:from-brand-600/50 hover:to-brand-accent/50 text-brand-300 border border-brand-500/40 px-2.5 py-1 text-xs font-semibold transition-all shadow-sm"
                  >
                    <Sparkles className="h-3 w-3 text-brand-accent" />
                    <span>✨ Magic Enhance</span>
                  </button>
                  <span className="text-[11px] font-mono text-zinc-500">
                    {composer.prompt.length} chars
                  </span>
                </div>
              </div>

              {/* Textarea */}
              <div className="relative">
                <textarea
                  value={composer.prompt}
                  onChange={(e) => setComposerField('prompt', e.target.value)}
                  placeholder="Describe your scene with cinematic details, camera angles, lighting, atmosphere..."
                  rows={4}
                  className="w-full resize-none rounded-xl border border-white/10 bg-[#07080c] p-3.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/50 leading-relaxed font-sans"
                />
              </div>

              {/* Quick Prompt Tokens / Chips */}
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-mono text-zinc-500 mr-1">Quick Add:</span>
                {[
                  'Anamorphic 35mm',
                  'Volumetric Neon Fog',
                  'Golden Hour Lighting',
                  'Hyper-Detailed 8K',
                  'Slow Motion 60fps',
                  'Shallow Depth of Field'
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleInsertTag(chip)}
                    className="rounded-md border border-white/5 bg-white/[0.03] px-2 py-0.5 text-[10px] font-medium text-zinc-300 hover:border-brand-500/40 hover:bg-brand-500/10 hover:text-brand-300 transition-colors"
                  >
                    + {chip}
                  </button>
                ))}
              </div>

              {/* Negative Prompt Accordion */}
              <div className="mt-4 pt-3 border-t border-white/5">
                <button
                  onClick={() => setShowNegativePrompt(!showNegativePrompt)}
                  className="flex items-center justify-between w-full text-xs font-semibold text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <span>Negative Prompt (Unwanted Artifacts)</span>
                    {composer.negativePrompt && (
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-accent" />
                    )}
                  </span>
                  {showNegativePrompt ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                </button>

                {showNegativePrompt && (
                  <div className="mt-2.5">
                    <input
                      type="text"
                      value={composer.negativePrompt}
                      onChange={(e) => setComposerField('negativePrompt', e.target.value)}
                      placeholder="e.g. blurry, deformed, cartoonish, low resolution, bad anatomy, flicker"
                      className="w-full rounded-lg border border-white/10 bg-[#07080c] px-3 py-2 text-xs text-zinc-200 placeholder-zinc-600 focus:border-brand-500 focus:outline-none"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Reference Image & Character Conditioning */}
            <div className="rounded-2xl border border-white/10 bg-[#10121d] p-5">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                  <ImageIcon className="h-3.5 w-3.5 text-brand-accent" />
                  <span>Reference Image / Character Lock</span>
                </label>

                {composer.referenceImage && (
                  <button
                    onClick={() => {
                      setComposerField('referenceImage', null);
                      setComposerField('referenceName', null);
                      setSelectedReferencePreset(null);
                    }}
                    className="flex items-center gap-1 text-[11px] text-rose-400 hover:text-rose-300 transition-colors"
                  >
                    <Trash2 className="h-3 w-3" />
                    <span>Clear Reference</span>
                  </button>
                )}
              </div>

              {/* Reference Preview or Upload Area */}
              {composer.referenceImage ? (
                <div className="rounded-xl border border-brand-500/30 bg-brand-500/5 p-3 flex items-center gap-4">
                  <div className="h-16 w-16 rounded-lg overflow-hidden flex-shrink-0 bg-black border border-white/10">
                    <img src={composer.referenceImage} alt="Ref" className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-white truncate">
                      {composer.referenceName || 'Custom Reference Image'}
                    </div>
                    <div className="mt-2 flex items-center gap-3">
                      <span className="text-[10px] font-mono text-zinc-400">Adherence Weight:</span>
                      <input
                        type="range"
                        min="0.1"
                        max="1.0"
                        step="0.05"
                        value={composer.referenceWeight}
                        onChange={(e) => setComposerField('referenceWeight', parseFloat(e.target.value))}
                        className="w-32 accent-brand-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
                      />
                      <span className="text-[11px] font-mono font-bold text-brand-300">
                        {Math.round(composer.referenceWeight * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  {/* Upload Dropzone */}
                  <label className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/15 bg-white/[0.02] p-4 text-center cursor-pointer hover:border-brand-500/50 hover:bg-white/[0.04] transition-all">
                    <UploadCloud className="h-6 w-6 text-zinc-400 mb-1" />
                    <span className="text-xs font-semibold text-zinc-200">
                      Upload Custom Reference
                    </span>
                    <span className="text-[10px] text-zinc-500 mt-0.5">
                      PNG, JPG or WebP (Identity or Composition Guide)
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  {/* Preset Demo References */}
                  <div className="mt-3">
                    <div className="text-[10px] font-mono text-zinc-400 mb-2">
                      Or pick from sample director references:
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {REFERENCE_PRESETS.map((ref) => (
                        <div
                          key={ref.id}
                          onClick={() => {
                            setComposerField('referenceImage', ref.url);
                            setComposerField('referenceName', ref.name);
                            setSelectedReferencePreset(ref.id);
                            addToast(`Loaded preset "${ref.name}" as reference`, 'info');
                          }}
                          className={`group cursor-pointer rounded-lg border p-1.5 flex items-center gap-2 transition-all ${
                            selectedReferencePreset === ref.id
                              ? 'border-brand-500 bg-brand-500/20'
                              : 'border-white/5 bg-white/[0.02] hover:border-white/20'
                          }`}
                        >
                          <img src={ref.thumbnail} alt={ref.name} className="h-8 w-8 rounded object-cover" />
                          <div className="min-w-0 flex-1">
                            <div className="text-[11px] font-semibold text-zinc-200 truncate">{ref.name}</div>
                            <div className="text-[9px] text-zinc-500 font-mono">{ref.category}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Camera Motion & Choreography */}
            <div className="rounded-2xl border border-white/10 bg-[#10121d] p-5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2 mb-3">
                <Camera className="h-3.5 w-3.5 text-brand-500" />
                <span>Camera Motion & Choreography</span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {CAMERA_MOTIONS.map((motion) => {
                  const isSelected = composer.cameraMotion === motion.id;
                  return (
                    <button
                      key={motion.id}
                      onClick={() => setComposerField('cameraMotion', motion.id)}
                      className={`rounded-xl border p-3 text-left transition-all ${
                        isSelected
                          ? 'border-brand-500 bg-brand-500/15 shadow-sm'
                          : 'border-white/5 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{motion.label}</span>
                        {isSelected && <Check className="h-3.5 w-3.5 text-brand-accent" />}
                      </div>
                      <p className="text-[10px] text-zinc-400 mt-1 line-clamp-1">{motion.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Column: AI Model, Style, Formats & Generate */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Model Selector */}
            <div className="rounded-2xl border border-white/10 bg-[#10121d] p-5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2 mb-3">
                <Cpu className="h-3.5 w-3.5 text-brand-400" />
                <span>AI Video Engine</span>
              </label>

              <div className="space-y-2">
                {MODEL_OPTIONS.map((model) => {
                  const isSelected = composer.model === model.id;
                  return (
                    <div
                      key={model.id}
                      onClick={() => setComposerField('model', model.id)}
                      className={`group cursor-pointer rounded-xl border p-3 transition-all ${
                        isSelected
                          ? 'border-brand-500 bg-brand-500/15 shadow-glow-brand'
                          : 'border-white/5 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white group-hover:text-brand-300">
                            {model.name}
                          </span>
                          <span className="rounded bg-brand-500/30 px-1.5 py-0.5 text-[9px] font-mono text-brand-200">
                            {model.badge}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-zinc-400">{model.fidelity}</span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-1">{model.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Visual Style Presets */}
            <div className="rounded-2xl border border-white/10 bg-[#10121d] p-5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2 mb-3">
                <Sparkles className="h-3.5 w-3.5 text-pink-400" />
                <span>Cinematic Style Preset</span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {STYLE_PRESETS.map((style) => {
                  const isSelected = composer.style === style.id;
                  return (
                    <button
                      key={style.id}
                      onClick={() => setComposerField('style', style.id)}
                      className={`group relative overflow-hidden rounded-xl border text-left aspect-[4/3] p-2 flex flex-col justify-end transition-all ${
                        isSelected
                          ? 'border-brand-400 ring-2 ring-brand-500/50'
                          : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      <img
                        src={style.preview}
                        alt={style.label}
                        className="absolute inset-0 h-full w-full object-cover brightness-75 group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                      
                      <div className="relative z-10">
                        <div className="text-[11px] font-bold text-white leading-tight">
                          {style.label}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Aspect Ratio & Duration */}
            <div className="rounded-2xl border border-white/10 bg-[#10121d] p-5">
              
              {/* Aspect Ratio */}
              <div className="mb-4">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2 block">
                  Aspect Ratio
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {ASPECT_RATIOS.map((ratio) => {
                    const isSelected = composer.aspectRatio === ratio.id;
                    return (
                      <button
                        key={ratio.id}
                        onClick={() => setComposerField('aspectRatio', ratio.id)}
                        className={`rounded-xl border py-2 px-1 text-center transition-all ${
                          isSelected
                            ? 'border-brand-500 bg-brand-500/20 text-white font-bold'
                            : 'border-white/5 bg-white/[0.02] text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        <div className="text-xs font-mono">{ratio.id}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2 block">
                  Duration & Fast Credits
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { sec: 5, credits: 5, label: '5 Seconds' },
                    { sec: 10, credits: 10, label: '10 Seconds' },
                    { sec: 15, credits: 15, label: '15 Seconds' },
                  ].map((dur) => {
                    const isSelected = composer.duration === dur.sec;
                    return (
                      <button
                        key={dur.sec}
                        onClick={() => setComposerField('duration', dur.sec)}
                        className={`rounded-xl border p-2.5 text-center transition-all ${
                          isSelected
                            ? 'border-brand-500 bg-brand-500/20 text-white shadow-sm'
                            : 'border-white/5 bg-white/[0.02] text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        <div className="text-xs font-bold">{dur.label}</div>
                        <div className="text-[10px] font-mono text-brand-300 mt-0.5">{dur.credits} Credits</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Big Launch Generation Button */}
            <div className="rounded-2xl border border-brand-500/30 bg-gradient-to-b from-[#141624] to-[#0e0f18] p-5 shadow-glow-brand">
              <div className="flex items-center justify-between mb-4 text-xs">
                <div className="flex items-center gap-1.5 text-zinc-300">
                  <Coins className="h-4 w-4 text-brand-accent" />
                  <span>Cost: <strong className="text-white font-mono">{estimatedCost} Credits</strong></span>
                </div>
                <div className="text-zinc-400 text-[11px] font-mono">
                  Remaining: <span className="text-emerald-400 font-bold">{userCredits} Credits</span>
                </div>
              </div>

              <button
                disabled={Boolean(activeGeneratingTask) || userCredits < estimatedCost}
                onClick={() => startGeneration(false)}
                className={`w-full flex items-center justify-center gap-2.5 rounded-xl py-4 text-base font-bold text-white shadow-glow-brand transition-all duration-300 ${
                  activeGeneratingTask
                    ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-brand-600 via-brand-500 to-brand-accent hover:brightness-110 active:scale-98'
                }`}
              >
                {activeGeneratingTask ? (
                  <>
                    <Sparkles className="h-5 w-5 animate-spin" />
                    <span>Synthesizing Video... ({activeGeneratingTask.progress}%)</span>
                  </>
                ) : (
                  <>
                    <Zap className="h-5 w-5 fill-white" />
                    <span>Generate Video ({estimatedCost} Credits)</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-zinc-500 text-center mt-3">
                Creates full <strong>Generation Recipe</strong> metadata with 1-click recreation.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
