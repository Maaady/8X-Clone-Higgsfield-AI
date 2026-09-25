import React, { useState } from 'react';
import { useStudioStore } from '../../store/useStudioStore';
import {
  Sparkles,
  Copy,
  Check,
  ArrowRight,
  BookOpen
} from 'lucide-react';

export const StyleLabView: React.FC = () => {
  const {
    styles,
    customPresets,
    setSelectedStyleId,
    setPrompt,
    setActiveView,
    addToast
  } = useStudioStore();

  const [copiedStyleId, setCopiedStyleId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(styles.map(s => s.category)))];

  const filteredStyles = activeCategory === 'all'
    ? styles
    : styles.filter(s => s.category === activeCategory);

  const handleCopyAffix = (affix: string, id: string) => {
    navigator.clipboard.writeText(affix);
    setCopiedStyleId(id);
    addToast('Affix Copied', 'Cinematic prompt tokens copied to clipboard.', 'info');
    setTimeout(() => setCopiedStyleId(null), 2000);
  };

  const handleApplyStyle = (style: typeof styles[0]) => {
    setSelectedStyleId(style.id);
    setActiveView('composer');
    addToast('Style Activated', `"${style.name}" style DNA applied to Composer.`, 'success');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#07080d] bg-grid-holo py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Header */}
        <div className="border-b border-white/10 pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-400" />
              <h1 className="text-2xl font-black font-mono tracking-tight text-white">
                STYLE DNA & PRESET LAB
              </h1>
            </div>
            <p className="text-xs text-zinc-400 mt-1 font-mono">
              Curated Optical Conditioning Presets • Custom Style Alchemy & Token Modifiers
            </p>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`capitalize rounded-xl px-3 py-1.5 text-xs font-mono transition-all ${
                  activeCategory === cat
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-glow-brand'
                    : 'bg-black/40 text-zinc-400 border border-white/10 hover:border-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Style Preset Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStyles.map((style) => {
            const isCopied = copiedStyleId === style.id;
            return (
              <div
                key={style.id}
                className="glass-panel-elevated group rounded-2xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all duration-300 shadow-glow-card flex flex-col justify-between"
              >
                <div>
                  {/* Visual Header Image */}
                  <div className="relative h-44 w-full overflow-hidden bg-black">
                    <img
                      src={style.preview_image}
                      alt={style.name}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                    
                    <div className="absolute top-3 left-3 right-3 flex justify-between items-center">
                      <span className="rounded-lg bg-black/60 backdrop-blur-md px-2.5 py-1 text-[10px] font-mono font-bold text-purple-300 border border-purple-500/30">
                        {style.category}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-base font-bold text-white font-mono">{style.name}</h3>
                      <p className="text-[11px] text-zinc-300 line-clamp-1">{style.description}</p>
                    </div>
                  </div>

                  {/* Token Affixes Details */}
                  <div className="p-4 space-y-3">
                    <div className="rounded-xl bg-black/50 border border-white/5 p-2.5 space-y-1">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
                        Optical Conditioning Prompt Affix:
                      </span>
                      <p className="text-xs font-mono text-zinc-300 line-clamp-2 leading-relaxed">
                        "{style.prompt_affix}"
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="p-4 pt-0 flex items-center justify-between gap-2 border-t border-white/5 mt-2">
                  <button
                    onClick={() => handleCopyAffix(style.prompt_affix, style.id)}
                    className="flex items-center gap-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 text-xs font-mono text-zinc-300 transition-colors"
                  >
                    {isCopied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    {isCopied ? 'Copied' : 'Copy Tokens'}
                  </button>

                  <button
                    onClick={() => handleApplyStyle(style)}
                    className="flex items-center gap-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500 hover:text-white border border-purple-500/40 px-3.5 py-1.5 text-xs font-mono font-semibold text-purple-300 transition-all"
                  >
                    Apply in Studio
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {/* Custom Presets Section */}
        {customPresets.length > 0 && (
          <div className="space-y-4 pt-6 border-t border-white/10">
            <h2 className="text-sm font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Director Custom Presets ({customPresets.length})
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {customPresets.map((cp) => (
                <div key={cp.id} className="glass-panel rounded-2xl p-4 border border-white/10 space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="font-mono font-bold text-sm text-white">{cp.name}</h4>
                    <span className="text-[10px] font-mono text-zinc-500">{new Date(cp.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-zinc-400 line-clamp-2">{cp.prompt}</p>
                  <div className="flex justify-between items-center pt-2 border-t border-white/5">
                    <span className="text-[10px] font-mono text-amber-300">{cp.aspect_ratio} • {cp.motion_mode}</span>
                    <button
                      onClick={() => {
                        setPrompt(cp.prompt);
                        setSelectedStyleId(cp.style_id);
                        setActiveView('composer');
                        addToast('Preset Loaded', `Applied preset "${cp.name}".`, 'info');
                      }}
                      className="text-xs font-mono text-amber-400 hover:underline flex items-center gap-1"
                    >
                      Load into Composer &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
