export type ModelType = 
  | 'Higgsfield Cinema v2.5'
  | 'Sora Flow 2.0'
  | 'Luma DreamPro'
  | 'Kling Motion 1.5'
  | 'AnimateDiff Ultra';

export type StylePreset = 
  | 'Cinematic'
  | 'Anime Fantasy'
  | 'Cyberpunk Neon'
  | 'Photorealistic'
  | 'Dark Fantasy'
  | 'Claymation'
  | 'Vintage 35mm'
  | 'Sci-Fi Macro';

export type AspectRatioType = '16:9' | '9:16' | '1:1' | '21:9' | '4:5';

export type CameraMotionType = 
  | 'Dynamic Orbit'
  | 'Cinematic Pan Right'
  | 'Dramatic Zoom In'
  | 'FPV Drone Glide'
  | 'Slow Vertical Tilt'
  | 'Static Locked';

export type GenerationStatus = 'queued' | 'processing' | 'rendering' | 'completed' | 'failed';

export interface GenerationRecipe {
  prompt: string;
  negativePrompt?: string;
  model: ModelType;
  style: StylePreset;
  aspectRatio: AspectRatioType;
  duration: number; // in seconds
  cameraMotion: CameraMotionType;
  referenceImage?: string | null;
  referenceName?: string | null;
  referenceWeight?: number;
  motionIntensity?: number;
  guidanceScale?: number;
  seed: number;
  resolution: string;
  fps: number;
}

export interface Generation extends GenerationRecipe {
  id: string;
  title: string;
  status: GenerationStatus;
  progress: number;
  stageMessage: string;
  videoUrl: string;
  thumbnailUrl: string;
  createdAt: string;
  isFavorite: boolean;
  creditsUsed: number;
  errorMessage?: string;
}

export interface ReferencePreset {
  id: string;
  name: string;
  category: 'Character' | 'Environment' | 'Lighting' | 'Creature';
  url: string;
  thumbnail: string;
}

export interface PromptTemplate {
  id: string;
  title: string;
  category: string;
  prompt: string;
  model: ModelType;
  style: StylePreset;
  aspectRatio: AspectRatioType;
  duration: number;
  cameraMotion: CameraMotionType;
  previewUrl: string;
}
