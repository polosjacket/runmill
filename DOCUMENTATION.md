# RUNMILL Architecture & Debugging Documentation

This document serves as the guide for the **RUNMILL** codebase, detailing the modules, logic, coordinate space, APIs, and guidelines for debugging and adding new features.

---

## 1. Overall System Architecture

The project is structured as a client-server app:
- **Backend (Express)**: Manages local scores in `leaderboard.json` and serves the production bundles.
- **Frontend (Three.js & Web Audio API)**: Handles WebGL rendering, keyboard/touch inputs, game loop physics, collisions, HUD overlays, and procedural audio synthesis.

```mermaid
graph TD
    A[Express Server (server.js)] <-->|GET / POST /api/scores| B[Game Controller (src/game.js)]
    B -->|Initialize & Render| C[Three.js WebGLRenderer]
    B -->|User Inputs| D[Keyboard / Mobile Touch Overlay]
    B -->|Synthesize SFX & Music| E[Synth Engine (src/audio.js)]
    B -->|Instantiate meshes| F[Voxel Factory (src/voxels.js)]
    F -->|Assemble Boxes| C
```

---

## 2. Key Modules & Roles

### `server.js` (Express Server)
- Serves bundled static files from `/dist` in production.
- **Endpoints**:
  - `GET /api/scores`: Reads scores from `leaderboard.json`, sorts descending, and returns top 10.
  - `POST /api/scores`: Receives score object `{ name, score }`, trims name to 3 letters, inserts score, saves top 10 back to `leaderboard.json`, and returns updated top list.

### `index.html` & `style.css` (UI Layer)
- **Overlay Panels**: Includes Start Menu screen, Game Over screen, HUD panel overlay (current scores, speed, distance meters, HP hearts, and score multiplier placks), and touch buttons panel for mobile.
- **CRT Filter**: Implements scanlines and a vignette overlay with phosphor flicker glow styles for the 90s screen feel.

### `src/audio.js` (Web Audio Synth)
- Uses **zero audio assets**. Everything is generated in real-time by linking oscillators (` Sawtooth `, ` Triangle `, ` Square `), volume gain nodes, and low/high-pass filters.
- **Background Sequencer**: Loops an 8-beat synth theme by scheduling oscillator starts at precise increments in the future using a lookahead algorithm.
- **SFX sweeps**:
  - **Jump**: Quick sweep up (150Hz -> 600Hz triangle).
  - **Collect**: Arpeggiated square chords (C5 -> E5 -> G5 -> C6).
  - **Hit**: Pitch slide down (180Hz -> 30Hz sawtooth) combined with a temporary white noise buffer burst.
  - **Bash**: Low-pitched rising-and-falling growling sawtooth sweep (65Hz -> 260Hz -> 45Hz) with a sweeping low-pass filter (300Hz -> 1000Hz -> 150Hz) and exponential decay.
  - **Game Over**: Decrescendo minor sweep (G5 -> Eb5 -> C5 -> G4).

### `src/voxels.js` (Asset Factory)
- Builds low-poly meshes out of combined `THREE.BoxGeometry` pieces.
- **Rigged pivots**: Exposes wheels arrays and spring submeshes (via `userData`) to animators.
- **Models**:
  - **Car**: Sleek sports vehicle with active spoilers and compact tires.
  - **Monster Truck**: Elevated chassis with shock absorber struts and giant wheels.
  - **Truck**: Semi-cab delivery vehicle with a large cargo trailer and 6 wheels.
  - **Spring**: Interleaved stacked coil segments designed to scale on jumps.
  - **Obstacles**: High-visibility safety hazard styling:
    - **Spikes**: Fluorescent glowing red (`0xff003c`) with emissive intensity `0.9` to stand out against the horizon.
    - **CRT TVs**: Safety neon orange casing (`0xff5500`) with glowing yellow screen (`0xffff00`, emissive intensity `0.9`).
    - **Cassette Tapes**: Vibrant neon yellow casing (`0xfff600`) with hot pink spools (`0xff007f`, emissive intensity `0.5`).
  - **Points**: Floppy disk.

### `src/game.js` (Core Game Controller)
- **Lane Interpolation**: Player lateral lane swaps are calculated using linear interpolation (`THREE.MathUtils.lerp`) toward targeted coordinates.
- **Jump Physics**: Simple vector calculus updates player coordinates:
  - Jump trigger sets upward velocity: $V_y = 10$ m/s.
  - Gravity exerts a constant downward force: $a_y = -25$ m/s$^2$.
- **Dynamic Wheels Spin**: Rotates tires around the X-axis based on current speed.
- **Spring-Jump Mechanics**: Scales spring length dynamically:
    - During jump: stretches spring down to $y = 0$ by setting scale $S = (playerY + springY) / 0.6$.
    - On landing: compresses scale back to $0$ inside the chassis.
- **Monster Truck Forward Bash Attack**:
  - Triggered via keyboard `ArrowDown` / `S` or the mobile `#touch-bash` button.
  - Active rush duration is 0.4 seconds, with a 3.0 seconds cooldown (total cooldown 3.4 seconds).
  - During active bash, the vehicle surges forward by 1.5 units using a parabolic equation: $Z_{offset} = -1.5 \sin(\text{bashProgress} \cdot \pi)$, and wheels spin at triple speed.
  - The front cabin of the truck tilts/nose-dives downward during the active surge (rotation on X axis: $X_{rot} = -0.18 \sin(\text{bashProgress} \cdot \pi)$) for visual weight.
  - Colliding with an obstacle during a bash marks it as knocked out (`obs.userData.isKnockedOut = true`), awards 250 points multiplied by the current score multiplier, shakes the camera slightly (150ms), and applies 3D parabolic physics flight.
- **Sports Car Spin Attack**:
  - Triggered via keyboard `ArrowDown` / `S` or the mobile `#touch-bash` button (dynamic text labels switch to "SPIN" when the Sports Car is active).
  - Active spin duration is 0.5 seconds, with a 3.0 seconds cooldown (total cooldown 3.5 seconds).
  - During active spin, the sports car spins rapidly 720 degrees around its Y-axis (`rotation.y` sweeps from $4\pi$ to $0$), while remaining in place on the Z-axis.
  - Proximity check is applied inside the game loop to detect obstacles and floppy disk points within a radius of **2.8 units** of the car.
  - Any nearby items within this radius are automatically marked as knocked out (`isKnockedOut = true`), play a hit sound, shake the camera (150ms), award score (250 points * multiplier), and get launched back exactly on one of the three highway lanes using parabolic physics.
- **Obstacle Launch & Explode Physics**:
  - Knocked-out obstacles are updated with gravity ($a_y = -25$ m/s$^2$) and high speed velocities:
    - **Target Lane Landing**: To ensure flung items land strictly in one of the three drivable highway lanes, we choose a target lane coordinate $X_{\text{target}} \in [-2.0, 0, 2.0]$ and calculate the horizontal velocity $V_{x0}$ dynamically.
    - **Air Time Formula**: Solving $Y(t) = 0$ for gravity $g = -25$ yields the total air time: $t_{\text{air}} = V_{y0} / 12.5$ seconds.
    - **Horizontal Speed**: Horizontal speed is scaled exactly: $V_{x0} = (X_{\text{target}} - X_{\text{start}}) / t_{\text{air}}$, guaranteeing the object lands on the lane centerline.
    - $V_y = \text{random}(14, 20)$ m/s
    - $V_z = \text{random}(-15, -25)$ m/s (propelled forward away from the player)
    - Rotational angular velocities about all 3 axes are randomized to simulate realistic tumble.
  - **Ground Impact Explosion**: When a flying obstacle descends ($V_y < 0$) and touches the ground level ($Y \le 0$), it is removed from the scene and triggers an explosion.
  - **Voxel Particles**: Ground impact spawns 16 small retro-colored voxel cubes that fly outwards with random velocities and shrink over a 0.6s lifetime.
  - **Chain Reaction Blastwave**: The ground impact flings any other active obstacles or floppy disk points within an expanded radius of **6.0 units**.
  - **Linear Propagation**: Flipped items are propelled forward along their target highway lanes ($X_{\text{target}} \in [-2.0, 0, 2.0]$ using the same air-time formulas) to maintain lane alignment and propagate linear cascading chain reactions down the lanes ("in the line").
- **Infinite Grid Scrolling**: Two adjacent 100m road grid meshes scroll back relative to speed. When a grid passes the viewport, its offset loops forward by 200m.
- **Collisions**: Calculated via bounding distances inside `checkCollision()`. Calibrates center height offset and tolerance thresholds dynamically based on chosen vehicle size.

---

## 3. Coordinate System & Spawning Metrics

For coordinates math and spawning:
- **Z-Axis (Depth)**:
  - Spawning point: $Z = -80.0$ (distant fog border).
  - Player position: $Z = 5.0$.
  - Despawning threshold: $Z = 12.0$ (passed behind player camera view).
- **X-Axis (Lanes)**:
  - Left Lane: $X = -2.0$
  - Middle Lane: $X = 0.0$
  - Right Lane: $X = 2.0$
- **Y-Axis (Elevation)**:
  - Ground level: $Y = 0.0$.
  - Obstacles center point: $Y \approx 0.4$ to $0.5$.
  - Floppy Disks: Float at $Y \approx 0.4$ with a sinusoidal wave fluctuation.
  - Player Y: Elevates during jumps ($Y_{max} \approx 2.0$).

---

## 4. Debugging & Common Customizations

When troubleshooting or altering mechanics, refer to these references:

### Adjusting Collision Sensitivity
If collisions feel too lenient or too strict, modify the tolerance offsets inside `updatePlaying()`:
```javascript
// Change X tolerance (0.7) or Y tolerance (0.8) for Obstacles
this.checkCollision(this.player, obs, 0.7, 0.8)

// Change X tolerance (0.6) or Y tolerance (0.8) for Floppy points
this.checkCollision(this.player, point, 0.6, 0.8)
```

### Changing Lane Widths
To spread lanes wider:
1. Open `src/game.js`.
2. Modify `LANE_WIDTH` (e.g., set to `3.0`). The `LANES` array will auto-recalculate lane coordinates to `[-3.0, 0, 3.0]`.

### Adjusting Game Speed & Acceleration
To change initial speed, max speed, or acceleration rates, adjust constructor properties in `src/game.js`:
```javascript
this.speed = 15;        // Start speed
this.maxSpeed = 45;     // Cap speed
this.speed += dt * 0.25; // Acceleration curve (meters per second squared)
```

---

## 5. Maintenance Guideline for Future Changes

> [!IMPORTANT]
> **Documentation Sync Requirement**
> Whenever a feature is added, modified, or removed:
> 1. Update the inline JSDoc comments within the code (`src/game.js`, `src/audio.js`, `src/voxels.js`, `server.js`) describing methods and property logic.
> 2. Document the change under the corresponding section in this file (`DOCUMENTATION.md`).
> 3. Document the release version and changes in `CHANGELOG.md`.
