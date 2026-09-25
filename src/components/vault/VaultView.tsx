import React, { useState } from 'react';
import { useStudioStore } from '../../store/useStudioStore';
import {
  Layers,
  Search,
  Heart,
  RotateCcw,
  GitFork,
  Trash2,
  Sliders,
  Grid,
  Film,
  Table as TableIcon,
  Info
} from 'lucide-react';

export const VaultView: React.FC = () => {
  const {
    generations,
    styles,
    models,
    vaultSearch,
    setVaultSearch,
    vaultStyleFilter,
    setVaultStyleFilter,
    vaultModelFilter,
    setVaultModelFilter,
    vaultFavoriteOnly,
    setVaultFavoriteOnly,
    vaultViewMode,
    setVaultViewMode,
    toggleFavorite,
    deleteGeneration,
    forkGeneration,
    applyRecipeToComposer,
    setSelectedGeneration,
    openCompareModal,
    setActiveView
  } = useStudioStore();

  const [hoveredGenId, setHoveredGenId] = useState<string | null>(null);

  const completedCount = generations.filter(g => g.status === 'completed').length;
  const favoriteCount = generations.filter(g => g.is_favorite === 1).length;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#07080d] bg-grid-holo py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-amber-400" />
              <h1 className="text-2xl font-black font-mono tracking-tight text-white">
                PRODUCTION VAULT & RECIPES
              </h1>
            </div>
            <p className="text-xs text-zinc-400 mt-1 font-mono">
              Persistent SQLite Archive • Spatiotemporal Video Re-creations & Forks
            </p>
          </div>

          {/* Quick Metrics & Actions */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5 text-xs font-mono text-zinc-300">
              <span>{completedCount} Generations</span>
              <span className="text-zinc-600">•</span>
              <span className="text-amber-400">{favoriteCount} Pinned</span>
            </div>

            {/* Split Compare Button */}
            {completedCount >= 2 && (
              <button
                onClick={() => {
                  const completed = generations.filter(g => g.status === 'completed');
                  if (completed.length >= 2) {
                    openCompareModal(completed[0], completed[1]);
                  }
                }}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 border border-cyan-500/40 text-cyan-300 px-3.5 py-1.5 text-xs font-mono font-semibold transition-all shadow-glow-cyan"
              >
                <Sliders className="h-3.5 w-3.5" />
                Split Compare Re-Takes
              </button>
            )}

            <button
              onClick={() => setActiveView('composer')}
              className="flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black px-4 py-1.5 text-xs font-mono font-bold transition-all shadow-glow-amber"
            >
              <Film className="h-3.5 w-3.5" />
              Compose Scene
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="glass-panel-elevated rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              value={vaultSearch}
              onChange={(e) => setVaultSearch(e.target.value)}
              placeholder="Search prompts, titles, tags..."
              className="w-full rounded-xl bg-black/50 border border-white/10 pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:border-amber-500/60 focus:outline-none font-mono"
            />
          </div>

          {/* Filters & Mode Switchers */}
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            
            {/* Style Filter */}
            <select
              value={vaultStyleFilter}
              onChange={(e) => setVaultStyleFilter(e.target.value)}
              className="rounded-xl bg-black/50 border border-white/10 px-3 py-2 text-xs text-zinc-300 focus:border-amber-500/60 focus:outline-none font-mono"
            >
              <option value="all">All Styles</option>
              {styles.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>

            {/* Model Filter */}
            <select
              value={vaultModelFilter}
              onChange={(e) => setVaultModelFilter(e.target.value)}
              className="rounded-xl bg-black/50 border border-white/10 px-3 py-2 text-xs text-zinc-300 focus:border-cyan-500/60 focus:outline-none font-mono"
            >
              <option value="all">All Models</option>
              {models.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>

            {/* Favorites Toggle */}
            <button
              onClick={() => setVaultFavoriteOnly(!vaultFavoriteOnly)}
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-mono transition-colors ${
                vaultFavoriteOnly
                  ? 'bg-red-500/20 text-red-400 border-red-500/40'
                  : 'bg-black/40 text-zinc-400 border-white/10 hover:border-white/20'
              }`}
            >
              <Heart className={`h-3.5 w-3.5 ${vaultFavoriteOnly ? 'fill-current text-red-400' : ''}`} />
              Favorites
            </button>

            {/* View Layout Toggle */}
            <div className="flex items-center rounded-xl bg-black/40 p-1 border border-white/10">
              <button
                onClick={() => setVaultViewMode('cinematic')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  vaultViewMode === 'cinematic' ? 'bg-white/10 text-amber-400' : 'text-zinc-500 hover:text-white'
                }`}
                title="Cinematic Cards"
              >
                <Film className="h-4 w-4" />
              </button>
              <button
                onClick={() => setVaultViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  vaultViewMode === 'grid' ? 'bg-white/10 text-amber-400' : 'text-zinc-500 hover:text-white'
                }`}
                title="Compact Grid"
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setVaultViewMode('table')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  vaultViewMode === 'table' ? 'bg-white/10 text-amber-400' : 'text-zinc-500 hover:text-white'
                }`}
                title="Table Metadata"
              >
                <TableIcon className="h-4 w-4" />
              </button>
            </div>

          </div>

        </div>

        {/* VAULT GENERATION CARDS */}
        {generations.length === 0 ? (
          <div className="glass-panel rounded-2xl p-12 text-center space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-zinc-500 mx-auto">
              <Search className="h-6 w-6" />
            </div>
            <h3 className="text-base font-mono font-bold text-white">No Generations Found</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              No results match your active filters. Try clearing the search or create a new scene.
            </p>
          </div>
        ) : vaultViewMode === 'table' ? (
          /* TABLE VIEW */
          <div className="glass-panel-elevated rounded-2xl overflow-hidden border border-white/10">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-black/60 text-zinc-400 border-b border-white/10 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3">Preview</th>
                  <th className="p-3">Title & Prompt</th>
                  <th className="p-3">Model</th>
                  <th className="p-3">Aspect</th>
                  <th className="p-3">Duration</th>
                  <th className="p-3">Seed</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {generations.map((g) => (
                  <tr key={g.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-3">
                      <div className="h-10 w-16 rounded overflow-hidden bg-black border border-white/10">
                        <img src={g.thumbnail_url} alt={g.title} className="h-full w-full object-cover" />
                      </div>
                    </td>
                    <td className="p-3 max-w-xs">
                      <span className="font-bold text-white block truncate">{g.title}</span>
                      <span className="text-zinc-500 text-[10px] block truncate">{g.prompt}</span>
                    </td>
                    <td className="p-3 text-amber-300">{g.model_id}</td>
                    <td className="p-3 text-zinc-400">{g.aspect_ratio}</td>
                    <td className="p-3 text-zinc-400">{g.duration_sec}s</td>
                    <td className="p-3 text-zinc-500">{g.seed}</td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedGeneration(g)}
                          className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-zinc-300"
                          title="Inspect Recipe"
                        >
                          <Info className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => applyRecipeToComposer(g)}
                          className="p-1.5 rounded bg-amber-500/20 hover:bg-amber-500/40 text-amber-300"
                          title="Open in Composer"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => forkGeneration(g.id)}
                          className="p-1.5 rounded bg-purple-500/20 hover:bg-purple-500/40 text-purple-300"
                          title="Fork Variation"
                        >
                          <GitFork className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* CINEMATIC & GRID CARDS */
          <div className={`grid gap-6 ${vaultViewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'}`}>
            {generations.map((g) => {
              const isHovered = hoveredGenId === g.id;
              return (
                <div
                  key={g.id}
                  onMouseEnter={() => setHoveredGenId(g.id)}
                  onMouseLeave={() => setHoveredGenId(null)}
                  className="glass-panel-elevated group rounded-2xl overflow-hidden border border-white/10 hover:border-amber-500/40 transition-all duration-300 shadow-glow-card flex flex-col"
                >
                  {/* Video / Preview Container */}
                  <div className="relative aspect-video w-full bg-black overflow-hidden flex items-center justify-center">
                    {g.status === 'completed' && isHovered && g.video_url ? (
                      <video
                        src={g.video_url}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <img
                        src={g.thumbnail_url}
                        alt={g.title}
                        className="h-full w-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                      />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

                    {/* Top Overlay Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                      <div className="flex items-center gap-1.5">
                        <span className="rounded bg-black/60 backdrop-blur-md px-2 py-0.5 text-[10px] font-mono font-bold text-amber-300 border border-white/10">
                          {g.aspect_ratio}
                        </span>
                        <span className="rounded bg-black/60 backdrop-blur-md px-2 py-0.5 text-[10px] font-mono text-zinc-300 border border-white/10">
                          {g.duration_sec}s • 60fps
                        </span>
                      </div>

                      {/* Favorite Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(g.id);
                        }}
                        className={`flex h-7 w-7 items-center justify-center rounded-lg backdrop-blur-md transition-all ${
                          g.is_favorite === 1
                            ? 'bg-red-500/30 text-red-400 border border-red-500/50'
                            : 'bg-black/60 text-zinc-400 hover:text-white border border-white/10'
                        }`}
                      >
                        <Heart className={`h-3.5 w-3.5 ${g.is_favorite === 1 ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    {/* Center Action Overlay on Hover */}
                    <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px] z-10">
                      <button
                        onClick={() => setSelectedGeneration(g)}
                        className="flex items-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-2 text-xs font-mono text-white backdrop-blur-md transition-all"
                      >
                        <Info className="h-3.5 w-3.5" />
                        Inspect Recipe
                      </button>
                      <button
                        onClick={() => applyRecipeToComposer(g)}
                        className="flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black px-3.5 py-2 text-xs font-mono font-bold transition-all shadow-glow-amber"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        Recreate
                      </button>
                    </div>

                    {/* Bottom Status / Stage if processing */}
                    {g.status !== 'completed' && (
                      <div className="absolute bottom-3 left-3 right-3 rounded-lg bg-amber-500/20 border border-amber-500/40 p-2 backdrop-blur-md">
                        <div className="flex justify-between text-[11px] font-mono text-amber-300 font-bold mb-1">
                          <span>{g.status.toUpperCase()}</span>
                          <span>{Math.round(g.progress)}%</span>
                        </div>
                        <div className="h-1 w-full bg-black/50 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-400 transition-all duration-300" style={{ width: `${g.progress}%` }} />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Content & Metadata */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 mb-1">
                        <span className="text-amber-400 font-semibold">{g.model_id}</span>
                        <span>Seed: #{g.seed}</span>
                      </div>
                      <h3 className="font-bold text-sm text-white line-clamp-1">{g.title}</h3>
                      <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed font-sans">{g.prompt}</p>
                    </div>

                    {/* Card Actions Footer */}
                    <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-[10px] font-mono text-zinc-500">
                        <span>{g.resolution.split(' ')[0]}</span>
                        <span>•</span>
                        <span>{g.style_id}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => forkGeneration(g.id)}
                          className="flex items-center gap-1 rounded-lg bg-white/5 hover:bg-purple-500/20 hover:text-purple-300 border border-white/5 px-2.5 py-1 text-xs font-mono text-zinc-400 transition-colors"
                          title="Fork variation branch"
                        >
                          <GitFork className="h-3 w-3" />
                          Fork
                        </button>
                        <button
                          onClick={() => deleteGeneration(g.id)}
                          className="rounded-lg p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Purge record"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};
