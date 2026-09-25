import type {
  GenerationItem,
  ModelInfo,
  StyleInfo,
  CameraPresetInfo,
  CustomPresetInfo,
  UserProfile,
  SystemStats
} from '../types';

const BASE_URL = '/api';

export async function fetchHealth() {
  const res = await fetch(`${BASE_URL}/health`);
  return res.json();
}

export async function fetchStats(): Promise<SystemStats> {
  const res = await fetch(`${BASE_URL}/stats`);
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to fetch stats');
  return data.data;
}

export async function fetchUserProfile(): Promise<UserProfile> {
  const res = await fetch(`${BASE_URL}/user`);
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to fetch user');
  return data.data;
}

export async function topUpCredits(amount: number): Promise<UserProfile> {
  const res = await fetch(`${BASE_URL}/user/credits/topup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount })
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to top up credits');
  return data.data;
}

export async function fetchModels(): Promise<ModelInfo[]> {
  const res = await fetch(`${BASE_URL}/models`);
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to fetch models');
  return data.data;
}

export async function fetchStyles(): Promise<StyleInfo[]> {
  const res = await fetch(`${BASE_URL}/styles`);
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to fetch styles');
  return data.data;
}

export async function fetchCameraPresets(): Promise<CameraPresetInfo[]> {
  const res = await fetch(`${BASE_URL}/camera-presets`);
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to fetch camera presets');
  return data.data;
}

export async function fetchCustomPresets(): Promise<CustomPresetInfo[]> {
  const res = await fetch(`${BASE_URL}/custom-presets`);
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to fetch custom presets');
  return data.data;
}

export async function createCustomPreset(preset: Partial<CustomPresetInfo>): Promise<CustomPresetInfo> {
  const res = await fetch(`${BASE_URL}/custom-presets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(preset)
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to create preset');
  return data.data;
}

export async function fetchGenerations(filters?: {
  search?: string;
  style?: string;
  model?: string;
  status?: string;
  favorite?: boolean;
}): Promise<GenerationItem[]> {
  const params = new URLSearchParams();
  if (filters?.search) params.append('search', filters.search);
  if (filters?.style && filters.style !== 'all') params.append('style', filters.style);
  if (filters?.model && filters.model !== 'all') params.append('model', filters.model);
  if (filters?.status && filters.status !== 'all') params.append('status', filters.status);
  if (filters?.favorite) params.append('favorite', 'true');

  const res = await fetch(`${BASE_URL}/generations?${params.toString()}`);
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to fetch generations');
  return data.data;
}

export async function fetchGenerationById(id: string): Promise<GenerationItem> {
  const res = await fetch(`${BASE_URL}/generations/${id}`);
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to fetch generation');
  return data.data;
}

export async function createGenerationTask(payload: {
  prompt: string;
  negative_prompt?: string;
  model_id: string;
  style_id: string;
  aspect_ratio: string;
  resolution?: string;
  duration_sec: number;
  motion_mode: string;
  seed?: number;
  steps?: number;
  cfg_scale?: number;
  camera_data?: any;
  tags?: string[];
  simulate_failure?: boolean;
}): Promise<{ data: GenerationItem; credits_deducted: number; remaining_credits: number }> {
  const res = await fetch(`${BASE_URL}/generations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to submit generation');
  return data;
}

export async function cancelGenerationTask(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/generations/${id}/cancel`, { method: 'POST' });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to cancel generation');
}

export async function retryGenerationTask(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/generations/${id}/retry`, { method: 'POST' });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to retry generation');
}

export async function forkGenerationTask(id: string): Promise<GenerationItem> {
  const res = await fetch(`${BASE_URL}/generations/${id}/fork`, { method: 'POST' });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to fork generation');
  return data.data;
}

export async function toggleFavoriteGeneration(id: string): Promise<boolean> {
  const res = await fetch(`${BASE_URL}/generations/${id}/favorite`, { method: 'PATCH' });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to toggle favorite');
  return data.is_favorite;
}

export async function deleteGenerationTask(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/generations/${id}`, { method: 'DELETE' });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to delete generation');
}

export async function enhancePromptApi(prompt: string, style_id: string): Promise<{
  enhanced_prompt: string;
  suggested_negatives: string;
  added_tokens_count: number;
}> {
  const res = await fetch(`${BASE_URL}/enhance-prompt`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, style_id })
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to enhance prompt');
  return data;
}
