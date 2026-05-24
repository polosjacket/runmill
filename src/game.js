import * as THREE from 'three';
import { createVehicleModel, createFloppyDiskModel, createObstacleModel } from './voxels.js';
import { audio } from './audio.js';

// Game Configuration Constants
const LANE_WIDTH = 2.0;
const LANES = [-LANE_WIDTH, 0, LANE_WIDTH]; // Left, Middle, Right lane X-coordinates
const PLAYER_START_Z = 5.0;                // Camera-relative Z position of player
const SPAWN_START_Z = -80.0;               // Z coordinate where obstacles spawn far away
const DESPAWN_Z = 12.0;                    // Z coordinate where obstacles are deleted (passed player)

/**
 * GameEngine - Main coordinator class for game loops, visual rendering,
 * and user interactions.
 */
class GameEngine {
  constructor() {
    // 1. Three.js Engine Variables
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.clock = new THREE.Clock(); // Tracks delta time for frame-independent speed

    // 2. Core Game State
    this.state = 'START';           // Active game state: 'START', 'PLAYING', 'GAMEOVER'
    this.score = 0;
    this.distance = 0;
    this.speed = 15;                // Current scroll speed (meters per second)
    this.maxSpeed = 45;             // Speed cap to keep the game playable
    this.lives = 3;                 // Player health points
    this.isInvincible = false;      // Flag tracking if player is in recovery after a hit
    this.invincibilityTimer = 0;    // Time remaining for recovery flashing
    this.cameraShakeTimer = 0;      // Time remaining for crash impact camera shake
    this.multiplier = 1;            // Floyd disk collection score multiplier
    this.multiplierTimer = 0;       // Expiry countdown for active score multiplier
    this.selectedCharacter = 'car';  // Selected vehicle ('car', 'monster_truck', 'truck')
    this.selectedColor = 'pink';     // Selected vehicle color
    this.bashTimer = 0;
    this.bashCooldownTimer = 0;

    // 3. Player Movement & Physics
    this.currentLane = 1;           // Starting lane index (Middle)
    this.targetX = 0;               // Desired X coordinate target (lane coordinate)
    this.playerY = 0;               // Current jump height
    this.playerVelocityY = 0;       // Vertical velocity vector for jumps
    this.gravity = -25;             // Downward acceleration force
    this.jumpForce = 10;            // Initial upward impulse force
    this.isJumping = false;         // Flag tracking if player is in mid-air

    // 4. Scene Collections
    this.player = null;             // Reference to player's 3D voxel group
    this.roadGrid1 = null;          // First segment of looping cyber grid
    this.roadGrid2 = null;          // Second segment of looping cyber grid
    this.sun = null;                // far-distance striped sunset sun mesh
    this.obstacles = [];            // Active hazards array (cassette tapes, TVs, spikes)
    this.points = [];               // Active floppys array (floppy disk score pickups)
    this.scenery = [];              // Side decorative elements (wireframe neon mountains)
    this.particles = [];            // Active visual explosion particles
    
    // 5. Spawning Frequency Variables
    this.spawnTimer = 0;
    this.spawnInterval = 1.8;       // Spawning frequency in seconds

    // 6. DOM Element Bindings (Menus and HUD overlays)
    this.domStartScreen = document.getElementById('start-screen');
    this.domGameOverScreen = document.getElementById('game-over-screen');
    this.domHud = document.getElementById('hud');
    this.domScore = document.getElementById('hud-score');
    this.domSpeed = document.getElementById('hud-speed');
    this.domDistance = document.getElementById('hud-distance');
    this.domLives = document.getElementById('hud-lives');
    this.domMultiplierContainer = document.getElementById('hud-multiplier-container');
    this.domMultiplier = document.getElementById('hud-multiplier');
    this.domBashContainer = document.getElementById('hud-bash-container');
    this.domBash = document.getElementById('hud-bash');
    this.domFinalScore = document.getElementById('final-score');
    this.domFinalDistance = document.getElementById('final-distance');
    this.domHighScoreForm = document.getElementById('high-score-form');
    this.domPlayerName = document.getElementById('player-name');
    this.domLeaderboardList = document.getElementById('leaderboard-list');

    // 7. Event Buttons
    this.btnStart = document.getElementById('start-btn');
    this.btnRestart = document.getElementById('restart-btn');
    this.btnSubmitScore = document.getElementById('submit-score-btn');
    this.btnTouchBash = document.getElementById('touch-bash');

    // 8. Core Initialization Steps
    this.initThree();
    this.setupLighting();
    this.createStaticScenery();
    this.setupEventListeners();
    this.fetchLeaderboard();
    
    // Begin main render loop recursion
    this.animate();
  }

  /**
   * initThree - Sets up the WebGL renderer, perspective camera, and fog blending.
   */
  initThree() {
    const container = document.getElementById('canvas-container');
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Initialize Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0b0214); // Deep space purple backdrop
    
    // Exponential fog mimics retro screen depth, fading meshes into the background color
    this.scene.fog = new THREE.FogExp2(0x0b0214, 0.015);

    // Set up Perspective Camera (Viewing the player from slightly behind and above)
    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    this.resetCamera();

    // Create and configure WebGLRenderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    this.renderer.setSize(width, height);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Soft shadow edges
    container.appendChild(this.renderer.domElement);

    // Responsive Canvas resizing
    window.addEventListener('resize', () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    });
  }

  /**
   * resetCamera - Positions the camera at its standard third-person angle.
   */
  resetCamera() {
    this.camera.position.set(0, 3.2, PLAYER_START_Z + 4.5);
    this.camera.lookAt(0, 1.2, PLAYER_START_Z - 5);
  }

  /**
   * setupLighting - Configures lighting rig for standard voxel shadows and highlighting.
   */
  setupLighting() {
    // 1. Neon purple ambient fill light
    const ambientLight = new THREE.AmbientLight(0x3a0066, 1.2);
    this.scene.add(ambientLight);

    // 2. Directional Cyber Sun light (casts depth shadows towards the front of screen)
    const dirLight = new THREE.DirectionalLight(0xff007f, 1.5);
    dirLight.position.set(0, 15, -60);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 150;
    dirLight.shadow.camera.left = -10;
    dirLight.shadow.camera.right = 10;
    dirLight.shadow.camera.top = 15;
    dirLight.shadow.camera.bottom = -5;
    this.scene.add(dirLight);

    // 3. Neon cyan point light centered on player to emphasize retro character details
    const frontLight = new THREE.PointLight(0x00f0ff, 2.0, 30);
    frontLight.position.set(0, 5, PLAYER_START_Z + 2);
    this.scene.add(frontLight);
  }

  /**
   * createStaticScenery - Builds grid roads, distant striped sun, background starfield.
   */
  createStaticScenery() {
    const size = 100;
    const divisions = 50;
    
    // We add two adjacent 100m GridHelpers.
    // As one moves past the screen, we scroll both backward and reset positions to form an infinite road loop.
    this.roadGrid1 = new THREE.GridHelper(size, divisions, 0x00f0ff, 0xff007f);
    this.roadGrid1.position.set(0, 0, 0);
    this.scene.add(this.roadGrid1);

    this.roadGrid2 = new THREE.GridHelper(size, divisions, 0x00f0ff, 0xff007f);
    this.roadGrid2.position.set(0, 0, -size);
    this.scene.add(this.roadGrid2);

    // Dark black underlay plane below the grid to block stars showing under the road
    const roadGeom = new THREE.PlaneGeometry(30, size * 2);
    const roadMat = new THREE.MeshBasicMaterial({ color: 0x05010a });
    const roadPlane = new THREE.Mesh(roadGeom, roadMat);
    roadPlane.rotation.x = -Math.PI / 2;
    roadPlane.position.set(0, -0.01, -size / 2);
    roadPlane.receiveShadow = true;
    this.scene.add(roadPlane);

    // Striped Sunset Sun
    // Structured out of horizontal boxes stacked with slight gaps to reproduce the classic 80s synthwave sunset sun
    const sunGroup = new THREE.Group();
    const sunRadius = 15;
    const stripeCount = 10;
    const stripeHeight = 0.8;
    const gap = 0.3;

    for (let i = 0; i < stripeCount; i++) {
      const yOffset = (i - stripeCount / 2) * (stripeHeight + gap);
      const angle = Math.asin(yOffset / sunRadius);
      const width = 2 * sunRadius * Math.cos(angle);
      
      const segmentGeom = new THREE.BoxGeometry(width, stripeHeight, 0.5);
      
      // Bottom segments are yellow, top segments are hot pink. We lerp colors based on height index.
      const mixRatio = i / stripeCount;
      const color = new THREE.Color().lerpColors(new THREE.Color(0xfff600), new THREE.Color(0xff007f), mixRatio);
      const segmentMat = new THREE.MeshBasicMaterial({ 
        color: color,
        fog: false // Disable fog on the sun to maintain sharp sunset colors in far distance
      });

      const segment = new THREE.Mesh(segmentGeom, segmentMat);
      segment.position.y = yOffset;
      sunGroup.add(segment);
    }
    sunGroup.position.set(0, 10, -120);
    this.scene.add(sunGroup);
    this.sun = sunGroup;

    // Stars particle system
    const starsGeom = new THREE.BufferGeometry();
    const starsCount = 300;
    const starPositions = new Float32Array(starsCount * 3);

    for (let i = 0; i < starsCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 150;     // Wide layout
      starPositions[i * 3 + 1] = Math.random() * 60 + 5;      // High sky position
      starPositions[i * 3 + 2] = -Math.random() * 120 - 40;  // Deep depth
    }

    starsGeom.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starsMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.25,
      sizeAttenuation: true,
      fog: false
    });

    const starParticles = new THREE.Points(starsGeom, starsMat);
    this.scene.add(starParticles);

    // Initial Side Mountains (3D wireframes)
    for (let z = 0; z > -150; z -= 15) {
      this.spawnMountain(z, -8); // Left mountain chain
      this.spawnMountain(z, 8);  // Right mountain chain
    }
  }

  /**
   * spawnMountain - Instantiates a low-poly mountain cone at roadside borders.
   */
  spawnMountain(z, xOffset) {
    const height = Math.random() * 8 + 4;
    const width = Math.random() * 4 + 4;
    const geom = new THREE.ConeGeometry(width, height, 4);
    
    // Wireframe purple mesh for retro 3D computer graphics styling
    const mat = new THREE.MeshStandardMaterial({
      color: 0xbd00ff,
      wireframe: true,
      flatShading: true
    });
    
    const cone = new THREE.Mesh(geom, mat);
    cone.position.set(xOffset + (xOffset > 0 ? width/2 : -width/2), height / 2 - 0.5, z);
    this.scene.add(cone);
    this.scenery.push(cone);
  }

  /**
   * setupEventListeners - Handles keyboard arrow key maps and overlay clicks.
   */
  setupEventListeners() {
    // Key bindings
    window.addEventListener('keydown', (e) => {
      if (this.state !== 'PLAYING') return;

      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        this.moveLane(-1);
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        this.moveLane(1);
      } else if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        this.jump();
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        this.bash();
      }
    });

    // Touch controls for mobile pointer events
    const touchLeft = document.getElementById('touch-left');
    const touchRight = document.getElementById('touch-right');
    const touchJump = document.getElementById('touch-jump');

    touchLeft.addEventListener('pointerdown', () => this.moveLane(-1));
    touchRight.addEventListener('pointerdown', () => this.moveLane(1));
    touchJump.addEventListener('pointerdown', () => this.jump());
    this.btnTouchBash.addEventListener('pointerdown', () => this.bash());

    // Character selection buttons
    this.domCharButtons = document.querySelectorAll('.char-btn');
    this.domCharButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.domCharButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.selectedCharacter = btn.getAttribute('data-char');
      });
    });

    // Color selection buttons
    this.domColorButtons = document.querySelectorAll('.color-btn');
    this.domColorButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.domColorButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.selectedColor = btn.getAttribute('data-color');
      });
    });

    // Menu overlays
    this.btnStart.addEventListener('click', () => this.startGame());
    this.btnRestart.addEventListener('click', () => {
      this.domGameOverScreen.classList.add('hidden');
      this.domStartScreen.classList.remove('hidden');
      this.state = 'START';
      this.fetchLeaderboard();
    });
    this.btnSubmitScore.addEventListener('click', () => this.submitHighScore());
  }

  /**
   * moveLane - Shakes the target lane index left/right.
   */
  moveLane(dir) {
    this.currentLane = THREE.MathUtils.clamp(this.currentLane + dir, 0, 2);
    this.targetX = LANES[this.currentLane];
  }

  /**
   * jump - Handles jump triggers if player is on ground.
   */
  jump() {
    if (this.isJumping) return;
    this.isJumping = true;
    this.playerVelocityY = this.jumpForce;
    audio.playJump();
  }

  /**
   * bash - Triggers the character special ability (Monster Truck Bash or Car Spin).
   */
  bash() {
    if (this.state !== 'PLAYING') return;
    if (this.bashCooldownTimer > 0) return;

    if (this.selectedCharacter === 'monster_truck') {
      this.bashTimer = 0.4;          // 0.4s active rush duration
      this.bashCooldownTimer = 3.4;   // 3.4s total cooldown (3s after active rush ends)
      audio.playBash();
    } else if (this.selectedCharacter === 'car') {
      this.bashTimer = 0.5;          // 0.5s active spin duration
      this.bashCooldownTimer = 3.5;   // 3.5s total cooldown (3s after active spin ends)
      audio.playSpin();
    }
  }

  /**
   * startGame - Resets variables and turns on active running states.
   */
  startGame() {
    // Activates Web Audio Context (mandatory on click event)
    audio.init();
    
    // Acquire focus on window for immediate keyboard controls responsiveness
    window.focus();

    // Reset game counters
    this.score = 0;
    this.distance = 0;
    this.speed = 18;
    this.lives = 3;
    this.isInvincible = false;
    this.currentLane = 1;
    this.targetX = 0;
    this.playerY = 0;
    this.playerVelocityY = 0;
    this.isJumping = false;
    this.multiplier = 1;
    this.multiplierTimer = 0;

    // Flush hazards from scene
    this.clearObstaclesAndPoints();

    // Spawn player mesh
    if (this.player) this.scene.remove(this.player);
    this.player = createVehicleModel(this.selectedCharacter, this.selectedColor);
    this.player.position.set(0, 0, PLAYER_START_Z);
    this.scene.add(this.player);

    // Sync HUD DOM elements
    this.updateHudLives();
    this.domScore.textContent = '00000';
    this.domDistance.textContent = '0';
    this.domSpeed.textContent = '0';
    this.domMultiplierContainer.classList.add('hidden');

    // Reset BASH state
    this.bashTimer = 0;
    this.bashCooldownTimer = 0;

    // Toggle BASH/SPIN UI indicators based on character selection
    const hudLabel = document.querySelector('#hud-bash-container .label');
    if (this.selectedCharacter === 'monster_truck') {
      this.domBashContainer.classList.remove('hidden');
      this.domBashContainer.classList.remove('cooldown');
      if (hudLabel) hudLabel.textContent = 'BASH';
      this.domBash.textContent = 'READY';
      this.btnTouchBash.classList.remove('hidden');
      this.btnTouchBash.classList.remove('cooldown');
      this.btnTouchBash.textContent = 'BASH';
    } else if (this.selectedCharacter === 'car') {
      this.domBashContainer.classList.remove('hidden');
      this.domBashContainer.classList.remove('cooldown');
      if (hudLabel) hudLabel.textContent = 'SPIN';
      this.domBash.textContent = 'READY';
      this.btnTouchBash.classList.remove('hidden');
      this.btnTouchBash.classList.remove('cooldown');
      this.btnTouchBash.textContent = 'SPIN';
    } else {
      this.domBashContainer.classList.add('hidden');
      this.btnTouchBash.classList.add('hidden');
    }

    // Toggle screen classes
    this.domStartScreen.classList.add('hidden');
    this.domGameOverScreen.classList.add('hidden');
    this.domHud.classList.remove('hidden');
    this.domHighScoreForm.classList.add('hidden');

    // Show mobile controls panel if screen has touch capabilities
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      document.getElementById('touch-controls').classList.remove('hidden');
    }

    this.state = 'PLAYING';
    audio.startMusic(); // Starts procedural synth soundtrack
  }

  clearObstaclesAndPoints() {
    this.obstacles.forEach(o => this.scene.remove(o));
    this.points.forEach(p => this.scene.remove(p));
    if (this.particles) {
      this.particles.forEach(p => this.scene.remove(p.mesh));
    }
    this.obstacles = [];
    this.points = [];
    this.particles = [];
  }

  /**
   * gameOver - Stops music and opens ending overlays.
   */
  gameOver() {
    this.state = 'GAMEOVER';
    audio.playGameOver();

    this.domHud.classList.add('hidden');
    document.getElementById('touch-controls').classList.add('hidden');

    this.domFinalScore.textContent = Math.floor(this.score);
    this.domFinalDistance.textContent = Math.floor(this.distance);

    // Open score posting fields
    this.domHighScoreForm.classList.remove('hidden');
    this.domPlayerName.value = '';
    
    this.domGameOverScreen.classList.remove('hidden');
  }

  /**
   * updateHudLives - Updates active heart indicators in the top HUD corner.
   */
  updateHudLives() {
    const hearts = this.domLives.querySelectorAll('.heart');
    hearts.forEach((heart, idx) => {
      if (idx < this.lives) {
        heart.classList.add('active');
      } else {
        heart.classList.remove('active');
      }
    });
  }

  /**
   * fetchLeaderboard - Obtains high scores list from the local Express server.
   */
  async fetchLeaderboard() {
    try {
      const response = await fetch('/api/scores');
      const data = await response.json();
      
      this.domLeaderboardList.innerHTML = '';
      if (data.length === 0) {
        this.domLeaderboardList.innerHTML = '<li><span>NO RUNNERS YET</span><span>0</span></li>';
        return;
      }
      
      data.forEach((entry, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
          <span>${index + 1}. <span class="name">${entry.name}</span></span>
          <span class="score">${entry.score}</span>
        `;
        this.domLeaderboardList.appendChild(li);
      });
    } catch (e) {
      // Offline fallback
      this.domLeaderboardList.innerHTML = '<li class="loading">OFFLINE MODE</li>';
    }
  }

  /**
   * submitHighScore - Posts user initials and score to high scores API.
   */
  async submitHighScore() {
    const nameInput = this.domPlayerName.value.trim().toUpperCase();
    if (!nameInput) return;

    try {
      this.btnSubmitScore.disabled = true;
      this.btnSubmitScore.textContent = 'SAVING...';
      
      await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: nameInput, score: Math.floor(this.score) })
      });
      
      this.domHighScoreForm.classList.add('hidden');
      this.domGameOverScreen.classList.add('hidden');
      this.domStartScreen.classList.remove('hidden');
      this.state = 'START';
      this.fetchLeaderboard(); // Refresh scores list
    } catch (e) {
      console.error(e);
    } finally {
      this.btnSubmitScore.disabled = false;
      this.btnSubmitScore.textContent = 'UPLOAD';
    }
  }

  /**
   * spawnObstacleOrPoint - Randomly chooses and spawns floppy disk items or voxel hazards.
   */
  spawnObstacleOrPoint() {
    const rand = Math.random();
    const lane = Math.floor(Math.random() * 3);
    const laneX = LANES[lane];

    if (rand < 0.35) {
      // Spawn floppy disk point pickup
      const floppy = createFloppyDiskModel();
      floppy.position.set(laneX, 0.4, SPAWN_START_Z);
      this.scene.add(floppy);
      this.points.push(floppy);
    } else {
      // Spawn standard obstacle block
      const types = ['cassette', 'tv', 'spike'];
      const chosenType = types[Math.floor(Math.random() * types.length)];
      const obs = createObstacleModel(chosenType);
      obs.position.set(laneX, 0, SPAWN_START_Z);
      this.scene.add(obs);
      this.obstacles.push(obs);
    }
  }

  /**
   * animate - Infinite WebGL rendering recursion cycle loop.
   */
  animate() {
    requestAnimationFrame(() => this.animate());

    const dt = this.clock.getDelta(); // delta time since last frame

    // Route updates depending on playing states
    if (this.state === 'PLAYING') {
      this.updatePlaying(dt);
    } else {
      this.updateMenu(dt);
    }

    // Camera hit impact screen-shake controller
    if (this.cameraShakeTimer > 0) {
      this.cameraShakeTimer -= dt;
      const shakeAmt = 0.15;
      this.camera.position.x = (Math.random() - 0.5) * shakeAmt;
      this.camera.position.y = 3.2 + (Math.random() - 0.5) * shakeAmt;
      if (this.cameraShakeTimer <= 0) {
        this.resetCamera(); // Reset camera positions to standard offset
      }
    }

    this.renderer.render(this.scene, this.camera);
  }

  /**
   * updateMenu - Animate backdrop grid meshes slowly on start menus.
   */
  updateMenu(dt) {
    const time = this.clock.getElapsedTime();
    const slowSpeed = 2;

    this.roadGrid1.position.z += slowSpeed * dt;
    this.roadGrid2.position.z += slowSpeed * dt;

    if (this.roadGrid1.position.z >= 100) this.roadGrid1.position.z -= 200;
    if (this.roadGrid2.position.z >= 100) this.roadGrid2.position.z -= 200;

    this.scenery.forEach(m => {
      m.position.z += slowSpeed * dt;
      if (m.position.z > DESPAWN_Z) {
        m.position.z = SPAWN_START_Z - 50;
      }
    });

    if (this.sun) {
      this.sun.rotation.z = time * 0.05;
    }
  }

  /**
   * updatePlaying - Active playing logic loop (physics, animations, and collisions).
   */
  updatePlaying(dt) {
    const time = this.clock.getElapsedTime();

    // 1. Advance score counters and acceleration curves
    this.distance += this.speed * dt;
    this.score += this.speed * dt * 0.1 * this.multiplier;
    
    if (this.speed < this.maxSpeed) {
      this.speed += dt * 0.25; // acceleration curve
    }

    // Sync HUD numbers
    this.domScore.textContent = Math.floor(this.score).toString().padStart(5, '0');
    this.domDistance.textContent = Math.floor(this.distance);
    this.domSpeed.textContent = Math.floor(this.speed * 4); // Virtual MPH

    // Update BASH/SPIN cooldowns and HUD if playing as monster truck or sports car
    if (this.selectedCharacter === 'monster_truck' || this.selectedCharacter === 'car') {
      if (this.bashCooldownTimer > 0) {
        this.bashCooldownTimer -= dt;
        if (this.bashCooldownTimer < 0) this.bashCooldownTimer = 0;
      }
      
      if (this.bashTimer > 0) {
        this.bashTimer -= dt;
        if (this.bashTimer < 0) this.bashTimer = 0;
      }

      const activeDuration = this.selectedCharacter === 'car' ? 0.5 : 0.4;
      const activeText = this.selectedCharacter === 'car' ? 'SPINNING' : 'BASHING';

      // Sync BASH/SPIN UI
      if (this.bashCooldownTimer > 0) {
        const displayCooldown = Math.max(0, this.bashCooldownTimer - activeDuration);
        if (displayCooldown > 0) {
          this.domBash.textContent = displayCooldown.toFixed(1) + 's';
          this.domBashContainer.classList.add('cooldown');
          this.btnTouchBash.classList.add('cooldown');
        } else {
          this.domBash.textContent = activeText;
          this.domBashContainer.classList.add('cooldown');
          this.btnTouchBash.classList.add('cooldown');
        }
      } else {
        this.domBash.textContent = 'READY';
        this.domBashContainer.classList.remove('cooldown');
        this.btnTouchBash.classList.remove('cooldown');
      }
    }

    // 2. Loop & scroll grid lines
    this.roadGrid1.position.z += this.speed * dt;
    this.roadGrid2.position.z += this.speed * dt;

    if (this.roadGrid1.position.z >= 100) this.roadGrid1.position.z -= 200;
    if (this.roadGrid2.position.z >= 100) this.roadGrid2.position.z -= 200;

    // 3. Move roadside mountains
    this.scenery.forEach(m => {
      m.position.z += this.speed * dt;
      if (m.position.z > DESPAWN_Z) {
        m.position.z = SPAWN_START_Z - 20;
      }
    });

    // 4. Sunset sun rotation
    if (this.sun) {
      this.sun.rotation.z = time * 0.1;
    }

    // 5. Procedural Spawner
    this.spawnTimer += dt;
    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnTimer = 0;
      this.spawnObstacleOrPoint();
      // Acceleration increases obstacle spawn rates
      this.spawnInterval = Math.max(0.8, 1.8 - (this.speed / 50));
    }

    // 6. Lerp player X coordinate toward target lane coordinate (smooth lane changes)
    this.player.position.x = THREE.MathUtils.lerp(this.player.position.x, this.targetX, 15 * dt);

    // Surge player Z position forward if bashing
    if (this.selectedCharacter === 'monster_truck' && this.bashTimer > 0) {
      const bashProgress = this.bashTimer / 0.4; // goes from 1.0 down to 0.0
      // Parabolic surge forward
      const zOffset = -Math.sin(bashProgress * Math.PI) * 1.5;
      this.player.position.z = PLAYER_START_Z + zOffset;

      // Nose-dive tilt down during surge (peaks at center of bash)
      const tiltAngle = -Math.sin(bashProgress * Math.PI) * 0.18;
      this.player.rotation.x = tiltAngle;
    } else if (this.selectedCharacter === 'car' && this.bashTimer > 0) {
      const spinProgress = this.bashTimer / 0.5; // goes from 1.0 down to 0.0
      // Rotate 720 degrees (2 full spins) during the spin duration
      this.player.rotation.y = spinProgress * Math.PI * 4;
      this.player.position.z = PLAYER_START_Z;
      this.player.rotation.x = 0;
    } else {
      this.player.position.z = PLAYER_START_Z;
      this.player.rotation.x = 0;
      this.player.rotation.y = 0;
    }

    // 7. Gravity physics calculation
    if (this.isJumping) {
      this.playerVelocityY += this.gravity * dt;
      this.playerY += this.playerVelocityY * dt;

      // Ground hit check
      if (this.playerY <= 0) {
        this.playerY = 0;
        this.playerVelocityY = 0;
        this.isJumping = false;
      }
    }
    this.player.position.y = this.playerY;

    // 8. Dynamic Voxel Vehicle Wheels & Spring Animation
    const vehicleData = this.player.userData;
    if (vehicleData) {
      // A. Wheels Spin
      const wheels = vehicleData.wheels;
      if (wheels && wheels.length > 0) {
        const isBashing = (this.selectedCharacter === 'monster_truck' && this.bashTimer > 0);
        const spinSpeed = this.speed * 1.5 * (isBashing ? 3 : 1);
        wheels.forEach(wheel => {
          wheel.rotation.x += spinSpeed * dt;
        });
      }

      // B. Spring Jump Extension/Retraction
      const spring = vehicleData.spring;
      if (spring) {
        if (this.isJumping) {
          // During jump, spring shoots out to touch ground (y=0) from vehicle chassis base (vehicleData.springY)
          const totalHeight = this.playerY + vehicleData.springY;
          const targetScaleY = totalHeight / 0.6;
          
          spring.scale.y = THREE.MathUtils.lerp(spring.scale.y, targetScaleY, 20 * dt);
        } else {
          // Retract spring inside the vehicle (scale Y back to 0)
          spring.scale.y = THREE.MathUtils.lerp(spring.scale.y, 0, 20 * dt);
        }
      }
    }

    // 9. Invincibility flash visibility loop
    if (this.isInvincible) {
      this.invincibilityTimer -= dt;
      this.player.visible = Math.floor(time * 20) % 2 === 0; // toggles visibility fast
      
      if (this.invincibilityTimer <= 0) {
        this.isInvincible = false;
        this.player.visible = true;
      }
    }

    // 10. Multiplier duration depletion timer
    if (this.multiplier > 1) {
      this.multiplierTimer -= dt;
      if (this.multiplierTimer <= 0) {
        this.multiplier = 1;
        this.domMultiplierContainer.classList.add('hidden');
      }
    }

    // Update Voxel Explosion Particles
    if (this.particles) {
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.mesh.position.x += p.vx * dt;
        p.mesh.position.y += p.vy * dt;
        p.mesh.position.z += p.vz * dt;
        p.vy += this.gravity * dt;
        
        p.life -= dt;
        const scale = Math.max(0, p.life / p.maxLife);
        p.mesh.scale.set(scale, scale, scale);
        
        if (p.life <= 0) {
          this.scene.remove(p.mesh);
          this.particles.splice(i, 1);
        }
      }
    }

    // 11. Move and Collide Obstacles
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const obs = this.obstacles[i];

      // If the obstacle has been knocked out, update its flight physics
      if (obs.userData.isKnockedOut) {
        obs.userData.velocityY += this.gravity * dt;
        
        obs.position.x += obs.userData.velocityX * dt;
        obs.position.y += obs.userData.velocityY * dt;
        obs.position.z += obs.userData.velocityZ * dt;
        
        obs.rotation.x += obs.userData.rotX * dt;
        obs.rotation.y += obs.userData.rotY * dt;
        obs.rotation.z += obs.userData.rotZ * dt;

        // Explode on ground impact (falling and Y <= 0)
        if (obs.userData.velocityY < 0 && obs.position.y <= 0) {
          this.explodeObstacle(obs);
          this.scene.remove(obs);
          this.obstacles.splice(i, 1);
          continue;
        }

        // Despawn if it falls far below screen or goes too far away
        if (obs.position.y < -15 || obs.position.z < -160 || obs.position.z > 30 || Math.abs(obs.position.x) > 40) {
          this.scene.remove(obs);
          this.obstacles.splice(i, 1);
        }
        continue;
      }

      obs.position.z += this.speed * dt;
      obs.rotation.y += dt; // Rotate object slightly

      // Check Car Spin Proximity Fling
      const isCarSpinning = (this.selectedCharacter === 'car' && this.bashTimer > 0);
      if (isCarSpinning && !obs.userData.isKnockedOut) {
        const dx = obs.position.x - this.player.position.x;
        const dz = obs.position.z - PLAYER_START_Z;
        const dist = Math.sqrt(dx * dx + dz * dz);
        
        if (dist < 2.8) {
          obs.userData.isKnockedOut = true;
          
          // Target random highway lane
          const targetLaneX = LANES[Math.floor(Math.random() * 3)];
          const vy0 = Math.random() * 6 + 14;
          obs.userData.velocityY = vy0;
          
          // Exact velocityX to land on targetLane
          const tAir = vy0 / 12.5;
          obs.userData.velocityX = (targetLaneX - obs.position.x) / tAir;
          obs.userData.velocityZ = -(Math.random() * 12 + 18); // Fling forward
          
          obs.userData.rotX = (Math.random() - 0.5) * 15;
          obs.userData.rotY = (Math.random() - 0.5) * 15;
          obs.userData.rotZ = (Math.random() - 0.5) * 15;

          audio.playHit();
          this.cameraShakeTimer = 0.15;
          this.score += 250 * this.multiplier;
          continue;
        }
      }

      // Collide Check
      if (!this.isInvincible && this.checkCollision(this.player, obs, 0.7, 0.8)) {
        if (this.selectedCharacter === 'monster_truck' && this.bashTimer > 0) {
          // Knock out the obstacle!
          obs.userData.isKnockedOut = true;
          
          // Target one of the three highway lanes randomly
          const targetLaneX = LANES[Math.floor(Math.random() * 3)];
          const vy0 = Math.random() * 6 + 14;
          obs.userData.velocityY = vy0;
          
          // Calculate exact velocityX to land on targetLaneX
          const tAir = vy0 / 12.5; // (since gravity is -25, half gravity is 12.5)
          obs.userData.velocityX = (targetLaneX - obs.position.x) / tAir;
          
          // Fly forward (negative Z direction)
          obs.userData.velocityZ = -(Math.random() * 10 + 15);
          
          obs.userData.rotX = (Math.random() - 0.5) * 15;
          obs.userData.rotY = (Math.random() - 0.5) * 15;
          obs.userData.rotZ = (Math.random() - 0.5) * 15;

          // Sound effect
          audio.playHit();
          
          // Tiny camera shake
          this.cameraShakeTimer = 0.15;
          
          // Add extra score for bashing!
          this.score += 250 * this.multiplier;
        } else {
          this.handleHit();
          this.scene.remove(obs);
          this.obstacles.splice(i, 1);
        }
        continue;
      }

      // Despawn checks
      if (obs.position.z > DESPAWN_Z) {
        this.scene.remove(obs);
        this.obstacles.splice(i, 1);
      }
    }

    // 12. Move and Collide Floppy Disk items
    for (let i = this.points.length - 1; i >= 0; i--) {
      const point = this.points[i];

      // If the point has been knocked out by explosion, update flight physics
      if (point.userData.isKnockedOut) {
        point.userData.velocityY += this.gravity * dt;
        
        point.position.x += point.userData.velocityX * dt;
        point.position.y += point.userData.velocityY * dt;
        point.position.z += point.userData.velocityZ * dt;
        
        point.rotation.x += point.userData.rotX * dt;
        point.rotation.y += 5 * dt;

        // Despawn check
        if (point.position.y < -15 || point.position.z < -160 || point.position.z > 30 || Math.abs(point.position.x) > 40) {
          this.scene.remove(point);
          this.points.splice(i, 1);
        }
        continue;
      }

      point.position.z += this.speed * dt;
      
      // Floating hover animations
      point.rotation.y += 3 * dt;
      point.position.y = 0.4 + Math.sin(time * 5 + i) * 0.15;

      // Check Car Spin Proximity Fling for Floppy disks
      const isCarSpinningProximity = (this.selectedCharacter === 'car' && this.bashTimer > 0);
      if (isCarSpinningProximity && !point.userData.isKnockedOut) {
        const dx = point.position.x - this.player.position.x;
        const dz = point.position.z - PLAYER_START_Z;
        const dist = Math.sqrt(dx * dx + dz * dz);
        
        if (dist < 2.8) {
          point.userData.isKnockedOut = true;
          
          const targetLaneX = LANES[Math.floor(Math.random() * 3)];
          const vy0 = Math.random() * 6 + 14;
          point.userData.velocityY = vy0;
          
          const tAir = vy0 / 12.5;
          point.userData.velocityX = (targetLaneX - point.position.x) / tAir;
          point.userData.velocityZ = -(Math.random() * 12 + 18);
          
          point.userData.rotX = (Math.random() - 0.5) * 15;
          point.userData.rotY = (Math.random() - 0.5) * 15;
          point.userData.rotZ = (Math.random() - 0.5) * 15;
          continue;
        }
      }

      // Collide Check
      if (this.checkCollision(this.player, point, 0.6, 0.8)) {
        this.handleCollect();
        this.scene.remove(point);
        this.points.splice(i, 1);
        continue;
      }

      // Despawn check
      if (point.position.z > DESPAWN_Z) {
        this.scene.remove(point);
        this.points.splice(i, 1);
      }
    }
  }

  /**
   * checkCollision - Axis-Aligned coordinates overlap verification checks.
   */
  checkCollision(playerMesh, itemMesh, defaultToleranceX, defaultToleranceY) {
    const type = playerMesh.userData.type;
    let centerY = 0.3;
    let toleranceX = defaultToleranceX;
    let toleranceY = defaultToleranceY;
    
    // Adjust collision heights and bounds depending on the chosen vehicle size
    if (type === 'monster_truck') {
      centerY = 0.85;
      toleranceX = defaultToleranceX * 1.2;
      toleranceY = defaultToleranceY * 1.25;
    } else if (type === 'truck') {
      centerY = 0.55;
      toleranceX = defaultToleranceX * 1.15;
      toleranceY = defaultToleranceY * 1.15;
    }
    
    const px = playerMesh.position.x;
    const py = playerMesh.position.y + centerY;
    const pz = PLAYER_START_Z;

    const ix = itemMesh.position.x;
    const iy = itemMesh.position.y + 0.4;
    const iz = itemMesh.position.z;

    // Check Z coordinate depth difference (larger offset for vehicles length)
    const distZ = Math.abs(pz - iz);
    if (distZ < 0.8) {
      // Check X lane and Y height difference
      const distX = Math.abs(px - ix);
      const distY = Math.abs(py - iy);
      if (distX < toleranceX && distY < toleranceY) {
        return true;
      }
    }
    return false;
  }

  /**
   * handleHit - Manages crash impact consequences.
   */
  handleHit() {
    this.lives--;
    this.updateHudLives();
    this.cameraShakeTimer = 0.25; // shake for 250ms
    audio.playHit();

    this.multiplier = 1;
    this.domMultiplierContainer.classList.add('hidden');

    if (this.lives <= 0) {
      this.gameOver();
    } else {
      this.isInvincible = true;
      this.invincibilityTimer = 1.5; // Invincible flash duration (1.5 seconds)
    }
  }

  /**
   * handleCollect - Handles floppy disk coin accumulation.
   */
  handleCollect() {
    audio.playCollect();
    
    // Increment active score multiplier
    this.multiplier = Math.min(4, this.multiplier + 1);
    this.score += 500 * this.multiplier;
    this.multiplierTimer = 4.0; // Multiplier lasts 4s before resetting

    this.domMultiplier.textContent = `x${this.multiplier}`;
    this.domMultiplierContainer.classList.remove('hidden');
  }

  /**
   * explodeObstacle - Triggers a visual voxel explosion and flings nearby obstacles/points.
   * @param {THREE.Object3D} obs - The exploding obstacle
   */
  explodeObstacle(obs) {
    const explX = obs.position.x;
    const explY = 0;
    const explZ = obs.position.z;

    // Trigger visual/audio feedback
    audio.playHit();
    this.cameraShakeTimer = 0.2;

    // Spawn voxel explosion particles
    const particleCount = 16;
    const colors = [0xff003c, 0xff5500, 0xffff00, 0xff007f];
    for (let k = 0; k < particleCount; k++) {
      const size = Math.random() * 0.15 + 0.1;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const geom = new THREE.BoxGeometry(size, size, size);
      const mat = new THREE.MeshBasicMaterial({ color: color, fog: true });
      const mesh = new THREE.Mesh(geom, mat);
      
      mesh.position.set(
        explX + (Math.random() - 0.5) * 0.4,
        explY + 0.1,
        explZ + (Math.random() - 0.5) * 0.4
      );
      mesh.castShadow = true;
      this.scene.add(mesh);

      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 4;
      this.particles.push({
        mesh: mesh,
        vx: Math.cos(angle) * speed,
        vy: Math.random() * 9 + 7,
        vz: Math.sin(angle) * speed,
        life: 0.6,
        maxLife: 0.6
      });
    }

    // Fling nearby obstacles (chain reaction) - Expanded area to 6.0 units
    const radius = 6.0;
    for (let j = 0; j < this.obstacles.length; j++) {
      const other = this.obstacles[j];
      if (other === obs || other.userData.isKnockedOut) continue;

      const dx = other.position.x - explX;
      const dz = other.position.z - explZ;
      const dist = Math.sqrt(dx * dx + dz * dz);
      
      if (dist < radius) {
        other.userData.isKnockedOut = true;
        const force = 12 + (radius - dist) * 3;
        
        // Target one of the three highway lanes randomly
        const targetLaneX = LANES[Math.floor(Math.random() * 3)];
        const vy0 = Math.random() * 5 + 12;
        other.userData.velocityY = vy0;
        
        // Calculate exact velocityX to land on targetLaneX
        const tAir = vy0 / 12.5;
        other.userData.velocityX = (targetLaneX - other.position.x) / tAir;
        other.userData.velocityZ = -(force + 8); // fling forward along the Z line (away from player)
        
        other.userData.rotX = (Math.random() - 0.5) * 15;
        other.userData.rotY = (Math.random() - 0.5) * 15;
        other.userData.rotZ = (Math.random() - 0.5) * 15;

        // Reward extra points for chain reaction
        this.score += 150 * this.multiplier;
      }
    }

    // Fling nearby floppy points - Expanded area to 6.0 units
    for (let j = 0; j < this.points.length; j++) {
      const point = this.points[j];
      if (point.userData.isKnockedOut) continue;

      const dx = point.position.x - explX;
      const dz = point.position.z - explZ;
      const dist = Math.sqrt(dx * dx + dz * dz);
      
      if (dist < radius) {
        point.userData.isKnockedOut = true;
        const force = 12 + (radius - dist) * 3;
        
        // Target one of the three highway lanes randomly
        const targetLaneX = LANES[Math.floor(Math.random() * 3)];
        const vy0 = Math.random() * 5 + 14;
        point.userData.velocityY = vy0;
        
        // Calculate exact velocityX to land on targetLaneX
        const tAir = vy0 / 12.5;
        point.userData.velocityX = (targetLaneX - point.position.x) / tAir;
        point.userData.velocityZ = -(force + 8); // fling forward along the Z line (away from player)
        
        point.userData.rotX = (Math.random() - 0.5) * 15;
        point.userData.rotY = (Math.random() - 0.5) * 15;
        point.userData.rotZ = (Math.random() - 0.5) * 15;
      }
    }
  }
}

// Start GameEngine instance when page completes loading
window.addEventListener('DOMContentLoaded', () => {
  new GameEngine();
});
