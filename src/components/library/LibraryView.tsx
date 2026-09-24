import React, { useState } from 'react';
import { 
  Film, 
  Search, 
  Heart, 
  Repeat, 
  Trash2, 
  Eye, 
  Grid, 
  List, 
  Plus
} from 'lucide-react';
import { useStudioStore } from '../../store/useStudioStore';
import { STYLE_PRESETS } from '../../data/mockData';

export const LibraryView: React.FC = () => {
  const { 
    generations, 
    libraryFilter, 
    setLibraryFilter, 
    searchQuery, 
    setSearchQuery, 
    selectedStyleFilter, 
    setSelectedStyleFilter,
    toggleFavorite, 
    deleteGeneration, 
    recreateFromGeneration, 
    setActiveGenerationId, 
    setView
  } = useStudioStore();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter logic
  const filteredGenerations = generations.filter((gen) => {
    // Tab filter
    if (libraryFilter === 'favorites' && !gen.isFavorite) return false;

    // Style filter
    if (selectedStyleFilter !== 'all' && gen.style !== selectedStyleFilter) {
      return false;
    }

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchPrompt = gen.prompt.toLowerCase().includes(q);
      const matchTitle = gen.title.toLowerCase().includes(q);
      const matchModel = gen.model.toLowerCase().includes(q);
      const matchStyle = gen.style.toLowerCase().includes(q);
      if (!matchPrompt && !matchTitle && !matchModel && !matchStyle) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-[#07080c] text-white pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Library Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-brand-500/20 px-2 py-0.5 text-[11px] font-mono font-bold text-brand-300 border border-brand-500/30">
                PERSISTENT VAULT
              </span>
              <span className="text-xs text-zinc-400">LocalStorage Synced</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white mt-1">
              Media & Recipe Library
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setView('create')}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 via-brand-500 to-brand-accent px-4 py-2 text-sm font-bold text-white shadow-glow-brand hover:brightness-110 active:scale-95 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Create New</span>
            </button>
          </div>
        </div>

        {/* Filter Bar & Search */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
          
          {/* Tabs */}
          <div className="flex items-center gap-1 rounded-xl bg-white/[0.03] p-1 border border-white/10 self-start">
            {[
              { id: 'all', label: `All (${generations.length})` },
              { id: 'favorites', label: `Favorites (${generations.filter(g => g.isFavorite).length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setLibraryFilter(tab.id as any)}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  libraryFilter === tab.id
                    ? 'bg-brand-500 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search & Style Filter */}
          <div className="flex flex-1 max-w-xl items-center gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search prompts, models, styles, seeds..."
                className="w-full rounded-xl border border-white/10 bg-[#0d0e17] py-2 pl-9 pr-4 text-xs text-white placeholder-zinc-500 focus:border-brand-500 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center rounded-xl border border-white/10 bg-white/[0.03] p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`rounded-lg p-1.5 text-xs ${viewMode === 'grid' ? 'bg-white/15 text-white' : 'text-zinc-500 hover:text-white'}`}
                title="Grid View"
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`rounded-lg p-1.5 text-xs ${viewMode === 'list' ? 'bg-white/15 text-white' : 'text-zinc-500 hover:text-white'}`}
                title="List View"
              >
                <List className="h-4 w-4" />
              </button>
            </div>

          </div>

        </div>

        {/* Style Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
          <button
            onClick={() => setSelectedStyleFilter('all')}
            className={`rounded-lg px-3 py-1 text-xs font-medium whitespace-nowrap transition-all ${
              selectedStyleFilter === 'all'
                ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40'
                : 'bg-white/[0.02] text-zinc-400 hover:bg-white/[0.06] border border-white/5'
            }`}
          >
            All Styles
          </button>
          {STYLE_PRESETS.map((style) => (
            <button
              key={style.id}
              onClick={() => setSelectedStyleFilter(style.id)}
              className={`rounded-lg px-3 py-1 text-xs font-medium whitespace-nowrap transition-all ${
                selectedStyleFilter === style.id
                  ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40'
                  : 'bg-white/[0.02] text-zinc-400 hover:bg-white/[0.06] border border-white/5'
              }`}
            >
              {style.label}
            </button>
          ))}
        </div>

        {/* Library Grid or List */}
        {filteredGenerations.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-16 text-center">
            <Film className="h-10 w-10 text-zinc-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">No generations found</h3>
            <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
              No creations match your current filters or search query. Try clearing filters or create a new video.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setLibraryFilter('all');
                setSelectedStyleFilter('all');
              }}
              className="mt-4 rounded-xl bg-white/10 hover:bg-white/20 text-white px-4 py-2 text-xs font-semibold transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGenerations.map((gen) => (
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

                  {/* Model Tag */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <span className="rounded-md bg-black/70 backdrop-blur-md px-2 py-0.5 text-[10px] font-mono text-brand-300 border border-white/10">
                      {gen.model}
                    </span>
                    <span className="rounded-md bg-brand-500/20 backdrop-blur-md px-2 py-0.5 text-[10px] font-semibold text-white">
                      {gen.duration}s • {gen.aspectRatio}
                    </span>
                  </div>
                </div>

                {/* Content */}
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
                    {/* Recreate */}
                    <button
                      onClick={() => recreateFromGeneration(gen)}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-brand-500/20 hover:bg-brand-500/30 text-brand-300 border border-brand-500/30 py-2 text-xs font-semibold transition-colors"
                      title="Restore Prompt & Recipe into Composer"
                    >
                      <Repeat className="h-3.5 w-3.5" />
                      <span>Recreate</span>
                    </button>

                    {/* Inspect Result */}
                    <button
                      onClick={() => {
                        setActiveGenerationId(gen.id);
                        setView('result');
                      }}
                      className="flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 px-3 py-2 text-xs font-medium border border-white/10 transition-colors"
                      title="Inspect Video Player & Recipe"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => deleteGeneration(gen.id)}
                      className="flex items-center justify-center rounded-xl bg-white/5 hover:bg-rose-500/20 hover:text-rose-400 text-zinc-400 px-2.5 py-2 text-xs border border-white/10 transition-colors"
                      title="Delete from Library"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="space-y-3">
            {filteredGenerations.map((gen) => (
              <div
                key={gen.id}
                className="group flex flex-col sm:flex-row items-center gap-4 rounded-2xl border border-white/10 bg-[#0f111a] p-3.5 hover:border-brand-500/40 transition-all"
              >
                <div className="relative h-20 w-36 rounded-xl overflow-hidden flex-shrink-0 bg-zinc-950">
                  <img src={gen.thumbnailUrl} alt={gen.title} className="h-full w-full object-cover" />
                  <div className="absolute top-1 right-1 rounded bg-black/70 px-1 py-0.5 text-[9px] font-mono text-zinc-300">
                    {gen.duration}s
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white truncate">{gen.title}</span>
                    <span className="rounded bg-brand-500/20 px-1.5 py-0.2 text-[9px] font-mono text-brand-300">
                      {gen.model}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 truncate mt-1">{gen.prompt}</p>
                  <div className="flex items-center gap-3 text-[10px] font-mono text-zinc-500 mt-2">
                    <span>{gen.style}</span>
                    <span>•</span>
                    <span>{gen.aspectRatio}</span>
                    <span>•</span>
                    <span>Seed: {gen.seed}</span>
                    <span>•</span>
                    <span>{gen.createdAt}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => toggleFavorite(gen.id)}
                    className={`p-2 rounded-xl border ${gen.isFavorite ? 'border-rose-500/50 bg-rose-500/20 text-rose-400' : 'border-white/10 text-zinc-400 hover:text-white'}`}
                  >
                    <Heart className={`h-4 w-4 ${gen.isFavorite ? 'fill-rose-500' : ''}`} />
                  </button>

                  <button
                    onClick={() => recreateFromGeneration(gen)}
                    className="flex items-center gap-1.5 rounded-xl bg-brand-500/20 hover:bg-brand-500/30 text-brand-300 border border-brand-500/30 px-3.5 py-2 text-xs font-semibold"
                  >
                    <Repeat className="h-3.5 w-3.5" />
                    <span>Recreate</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveGenerationId(gen.id);
                      setView('result');
                    }}
                    className="p-2 rounded-xl border border-white/10 text-zinc-400 hover:text-white"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
