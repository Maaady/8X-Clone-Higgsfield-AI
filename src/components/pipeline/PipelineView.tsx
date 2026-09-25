import React from 'react';
import { useStudioStore } from '../../store/useStudioStore';
import {
  Activity,
  Cpu,
  RefreshCw,
  XCircle,
  CheckCircle2,
  AlertOctagon,
  Clock,
  Film
} from 'lucide-react';

export const PipelineView: React.FC = () => {
  const {
    generations,
    stats,
    cancelGeneration,
    retryGeneration,
    applyRecipeToComposer,
    setActiveView,
    refreshGenerations
  } = useStudioStore();

  const activeJobs = generations.filter(g => g.status !== 'completed' && g.status !== 'failed');
  const recentCompleted = generations.filter(g => g.status === 'completed' || g.status === 'failed');

  const STAGES_PIPELINE = [
    { key: 'queued', label: 'Queued', desc: 'GPU scheduler allocation' },
    { key: 'tensor_init', label: 'Latent Init', desc: 'Text embedding tensors' },
    { key: 'spatial_diffusion', label: 'Diffusion 3D', desc: 'Spatiotemporal sampling' },
    { key: 'temporal_smoothing', label: 'Flow Smoothing', desc: 'Optical frame de-flicker' },
    { key: 'upscaling_hdr', label: 'HDR Master', desc: 'Neural super-resolution' }
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#07080d] bg-grid-holo py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-3 w-3 rounded-full bg-cyan-400 animate-ping" />
              <h1 className="text-2xl font-black font-mono tracking-tight text-white">
                GPU PIPELINE & RENDER FARM
              </h1>
            </div>
            <p className="text-xs text-zinc-400 mt-1 font-mono">
              Live Asynchronous CUDA Tensor Workloads • Active SQLite Job Monitor
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => refreshGenerations()}
              className="flex items-center gap-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 px-3.5 py-2 text-xs font-mono text-zinc-300 transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Sync DB Queue
            </button>
            <button
              onClick={() => setActiveView('composer')}
              className="flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black px-4 py-2 text-xs font-mono font-bold transition-all shadow-glow-amber"
            >
              <Film className="h-3.5 w-3.5" />
              New Generation
            </button>
          </div>
        </div>

        {/* Live Cluster Health Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-panel-elevated rounded-2xl p-4 border-l-4 border-l-amber-500">
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">Active Render Jobs</span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-mono font-bold text-white">{activeJobs.length}</span>
              <span className="text-xs font-mono text-amber-400">processing now</span>
            </div>
          </div>

          <div className="glass-panel-elevated rounded-2xl p-4 border-l-4 border-l-cyan-500">
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">GPU Cluster Load</span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-mono font-bold text-white">{stats?.gpu_utilization_pct || 38}%</span>
              <span className="text-xs font-mono text-cyan-400">16x H100 SXM</span>
            </div>
          </div>

          <div className="glass-panel-elevated rounded-2xl p-4 border-l-4 border-l-emerald-500">
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">Completed Renders</span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-mono font-bold text-white">{stats?.completed_generations || 0}</span>
              <span className="text-xs font-mono text-emerald-400">4K Masters</span>
            </div>
          </div>

          <div className="glass-panel-elevated rounded-2xl p-4 border-l-4 border-l-purple-500">
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">Avg Render Latency</span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-mono font-bold text-white">5.8s</span>
              <span className="text-xs font-mono text-purple-400">TensorRT-LLM</span>
            </div>
          </div>
        </div>

        {/* ACTIVE JOBS QUEUE */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Live In-Flight Diffusion Tasks ({activeJobs.length})
            </h2>
          </div>

          {activeJobs.length === 0 ? (
            <div className="glass-panel rounded-2xl p-8 text-center space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mx-auto">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="text-base font-mono font-bold text-white">All GPU Nodes Idle & Ready</h3>
              <p className="text-xs text-zinc-400 max-w-md mx-auto">
                No active rendering tasks in the pipeline. Launch a new scene in the Studio Composer to watch real-time tensor diffusion.
              </p>
              <button
                onClick={() => setActiveView('composer')}
                className="mt-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black px-4 py-2 text-xs font-mono font-bold transition-all shadow-glow-amber"
              >
                Launch Director Composer
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {activeJobs.map((job) => (
                <div
                  key={job.id}
                  className="glass-panel-elevated rounded-2xl p-5 border border-amber-500/30 shadow-glow-amber space-y-4 animate-fadeIn"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="inline-block h-2.5 w-2.5 rounded-full bg-amber-400 animate-ping" />
                        <span className="font-mono text-xs font-bold text-amber-400">{job.id}</span>
                        <span className="rounded bg-white/10 px-2 py-0.5 text-[10px] font-mono text-zinc-300">
                          {job.model_id}
                        </span>
                        <span className="rounded bg-white/10 px-2 py-0.5 text-[10px] font-mono text-zinc-300">
                          {job.aspect_ratio}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-white line-clamp-1">{job.title}</h4>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => cancelGeneration(job.id)}
                        className="flex items-center gap-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 px-3 py-1.5 text-xs font-mono text-red-400 transition-colors"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        Abort & Refund
                      </button>
                    </div>
                  </div>

                  {/* Stage Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-zinc-300 flex items-center gap-1.5">
                        <Cpu className="h-3.5 w-3.5 text-cyan-400 animate-spin" />
                        {job.current_stage}
                      </span>
                      <span className="text-amber-400 font-bold">{Math.round(job.progress)}%</span>
                    </div>

                    <div className="w-full bg-black/60 h-2.5 rounded-full overflow-hidden border border-white/10">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-cyan-400 transition-all duration-300 rounded-full"
                        style={{ width: `${job.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Diffusion Tensor Stages Indicator */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 border-t border-white/10 text-center">
                    {STAGES_PIPELINE.map((st, i) => {
                      const isPast = job.progress >= (i + 1) * 20;
                      const isCurrent = job.status === st.key || (job.progress >= i * 20 && job.progress < (i + 1) * 20);
                      return (
                        <div
                          key={st.key}
                          className={`rounded-xl p-2 border transition-all ${
                            isCurrent
                              ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                              : isPast
                              ? 'bg-white/5 border-emerald-500/30 text-emerald-400'
                              : 'bg-black/30 border-white/5 text-zinc-600'
                          }`}
                        >
                          <span className="block text-[11px] font-mono font-bold">{st.label}</span>
                          <span className="block text-[9px] truncate">{st.desc}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RECENT PIPELINE HISTORY */}
        <div className="space-y-4">
          <h2 className="text-sm font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Recent Pipeline Executions ({recentCompleted.length})
          </h2>

          <div className="space-y-2">
            {recentCompleted.map((item) => (
              <div
                key={item.id}
                className="glass-panel rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border border-white/10 hover:border-white/20 transition-all"
              >
                <div className="flex items-center gap-3">
                  {item.status === 'completed' ? (
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/20 text-red-400 border border-red-500/30">
                      <AlertOctagon className="h-4 w-4" />
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-white">{item.title}</span>
                      <span className="text-[10px] font-mono text-zinc-500">({item.id})</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 line-clamp-1">{item.prompt}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <span className="text-[10px] font-mono text-zinc-400">
                    {item.execution_time_ms ? `${(item.execution_time_ms / 1000).toFixed(1)}s render` : 'Instant'}
                  </span>

                  {item.status === 'failed' && (
                    <button
                      onClick={() => retryGeneration(item.id)}
                      className="rounded-lg bg-amber-500/20 hover:bg-amber-500 hover:text-black border border-amber-500/40 px-3 py-1 text-xs font-mono text-amber-300 transition-all"
                    >
                      Retry Job
                    </button>
                  )}

                  <button
                    onClick={() => applyRecipeToComposer(item)}
                    className="rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1 text-xs font-mono text-zinc-300 hover:text-white transition-colors"
                  >
                    Open in Composer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
