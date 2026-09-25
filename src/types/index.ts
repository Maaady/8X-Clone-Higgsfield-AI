export type AspectRatioType = '16:9' | '21:9' | '9:16' | '1:1' | '4:5';

export interface ModelInfo {
  id: string;
  name: string;
  version: string;
  badge: string;
  description: string;
  context_tokens: number;
  max_resolution: string;
  cost_per_sec: number;
  is_active: number;
  vram_req: string;
  latency_tier: string;
}

export interface StyleInfo {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  prompt_affix: string;
  negative_affix: string;
  preview_image: string;
  badge_color: string;
}

export interface CameraPresetInfo {
  id: string;
  name: string;
  type: string;
  description: string;
  trajectory: string;
  speed: number;
  icon: string;
}

export interface CustomPresetInfo {
  id: string;
  name: string;
  description: string;
  prompt: string;
  model_id: string;
  style_id: string;
  aspect_ratio: string;
  motion_mode: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  username: string;
  handle: string;
  tier: string;
  credits_balance: number;
  gpu_cluster: string;
  total_generations: number;
  total_render_time_sec: number;
}

export interface SystemStats {
  total_generations: number;
  completed_generations: number;
  active_pipeline_jobs: number;
  user_credits: number;
  gpu_cluster_nodes: number;
  gpu_utilization_pct: number;
  average_latency_ms: number;
  db_engine: string;
  storage_file: string;
}

export interface GenerationItem {
  id: string;
  title: string;
  prompt: string;
  negative_prompt: string;
  model_id: string;
  style_id: string;
  aspect_ratio: AspectRatioType;
  resolution: string;
  duration_sec: number;
  motion_mode: string;
  seed: number;
  status: 'queued' | 'tensor_init' | 'spatial_diffusion' | 'temporal_smoothing' | 'upscaling_hdr' | 'completed' | 'failed';
  progress: number;
  current_stage: string;
  video_url: string;
  thumbnail_url: string;
  width: number;
  height: number;
  fps: number;
  steps: number;
  cfg_scale: number;
  camera_data: string;
  tags: string;
  is_favorite: number;
  execution_time_ms: number;
  created_at: string;
  completed_at?: string;
  error_message?: string;
}

export type ActiveView = 'composer' | 'vault' | 'pipeline' | 'styles' | 'cluster';
