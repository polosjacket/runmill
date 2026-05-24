# Changelog

All notable changes to the **RUNMILL** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.4.1] - 2026-05-24

### Changed
- **Vehicle Orientation**:
  - Reoriented all player vehicle models to face away from the camera ($180^\circ$ Y-rotation) by default, showing the back of the car (spoiler), monster truck (cargo bed), and cargo trailer to the player.
  - Adjusted sports car spin animation offsets to maintain the default away-facing state upon completing the spin sequence.
  - Inverted monster truck forward bash nose-dive tilt calculations to align with the new facing orientation.

## [1.4.0] - 2026-05-24

### Added
- **Vehicle Color Customization**:
  - Added a retro color selection panel to the Start Menu containing five neon color options: Pink (`#ff007f`), Cyan (`#00f0ff`), Green (`#39ff14`), Yellow (`#fff600`), and Purple (`#bd00ff`).
  - Added styling rules and subtle glowing hover states for circular color swatches in `style.css`.
  - Upgraded vehicle model generator in `src/voxels.js` to accept a custom color parameter and dynamically assign it to the vehicle chassis (sports car, monster truck, and cargo truck).
  - Wired event handlers in `src/game.js` to set the active color and pass it to the spawning logic.

## [1.3.0] - 2026-05-24

### Added
- **Sports Car Spin Proximity Fling Ability**:
  - Added ability to spin-screech when playing as the Sports Car by pressing **Down Arrow** or **S** (or clicking the new mobile **SPIN** button).
  - Programmed active spin state lasting 0.5 seconds that rotates the vehicle 720 degrees around its Y-axis, keeping the Z-coordinate constant.
  - Programmed proximity-based fling mechanics: detecting obstacles and floppy disk points within a `2.8` units radius.
  - Flung items are propelled in parabolic arcs and land exactly on one of the three drivable highway lanes ($X \in [-2.0, 0.0, 2.0]$) using exact air-time landing trajectories.
  - Synthesized high-pitched, squealing tire screech procedural sweep sound effect `playSpin()`.

## [1.2.0] - 2026-05-24

### Added
- **Monster Truck Forward Bash Attack**:
  - Added ability to bash forward when playing as the Monster Truck by pressing **Down Arrow** or **S** (or clicking the new mobile **BASH** button).
  - Programmed active bash state lasting 0.4 seconds that accelerates the vehicle forward in space, spins tires at triple speed, and nose-dives the vehicle cabin downward by 0.18 rad for visual impact.
  - Added a 3-second recharge cooldown, displaying numerical timers or "READY" in a dedicated neon-green HUD module.
  - Synthesized a low-pitched, growling engine revving sawtooth procedural sound effect `playBash()`.
  - Added `e.preventDefault()` to key handlers (Arrow keys and Space) and automatic window focus upon starting the run to ensure smooth, uninterrupted keyboard input.
- **Obstacle Launch & Explode Physics**:
  - Engineered physics-based parabolic knock-out arcs for slammed obstacles. Trajectories are mathematically calculated to land exactly on one of the three drivable highway lanes ($X = -2.0, 0, 2.0$) by solving the exact air-time equation ($t_{\text{air}} = V_{y0} / 12.5$) and scaling horizontal velocity ($V_{x0} = \Delta X / t_{\text{air}}$). This ensures thrown obstacles and points remain within bounds where the player can reach/interact with them.
  - Programmed ground impact explosions: when a flung obstacle lands back on the ground, it explodes into colorful voxel shrapnel particles (increased particle count to 16).
  - Implemented chain reaction blastwaves: expanded the blast radius to **6.0 units**, flinging any active obstacles or floppy disk points within range.
  - Constrained blast propagation: flung items are propelled forward along their target highway lanes, propagating linear cascading chain reactions down the lanes.
- **High-Visibility Hazard Obstacles**:
  - Redesigned obstacle voxel materials in `src/voxels.js` with glowing emissive characteristics: spikes are fluorescent crimson red, CRT TVs feature a safety neon orange casing and bright yellow static screen, and cassettes have vibrant neon yellow casing with hot pink spools.

---

## [1.1.2] - 2026-05-24

### Fixed
- **Menu Navigation**:
  - Changed the "REBOOT RUN" button behavior (and renamed it to "REBOOT MENU") on the Game Over screen to transition back to the main Start Menu, rather than forcing an immediate run restart. This allows users to change character vehicles or view scores between runs.

---

## [1.1.1] - 2026-05-24

### Changed
- **UI UX Improvement**:
  - Configured the game to automatically transition back to the Start Menu (main screen) upon uploading a high score, allowing the user to select vehicles and see the refreshed leaderboard immediately.

---

## [1.1.0] - 2026-05-23

### Added
- **Vehicle Selection Menu**:
  - Implemented a horizontal grid selector on the start menu to choose from three vehicles: "CAR", "MONSTER TRUCK", and "TRUCK".
  - Created corresponding CSS layouts and neon active outlines for the selection buttons.
- **Procedural Vehicle Voxel Models**:
  - Added `createVehicleModel()` and `createSpringModel()` inside `src/voxels.js`.
  - Built custom shapes, colors, spoiler attachments, frame cages, cargo boxes, and multiple wheels for each vehicle.
- **Wheel Spinning Animation**:
  - Attached wheel meshes to groups and programmed rotating on their X-axis in the rendering loop, proportional to the game's scrolling speed.
- **Spring-Jump Physics & Anim**:
  - Interleaved box geometry layers to construct a spiral spring anchored below the chassis.
  - Programmed dynamic spring Y-scaling to stretch down to the cyber road ($y = 0$) on jump inputs, and compress to $0$ (retracted inside the body) when resting on ground.
- **Dynamic Bounding Boxes**:
  - Calibrated collision offsets, lane width thresholds, and box tolerances in `checkCollision()` depending on vehicle heights and depths.

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
