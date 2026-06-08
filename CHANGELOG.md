# Changelog

All notable changes to the **RUNMILL** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.9.0] - 2026-06-08

### Added
- **Unified Settings Overlay Modal**:
  - Replaced start-screen audio elements with a dedicated floating Settings gear modal container.
  - Relocated volume control slider, music toggle (Music: ON/OFF), and SFX toggle (SFX: ON/OFF) into the new settings overlay.
  - Automatically loads and saves volume levels, music, and SFX preferences in `localStorage`.
- **First-Person View Camera Mode**:
  - Integrated a new HUD toggle button to switch between first-person (hood/windshield tracking) and third-person (lerped follow chase) camera views.
  - Automatically disables player vehicle visibility (sets `visible = false`) in first-person mode to prevent visual clipping of the vehicle meshes inside the viewport.
- **Customization Settings (Text Font, Grid Color, Text Color)**:
  - Added a **Text Font Selector** inside Settings offering four styles: Share Tech (Mono default), Retro Pixel, Orbitron Cyber, and Modern Inter.
  - Added a **Grid Color Selector** providing custom color selections (Default, Cyan, Pink, Green, Yellow, Purple, White) that override default world theme highway grid colors on the fly.
  - Added a **Text Color Selector** allowing players to override standard text color styling with Cyan, Pink, Green, Yellow, or Purple.
  - Standardized all preferences to persist in `localStorage` and automatically apply on boot.
- **Garbage Truck & Trash Bag Projectiles**:
  - Rewrote the base "TRUCK" vehicle model to a themed **Garbage Truck** complete with a sloped rear hopper, hazard warning stripes, and a side-loading robotic grabber arm.
  - Added **Trash Bag Throw Ability** (S / Down Arrow / mobile TRASH button): throws a custom 3D voxel dark grey garbage bag with yellow ties onto the road lane ahead.
  - Trash bags detonate on ground impact, triggering a chain-reaction explosion that eliminates spikes, CRT TVs, cassettes, and other hazards in proximity.
  - Synthesized a custom sound effect `playTrashExplosion` featuring a wet low punch and clattering square/sawtooth noise sweeps to simulate garbage bags exploding.
- **Dynamic 30-Language Google Translate Integration**:
  - Implemented a dynamic language selection dictionary supporting 30+ languages (e.g., English, Spanish, Japanese, French, German, Italian, Portuguese, Chinese, Korean, Russian, etc.).
  - Configured automatic translation retrieval using the Google Translate Free API.
  - Integrated `localStorage` translation caching (`runmill_lang_cache_v4_...`) to speed up UI loading and limit redundant API requests.
  - Built an alphanumeric-stripped string matching parser to handle dynamic spacing shifts introduced by automated translation engines (e.g. mapping "v1.8.0" to "v 1.8.0").
  - Fixed translating key components including HUD headers ("specials", "next world"), subtitles, and game alerts to match the chosen system language.
- **AFK Coin Mining Screensaver Mode**:
  - Created an idle AFK mode with a custom floating overlay showing Matrix code rain and scanner lines.
  - Automatically deposits 100 "Data Coins" into the persistent wallet for every 60 seconds of idle time.
  - Added a button to safely return to the main system dashboard.

## [1.8.0] - 2026-05-29

### Added
- **Coin Currency & Persistent Wallet**:
  - Transformed floppy disk point items into spinning 3D voxel Coins of three denominations:
    - **Green Coin**: Worth 1 coin. Common chance of spawning (70%).
    - **Yellow Coin**: Worth 4 coins. Uncommon chance of spawning (24%).
    - **Black Coin**: Worth 20 coins. Rare chance of spawning (6%). Designed as a dark charcoal core with a hot pink glowing neon rim for high visibility.
  - Stores player's total coin balance persistently in `localStorage` across runs.
  - Displays a dedicated glowing neon-green **COINS** container on the HUD during gameplay and a **WALLET** balance indicator in the Start Menu overlay.
- **Vehicle Shop Menu**:
  - Integrated locking/unlocking shop mechanics directly into the character select screen.
  - Unlocked vehicles (Car, Monster Truck, Delivery Truck) remain free.
  - Locked vehicles show their currency cost. If a player click-selects a locked vehicle, the shop verifies if the wallet has sufficient funds, deducts the price, plays a collection chime, and unlocks it persistently (saved via `localStorage`). If funds are insufficient, a red wobble-shake animation is triggered with a hit SFX.
- **Three Playable Cyber Vehicles**:
  - **Cyber Truck** (Cost: 5,000 coins): starts with 5 HP. Special ability: **Coin Magnet** (automatically draws in any nearby coin point items within 4.5 units of the truck using a magnetic force pull).
  - **Hovercraft** (Cost: 25,000 coins): starts with 3 HP. Hover/glide design (no wheels, bottom thruster plate, booster fans). Special ability: **Glide** (completely immune to spike hazards; floats right over spikes without taking collision damage).
  - **Tank** (Cost: 150,000 coins): starts with 8 HP. Heavy tracked body and turrets. Special ability: **Shoot** (pressing Down Arrow/S or tapping mobile FIRE button fires a glowing neon shell forward along the active lane, immediately detonating and removing any obstacle it hits, including immune barriers like shields).
- **Shooting sound effect**:
  - Synthesized `playShoot()`: A loud, retro 8-bit laser/cannon blast (800Hz to 100Hz square sweep with bandpass filtered noise crunch).

## [1.7.1] - 2026-05-29

### Changed
- **5-World Progression scaling**: Transitions world progression from distance-based (500m per world) to time-based (+1 minute per world level).
  - World 1: 1 minute (60s)
  - World 2: 2 minutes (120s)
  - World 3: 3 minutes (180s)
  - World 4: 4 minutes (240s)
  - World 5: 5 minutes (300s)
  - Program completion victory ending is triggered after surviving World 5's full 5 minutes.
- **HUD Timer Overlay**: Displays a bright LED countdown timer showing remaining seconds before the next world warp or final victory.

### Fixed
- **Constructor Duplication Cleanup**: Removed the redundant `this.bashCooldownTimer = 0;` variable definition in `src/game.js`.

## [1.7.0] - 2026-05-28

### Added
- **5-World Progression**:
  - Implemented World 1 to World 5 gameplay progression. Players advance to the next world based on survived time.
  - Added a dynamic visual theme for each world with unique grid line colors, wireframe mountain colors, sunset sun gradients, background sky/fog tones, and light colors/intensities:
    - **World 1: Cyber City** (Electric Cyan grid, Purple sky/ambient)
    - **World 2: Acid Grid** (Acid Neon Green grid, Toxic Green-Black sky/ambient)
    - **World 3: Tokyo Drift** (Gold-Yellow grid, Ember Orange-Black sky/ambient)
    - **World 4: Synth Wave** (Hot Pink grid, Laser Purple-Black sky/ambient)
    - **World 5: Matrix Codes** (Pure LED White grid, Glacial Blue-Black sky/ambient)
  - Designed an animated `#world-transition` banner overlay that pops, pulses, and slides out on screen to announce the entry to a new world.
- **Victory Ending Screen**:
  - Completing World 5 (attaining 2500 meters total distance) successfully completes the program run, triggering a custom Victory Ending screen (`#victory-screen`).
  - Added score and distance tallies, initials score submission forms, and menu reboot buttons for the Victory screen.
- **Victory and Transition Sound Synthesizers**:
  - Synthesized `playWorldTransition()`: A rising sci-fi laser sweep (200Hz -> 1200Hz sawtooth) triggered on crossing world boundaries.
  - Synthesized `playVictory()`: A major chord ascending arpeggio fanfare (C5 -> E5 -> G5 -> C6 -> E6 -> G6 -> C7 triangle waves) backed by a sawtooth major chord when the victory screen loads.
- **LED-Bright Glow Aesthetics**:
  - Enhanced all HUD value fields with intense glowing box-shadows (up to `15px` blur with `0.8` opacity) and text-shadow glow effects to emulate actual retro LED sign lights.

## [1.6.1] - 2026-05-25

### Changed
- **Lighter and Shinier Color Aesthetics**:
  - Calibrated all voxel models (player runner, custom vehicle selections, points, heart items, and hazards) to use lighter, glowing pastel-neon color palettes.
  - Added self-illuminating emissive channels and reflective metallic properties to all standard meshes to make models shine from within.
  - Shifted the sky background and depth fog to a lighter, glowing cyber-indigo hue (`0x19082b`).
  - Lighter electric cyan (`0x80f7ff`) applied to scrolling grid helpers and side mountains, with wireframe mountains' emissive intensity raised to `1.2` for laser-like brightness.
  - Boosted light intensities further: Ambient Light to `2.6` (color `0x8833ff`), Directional Sun to `3.2` (color `0xff4da6`), and front player spotlight to `4.5` (color `0x80f7ff`).

## [1.6.0] - 2026-05-25

### Added
- **Health-Restoring Item (Hearts)**:
  - Spawns retro pixelated heart items with a 15% probability in place of floppy disks.
  - Hearts can be flung by abilities (Sports Car Spin, Monster Truck Bash, shockwaves) just like floppy disks.
  - Collecting a heart plays a rising chime synth effect and restores 1 HP up to the vehicle's maximum health pool.
- **Neon Cyan Grid and Scenery Lines**:
  - Modified infinite highway road grid center and side lines to neon cyan (`0x00f0ff`).
  - Modified wireframe mountains to neon cyan (`0x00f0ff`) with a glowing emissive intensity of `0.5` to make them pop.
- **Enhanced Scene Brightness**:
  - Upgraded the 3D scene lighting parameters to brighten the view.
  - Increased `AmbientLight` intensity from 1.2 to 2.2 with a brighter purple color (`0x6a00b8`).
  - Increased directional sun light intensity from 1.5 to 2.8.
  - Increased front cyan spotlight intensity from 2.0 to 4.0 and range to 40.

## [1.5.1] - 2026-05-25

### Changed
- **Vehicle Starting Health Adjustments**:
  - Modified player starting health points based on the selected vehicle: Sports Car retains 3 HP, Monster Truck starts with 4 HP (up from 3), and Delivery Truck starts with 6 HP (up from 3).
  - Dynamically generate heart elements in the top HUD corner to support varying player health pools.

## [1.5.0] - 2026-05-24

### Added
- **Shield Energy Barrier Obstacle**:
  - Implemented a new `'shield'` obstacle type that represents an energy barrier (glowing cyan shield plate, metallic base framing, and hot pink grid bars).
  - Shields must be avoided by changing lanes or jumped over using spring jump physics.
  - Made shields completely immune to player special abilities: they cannot be flung by Sports Car Spins or knocked out by Monster Truck Bashes. Colliding with them under any state deals damage normally.
  - Excluded shields from explosion blastwaves: they remain standing on the highway grid and cannot be chain-flung by neighboring obstacle detonations.

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
