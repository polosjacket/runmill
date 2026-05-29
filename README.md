# RUNMILL - 3D 8-Bit Cyber-Grid Runner

![RUNMILL Logo](assets/runmill_menu.png)

**RUNMILL** is a premium 3D retro arcade-style runner game featuring a 90s cyber-grid and neon synthwave aesthetic. Built with Three.js (WebGL) for flat-shaded voxel rendering, procedural Web Audio synthesizer loops, and a lightweight Node/Express backend with persistent leaderboard storage.

---

## Gameplay Screenshot

![Gameplay Showcase](assets/runmill_gameplay.png)

---

## 🎮 How to Play

1. **Launch Program**: Select your vehicle and customization color from the Start Menu, then click **RUN PROGRAM** (or press Space/Enter).
2. **Move Lanes**: Press `←` / `A` to move left, and `→` / `D` to move right.
3. **Jump**: Press `SPACE` / `W` / `↑` to jump over low-lying obstacles.
4. **Special Ability**: Press `↓` / `S` to trigger your vehicle's custom weapon/attack (when ready).
5. **Mobile Controls**: Use the on-screen left/right arrow buttons, `JUMP` button, and context-sensitive `BASH`/`SPIN` action button.

---

## 🚗 Choose Your Vehicle & Color

Each vehicle features its own procedural voxel geometry, custom dimensions, rigid physics bounding box, and special characteristics. You can also customize your vehicle's primary chassis color using the retro color selector on the Start Menu:
- **Neon Pink** (`#ff007f`)
- **Neon Cyan** (`#00f0ff`)
- **Neon Green** (`#39ff14`)
- **Neon Yellow** (`#fff600`)
- **Neon Purple** (`#bd00ff`)

| Vehicle | Speed | HP | Special Ability | Description | Cost |
| :--- | :---: | :---: | :--- | :--- | :---: |
| **SPORTS CAR** | Fast | 3 | **Spin Proximity Fling** | Performs a $720^\circ$ Y-axis tire screech spin. Flings any obstacles or coins within a **2.8-unit** radius up into the air. | Free |
| **MONSTER TRUCK** | Medium | 4 | **Forward Bash Surge** | Nose-dives and surges forward by 1.5 units, knocking out and launching any obstacles hit on impact. | Free |
| **DELIVERY TRUCK** | Heavy | 6 | *None* | A robust, heavy-profile vehicle with massive HP to absorb multiple collisions, but lacks a special ability. | Free |
| **CYBER TRUCK** | Fast | 5 | **Coin Magnet** | Stainless steel angular truck with a magnet that automatically pulls nearby coins within **4.5 units**. | 5,000 |
| **HOVERCRAFT** | Float | 3 | **Hover Glide** | Sleek boat-like vehicle that hovers above the road, letting you glide right over spike hazards without taking damage. | 25,000 |
| **TANK** | Heavy | 8 | **Cannon Shoot** | Fires a neon orange shell forward to explode and completely destroy any obstacles in its path (including shields). | 150,000 |

---

## 📝 Game Rules & Mechanics

### 1. Collect Coins & Buy Vehicles
- Collect **Coins** of three types: Green (1 coin, common), Yellow (4 coins, uncommon), and Black (20 coins, rare). Coins can be spent in the menu shop to purchase premium vehicles.
- Collecting coins increases your score and builds up your **score multiplier** (up to x4).
- Collect **Hearts** (glowing retro 3D hearts) to restore lost health (HP) up to your vehicle's maximum health pool.
- Multipliers decay over time, so keep collecting to maintain high scoring rates.

### 2. Avoid Hazards
- Avoid crashing into obstacles:
  - **pyramid Spikes** (neon fluorescent crimson red)
  - **CRT TVs** (neon orange frame with yellow static screen)
  - **Cassette Tapes** (neon yellow case with hot pink spools)
  - **Shield Barriers** (neon cyan plate with hot pink cross-bars; immune to spins, bashes, and explosions, requiring you to jump or steer around them)
- Hitting an obstacle reduces your HP hearts and triggers temporary invincibility frames. Reaching 0 HP terminates the run.

### 3. Lane Landing Physics Trajectories
- Flung items (whether knocked out by a **Bash** or a **Spin**) fly in 3D parabolic arcs under gravity ($g = -25$ m/s$^2$).
- Trajectories are mathematically calculated to land **exactly on the centerlines of the three highway lanes** ($X \in [-2.0, 0, 2.0]$) so they remain reachable and within bounds for you to interact with them.

### 4. Cascade Ground-Impact Explosions
- When a flung obstacle lands, it is removed from the scene and triggers a retro voxel shrapnel explosion (16 glowing cubes).
- The ground impact creates a **6.0-unit blastwave** that flings nearby obstacles and coins forward along their respective lanes, enabling chain-reaction cascade events.

### 5. 5-World Progression & Victory Ending
- Survive the countdown timer in each world to advance to the next, transitioning to a custom grid, mountain, sky, and lighting color theme. The countdown timer starts at 1 minute (60s) for World 1, and increases by 1 minute for each subsequent world (+1 minute per world level).
- Complete the full duration of World 5 (5 minutes/300 seconds) to win the game and trigger the victory ending screen.

### 6. High Scores Upload
- If you beat the current runners or complete the game, you'll unlock the **High Score Upload** form. Enter your 3-character initials to submit your score directly to the online leaderboard database.

---

## 🛠️ Technical Architecture

- **Frontend Engine**: `Three.js` (WebGL WebGLRenderer) using custom procedural box geometry meshes, linear lane-swapping interpolations (`lerp`), and parabolic vector kinematics.
- **Audio Synthesizer**: Uses standard Web Audio API oscillators, high/low-pass filters, and gain nodes to generate **100% procedural retro sound effects** and background synth beats dynamically in real-time.
- **Backend Service**: `Express` server serving static build assets in production and exposing API endpoints (`GET /api/scores` and `POST /api/scores`) to read/write leaderboard data stored in a local JSON structure.

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed.

### Installation
1. Clone this repository to your local machine.
2. Run the dependency installer:
   ```bash
   npm install
   ```

### Running Locally (Vite Dev Mode)
Start the Vite hot-reloading development server on port `3000`:
```bash
npm run dev
```

### Building for Production
Compile optimized production assets inside the `/dist` directory:
```bash
npm run build
```

### Running Production Server
Start the Express server on port `3001` serving production assets:
```bash
npm start
```
