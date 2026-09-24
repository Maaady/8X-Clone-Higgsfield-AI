import type { ModelType, StylePreset, AspectRatioType, CameraMotionType, Generation, ReferencePreset, PromptTemplate } from '../types';

export const MODEL_OPTIONS: { id: ModelType; name: string; tag: string; description: string; badge: string; speed: string; fidelity: string }[] = [
  {
    id: 'Higgsfield Cinema v2.5',
    name: 'Higgsfield Cinema v2.5',
    tag: 'Flagship',
    description: 'Cinematographic physics, dynamic lighting, 4K consistency & complex choreography.',
    badge: 'Pro Recommended',
    speed: '4.2s / sec',
    fidelity: 'Ultra 4K'
  },
  {
    id: 'Sora Flow 2.0',
    name: 'Sora Flow 2.0',
    tag: 'Long Form',
    description: 'Spatiotemporal coherence, fluid natural motion, complex multi-agent scenes.',
    badge: 'State of Art',
    speed: '5.8s / sec',
    fidelity: '1080p 60fps'
  },
  {
    id: 'Luma DreamPro',
    name: 'Luma DreamPro',
    tag: 'Fast Render',
    description: 'Optimized for high-speed camera motion, hyper-realistic depth and organic textures.',
    badge: 'Lightning Fast',
    speed: '2.1s / sec',
    fidelity: '1440p'
  },
  {
    id: 'Kling Motion 1.5',
    name: 'Kling Motion 1.5',
    tag: 'Character Lock',
    description: 'Superior facial fidelity, expressions, and strict reference image adherence.',
    badge: 'Best for Faces',
    speed: '3.6s / sec',
    fidelity: '1080p'
  },
  {
    id: 'AnimateDiff Ultra',
    name: 'AnimateDiff Ultra',
    tag: 'Stylized',
    description: 'Ideal for anime, hand-drawn aesthetic, claymation, and stylized art directing.',
    badge: 'Creative Art',
    speed: '1.9s / sec',
    fidelity: '1080p'
  }
];

export const STYLE_PRESETS: { id: StylePreset; label: string; preview: string; description: string; color: string }[] = [
  {
    id: 'Cinematic',
    label: 'Cinematic 35mm',
    preview: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80',
    description: 'Anamorphic lens flares, shallow depth of field, blockbuster color grading.',
    color: 'from-purple-600 to-indigo-700'
  },
  {
    id: 'Cyberpunk Neon',
    label: 'Cyberpunk Neon',
    preview: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
    description: 'Holographic volumetric fog, rain-soaked asphalt, neon glow aesthetics.',
    color: 'from-cyan-500 to-blue-600'
  },
  {
    id: 'Anime Fantasy',
    label: 'Anime Fantasy',
    preview: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80',
    description: 'Makoto Shinkai-inspired vibrant clouds, painterly light rays, hand-drawn magic.',
    color: 'from-pink-500 to-purple-600'
  },
  {
    id: 'Photorealistic',
    label: 'Hyper Photoreal',
    preview: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    description: 'Naturalistic ambient occlusion, micro-skin textures, true-to-life physics.',
    color: 'from-emerald-500 to-teal-700'
  },
  {
    id: 'Dark Fantasy',
    label: 'Dark Fantasy',
    preview: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    description: 'Eldritch monoliths, moody low-key chiaroscuro, Gothic ethereal atmosphere.',
    color: 'from-slate-700 to-zinc-900'
  },
  {
    id: 'Sci-Fi Macro',
    label: 'Sci-Fi Macro',
    preview: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    description: 'Fluid ferrofluid, refractive prism crystals, quantum particle simulation.',
    color: 'from-violet-500 to-fuchsia-600'
  },
  {
    id: 'Claymation',
    label: 'Claymation / Stop-Mo',
    preview: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=600&q=80',
    description: 'Handcrafted plasticine tactile textures, tactile stop-motion frame jitter.',
    color: 'from-amber-500 to-orange-600'
  },
  {
    id: 'Vintage 35mm',
    label: 'Vintage Kodachrome',
    preview: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=600&q=80',
    description: '1970s film grain, warm nostalgic dye tones, optical chromatic aberration.',
    color: 'from-yellow-600 to-rose-700'
  }
];

export const ASPECT_RATIOS: { id: AspectRatioType; label: string; iconRatio: string; desc: string }[] = [
  { id: '16:9', label: '16:9 Landscape', iconRatio: 'w-7 h-4', desc: 'Cinema / YouTube / TV' },
  { id: '9:16', label: '9:16 Vertical', iconRatio: 'w-4 h-7', desc: 'TikTok / Reels / Shorts' },
  { id: '1:1', label: '1:1 Square', iconRatio: 'w-5 h-5', desc: 'Instagram / Feed' },
  { id: '21:9', label: '21:9 Ultra-Wide', iconRatio: 'w-8 h-3.5', desc: 'Anamorphic Widescreen' },
  { id: '4:5', label: '4:5 Social Portrait', iconRatio: 'w-4 h-5', desc: 'Social Card / Portrait' },
];

export const CAMERA_MOTIONS: { id: CameraMotionType; label: string; iconName: string; desc: string }[] = [
  { id: 'Dynamic Orbit', label: 'Dynamic Orbit', iconName: 'RotateCcw', desc: 'Sweeping 360 camera rotation around subject' },
  { id: 'Cinematic Pan Right', label: 'Cinematic Pan', iconName: 'MoveRight', desc: 'Smooth horizontal dolly tracker' },
  { id: 'Dramatic Zoom In', label: 'Dramatic Zoom', iconName: 'ZoomIn', desc: 'High-tension vertigo push towards center' },
  { id: 'FPV Drone Glide', label: 'FPV Drone Glide', iconName: 'Plane', desc: 'High-speed dynamic low-altitude aerial glide' },
  { id: 'Slow Vertical Tilt', label: 'Slow Tilt Up', iconName: 'MoveUp', desc: 'Grand scale reveal from base to horizon' },
  { id: 'Static Locked', label: 'Locked Tripod', iconName: 'Camera', desc: 'Zero camera shake for pure internal motion' },
];

export const REFERENCE_PRESETS: ReferencePreset[] = [
  {
    id: 'ref-1',
    name: 'Cyberpunk Ronin (Akira)',
    category: 'Character',
    url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'ref-2',
    name: 'Astronaut in Luminescent Flora',
    category: 'Environment',
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'ref-3',
    name: 'Bioluminescent Deep Sea Leviathan',
    category: 'Creature',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'ref-4',
    name: 'Gold Hour Volumetric Cyber City',
    category: 'Lighting',
    url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=600&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=200&q=80'
  }
];

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: 'tpl-1',
    title: 'Neon Cyberpunk Pursuit',
    category: 'Sci-Fi Action',
    prompt: 'Hyper-detailed cinematic shot of a sleek chrome hover-car darting through neon rain in Neo-Shinjuku, reflections glistening on asphalt, volumetric purple fog, lens flare, 35mm film grain, 8k resolution.',
    model: 'Higgsfield Cinema v2.5',
    style: 'Cyberpunk Neon',
    aspectRatio: '16:9',
    duration: 10,
    cameraMotion: 'FPV Drone Glide',
    previewUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'tpl-2',
    title: 'Enchanted Crystal Bloom',
    category: 'Fantasy & Nature',
    prompt: 'Extreme close-up macro timelapse of glowing quartz crystals growing and blooming like lotus petals, iridescent refractive prism highlights, magical dust motes drifting in ethereal sunlight.',
    model: 'Sora Flow 2.0',
    style: 'Sci-Fi Macro',
    aspectRatio: '16:9',
    duration: 5,
    cameraMotion: 'Dramatic Zoom In',
    previewUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'tpl-3',
    title: 'Mystic Solitary Samurai',
    category: 'Cinematic Story',
    prompt: 'Cinematic slow-motion shot of an armored warrior standing atop a misty mountain ridge at twilight, crimson cherry blossom petals swirling in the wind, katana reflecting sunset rays, masterwork composition.',
    model: 'Higgsfield Cinema v2.5',
    style: 'Cinematic',
    aspectRatio: '21:9',
    duration: 10,
    cameraMotion: 'Dynamic Orbit',
    previewUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'tpl-4',
    title: 'Space Station Dawn Walk',
    category: 'Sci-Fi Film',
    prompt: 'First-person perspective of an astronaut stepping out onto the orbital observation ring of a planetary space station, colossal gas giant rising below, solar panels glinting in raw sunlight, IMAX depth.',
    model: 'Luma DreamPro',
    style: 'Photorealistic',
    aspectRatio: '16:9',
    duration: 5,
    cameraMotion: 'Cinematic Pan Right',
    previewUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80'
  }
];

export const GENERATED_MEDIA_POOL = [
  {
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-futuristic-city-with-flying-cars-42589-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80'
  },
  {
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-foggy-forest-42416-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80'
  },
  {
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-the-earth-rotating-in-space-42617-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80'
  },
  {
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-ink-swirling-in-water-43343-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'
  },
  {
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-glowing-sphere-43093-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1200&q=80'
  },
  {
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-particles-in-slow-motion-41857-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1200&q=80'
  }
];

export const SEED_GENERATIONS: Generation[] = [
  {
    id: 'gen-seed-1',
    title: 'Futuristic Cyberpunk Tokyo Rain Drift',
    prompt: 'Cinematic 8k footage of a futuristic sports car accelerating through neon-drenched futuristic Tokyo streets in heavy rain, puddles reflecting magenta and cyan neon signs, ultra-realistic tire spray and motion blur.',
    negativePrompt: 'low quality, blurry, deformed, cartoonish, watermark',
    model: 'Higgsfield Cinema v2.5',
    style: 'Cyberpunk Neon',
    aspectRatio: '16:9',
    duration: 10,
    cameraMotion: 'FPV Drone Glide',
    referenceImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
    referenceName: 'Tokyo Rain Reference',
    referenceWeight: 0.85,
    motionIntensity: 8,
    guidanceScale: 7.5,
    seed: 94827104,
    resolution: '3840x2160 (4K UHD)',
    fps: 60,
    status: 'completed',
    progress: 100,
    stageMessage: 'Generation finished in 4.1s',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-futuristic-city-with-flying-cars-42589-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
    createdAt: '2026-09-24 11:30:15',
    isFavorite: true,
    creditsUsed: 10
  },
  {
    id: 'gen-seed-2',
    title: 'Ethereal Bioluminescent Forest Canopy',
    prompt: 'Slow-motion aerial pass through a mystical ancient forest filled with glowing blue spores, towering luminescent fungi, and a crystal river cascading between mossy stones.',
    negativePrompt: 'grainy, oversaturated, lowres, extra limbs',
    model: 'Sora Flow 2.0',
    style: 'Anime Fantasy',
    aspectRatio: '16:9',
    duration: 5,
    cameraMotion: 'Cinematic Pan Right',
    referenceImage: null,
    referenceWeight: 0,
    motionIntensity: 5,
    guidanceScale: 8.0,
    seed: 12093847,
    resolution: '1920x1080 (1080p)',
    fps: 60,
    status: 'completed',
    progress: 100,
    stageMessage: 'Generation finished in 3.6s',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-foggy-forest-42416-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    createdAt: '2026-09-24 10:45:00',
    isFavorite: true,
    creditsUsed: 5
  },
  {
    id: 'gen-seed-3',
    title: 'Orbital Sunset over Deep Oceans',
    prompt: 'Hyper-realistic cinematic IMAX shot of Earth from low orbit as the golden sun dips behind the curve of the atmosphere, aurora borealis shimmering across the dark hemisphere.',
    negativePrompt: 'blurry, pixelated, 2d, artifacting',
    model: 'Higgsfield Cinema v2.5',
    style: 'Photorealistic',
    aspectRatio: '21:9',
    duration: 10,
    cameraMotion: 'Dynamic Orbit',
    referenceImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
    referenceName: 'NASA Space Plate',
    referenceWeight: 0.9,
    motionIntensity: 6,
    guidanceScale: 7.0,
    seed: 66392019,
    resolution: '3840x1645 (21:9 Cinema)',
    fps: 60,
    status: 'completed',
    progress: 100,
    stageMessage: 'Generation finished in 4.8s',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-the-earth-rotating-in-space-42617-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    createdAt: '2026-09-24 09:12:40',
    isFavorite: false,
    creditsUsed: 10
  },
  {
    id: 'gen-seed-4',
    title: 'Macro Crystalline Quantum Bloom',
    prompt: 'Super slow motion 1000fps macro capture of iridescent liquid crystal formations reacting to magnetic frequencies, metallic obsidian tentacles with gold veining.',
    negativePrompt: 'flat, dull, low quality',
    model: 'Luma DreamPro',
    style: 'Sci-Fi Macro',
    aspectRatio: '9:16',
    duration: 5,
    cameraMotion: 'Dramatic Zoom In',
    referenceImage: null,
    referenceWeight: 0,
    motionIntensity: 9,
    guidanceScale: 8.5,
    seed: 49201855,
    resolution: '1080x1920 (Vertical 4K)',
    fps: 60,
    status: 'completed',
    progress: 100,
    stageMessage: 'Generation finished in 2.9s',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-ink-swirling-in-water-43343-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    createdAt: '2026-09-24 08:30:10',
    isFavorite: true,
    creditsUsed: 5
  },
  {
    id: 'gen-seed-5',
    title: 'Vintage 35mm Desert Drifter',
    prompt: 'Nostalgic 1970s Kodachrome film footage of a solitary vintage motorcycle riding down an endless desert highway during golden hour, lens flare, dust swirls in sunlight.',
    negativePrompt: 'digital, sterile, 3d render',
    model: 'AnimateDiff Ultra',
    style: 'Vintage 35mm',
    aspectRatio: '16:9',
    duration: 5,
    cameraMotion: 'Cinematic Pan Right',
    referenceImage: null,
    referenceWeight: 0,
    motionIntensity: 4,
    guidanceScale: 6.5,
    seed: 38291044,
    resolution: '1920x1080 (35mm Scanned)',
    fps: 24,
    status: 'completed',
    progress: 100,
    stageMessage: 'Generation finished in 2.4s',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-highway-in-the-middle-of-the-desert-41544-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80',
    createdAt: '2026-09-23 18:22:15',
    isFavorite: false,
    creditsUsed: 5
  }
];
