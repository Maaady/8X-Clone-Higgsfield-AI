import initSqlJs, { Database } from 'sql.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'studio.sqlite');

let db: Database;

export interface GenerationRecord {
  id: string;
  title: string;
  prompt: string;
  negative_prompt: string;
  model_id: string;
  style_id: string;
  aspect_ratio: string;
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
  camera_data: string; // JSON
  tags: string; // JSON array string
  is_favorite: number;
  execution_time_ms: number;
  created_at: string;
  completed_at?: string;
  error_message?: string;
}

export interface ModelRecord {
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

export interface StyleRecord {
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

export interface CameraPresetRecord {
  id: string;
  name: string;
  type: string;
  description: string;
  trajectory: string;
  speed: number;
  icon: string;
}

export interface CustomPresetRecord {
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

export interface UserProfileRecord {
  id: string;
  username: string;
  handle: string;
  tier: string;
  credits_balance: number;
  gpu_cluster: string;
  total_generations: number;
  total_render_time_sec: number;
}

// Initial rich seed data with high-quality cinematic video reels
const INITIAL_MODELS: ModelRecord[] = [
  {
    id: 'synapse-v4-ultra',
    name: 'Synapse-V4 Ultra Cinema',
    version: 'v4.2.0',
    badge: 'FLAGSHIP',
    description: 'Next-gen spatiotemporal video synthesis with coherent 3D depth and cinematic physics.',
    context_tokens: 4096,
    max_resolution: '4K Ultra-HD',
    cost_per_sec: 4,
    is_active: 1,
    vram_req: '48 GB H100',
    latency_tier: '0.8s / frame'
  },
  {
    id: 'aether-motion-pro',
    name: 'Aether-Motion Pro 2.5',
    version: 'v2.5.1',
    badge: 'HIGH-FPS',
    description: 'Optimized for high-speed dynamic camera movements, fluid stunts, and action tracking.',
    context_tokens: 2048,
    max_resolution: '2K QHD',
    cost_per_sec: 3,
    is_active: 1,
    vram_req: '24 GB A100',
    latency_tier: '0.4s / frame'
  },
  {
    id: 'chrono-diffusion-xl',
    name: 'ChronoDiffusion XL',
    version: 'v3.0.0',
    badge: 'LONG-FORM',
    description: 'Extended temporal consistency engine supporting seamless loops and coherent long takes.',
    context_tokens: 3072,
    max_resolution: '4K Cinema 21:9',
    cost_per_sec: 5,
    is_active: 1,
    vram_req: '80 GB H100 SXM',
    latency_tier: '1.1s / frame'
  },
  {
    id: 'lumina-photoreal',
    name: 'Lumina-Photoreal Prime',
    version: 'v1.8.4',
    badge: 'VFX GRADE',
    description: 'Micro-surface subsurface scattering, authentic optics aberration, and photorealistic skin rendering.',
    context_tokens: 2048,
    max_resolution: '4K Ultra-HD',
    cost_per_sec: 3,
    is_active: 1,
    vram_req: '32 GB V100',
    latency_tier: '0.6s / frame'
  }
];

const INITIAL_STYLES: StyleRecord[] = [
  {
    id: 'cyberpunk-2099',
    name: 'Cyberpunk Neo-Tokyo',
    slug: 'cyberpunk',
    category: 'Sci-Fi',
    description: 'Bioluminescent neon reflections, rain-slicked asphalt, holographic billboards, anamorphic lens flares.',
    prompt_affix: 'cinematic neon noir, futuristic cyberpunk metropolis, wet pavement reflections, volumetric fog, anamorphic blue flare, 8k octane render, masterpiece',
    negative_affix: 'cartoon, low quality, daytime, blurry, low resolution, amateur',
    preview_image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
    badge_color: 'from-cyan-500 to-blue-600'
  },
  {
    id: 'anamorphic-35mm',
    name: '35mm Panavision Cinema',
    slug: 'anamorphic',
    category: 'Film',
    description: 'Authentic 35mm grain, organic optical depth of field, warm golden-hour grading, Hollywood blockbuster look.',
    prompt_affix: 'shot on 35mm Panavision Primo anamorphic lens, Kodak Vision3 500T, organic halation, natural motion blur, shallow depth of field, award-winning cinematography',
    negative_affix: 'digital sharp, oversharpened, flat lighting, video game, 3d render',
    preview_image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&auto=format&fit=crop&q=80',
    badge_color: 'from-amber-500 to-orange-600'
  },
  {
    id: 'hyper-surreal-dream',
    name: 'Hyper-Surrealist Dream',
    slug: 'surreal',
    category: 'Artistic',
    description: 'Gravity-defying physics, iridescent liquid crystal materials, celestial vistas, ethereal dreamscapes.',
    prompt_affix: 'surrealist floating monoliths, iridescent chromatic aberration, dreamlike atmosphere, golden volumetric god rays, fluid geometry, ultra-detailed',
    negative_affix: 'ordinary, dull colors, static, low contrast, grainy',
    preview_image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    badge_color: 'from-purple-500 to-pink-600'
  },
  {
    id: 'imax-documentary',
    name: 'IMAX Nature 8K',
    slug: 'documentary',
    category: 'Realism',
    description: 'High-shutter nature documentary realism, BBC Earth grade clarity, hyper-detailed textures.',
    prompt_affix: 'IMAX 70mm natural documentary capture, photorealistic raw lighting, ultra-sharp atmospheric particles, National Geographic grade fidelity',
    negative_affix: 'cgi, fake, plastic, saturated colors, oversaturated, painting',
    preview_image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80',
    badge_color: 'from-emerald-500 to-teal-600'
  },
  {
    id: 'anime-shinkai',
    name: 'Ethereal Anime Shinkai',
    slug: 'anime',
    category: 'Animation',
    description: 'Lush painted skies, sparkling twilight reflections, emotional cinematic lighting, Makoto Shinkai aesthetic.',
    prompt_affix: 'Makoto Shinkai style, CoMix Wave Films quality, vivid twilight gradient sky, lens reflections, sparkling particles, ultra-detailed anime background',
    negative_affix: 'photorealistic, western comic, 3d cgi, ugly, sketch, unfinished',
    preview_image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
    badge_color: 'from-sky-400 to-indigo-600'
  },
  {
    id: 'dark-fantasy-grim',
    name: 'Dark Fantasy Eldritch',
    slug: 'fantasy',
    category: 'Fantasy',
    description: 'Towering gothic citadels, stormy skies, mystical ember sparks, dark souls atmospheric mood.',
    prompt_affix: 'dark fantasy gothic aesthetics, volumetric mist, glowing mystical runes, ancient stone architecture, grim dark mood, 8k cinematic lighting',
    negative_affix: 'bright, cartoon, joyful, cute, cheerful, oversaturated',
    preview_image: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=600&auto=format&fit=crop&q=80',
    badge_color: 'from-zinc-600 to-red-900'
  }
];

const INITIAL_CAMERA_PRESETS: CameraPresetRecord[] = [
  {
    id: 'cam-orbit-360',
    name: '360° Cinematic Orbit',
    type: 'Rotational',
    description: 'Smooth full rotational orbit around the central focal subject with dynamic parallax.',
    trajectory: 'orbit_360_parallax',
    speed: 1.2,
    icon: 'RotateCw'
  },
  {
    id: 'cam-fpv-drone',
    name: 'High-Speed FPV Drone',
    type: 'Dynamic',
    description: 'Aggressive dive through narrow geometry with realistic bank angles and speed blur.',
    trajectory: 'fpv_dive_banking',
    speed: 2.5,
    icon: 'Zap'
  },
  {
    id: 'cam-vertigo-dolly',
    name: 'Vertigo Dolly Zoom (Hitchcock)',
    type: 'Optical',
    description: 'Opposing dolly push and focal zoom creating dramatic spatial distortion.',
    trajectory: 'contra_zoom_vertigo',
    speed: 1.0,
    icon: 'Maximize2'
  },
  {
    id: 'cam-crane-ascend',
    name: 'Titan Crane Ascend',
    type: 'Vertical',
    description: 'Sweeping low-angle upward crane reveal unveiling panoramic horizons.',
    trajectory: 'crane_vertical_reveal',
    speed: 0.9,
    icon: 'ArrowUpCircle'
  },
  {
    id: 'cam-bullet-time',
    name: 'Bullet-Time 1000fps',
    type: 'Temporal',
    description: 'Ultra slow-motion camera drift around suspended water droplets and shockwaves.',
    trajectory: 'temporal_slow_drift',
    speed: 0.4,
    icon: 'Clock'
  },
  {
    id: 'cam-steadicam-push',
    name: 'Fluid Steadicam Push',
    type: 'Linear',
    description: 'Natural human eye-level forward tracking with subtle organic micro-sway.',
    trajectory: 'steadicam_linear_push',
    speed: 1.1,
    icon: 'Move'
  }
];

const INITIAL_GENERATIONS: GenerationRecord[] = [
  {
    id: 'gen-syn-901',
    title: 'Neon Ronin — Rain of Shinjuku',
    prompt: 'A cybernetic samurai standing on a neon-drenched rooftop in Neo-Tokyo 2099, rain pouring down reflecting glowing cyan and magenta holographic Kanji signs, katana vibrating with electric energy, cinematic wide angle, 35mm lens, atmospheric steam rising from vents.',
    negative_prompt: 'low quality, blurry, noisy, daylight, cartoon, oversaturated, amateur footage',
    model_id: 'synapse-v4-ultra',
    style_id: 'cyberpunk-2099',
    aspect_ratio: '16:9',
    resolution: '4K Ultra-HD (3840x2160)',
    duration_sec: 10,
    motion_mode: 'cam-orbit-360',
    seed: 4829103,
    status: 'completed',
    progress: 100,
    current_stage: 'Render Pipeline Finalized',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-cyber-city-with-traffic-and-neon-lights-at-night-42284-large.mp4',
    thumbnail_url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
    width: 3840,
    height: 2160,
    fps: 60,
    steps: 50,
    cfg_scale: 7.5,
    camera_data: JSON.stringify({ trajectory: 'orbit_360_parallax', speed: 1.2, focal_length: '35mm', aperture: 'f/1.8' }),
    tags: JSON.stringify(['Cyberpunk', 'Cinematic', 'Rain', 'Samurai', '4K']),
    is_favorite: 1,
    execution_time_ms: 12450,
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    completed_at: new Date(Date.now() - 3600000 * 2 + 12450).toISOString()
  },
  {
    id: 'gen-syn-902',
    title: 'Titan Monolith — Dunes of Arrakis',
    prompt: 'Massive obsidian alien monolith rising out of immense shifting desert sand dunes at golden hour, immense scale, tiny exploratory rover in foreground with headlights on, swirling dust storm with sunbeams piercing through particulate haze.',
    negative_prompt: 'blurry, cartoon, 3d cgi render, oversaturated, low poly',
    model_id: 'chrono-diffusion-xl',
    style_id: 'anamorphic-35mm',
    aspect_ratio: '21:9',
    resolution: '4K Cinema (3840x1646)',
    duration_sec: 15,
    motion_mode: 'cam-crane-ascend',
    seed: 8392011,
    status: 'completed',
    progress: 100,
    current_stage: 'Render Pipeline Finalized',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-sunset-over-the-sand-dunes-43224-large.mp4',
    thumbnail_url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&auto=format&fit=crop&q=80',
    width: 3840,
    height: 1646,
    fps: 48,
    steps: 60,
    cfg_scale: 8.0,
    camera_data: JSON.stringify({ trajectory: 'crane_vertical_reveal', speed: 0.9, focal_length: '50mm', aperture: 'f/2.8' }),
    tags: JSON.stringify(['Desert', 'Sci-Fi', 'Anamorphic', 'Monolith', '21:9']),
    is_favorite: 1,
    execution_time_ms: 18200,
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    completed_at: new Date(Date.now() - 3600000 * 5 + 18200).toISOString()
  },
  {
    id: 'gen-syn-903',
    title: 'Bioluminescent Abyss Leviathan',
    prompt: 'A gargantuan bioluminescent ethereal whale swimming through dark crystalline underwater trench, emitting pulsating blue and emerald light particles, micro-organisms floating, deep oceanic abyss, volumetric god rays from above water surface.',
    negative_prompt: 'muddy, noisy, low resolution, flat colors, artificial',
    model_id: 'lumina-photoreal',
    style_id: 'hyper-surreal-dream',
    aspect_ratio: '16:9',
    resolution: '4K Ultra-HD (3840x2160)',
    duration_sec: 10,
    motion_mode: 'cam-steadicam-push',
    seed: 1204983,
    status: 'completed',
    progress: 100,
    current_stage: 'Render Pipeline Finalized',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-school-of-fish-swimming-in-the-deep-ocean-43285-large.mp4',
    thumbnail_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80',
    width: 3840,
    height: 2160,
    fps: 60,
    steps: 55,
    cfg_scale: 7.0,
    camera_data: JSON.stringify({ trajectory: 'steadicam_linear_push', speed: 1.1, focal_length: '24mm', aperture: 'f/2.0' }),
    tags: JSON.stringify(['Underwater', 'Bioluminescent', 'Surreal', '4K']),
    is_favorite: 0,
    execution_time_ms: 14100,
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    completed_at: new Date(Date.now() - 3600000 * 12 + 14100).toISOString()
  },
  {
    id: 'gen-syn-904',
    title: 'Hyper-Speed Orbital Re-Entry',
    prompt: 'Space capsule cutting through the upper atmosphere during fiery re-entry, glowing plasma plasma sheath wrapping around heat shield, Earth curvature with glowing aurora borealis below, stars above, intense aerodynamic vibration and camera shake.',
    negative_prompt: 'cartoon, static, low quality, flat',
    model_id: 'aether-motion-pro',
    style_id: 'imax-documentary',
    aspect_ratio: '16:9',
    resolution: '2K QHD (2560x1440)',
    duration_sec: 5,
    motion_mode: 'cam-fpv-drone',
    seed: 9582173,
    status: 'completed',
    progress: 100,
    current_stage: 'Render Pipeline Finalized',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-flying-through-the-clouds-in-the-sky-42410-large.mp4',
    thumbnail_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
    width: 2560,
    height: 1440,
    fps: 60,
    steps: 40,
    cfg_scale: 7.2,
    camera_data: JSON.stringify({ trajectory: 'fpv_dive_banking', speed: 2.5, focal_length: '18mm', aperture: 'f/4.0' }),
    tags: JSON.stringify(['Space', 'Action', 'Atmosphere', 'FPV']),
    is_favorite: 1,
    execution_time_ms: 7800,
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    completed_at: new Date(Date.now() - 3600000 * 24 + 7800).toISOString()
  }
];

export async function initDatabase(): Promise<Database> {
  if (db) return db;

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  const SQL = await initSqlJs();

  if (fs.existsSync(DB_FILE)) {
    try {
      const fileBuffer = fs.readFileSync(DB_FILE);
      db = new SQL.Database(fileBuffer);
      console.log(`[DB] Loaded existing SQLite database from ${DB_FILE}`);
      return db;
    } catch (err) {
      console.warn(`[DB] Failed reading existing SQLite database, creating new one:`, err);
    }
  }

  db = new SQL.Database();
  console.log(`[DB] Initializing new SQLite schema and seed records...`);

  // Create tables
  db.run(`
    CREATE TABLE IF NOT EXISTS models (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      version TEXT NOT NULL,
      badge TEXT NOT NULL,
      description TEXT NOT NULL,
      context_tokens INTEGER NOT NULL,
      max_resolution TEXT NOT NULL,
      cost_per_sec INTEGER NOT NULL,
      is_active INTEGER NOT NULL DEFAULT 1,
      vram_req TEXT NOT NULL,
      latency_tier TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS styles (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      prompt_affix TEXT NOT NULL,
      negative_affix TEXT NOT NULL,
      preview_image TEXT NOT NULL,
      badge_color TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS camera_presets (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      description TEXT NOT NULL,
      trajectory TEXT NOT NULL,
      speed REAL NOT NULL,
      icon TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS generations (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      prompt TEXT NOT NULL,
      negative_prompt TEXT NOT NULL,
      model_id TEXT NOT NULL,
      style_id TEXT NOT NULL,
      aspect_ratio TEXT NOT NULL,
      resolution TEXT NOT NULL,
      duration_sec INTEGER NOT NULL,
      motion_mode TEXT NOT NULL,
      seed INTEGER NOT NULL,
      status TEXT NOT NULL,
      progress REAL NOT NULL DEFAULT 0,
      current_stage TEXT NOT NULL,
      video_url TEXT NOT NULL,
      thumbnail_url TEXT NOT NULL,
      width INTEGER NOT NULL,
      height INTEGER NOT NULL,
      fps INTEGER NOT NULL,
      steps INTEGER NOT NULL,
      cfg_scale REAL NOT NULL,
      camera_data TEXT NOT NULL,
      tags TEXT NOT NULL,
      is_favorite INTEGER NOT NULL DEFAULT 0,
      execution_time_ms INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      completed_at TEXT,
      error_message TEXT
    );

    CREATE TABLE IF NOT EXISTS custom_presets (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      prompt TEXT NOT NULL,
      model_id TEXT NOT NULL,
      style_id TEXT NOT NULL,
      aspect_ratio TEXT NOT NULL,
      motion_mode TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS user_profile (
      id TEXT PRIMARY KEY,
      username TEXT NOT NULL,
      handle TEXT NOT NULL,
      tier TEXT NOT NULL,
      credits_balance INTEGER NOT NULL,
      gpu_cluster TEXT NOT NULL,
      total_generations INTEGER NOT NULL DEFAULT 0,
      total_render_time_sec INTEGER NOT NULL DEFAULT 0
    );
  `);

  // Seed Models
  for (const m of INITIAL_MODELS) {
    db.run(
      `INSERT OR REPLACE INTO models (id, name, version, badge, description, context_tokens, max_resolution, cost_per_sec, is_active, vram_req, latency_tier)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [m.id, m.name, m.version, m.badge, m.description, m.context_tokens, m.max_resolution, m.cost_per_sec, m.is_active, m.vram_req, m.latency_tier]
    );
  }

  // Seed Styles
  for (const s of INITIAL_STYLES) {
    db.run(
      `INSERT OR REPLACE INTO styles (id, name, slug, category, description, prompt_affix, negative_affix, preview_image, badge_color)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [s.id, s.name, s.slug, s.category, s.description, s.prompt_affix, s.negative_affix, s.preview_image, s.badge_color]
    );
  }

  // Seed Camera Presets
  for (const c of INITIAL_CAMERA_PRESETS) {
    db.run(
      `INSERT OR REPLACE INTO camera_presets (id, name, type, description, trajectory, speed, icon)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [c.id, c.name, c.type, c.description, c.trajectory, c.speed, c.icon]
    );
  }

  // Seed User Profile
  db.run(
    `INSERT OR REPLACE INTO user_profile (id, username, handle, tier, credits_balance, gpu_cluster, total_generations, total_render_time_sec)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    ['user-dir-01', 'Synapse Director', '@director_prime', 'Director Studio Pro', 2480, 'US-East H100 Cluster #4', 42, 380]
  );

  // Seed Generations
  for (const g of INITIAL_GENERATIONS) {
    db.run(
      `INSERT OR REPLACE INTO generations (
        id, title, prompt, negative_prompt, model_id, style_id, aspect_ratio, resolution,
        duration_sec, motion_mode, seed, status, progress, current_stage, video_url,
        thumbnail_url, width, height, fps, steps, cfg_scale, camera_data, tags,
        is_favorite, execution_time_ms, created_at, completed_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        g.id, g.title, g.prompt, g.negative_prompt, g.model_id, g.style_id, g.aspect_ratio, g.resolution,
        g.duration_sec, g.motion_mode, g.seed, g.status, g.progress, g.current_stage, g.video_url,
        g.thumbnail_url, g.width, g.height, g.fps, g.steps, g.cfg_scale, g.camera_data, g.tags,
        g.is_favorite, g.execution_time_ms, g.created_at, g.completed_at
      ]
    );
  }

  saveDatabaseToFile();
  return db;
}

export function saveDatabaseToFile(): void {
  if (!db) return;
  try {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_FILE, buffer);
  } catch (err) {
    console.error('[DB] Failed persisting database to file:', err);
  }
}

// Data access helpers
function parseRow<T>(row: any[], columns: string[]): T {
  const obj: any = {};
  for (let i = 0; i < columns.length; i++) {
    obj[columns[i]] = row[i];
  }
  return obj as T;
}

export function getAllGenerations(filters?: { search?: string; style?: string; model?: string; status?: string; favoriteOnly?: boolean }): GenerationRecord[] {
  let query = 'SELECT * FROM generations WHERE 1=1';
  const params: any[] = [];

  if (filters?.search) {
    query += ' AND (prompt LIKE ? OR title LIKE ?)';
    params.push(`%${filters.search}%`, `%${filters.search}%`);
  }
  if (filters?.style && filters.style !== 'all') {
    query += ' AND style_id = ?';
    params.push(filters.style);
  }
  if (filters?.model && filters.model !== 'all') {
    query += ' AND model_id = ?';
    params.push(filters.model);
  }
  if (filters?.status && filters.status !== 'all') {
    query += ' AND status = ?';
    params.push(filters.status);
  }
  if (filters?.favoriteOnly) {
    query += ' AND is_favorite = 1';
  }

  query += ' ORDER BY created_at DESC';

  const stmt = db.prepare(query);
  if (params.length > 0) {
    stmt.bind(params);
  }

  const results: GenerationRecord[] = [];
  while (stmt.step()) {
    const row = stmt.getAsObject() as unknown as GenerationRecord;
    results.push(row);
  }
  stmt.free();
  return results;
}

export function getGenerationById(id: string): GenerationRecord | null {
  const stmt = db.prepare('SELECT * FROM generations WHERE id = ?');
  stmt.bind([id]);
  if (stmt.step()) {
    const row = stmt.getAsObject() as unknown as GenerationRecord;
    stmt.free();
    return row;
  }
  stmt.free();
  return null;
}

export function insertGeneration(record: GenerationRecord): void {
  db.run(
    `INSERT INTO generations (
      id, title, prompt, negative_prompt, model_id, style_id, aspect_ratio, resolution,
      duration_sec, motion_mode, seed, status, progress, current_stage, video_url,
      thumbnail_url, width, height, fps, steps, cfg_scale, camera_data, tags,
      is_favorite, execution_time_ms, created_at, completed_at, error_message
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      record.id, record.title, record.prompt, record.negative_prompt, record.model_id, record.style_id, record.aspect_ratio, record.resolution,
      record.duration_sec, record.motion_mode, record.seed, record.status, record.progress, record.current_stage, record.video_url,
      record.thumbnail_url, record.width, record.height, record.fps, record.steps, record.cfg_scale, record.camera_data, record.tags,
      record.is_favorite, record.execution_time_ms, record.created_at, record.completed_at || null, record.error_message || null
    ]
  );
  saveDatabaseToFile();
}

export function updateGenerationProgress(id: string, updates: Partial<GenerationRecord>): void {
  const fields = Object.keys(updates);
  if (fields.length === 0) return;

  const setClause = fields.map(f => `${f} = ?`).join(', ');
  const values = fields.map(f => (updates as any)[f]);
  values.push(id);

  db.run(`UPDATE generations SET ${setClause} WHERE id = ?`, values);
  saveDatabaseToFile();
}

export function deleteGenerationRecord(id: string): boolean {
  db.run('DELETE FROM generations WHERE id = ?', [id]);
  saveDatabaseToFile();
  return true;
}

export function toggleGenerationFavorite(id: string): boolean {
  db.run('UPDATE generations SET is_favorite = CASE WHEN is_favorite = 1 THEN 0 ELSE 1 END WHERE id = ?', [id]);
  saveDatabaseToFile();
  return true;
}

export function getModelsList(): ModelRecord[] {
  const stmt = db.prepare('SELECT * FROM models ORDER BY is_active DESC, cost_per_sec ASC');
  const results: ModelRecord[] = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject() as unknown as ModelRecord);
  }
  stmt.free();
  return results;
}

export function getStylesList(): StyleRecord[] {
  const stmt = db.prepare('SELECT * FROM styles ORDER BY category ASC, name ASC');
  const results: StyleRecord[] = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject() as unknown as StyleRecord);
  }
  stmt.free();
  return results;
}

export function getCameraPresetsList(): CameraPresetRecord[] {
  const stmt = db.prepare('SELECT * FROM camera_presets ORDER BY speed ASC');
  const results: CameraPresetRecord[] = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject() as unknown as CameraPresetRecord);
  }
  stmt.free();
  return results;
}

export function getUserProfile(): UserProfileRecord {
  const stmt = db.prepare('SELECT * FROM user_profile LIMIT 1');
  if (stmt.step()) {
    const user = stmt.getAsObject() as unknown as UserProfileRecord;
    stmt.free();
    return user;
  }
  stmt.free();
  return {
    id: 'user-dir-01',
    username: 'Synapse Director',
    handle: '@director_prime',
    tier: 'Director Studio Pro',
    credits_balance: 2000,
    gpu_cluster: 'US-East H100 Cluster #4',
    total_generations: 0,
    total_render_time_sec: 0
  };
}

export function deductUserCredits(amount: number, renderSeconds: number = 0): void {
  db.run(
    `UPDATE user_profile SET
      credits_balance = MAX(0, credits_balance - ?),
      total_generations = total_generations + 1,
      total_render_time_sec = total_render_time_sec + ?
     WHERE id = (SELECT id FROM user_profile LIMIT 1)`,
    [amount, renderSeconds]
  );
  saveDatabaseToFile();
}

export function refundUserCredits(amount: number): void {
  db.run(
    `UPDATE user_profile SET credits_balance = credits_balance + ? WHERE id = (SELECT id FROM user_profile LIMIT 1)`,
    [amount]
  );
  saveDatabaseToFile();
}

export function addUserCredits(amount: number): void {
  db.run(
    `UPDATE user_profile SET credits_balance = credits_balance + ? WHERE id = (SELECT id FROM user_profile LIMIT 1)`,
    [amount]
  );
  saveDatabaseToFile();
}

export function getCustomPresets(): CustomPresetRecord[] {
  const stmt = db.prepare('SELECT * FROM custom_presets ORDER BY created_at DESC');
  const results: CustomPresetRecord[] = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject() as unknown as CustomPresetRecord);
  }
  stmt.free();
  return results;
}

export function saveCustomPreset(preset: CustomPresetRecord): void {
  db.run(
    `INSERT OR REPLACE INTO custom_presets (id, name, description, prompt, model_id, style_id, aspect_ratio, motion_mode, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [preset.id, preset.name, preset.description, preset.prompt, preset.model_id, preset.style_id, preset.aspect_ratio, preset.motion_mode, preset.created_at]
  );
  saveDatabaseToFile();
}

export function getSystemStats() {
  const totalGenerationsStmt = db.prepare('SELECT COUNT(*) as count FROM generations');
  let totalGenerations = 0;
  if (totalGenerationsStmt.step()) {
    totalGenerations = (totalGenerationsStmt.getAsObject() as any).count;
  }
  totalGenerationsStmt.free();

  const completedStmt = db.prepare("SELECT COUNT(*) as count FROM generations WHERE status = 'completed'");
  let completedCount = 0;
  if (completedStmt.step()) {
    completedCount = (completedStmt.getAsObject() as any).count;
  }
  completedStmt.free();

  const activeStmt = db.prepare("SELECT COUNT(*) as count FROM generations WHERE status NOT IN ('completed', 'failed')");
  let activeCount = 0;
  if (activeStmt.step()) {
    activeCount = (activeStmt.getAsObject() as any).count;
  }
  activeStmt.free();

  const user = getUserProfile();

  return {
    total_generations: totalGenerations,
    completed_generations: completedCount,
    active_pipeline_jobs: activeCount,
    user_credits: user.credits_balance,
    gpu_cluster_nodes: 16,
    gpu_utilization_pct: activeCount > 0 ? 84 + (activeCount * 3) : 38,
    average_latency_ms: 11400,
    db_engine: 'SQLite 3.45 (Persistent Wasm Core)',
    storage_file: DB_FILE
  };
}
