import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import confetti from 'canvas-confetti';
import type { 
  Generation, 
  ModelType, 
  StylePreset, 
  AspectRatioType, 
  CameraMotionType, 
  GenerationRecipe 
} from '../types';
import { SEED_GENERATIONS, GENERATED_MEDIA_POOL } from '../data/mockData';

export type ViewType = 'landing' | 'dashboard' | 'create' | 'result' | 'library';

interface ComposerState {
  prompt: string;
  negativePrompt: string;
  model: ModelType;
  style: StylePreset;
  aspectRatio: AspectRatioType;
  duration: number;
  cameraMotion: CameraMotionType;
  referenceImage: string | null;
  referenceName: string | null;
  referenceWeight: number;
  motionIntensity: number;
  guidanceScale: number;
}

interface ToastNotification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface StudioStore {
  // Navigation
  currentView: ViewType;
  setView: (view: ViewType) => void;

  // Composer
  composer: ComposerState;
  setComposerField: <K extends keyof ComposerState>(field: K, value: ComposerState[K]) => void;
  resetComposer: () => void;
  loadRecipe: (recipe: GenerationRecipe) => void;
  recreateFromGeneration: (generation: Generation) => void;

  // Generations
  generations: Generation[];
  activeGenerationId: string | null;
  setActiveGenerationId: (id: string | null) => void;
  activeGeneratingTask: Generation | null;

  // Actions
  userCredits: number;
  startGeneration: (shouldFail?: boolean) => void;
  cancelGeneration: () => void;
  retryGeneration: (id: string) => void;
  toggleFavorite: (id: string) => void;
  deleteGeneration: (id: string) => void;

  // Search & Filter
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  libraryFilter: 'all' | 'video' | 'image' | 'favorites';
  setLibraryFilter: (filter: 'all' | 'video' | 'image' | 'favorites') => void;
  selectedStyleFilter: string;
  setSelectedStyleFilter: (style: string) => void;

  // Notifications
  notifications: ToastNotification[];
  addToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;

  // Demo helper
  simulateFailureNext: boolean;
  setSimulateFailureNext: (fail: boolean) => void;
}

const DEFAULT_COMPOSER: ComposerState = {
  prompt: 'Cinematic wide shot of an obsidian cybernetic android in glowing rain, neon reflections on wet glass, volumetric cinematic smoke, 35mm film grain, 8k render',
  negativePrompt: 'low quality, blurry, deformed, cartoonish, low resolution',
  model: 'Higgsfield Cinema v2.5',
  style: 'Cinematic',
  aspectRatio: '16:9',
  duration: 10,
  cameraMotion: 'Dynamic Orbit',
  referenceImage: null,
  referenceName: null,
  referenceWeight: 0.8,
  motionIntensity: 7,
  guidanceScale: 7.5,
};

export const useStudioStore = create<StudioStore>()(
  persist(
    (set, get) => ({
      currentView: 'landing',
      setView: (view) => set({ currentView: view }),

      composer: DEFAULT_COMPOSER,
      setComposerField: (field, value) =>
        set((state) => ({
          composer: { ...state.composer, [field]: value },
        })),
      resetComposer: () => set({ composer: DEFAULT_COMPOSER }),

      loadRecipe: (recipe) => {
        set({
          composer: {
            prompt: recipe.prompt,
            negativePrompt: recipe.negativePrompt || '',
            model: recipe.model,
            style: recipe.style,
            aspectRatio: recipe.aspectRatio,
            duration: recipe.duration,
            cameraMotion: recipe.cameraMotion,
            referenceImage: recipe.referenceImage || null,
            referenceName: recipe.referenceName || null,
            referenceWeight: recipe.referenceWeight || 0.8,
            motionIntensity: recipe.motionIntensity || 7,
            guidanceScale: recipe.guidanceScale || 7.5,
          },
          currentView: 'create',
        });
        get().addToast('Recipe loaded into composer! Ready to tweak and generate.', 'info');
      },

      recreateFromGeneration: (generation) => {
        get().loadRecipe(generation);
      },

      generations: SEED_GENERATIONS,
      activeGenerationId: SEED_GENERATIONS[0].id,
      setActiveGenerationId: (id) => set({ activeGenerationId: id }),
      activeGeneratingTask: null,

      userCredits: 240,
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
      libraryFilter: 'all',
      setLibraryFilter: (filter) => set({ libraryFilter: filter }),
      selectedStyleFilter: 'all',
      setSelectedStyleFilter: (style) => set({ selectedStyleFilter: style }),

      notifications: [],
      addToast: (message, type = 'info') => {
        const id = Math.random().toString(36).substring(2, 9);
        set((state) => ({
          notifications: [...state.notifications, { id, message, type }],
        }));
        setTimeout(() => {
          set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
          }));
        }, 4000);
      },
      removeToast: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),

      simulateFailureNext: false,
      setSimulateFailureNext: (fail) => set({ simulateFailureNext: fail }),

      startGeneration: (shouldFail = false) => {
        const state = get();
        const cost = state.composer.duration === 15 ? 15 : state.composer.duration === 10 ? 10 : 5;

        if (state.userCredits < cost) {
          state.addToast('Insufficient credits! Please top up.', 'error');
          return;
        }

        const willFail = shouldFail || state.simulateFailureNext;
        if (state.simulateFailureNext) {
          set({ simulateFailureNext: false });
        }

        const newId = `gen-${Date.now()}`;
        const randomMedia = GENERATED_MEDIA_POOL[Math.floor(Math.random() * GENERATED_MEDIA_POOL.length)];
        const seed = Math.floor(Math.random() * 90000000) + 10000000;

        const newGen: Generation = {
          id: newId,
          title: state.composer.prompt.slice(0, 45) + '...',
          prompt: state.composer.prompt,
          negativePrompt: state.composer.negativePrompt,
          model: state.composer.model,
          style: state.composer.style,
          aspectRatio: state.composer.aspectRatio,
          duration: state.composer.duration,
          cameraMotion: state.composer.cameraMotion,
          referenceImage: state.composer.referenceImage,
          referenceName: state.composer.referenceName,
          referenceWeight: state.composer.referenceWeight,
          motionIntensity: state.composer.motionIntensity,
          guidanceScale: state.composer.guidanceScale,
          seed,
          resolution: state.composer.aspectRatio === '16:9' ? '3840x2160 (4K)' : state.composer.aspectRatio === '9:16' ? '1080x1920 (Vertical 4K)' : '2048x2048 (Square UHD)',
          fps: 60,
          status: 'queued',
          progress: 5,
          stageMessage: 'Queued in GPU cluster #2 (High Priority Tier)...',
          videoUrl: randomMedia.videoUrl,
          thumbnailUrl: state.composer.referenceImage || randomMedia.thumbnailUrl,
          createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
          isFavorite: false,
          creditsUsed: cost,
        };

        // Deduct credits and set active task
        set((s) => ({
          userCredits: s.userCredits - cost,
          activeGeneratingTask: newGen,
          generations: [newGen, ...s.generations],
          activeGenerationId: newId,
        }));

        state.addToast(`Generation initiated with ${state.composer.model}!`, 'info');

        // Asynchronous Pipeline Progression
        // Stage 1: Queued -> Processing
        setTimeout(() => {
          set((s) => {
            if (!s.activeGeneratingTask || s.activeGeneratingTask.id !== newId) return s;
            const updated = {
              ...s.activeGeneratingTask,
              status: 'processing' as const,
              progress: 28,
              stageMessage: 'Analyzing prompt semantic latents & conditioning tensors...',
            };
            return {
              activeGeneratingTask: updated,
              generations: s.generations.map((g) => (g.id === newId ? updated : g)),
            };
          });
        }, 1500);

        // Stage 2: Processing -> Rendering
        setTimeout(() => {
          set((s) => {
            if (!s.activeGeneratingTask || s.activeGeneratingTask.id !== newId) return s;

            if (willFail) {
              const failedGen = {
                ...s.activeGeneratingTask,
                status: 'failed' as const,
                progress: 45,
                stageMessage: 'GPU Node Latency Outage: Frame tensor memory spike.',
                errorMessage: 'Generation halted at step 22/50. Credits have been refunded.',
              };
              return {
                userCredits: s.userCredits + cost, // Refund
                activeGeneratingTask: failedGen,
                generations: s.generations.map((g) => (g.id === newId ? failedGen : g)),
              };
            }

            const updated = {
              ...s.activeGeneratingTask,
              status: 'rendering' as const,
              progress: 68,
              stageMessage: 'Diffusion sampling step 34/50 (Spatial Coherence Engine)...',
            };
            return {
              activeGeneratingTask: updated,
              generations: s.generations.map((g) => (g.id === newId ? updated : g)),
            };
          });

          if (willFail) {
            get().addToast('Generation failed: GPU tensor error. Credits refunded!', 'error');
          }
        }, 3200);

        // Stage 3: Rendering -> Completed
        if (!willFail) {
          setTimeout(() => {
            set((s) => {
              if (!s.activeGeneratingTask || s.activeGeneratingTask.id !== newId) return s;
              const updated = {
                ...s.activeGeneratingTask,
                status: 'rendering' as const,
                progress: 92,
                stageMessage: 'Neural temporal interpolation & 4K upscaling...',
              };
              return {
                activeGeneratingTask: updated,
                generations: s.generations.map((g) => (g.id === newId ? updated : g)),
              };
            });
          }, 4600);

          setTimeout(() => {
            set((s) => {
              if (!s.activeGeneratingTask || s.activeGeneratingTask.id !== newId) return s;
              const completedGen = {
                ...s.activeGeneratingTask,
                status: 'completed' as const,
                progress: 100,
                stageMessage: 'Generation completed in 5.8s',
              };
              return {
                activeGeneratingTask: null,
                activeGenerationId: newId,
                currentView: 'result',
                generations: s.generations.map((g) => (g.id === newId ? completedGen : g)),
              };
            });

            // Trigger celebration
            try {
              confetti({
                particleCount: 50,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#8b5cf6', '#00f2fe', '#ec4899', '#ffffff']
              });
            } catch {
              // ignore
            }

            get().addToast('Video generated successfully! Generation Recipe is ready.', 'success');
          }, 6000);
        }
      },

      cancelGeneration: () => {
        const state = get();
        if (state.activeGeneratingTask) {
          const cost = state.activeGeneratingTask.creditsUsed;
          set((s) => ({
            userCredits: s.userCredits + cost,
            activeGeneratingTask: null,
            generations: s.generations.filter((g) => g.id !== s.activeGeneratingTask?.id),
          }));
          state.addToast('Generation cancelled. Credits refunded.', 'info');
        }
      },

      retryGeneration: (id) => {
        const gen = get().generations.find((g) => g.id === id);
        if (gen) {
          get().loadRecipe(gen);
          get().startGeneration(false);
        }
      },

      toggleFavorite: (id) => {
        set((state) => {
          const updated = state.generations.map((g) => {
            if (g.id === id) {
              const newFav = !g.isFavorite;
              return { ...g, isFavorite: newFav };
            }
            return g;
          });
          return { generations: updated };
        });
        const gen = get().generations.find((g) => g.id === id);
        if (gen) {
          get().addToast(
            gen.isFavorite ? 'Removed from favorites' : 'Saved to favorites!',
            'info'
          );
        }
      },

      deleteGeneration: (id) => {
        set((state) => {
          const filtered = state.generations.filter((g) => g.id !== id);
          const nextActiveId = state.activeGenerationId === id ? (filtered[0]?.id || null) : state.activeGenerationId;
          return {
            generations: filtered,
            activeGenerationId: nextActiveId,
          };
        });
        get().addToast('Generation deleted from library', 'info');
      },
    }),
    {
      name: 'higgsfield-studio-state-v1',
      partialize: (state) => ({
        generations: state.generations,
        userCredits: state.userCredits,
        composer: state.composer,
      }),
    }
  )
);
