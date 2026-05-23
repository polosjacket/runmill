# Changelog

All notable changes to the **RUNMILL** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.2] - 2026-05-23

### Added
- **Repository Optimization**:
  - Created [`.gitignore`](file:///Users/kids/Documents/GitHub/runmill/.gitignore) to exclude local dependencies (`node_modules`), production build outputs (`dist/`), environment secrets (`.env`), OS caches (`.DS_Store`), and editor configurations (`.vscode/`).

---

## [1.0.1] - 2026-05-23

### Added
- **Detailed Source Annotations**:
  - Inserted comprehensive JSDoc block comments and inline explanations into `server.js`, `src/audio.js`, `src/voxels.js`, and `src/game.js` to detail variables, logic flows, sound design filters, and collision geometry coordinates.
- **Architectural Documentation**:
  - Authored [`DOCUMENTATION.md`](file:///Users/kids/Documents/GitHub/runmill/DOCUMENTATION.md) outlining the coordinate system, lane movement formulas, audio synthesizer components, API endpoint schemas, and modular layout diagrams.
  - Added a troubleshooting and calibration guide to help developers adjust collision bounds, game speeds, and colors.
  - Set documentation synchronization requirements to ensure future code modifications maintain code annotations.

---

## [1.0.0] - 2026-05-23

### Added
- **Project Structure & Bundler Config**:
  - Initialized `package.json` with scripts for dev mode (`vite`), building (`vite build`), previewing (`vite preview`), and starting the production server (`node server.js`).
  - Set up `vite.config.js` to run on port 3000, enable auto-opening, and proxy API calls (`/api`) to the Express backend (`http://localhost:3001`).
- **Express Backend Server**:
  - Created `server.js` with Express to serve production assets from `dist` and handle client API requests.
  - Implemented high score leaderboard endpoints: `GET /api/scores` (reads and sorts scores descending) and `POST /api/scores` (saves initials and scores, trimming to top 10).
  - Seeded initial scores database in `leaderboard.json`.
- **Game Engine & Controller**:
  - Implemented `src/game.js` coordinating the Three.js WebGL rendering pipeline, camera settings, lighting rig, running physics, lane changing, jump velocity, object movement, AABB collisions, and scoring.
  - Added UI hooks linking page elements (HUD statistics, Start/Game Over overlay menus) and mobile touch controller arrows.
- **Procedural Voxel Models**:
  - Created `src/voxels.js` programmatically building 3D assets out of standard box geometries and flat shaded materials:
    - Running character mesh featuring animated pivot arms and legs.
    - Floating floppy disk collectibles.
    - Multiple barrier obstacles (retro CRT TVs with glowing screens, cassette tapes, and pixelated pyramid spikes).
- **Procedural Web Audio Synth**:
  - Created `src/audio.js` using the browser's native Web Audio API to procedurally synthesize a looping synthwave baseline/melody soundtrack and individual sounds (jump sliding sine wave, coins chime arpeggio, collision low-pass explosion, and game over minor chord).
- **Retro Visual Styling & Overlay Layout**:
  - Created `index.html` structure wrapping canvas layout, custom HUD counters, overlays, and touch controls.
  - Styled `style.css` with deep space colors, glowing neon selectors, CRT screen scanlines, custom glitch titles, and responsive glassmorphism menus.

---

## Future Modifications Guideline

When adding new features or fixing bugs in future turns:
1. Document the version bump (e.g., `[1.0.1]` or `[1.1.0]`) and release date.
2. Group changes under the appropriate headers:
   - `Added` for new features.
   - `Changed` for changes in existing functionality.
   - `Deprecated` for soon-to-be removed features.
   - `Removed` for now removed features.
   - `Fixed` for any bug fixes.
   - `Security` in case of vulnerabilities addressed.
