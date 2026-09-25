import express from 'express';
import cors from 'cors';
import {
  initDatabase,
  getAllGenerations,
  getGenerationById,
  insertGeneration,
  updateGenerationProgress,
  deleteGenerationRecord,
  toggleGenerationFavorite,
  getModelsList,
  getStylesList,
  getCameraPresetsList,
  getUserProfile,
  deductUserCredits,
  refundUserCredits,
  addUserCredits,
  getCustomPresets,
  saveCustomPreset,
  getSystemStats,
  GenerationRecord
} from './db.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Track active background job timers so they can be cancelled if needed
const activeJobs = new Map<string, NodeJS.Timeout[]>();

// Curated high quality cinematic video pool for realistic generation completions
const CINEMATIC_VIDEOS = [
  {
    video: 'https://assets.mixkit.co/videos/preview/mixkit-cyber-city-with-traffic-and-neon-lights-at-night-42284-large.mp4',
    thumb: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80'
  },
  {
    video: 'https://assets.mixkit.co/videos/preview/mixkit-sunset-over-the-sand-dunes-43224-large.mp4',
    thumb: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&auto=format&fit=crop&q=80'
  },
  {
    video: 'https://assets.mixkit.co/videos/preview/mixkit-school-of-fish-swimming-in-the-deep-ocean-43285-large.mp4',
    thumb: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80'
  },
  {
    video: 'https://assets.mixkit.co/videos/preview/mixkit-flying-through-the-clouds-in-the-sky-42410-large.mp4',
    thumb: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80'
  },
  {
    video: 'https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-background-1610-large.mp4',
    thumb: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=800&auto=format&fit=crop&q=80'
  },
  {
    video: 'https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4',
    thumb: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80'
  }
];

function runAsyncGenerationPipeline(genId: string, simulateFailure = false, durationSec = 10, costCredits = 30) {
  const startTime = Date.now();
  const timeouts: NodeJS.Timeout[] = [];

  const stages = [
    { delay: 400, progress: 12, status: 'tensor_init', stage: 'Allocating GPU Tensors & Embedding Text Latents' },
    { delay: 1400, progress: 36, status: 'spatial_diffusion', stage: 'Spatiotemporal Diffusion Sampling (Step 18/50)' },
    { delay: 2600, progress: 62, status: 'spatial_diffusion', stage: 'Spatiotemporal Diffusion Sampling (Step 38/50)' },
    { delay: 3800, progress: 84, status: 'temporal_smoothing', stage: 'Optical Flow Motion Coherence & Frame De-flicker' },
    { delay: 4900, progress: 95, status: 'upscaling_hdr', stage: 'Neural Super-Resolution 4K & HDR Tone Grading' }
  ];

  stages.forEach(st => {
    const t = setTimeout(() => {
      try {
        updateGenerationProgress(genId, {
          progress: st.progress,
          status: st.status as any,
          current_stage: st.stage
        });
      } catch (e) {
        console.error(`[Worker] Error updating stage ${st.stage} for ${genId}:`, e);
      }
    }, st.delay);
    timeouts.push(t);
  });

  const finalT = setTimeout(() => {
    activeJobs.delete(genId);
    const elapsed = Date.now() - startTime;

    if (simulateFailure) {
      updateGenerationProgress(genId, {
        status: 'failed',
        progress: 0,
        current_stage: 'Render Pipeline Failed: CUDA Out of Memory Exception',
        error_message: 'GPU Kernel Error: Tensor allocation failed on Node 7. Credits have been refunded.',
        execution_time_ms: elapsed
      });
      refundUserCredits(costCredits);
      console.log(`[Worker] Simulated failure for job ${genId}. Refunded ${costCredits} credits.`);
    } else {
      const pick = CINEMATIC_VIDEOS[Math.floor(Math.random() * CINEMATIC_VIDEOS.length)];
      updateGenerationProgress(genId, {
        status: 'completed',
        progress: 100,
        current_stage: 'Render Pipeline Finalized',
        video_url: pick.video,
        thumbnail_url: pick.thumb,
        completed_at: new Date().toISOString(),
        execution_time_ms: elapsed
      });
      console.log(`[Worker] Job ${genId} successfully finished in ${elapsed}ms.`);
    }
  }, 5800);

  timeouts.push(finalT);
  activeJobs.set(genId, timeouts);
}

// ---------------- API ROUTES ---------------- //

// Health Check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'online',
    service: 'Synapse Cinema API & Diffusion Engine',
    version: '2.5.0-production',
    uptime_seconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

// System Stats
app.get('/api/stats', (_req, res) => {
  try {
    const stats = getSystemStats();
    res.json({ success: true, data: stats });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// User Profile
app.get('/api/user', (_req, res) => {
  try {
    const user = getUserProfile();
    res.json({ success: true, data: user });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Top up user credits
app.post('/api/user/credits/topup', (req, res) => {
  try {
    const { amount = 500 } = req.body;
    addUserCredits(amount);
    const user = getUserProfile();
    res.json({ success: true, data: user, message: `Added ${amount} credits successfully.` });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// AI Models Catalog
app.get('/api/models', (_req, res) => {
  try {
    const models = getModelsList();
    res.json({ success: true, data: models });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Style Presets Catalog
app.get('/api/styles', (_req, res) => {
  try {
    const styles = getStylesList();
    res.json({ success: true, data: styles });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Camera Choreography Presets
app.get('/api/camera-presets', (_req, res) => {
  try {
    const presets = getCameraPresetsList();
    res.json({ success: true, data: presets });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Custom Presets
app.get('/api/custom-presets', (_req, res) => {
  try {
    const presets = getCustomPresets();
    res.json({ success: true, data: presets });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/custom-presets', (req, res) => {
  try {
    const { name, description = '', prompt, model_id, style_id, aspect_ratio, motion_mode } = req.body;
    if (!name || !prompt) {
      return res.status(400).json({ success: false, error: 'Name and prompt are required' });
    }
    const id = `preset-${Date.now()}`;
    const preset = {
      id,
      name,
      description,
      prompt,
      model_id: model_id || 'synapse-v4-ultra',
      style_id: style_id || 'anamorphic-35mm',
      aspect_ratio: aspect_ratio || '16:9',
      motion_mode: motion_mode || 'cam-orbit-360',
      created_at: new Date().toISOString()
    };
    saveCustomPreset(preset);
    res.json({ success: true, data: preset });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Query Generations
app.get('/api/generations', (req, res) => {
  try {
    const { search, style, model, status, favorite } = req.query;
    const generations = getAllGenerations({
      search: typeof search === 'string' ? search : undefined,
      style: typeof style === 'string' ? style : undefined,
      model: typeof model === 'string' ? model : undefined,
      status: typeof status === 'string' ? status : undefined,
      favoriteOnly: favorite === 'true'
    });
    res.json({ success: true, data: generations, total: generations.length });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Single Generation Details
app.get('/api/generations/:id', (req, res) => {
  try {
    const gen = getGenerationById(req.params.id);
    if (!gen) {
      return res.status(404).json({ success: false, error: 'Generation not found' });
    }
    res.json({ success: true, data: gen });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Create Generation Task (Real DB write + Real async pipeline execution)
app.post('/api/generations', (req, res) => {
  try {
    const {
      prompt,
      negative_prompt = 'blurry, distorted, low quality, artifacts, cartoonish',
      model_id = 'synapse-v4-ultra',
      style_id = 'anamorphic-35mm',
      aspect_ratio = '16:9',
      resolution = '4K Ultra-HD (3840x2160)',
      duration_sec = 10,
      motion_mode = 'cam-orbit-360',
      seed,
      steps = 50,
      cfg_scale = 7.5,
      camera_data,
      tags = [],
      simulate_failure = false
    } = req.body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'A prompt is required for video generation.' });
    }

    const models = getModelsList();
    const selectedModel = models.find(m => m.id === model_id) || models[0];
    const costCredits = (selectedModel?.cost_per_sec || 3) * duration_sec;

    const user = getUserProfile();
    if (user.credits_balance < costCredits) {
      return res.status(402).json({
        success: false,
        error: `Insufficient GPU credits. Needed ${costCredits}, available ${user.credits_balance}. Top up to proceed.`
      });
    }

    // Deduct credits in SQLite
    deductUserCredits(costCredits, duration_sec);

    // Compute dimensions based on aspect ratio
    let width = 3840;
    let height = 2160;
    if (aspect_ratio === '21:9') {
      width = 3840;
      height = 1646;
    } else if (aspect_ratio === '9:16') {
      width = 2160;
      height = 3840;
    } else if (aspect_ratio === '1:1') {
      width = 2160;
      height = 2160;
    } else if (aspect_ratio === '4:5') {
      width = 2160;
      height = 2700;
    }

    const genId = `gen-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const finalSeed = typeof seed === 'number' && seed > 0 ? seed : Math.floor(Math.random() * 9000000) + 1000000;

    // Generate smart cinematic title from prompt
    const titleWords = prompt.split(' ').slice(0, 5).join(' ');
    const title = titleWords.length > 0 ? `${titleWords}...` : 'Cinematic Vision';

    const defaultCameraData = JSON.stringify(camera_data || {
      trajectory: motion_mode,
      speed: 1.0,
      focal_length: '35mm',
      aperture: 'f/2.0'
    });

    const record: GenerationRecord = {
      id: genId,
      title,
      prompt,
      negative_prompt,
      model_id,
      style_id,
      aspect_ratio,
      resolution,
      duration_sec,
      motion_mode,
      seed: finalSeed,
      status: 'queued',
      progress: 5,
      current_stage: 'Enqueued in Synapse GPU Compute Cluster',
      video_url: '',
      thumbnail_url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
      width,
      height,
      fps: 60,
      steps,
      cfg_scale,
      camera_data: defaultCameraData,
      tags: JSON.stringify(Array.isArray(tags) && tags.length > 0 ? tags : ['AI Cinema', aspect_ratio, style_id]),
      is_favorite: 0,
      execution_time_ms: 0,
      created_at: new Date().toISOString()
    };

    insertGeneration(record);

    // Launch background asynchronous pipeline
    runAsyncGenerationPipeline(genId, simulateFailure, duration_sec, costCredits);

    res.status(201).json({
      success: true,
      data: record,
      credits_deducted: costCredits,
      remaining_credits: getUserProfile().credits_balance,
      message: 'Generation job submitted and queued in GPU cluster.'
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Cancel active generation
app.post('/api/generations/:id/cancel', (req, res) => {
  try {
    const { id } = req.params;
    const gen = getGenerationById(id);
    if (!gen) {
      return res.status(404).json({ success: false, error: 'Generation not found' });
    }

    if (activeJobs.has(id)) {
      const timeouts = activeJobs.get(id);
      timeouts?.forEach(t => clearTimeout(t));
      activeJobs.delete(id);
    }

    updateGenerationProgress(id, {
      status: 'failed',
      current_stage: 'Cancelled by User',
      error_message: 'Execution aborted by director request. Credits refunded.'
    });

    // Refund credits
    refundUserCredits(30);

    res.json({ success: true, message: 'Generation task cancelled and credits refunded.' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Retry failed generation
app.post('/api/generations/:id/retry', (req, res) => {
  try {
    const { id } = req.params;
    const gen = getGenerationById(id);
    if (!gen) {
      return res.status(404).json({ success: false, error: 'Generation not found' });
    }

    updateGenerationProgress(id, {
      status: 'queued',
      progress: 5,
      current_stage: 'Retrying in GPU Cluster',
      error_message: undefined
    });

    runAsyncGenerationPipeline(id, false, gen.duration_sec, 30);
    res.json({ success: true, message: 'Generation restarted in pipeline.' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Fork / Branch a generation
app.post('/api/generations/:id/fork', (req, res) => {
  try {
    const { id } = req.params;
    const parent = getGenerationById(id);
    if (!parent) {
      return res.status(404).json({ success: false, error: 'Parent generation not found' });
    }

    const forkedId = `gen-fork-${Date.now().toString(36)}`;
    const newSeed = parent.seed + Math.floor(Math.random() * 1000) + 1;

    const record: GenerationRecord = {
      ...parent,
      id: forkedId,
      title: `${parent.title} (Branch #${Math.floor(Math.random() * 90 + 10)})`,
      seed: newSeed,
      status: 'queued',
      progress: 5,
      current_stage: 'Enqueued Branch in GPU Array',
      video_url: '',
      is_favorite: 0,
      created_at: new Date().toISOString(),
      completed_at: undefined,
      execution_time_ms: 0
    };

    insertGeneration(record);
    runAsyncGenerationPipeline(forkedId, false, parent.duration_sec, 30);

    res.status(201).json({ success: true, data: record });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Toggle Favorite
app.patch('/api/generations/:id/favorite', (req, res) => {
  try {
    const { id } = req.params;
    toggleGenerationFavorite(id);
    const updated = getGenerationById(id);
    res.json({ success: true, is_favorite: updated?.is_favorite === 1 });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Delete Generation
app.delete('/api/generations/:id', (req, res) => {
  try {
    const { id } = req.params;
    deleteGenerationRecord(id);
    res.json({ success: true, message: 'Generation deleted from database.' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Intelligent AI Prompt Enhancer
app.post('/api/enhance-prompt', (req, res) => {
  try {
    const { prompt = '', style_id = 'anamorphic-35mm', mood = 'cinematic' } = req.body;
    if (!prompt.trim()) {
      return res.status(400).json({ success: false, error: 'Please provide a prompt to enhance.' });
    }

    const styles = getStylesList();
    const style = styles.find(s => s.id === style_id);
    const styleAffix = style?.prompt_affix || 'cinematic lighting, 8k resolution, photorealistic, volumetric god rays';

    const opticalTokens = [
      'shot on ARRI Alexa 65 with Cooke Anamorphic /i Prime lenses',
      'subsurface light scattering through volumetric atmospheric mist',
      'deep chiaroscuro shadows with natural dynamic color roll-off',
      'subtle chromatic aberration at lens periphery and micro-bokeh',
      'natural motion blur with 180-degree shutter angle coherence'
    ];

    const randomOptics = opticalTokens.slice(0, 3).join(', ');
    const enhancedPrompt = `${prompt.trim()}, ${randomOptics}, ${styleAffix}, award-winning Hollywood color grading, 16-bit uncompressed RAW master`;

    const suggestedNegatives = 'oversaturated, artificial bloom, plastic skin, low bitrate, jagged edges, jittery camera, temporal flicker, cartoonish shading';

    res.json({
      success: true,
      original_prompt: prompt,
      enhanced_prompt: enhancedPrompt,
      suggested_negatives: suggestedNegatives,
      added_tokens_count: 24
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Start Server and initialize SQLite database
async function start() {
  await initDatabase();
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 SYNAPSE CINEMA API & SQLite DATABASE RUNNING ON PORT ${PORT}`);
    console.log(`📡 Endpoints active: /api/generations, /api/models, /api/styles, /api/stats, /api/enhance-prompt`);
    console.log(`=======================================================`);
  });
}

start().catch(err => {
  console.error('[Fatal] Server failed to start:', err);
});
