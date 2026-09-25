import { create } from 'zustand';
import type {
  GenerationItem,
  ModelInfo,
  StyleInfo,
  CameraPresetInfo,
  CustomPresetInfo,
  UserProfile,
  SystemStats,
  ActiveView,
  AspectRatioType
} from '../types';
import * as api from '../api/client';

export interface ToastNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: number;
}

interface StudioState {
  // Navigation & Layout
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;

  // DB Data
  generations: GenerationItem[];
  models: ModelInfo[];
  styles: StyleInfo[];
  cameraPresets: CameraPresetInfo[];
  customPresets: CustomPresetInfo[];
  userProfile: UserProfile | null;
  stats: SystemStats | null;
  isLoading: boolean;
  error: string | null;

  // Active Job & Inspection
  activeGenerationId: string | null;
  selectedGeneration: GenerationItem | null;
  setSelectedGeneration: (gen: GenerationItem | null) => void;

  // Split-Screen Comparison
  compareA: GenerationItem | null;
  compareB: GenerationItem | null;
  isCompareModalOpen: boolean;
  setCompareGenerations: (a: GenerationItem | null, b: GenerationItem | null) => void;
  openCompareModal: (a: GenerationItem, b?: GenerationItem) => void;
  closeCompareModal: () => void;

  // Top Up Modal
  isTopUpModalOpen: boolean;
  setTopUpModalOpen: (open: boolean) => void;

  // Composer Form
  prompt: string;
  negativePrompt: string;
  selectedModelId: string;
  selectedStyleId: string;
  aspectRatio: AspectRatioType;
  durationSec: number;
  motionMode: string;
  seed: number;
  steps: number;
  cfgScale: number;
  focalLength: string;
  aperture: string;
  simulateFailure: boolean;
  isEnhancingPrompt: boolean;
  isSubmitting: boolean;

  // Composer Setters
  setPrompt: (prompt: string) => void;
  setNegativePrompt: (neg: string) => void;
  setSelectedModelId: (modelId: string) => void;
  setSelectedStyleId: (styleId: string) => void;
  setAspectRatio: (ar: AspectRatioType) => void;
  setDurationSec: (sec: number) => void;
  setMotionMode: (motion: string) => void;
  setSeed: (seed: number) => void;
  randomizeSeed: () => void;
  setSteps: (steps: number) => void;
  setCfgScale: (scale: number) => void;
  setFocalLength: (fl: string) => void;
  setAperture: (ap: string) => void;
  setSimulateFailure: (val: boolean) => void;

  // Vault Filters
  vaultSearch: string;
  vaultStyleFilter: string;
  vaultModelFilter: string;
  vaultStatusFilter: string;
  vaultFavoriteOnly: boolean;
  vaultViewMode: 'grid' | 'cinematic' | 'table';
  setVaultSearch: (s: string) => void;
  setVaultStyleFilter: (st: string) => void;
  setVaultModelFilter: (m: string) => void;
  setVaultStatusFilter: (st: string) => void;
  setVaultFavoriteOnly: (f: boolean) => void;
  setVaultViewMode: (mode: 'grid' | 'cinematic' | 'table') => void;

  // Toasts
  toasts: ToastNotification[];
  addToast: (title: string, message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;

  // API Actions
  loadInitialData: () => Promise<void>;
  refreshGenerations: () => Promise<void>;
  refreshStats: () => Promise<void>;
  submitGeneration: () => Promise<void>;
  cancelGeneration: (id: string) => Promise<void>;
  retryGeneration: (id: string) => Promise<void>;
  forkGeneration: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  deleteGeneration: (id: string) => Promise<void>;
  enhancePrompt: () => Promise<void>;
  applyRecipeToComposer: (gen: GenerationItem) => void;
  saveCurrentAsPreset: (name: string, description: string) => Promise<void>;
  topUpCreditsAction: (amount: number) => Promise<void>;
}

let pollingInterval: any = null;

export const useStudioStore = create<StudioState>((set, get) => ({
  activeView: 'composer',
  setActiveView: (view) => set({ activeView: view }),

  generations: [],
  models: [],
  styles: [],
  cameraPresets: [],
  customPresets: [],
  userProfile: null,
  stats: null,
  isLoading: true,
  error: null,

  activeGenerationId: null,
  selectedGeneration: null,
  setSelectedGeneration: (gen) => set({ selectedGeneration: gen }),

  compareA: null,
  compareB: null,
  isCompareModalOpen: false,
  setCompareGenerations: (a, b) => set({ compareA: a, compareB: b }),
  openCompareModal: (a, b) => {
    const all = get().generations.filter(g => g.status === 'completed');
    const second = b || all.find(g => g.id !== a.id) || a;
    set({ compareA: a, compareB: second, isCompareModalOpen: true });
  },
  closeCompareModal: () => set({ isCompareModalOpen: false, compareA: null, compareB: null }),

  isTopUpModalOpen: false,
  setTopUpModalOpen: (open) => set({ isTopUpModalOpen: open }),

  // Composer Initial State
  prompt: 'A cybernetic neon samurai standing atop a rain-soaked rooftop in Neo-Tokyo, holographic kanji banners reflecting on wet carbon armor, 35mm anamorphic lens, shallow depth of field, 8k cinematic lighting.',
  negativePrompt: 'blurry, oversaturated, cartoon, low resolution, 3d render plastic, jittery',
  selectedModelId: 'synapse-v4-ultra',
  selectedStyleId: 'cyberpunk-2099',
  aspectRatio: '16:9',
  durationSec: 10,
  motionMode: 'cam-orbit-360',
  seed: 4829103,
  steps: 50,
  cfgScale: 7.5,
  focalLength: '35mm Storyteller',
  aperture: 'f/1.8 Cinematic Prime',
  simulateFailure: false,
  isEnhancingPrompt: false,
  isSubmitting: false,

  setPrompt: (prompt) => set({ prompt }),
  setNegativePrompt: (negativePrompt) => set({ negativePrompt }),
  setSelectedModelId: (selectedModelId) => set({ selectedModelId }),
  setSelectedStyleId: (selectedStyleId) => set({ selectedStyleId }),
  setAspectRatio: (aspectRatio) => set({ aspectRatio }),
  setDurationSec: (durationSec) => set({ durationSec }),
  setMotionMode: (motionMode) => set({ motionMode }),
  setSeed: (seed) => set({ seed }),
  randomizeSeed: () => set({ seed: Math.floor(Math.random() * 9000000) + 1000000 }),
  setSteps: (steps) => set({ steps }),
  setCfgScale: (cfgScale) => set({ cfgScale }),
  setFocalLength: (focalLength) => set({ focalLength }),
  setAperture: (aperture) => set({ aperture }),
  setSimulateFailure: (simulateFailure) => set({ simulateFailure }),

  // Vault Filters
  vaultSearch: '',
  vaultStyleFilter: 'all',
  vaultModelFilter: 'all',
  vaultStatusFilter: 'all',
  vaultFavoriteOnly: false,
  vaultViewMode: 'cinematic',
  setVaultSearch: (vaultSearch) => {
    set({ vaultSearch });
    get().refreshGenerations();
  },
  setVaultStyleFilter: (vaultStyleFilter) => {
    set({ vaultStyleFilter });
    get().refreshGenerations();
  },
  setVaultModelFilter: (vaultModelFilter) => {
    set({ vaultModelFilter });
    get().refreshGenerations();
  },
  setVaultStatusFilter: (vaultStatusFilter) => {
    set({ vaultStatusFilter });
    get().refreshGenerations();
  },
  setVaultFavoriteOnly: (vaultFavoriteOnly) => {
    set({ vaultFavoriteOnly });
    get().refreshGenerations();
  },
  setVaultViewMode: (vaultViewMode) => set({ vaultViewMode }),

  toasts: [],
  addToast: (title, message, type = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
    const newToast: ToastNotification = { id, title, message, type, timestamp: Date.now() };
    set((state) => ({ toasts: [newToast, ...state.toasts].slice(0, 5) }));
    setTimeout(() => {
      get().removeToast(id);
    }, 4500);
  },
  removeToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },

  loadInitialData: async () => {
    set({ isLoading: true, error: null });
    try {
      const [models, styles, cameraPresets, customPresets, userProfile, stats, generations] = await Promise.all([
        api.fetchModels(),
        api.fetchStyles(),
        api.fetchCameraPresets(),
        api.fetchCustomPresets(),
        api.fetchUserProfile(),
        api.fetchStats(),
        api.fetchGenerations()
      ]);

      set({
        models,
        styles,
        cameraPresets,
        customPresets,
        userProfile,
        stats,
        generations,
        isLoading: false
      });

      // Start automatic polling for active jobs
      if (!pollingInterval) {
        pollingInterval = setInterval(async () => {
          const { activeGenerationId } = get();
          const hasActiveInList = get().generations.some(g => g.status !== 'completed' && g.status !== 'failed');
          
          if (activeGenerationId || hasActiveInList) {
            try {
              const updatedGens = await api.fetchGenerations({
                search: get().vaultSearch,
                style: get().vaultStyleFilter,
                model: get().vaultModelFilter,
                status: get().vaultStatusFilter,
                favorite: get().vaultFavoriteOnly
              });
              const statsData = await api.fetchStats();
              const user = await api.fetchUserProfile();
              
              set({ generations: updatedGens, stats: statsData, userProfile: user });

              // Check if active generation finished
              if (activeGenerationId) {
                const target = updatedGens.find(g => g.id === activeGenerationId);
                if (target && (target.status === 'completed' || target.status === 'failed')) {
                  set({ activeGenerationId: null });
                  if (target.status === 'completed') {
                    get().addToast('Diffusion Finished', `"${target.title}" successfully synthesized at 4K.`, 'success');
                  } else {
                    get().addToast('Render Exception', target.error_message || 'Pipeline encountered a GPU error.', 'error');
                  }
                }
              }
            } catch (e) {
              console.error('[Polling] Error:', e);
            }
          }
        }, 1200);
      }
    } catch (err: any) {
      set({ error: err.message || 'Failed to initialize Synapse Studio', isLoading: false });
    }
  },

  refreshGenerations: async () => {
    try {
      const gens = await api.fetchGenerations({
        search: get().vaultSearch,
        style: get().vaultStyleFilter,
        model: get().vaultModelFilter,
        status: get().vaultStatusFilter,
        favorite: get().vaultFavoriteOnly
      });
      set({ generations: gens });
    } catch (err: any) {
      console.error('Failed refreshing generations:', err);
    }
  },

  refreshStats: async () => {
    try {
      const stats = await api.fetchStats();
      const user = await api.fetchUserProfile();
      set({ stats, userProfile: user });
    } catch (err: any) {
      console.error('Failed refreshing stats:', err);
    }
  },

  submitGeneration: async () => {
    const state = get();
    if (!state.prompt.trim()) {
      state.addToast('Prompt Required', 'Please enter a visual description before launching diffusion.', 'warning');
      return;
    }

    set({ isSubmitting: true });
    try {
      const result = await api.createGenerationTask({
        prompt: state.prompt,
        negative_prompt: state.negativePrompt,
        model_id: state.selectedModelId,
        style_id: state.selectedStyleId,
        aspect_ratio: state.aspectRatio,
        duration_sec: state.durationSec,
        motion_mode: state.motionMode,
        seed: state.seed,
        steps: state.steps,
        cfg_scale: state.cfgScale,
        camera_data: {
          trajectory: state.motionMode,
          focal_length: state.focalLength,
          aperture: state.aperture
        },
        simulate_failure: state.simulateFailure
      });

      set({
        activeGenerationId: result.data.id,
        isSubmitting: false,
        generations: [result.data, ...state.generations]
      });

      state.addToast('Task Dispatched', `Job ${result.data.id} allocated to GPU cluster (${result.credits_deducted} credits deducted).`, 'info');
      state.refreshStats();
    } catch (err: any) {
      set({ isSubmitting: false });
      state.addToast('Dispatch Error', err.message || 'Failed to dispatch generation task.', 'error');
    }
  },

  cancelGeneration: async (id: string) => {
    try {
      await api.cancelGenerationTask(id);
      get().addToast('Job Cancelled', `Generation ${id} was aborted. Credits refunded.`, 'info');
      get().refreshGenerations();
      get().refreshStats();
    } catch (err: any) {
      get().addToast('Cancel Failed', err.message, 'error');
    }
  },

  retryGeneration: async (id: string) => {
    try {
      await api.retryGenerationTask(id);
      set({ activeGenerationId: id });
      get().addToast('Job Retried', `Re-enqueued generation ${id} in GPU cluster.`, 'info');
      get().refreshGenerations();
    } catch (err: any) {
      get().addToast('Retry Failed', err.message, 'error');
    }
  },

  forkGeneration: async (id: string) => {
    try {
      const forked = await api.forkGenerationTask(id);
      set({ activeGenerationId: forked.id, generations: [forked, ...get().generations] });
      get().addToast('Branch Forked', `Created variation branch for ${forked.title}`, 'success');
      get().refreshStats();
    } catch (err: any) {
      get().addToast('Fork Failed', err.message, 'error');
    }
  },

  toggleFavorite: async (id: string) => {
    try {
      const isFav = await api.toggleFavoriteGeneration(id);
      set((state) => ({
        generations: state.generations.map((g) => (g.id === id ? { ...g, is_favorite: isFav ? 1 : 0 } : g)),
        selectedGeneration: state.selectedGeneration?.id === id ? { ...state.selectedGeneration, is_favorite: isFav ? 1 : 0 } : state.selectedGeneration
      }));
      get().addToast(isFav ? 'Pinned to Favorites' : 'Removed from Favorites', 'Library updated.', 'info');
    } catch (err: any) {
      get().addToast('Error', err.message, 'error');
    }
  },

  deleteGeneration: async (id: string) => {
    try {
      await api.deleteGenerationTask(id);
      set((state) => ({
        generations: state.generations.filter((g) => g.id !== id),
        selectedGeneration: state.selectedGeneration?.id === id ? null : state.selectedGeneration
      }));
      get().addToast('Generation Purged', 'Record removed from SQLite database.', 'info');
      get().refreshStats();
    } catch (err: any) {
      get().addToast('Delete Failed', err.message, 'error');
    }
  },

  enhancePrompt: async () => {
    const state = get();
    if (!state.prompt.trim()) {
      state.addToast('Prompt Empty', 'Type a base prompt first before invoking AI enhancement.', 'warning');
      return;
    }

    set({ isEnhancingPrompt: true });
    try {
      const res = await api.enhancePromptApi(state.prompt, state.selectedStyleId);
      set({
        prompt: res.enhanced_prompt,
        negativePrompt: res.suggested_negatives,
        isEnhancingPrompt: false
      });
      state.addToast('✨ AI Prompt Enhanced', `Injected ${res.added_tokens_count} optical & cinematic conditioning tokens.`, 'success');
    } catch (err: any) {
      set({ isEnhancingPrompt: false });
      state.addToast('Enhance Failed', err.message, 'error');
    }
  },

  applyRecipeToComposer: (gen: GenerationItem) => {
    let parsedCamera: any = {};
    try {
      parsedCamera = JSON.parse(gen.camera_data);
    } catch (_) {}

    set({
      prompt: gen.prompt,
      negativePrompt: gen.negative_prompt,
      selectedModelId: gen.model_id,
      selectedStyleId: gen.style_id,
      aspectRatio: gen.aspect_ratio,
      durationSec: gen.duration_sec,
      motionMode: gen.motion_mode,
      seed: gen.seed,
      steps: gen.steps,
      cfgScale: gen.cfg_scale,
      focalLength: parsedCamera.focal_length || '35mm Storyteller',
      aperture: parsedCamera.aperture || 'f/1.8 Cinematic Prime',
      activeView: 'composer',
      selectedGeneration: null
    });

    get().addToast('Recipe Applied', `Loaded exact recipe parameters for "${gen.title}".`, 'info');
  },

  saveCurrentAsPreset: async (name: string, description: string) => {
    const state = get();
    try {
      const preset = await api.createCustomPreset({
        name,
        description,
        prompt: state.prompt,
        model_id: state.selectedModelId,
        style_id: state.selectedStyleId,
        aspect_ratio: state.aspectRatio,
        motion_mode: state.motionMode
      });
      set({ customPresets: [preset, ...state.customPresets] });
      state.addToast('Preset Stored', `Saved "${name}" to custom SQLite recipe bank.`, 'success');
    } catch (err: any) {
      state.addToast('Save Failed', err.message, 'error');
    }
  },

  topUpCreditsAction: async (amount: number) => {
    try {
      const updated = await api.topUpCredits(amount);
      set({ userProfile: updated, isTopUpModalOpen: false });
      get().addToast('Credits Added', `Successfully credited ${amount} GPU tokens to your balance.`, 'success');
      get().refreshStats();
    } catch (err: any) {
      get().addToast('Top-Up Failed', err.message, 'error');
    }
  }
}));
