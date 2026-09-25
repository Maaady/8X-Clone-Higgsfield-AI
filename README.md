# Higgsfield AI Studio — Clone

An autonomous, high-fidelity rebuild of the **Higgsfield AI** generative video creation platform. Designed for film directors, VFX artists, and AI creators, prioritizing spatiotemporal visual coherence, fine-grained virtual camera controls, and the flagship **Generation Recipe** recreation system.

---

## 🚀 Key Product Capabilities

| Surface / Flow | Capabilities Implemented |
| :--- | :--- |
| **Landing Page** | Premium Obsidian/Violet hero, live interactive generation showcase, 1-click recipe tryout pills, feature pillars, and primary studio CTA. |
| **Dashboard** | Creative Director workspace, quick creation mode tiles (Text-to-Video, Image-to-Video, Camera Choreography, Character Consistency), active GPU generation monitor, and recent generations shelf. |
| **Create Composer** | Prompt editor with **✨ Magic Enhance**, token counter, negative prompt accordion, reference media upload & demo preset picker with adherence sliders, AI model switch, 8 cinematic style presets, aspect ratios (16:9, 9:16, 1:1, 21:9, 4:5), durations (5s, 10s, 15s), camera motion director, and credit estimation. |
| **Asynchronous Pipeline** | Convincing multi-stage simulated pipeline (`Queued` → `Processing Tensors` → `Neural Diffusion Rendering` → `Completed`), live progress visualizer, plus simulated error failure toggle with automatic credit refund and retry flow. |
| **Result & Recipe Inspector** | **Differentiating Interaction**: High-definition video player with speed and loop controls, paired with the full **Generation Recipe** (Prompt, Reference, Model, Style, Aspect Ratio, Resolution, Seed, Duration, Motion). |
| **Recreate Flow** | Single-click **"Recreate in Composer"** restores the exact prompt and all configuration parameters back into `/create` for rapid creative iteration. |
| **Library Vault** | Filter by All/Favorites, live instant keyword search across prompts and models, style filtering pills, grid/list view toggling, video hover playback, and persistent localStorage sync. |

---

## ⚡ Technology Stack & Architecture

- **Core**: React 19 + TypeScript + Vite 8
- **Styling & UI**: Tailwind CSS v4 + Custom Dark Obsidian/Violet Glassmorphism design system
- **State & Persistence**: Zustand with `localStorage` synchronization (`higgsfield-studio-state-v1`)
- **Icons & Animation**: Lucide React + Canvas Confetti + Custom CSS Keyframe Animations

---

## 🔬 Generation Disclosure

> **Note on AI Generation**: Real cloud GPU video rendering is optionally simulated via an asynchronous state machine with realistic neural tensor stages (`queued`, `processing`, `rendering`, `completed`, `failed`), backed by ultra-crisp demo video reels and responsive metadata generators.

---

## 🛠️ Local Setup & Quick Start

1. **Clone or Navigate to the project directory**:
   ```bash
   cd 8X
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

4. **Build for production**:
   ```bash
   npm run build
   ```

<<<<<<< Updated upstream
## 📁 Agent Logs
>>>>>>> Stashed changes
The `.agent-logs/` directory contains structured logs and metadata tracking incremental agent execution and validation.
