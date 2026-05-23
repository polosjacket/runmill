import * as THREE from 'three';
import { createPlayerModel, createFloppyDiskModel, createObstacleModel } from './voxels.js';
import { audio } from './audio.js';

// Game Configuration
const LANE_WIDTH = 2.0;
const LANES = [-LANE_WIDTH, 0, LANE_WIDTH];
const PLAYER_START_Z = 5.0;
const SPAWN_START_Z = -80.0;
const DESPAWN_Z = 12.0;

class GameEngine {
  constructor() {
    // Three.js Core
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.clock = new THREE.Clock();

    // Game State
    this.state = 'START'; // START, PLAYING, GAMEOVER
    this.score = 0;
    this.distance = 0;
    this.speed = 15; // base speed
    this.maxSpeed = 45;
    this.lives = 3;
    this.isInvincible = false;
    this.invincibilityTimer = 0;
    this.cameraShakeTimer = 0;
    this.multiplier = 1;
    this.multiplierTimer = 0;

    // Player Movement
    this.currentLane = 1; // index in LANES (0: Left, 1: Middle, 2: Right)
    this.targetX = 0;
    this.playerY = 0;
    this.playerVelocityY = 0;
    this.gravity = -25;
    this.jumpForce = 10;
    this.isJumping = false;

    // Scene Objects
    this.player = null;
    this.roadGrid1 = null;
    this.roadGrid2 = null;
    this.sun = null;
    this.obstacles = [];
    this.points = [];
    this.scenery = [];
    
    // Spawning controls
    this.spawnTimer = 0;
    this.spawnInterval = 1.8; // seconds

    // DOM Bindings
    this.domStartScreen = document.getElementById('start-screen');
    this.domGameOverScreen = document.getElementById('game-over-screen');
    this.domHud = document.getElementById('hud');
    this.domScore = document.getElementById('hud-score');
    this.domSpeed = document.getElementById('hud-speed');
    this.domDistance = document.getElementById('hud-distance');
    this.domLives = document.getElementById('hud-lives');
    this.domMultiplierContainer = document.getElementById('hud-multiplier-container');
    this.domMultiplier = document.getElementById('hud-multiplier');
    this.domFinalScore = document.getElementById('final-score');
    this.domFinalDistance = document.getElementById('final-distance');
    this.domHighScoreForm = document.getElementById('high-score-form');
    this.domPlayerName = document.getElementById('player-name');
    this.domLeaderboardList = document.getElementById('leaderboard-list');

    // UI Buttons
    this.btnStart = document.getElementById('start-btn');
    this.btnRestart = document.getElementById('restart-btn');
    this.btnSubmitScore = document.getElementById('submit-score-btn');

    // Setup Everything
    this.initThree();
    this.setupLighting();
    this.createStaticScenery();
    this.setupEventListeners();
    this.fetchLeaderboard();
    
    // Start Game Loop
    this.animate();
  }

  initThree() {
    const container = document.getElementById('canvas-container');
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0b0214);
    // Fog for retro depth blending
    this.scene.fog = new THREE.FogExp2(0x0b0214, 0.015);

    // Camera (Third person perspective)
    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    this.resetCamera();

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    this.renderer.setSize(width, height);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(this.renderer.domElement);

    // Window Resize Handler
    window.addEventListener('resize', () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    });
  }

  resetCamera() {
    this.camera.position.set(0, 3.2, PLAYER_START_Z + 4.5);
    this.camera.lookAt(0, 1.2, PLAYER_START_Z - 5);
  }

  setupLighting() {
    // Ambient light (neon colored tint)
    const ambientLight = new THREE.AmbientLight(0x3a0066, 1.2);
    this.scene.add(ambientLight);

    // Directional Cyber Sun light (casts shadows)
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

    // Front soft light to highlight player voxel details
    const frontLight = new THREE.PointLight(0x00f0ff, 2.0, 30);
    frontLight.position.set(0, 5, PLAYER_START_Z + 2);
    this.scene.add(frontLight);
  }

  createStaticScenery() {
    // Loopable scrolling roads (using GridHelpers for retro cyber grid line feel)
    const size = 100;
    const divisions = 50;
    
    this.roadGrid1 = new THREE.GridHelper(size, divisions, 0x00f0ff, 0xff007f);
    this.roadGrid1.position.set(0, 0, 0);
    this.scene.add(this.roadGrid1);

    this.roadGrid2 = new THREE.GridHelper(size, divisions, 0x00f0ff, 0xff007f);
    this.roadGrid2.position.set(0, 0, -size);
    this.scene.add(this.roadGrid2);

    // Dark asphalt underlay
    const roadGeom = new THREE.PlaneGeometry(30, size * 2);
    const roadMat = new THREE.MeshBasicMaterial({ color: 0x05010a });
    const roadPlane = new THREE.Mesh(roadGeom, roadMat);
    roadPlane.rotation.x = -Math.PI / 2;
    roadPlane.position.set(0, -0.01, -size / 2);
    roadPlane.receiveShadow = true;
    this.scene.add(roadPlane);

    // Retro Neon Sun (Striped Sunset Sun)
    const sunGroup = new THREE.Group();
    const sunRadius = 15;
    const stripeCount = 10;
    const stripeHeight = 0.8;
    const gap = 0.3;

    for (let i = 0; i < stripeCount; i++) {
      const yOffset = (i - stripeCount / 2) * (stripeHeight + gap);
      // Calculate width of horizontal box representing a segment of a circle
      const angle = Math.asin(yOffset / sunRadius);
      const width = 2 * sunRadius * Math.cos(angle);
      
      const segmentGeom = new THREE.BoxGeometry(width, stripeHeight, 0.5);
      
      // Bottom segments are thinner / fade out
      const mixRatio = i / stripeCount;
      const color = new THREE.Color().lerpColors(new THREE.Color(0xfff600), new THREE.Color(0xff007f), mixRatio);
      const segmentMat = new THREE.MeshBasicMaterial({ 
        color: color,
        fog: false // The sun shouldn't fade into distance fog
      });

      const segment = new THREE.Mesh(segmentGeom, segmentMat);
      segment.position.y = yOffset;
      sunGroup.add(segment);
    }
    sunGroup.position.set(0, 10, -120);
    this.scene.add(sunGroup);
    this.sun = sunGroup;

    // Stars particle system in background
    const starsGeom = new THREE.BufferGeometry();
    const starsCount = 300;
    const starPositions = new Float32Array(starsCount * 3);

    for (let i = 0; i < starsCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 150;
      starPositions[i * 3 + 1] = Math.random() * 60 + 5;
      starPositions[i * 3 + 2] = -Math.random() * 120 - 40;
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

    // Initial Side Mountains (voxel style)
    for (let z = 0; z > -150; z -= 15) {
      this.spawnMountain(z, -8); // Left mountain
      this.spawnMountain(z, 8);  // Right mountain
    }
  }

  spawnMountain(z, xOffset) {
    const height = Math.random() * 8 + 4;
    const width = Math.random() * 4 + 4;
    const geom = new THREE.ConeGeometry(width, height, 4);
    
    // Mesh basic outline wireframe look for cyber retro vibe
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

  setupEventListeners() {
    // Keyboard Controls
    window.addEventListener('keydown', (e) => {
      if (this.state !== 'PLAYING') return;

      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        this.moveLane(-1);
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        this.moveLane(1);
      } else if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        this.jump();
      }
    });

    // Touch controls for Mobile
    const touchLeft = document.getElementById('touch-left');
    const touchRight = document.getElementById('touch-right');
    const touchJump = document.getElementById('touch-jump');

    touchLeft.addEventListener('pointerdown', () => this.moveLane(-1));
    touchRight.addEventListener('pointerdown', () => this.moveLane(1));
    touchJump.addEventListener('pointerdown', () => this.jump());

    // Game Overlay Buttons
    this.btnStart.addEventListener('click', () => this.startGame());
    this.btnRestart.addEventListener('click', () => this.startGame());
    this.btnSubmitScore.addEventListener('click', () => this.submitHighScore());
  }

  moveLane(dir) {
    this.currentLane = THREE.MathUtils.clamp(this.currentLane + dir, 0, 2);
    this.targetX = LANES[this.currentLane];
  }

  jump() {
    if (this.isJumping) return;
    this.isJumping = true;
    this.playerVelocityY = this.jumpForce;
    audio.playJump();
  }

  startGame() {
    // Initialize Audio context on first click
    audio.init();

    // Reset game state
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

    // Clear existing objects from scene
    this.clearObstaclesAndPoints();

    // Recreate Player voxel model
    if (this.player) this.scene.remove(this.player);
    this.player = createPlayerModel();
    this.player.position.set(0, 0, PLAYER_START_Z);
    this.scene.add(this.player);

    // Update DOM UI
    this.updateHudLives();
    this.domScore.textContent = '00000';
    this.domDistance.textContent = '0';
    this.domSpeed.textContent = '0';
    this.domMultiplierContainer.classList.add('hidden');

    this.domStartScreen.classList.add('hidden');
    this.domGameOverScreen.classList.add('hidden');
    this.domHud.classList.remove('hidden');
    this.domHighScoreForm.classList.add('hidden');

    // Show mobile touch buttons if device has touch
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      document.getElementById('touch-controls').classList.remove('hidden');
    }

    this.state = 'PLAYING';
    audio.startMusic();
  }

  clearObstaclesAndPoints() {
    this.obstacles.forEach(o => this.scene.remove(o));
    this.points.forEach(p => this.scene.remove(p));
    this.obstacles = [];
    this.points = [];
  }

  gameOver() {
    this.state = 'GAMEOVER';
    audio.playGameOver();

    // Hide HUD & Mobile buttons
    this.domHud.classList.add('hidden');
    document.getElementById('touch-controls').classList.add('hidden');

    // Populate GameOver stats
    this.domFinalScore.textContent = Math.floor(this.score);
    this.domFinalDistance.textContent = Math.floor(this.distance);

    // Show high score upload form if they qualify
    this.domHighScoreForm.classList.remove('hidden');
    this.domPlayerName.value = '';
    
    this.domGameOverScreen.classList.remove('hidden');
  }

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

  // API Interactivity
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
      this.domLeaderboardList.innerHTML = '<li class="loading">OFFLINE MODE</li>';
    }
  }

  async submitHighScore() {
    const nameInput = this.domPlayerName.value.trim().toUpperCase();
    if (!nameInput) return;

    try {
      this.btnSubmitScore.disabled = true;
      this.btnSubmitScore.textContent = 'SAVING...';
      
      const response = await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: nameInput, score: Math.floor(this.score) })
      });
      
      const updatedScores = await response.json();
      this.domHighScoreForm.classList.add('hidden');
      
      // Update local scores list directly
      this.fetchLeaderboard();
    } catch (e) {
      console.error(e);
    } finally {
      this.btnSubmitScore.disabled = false;
      this.btnSubmitScore.textContent = 'UPLOAD';
    }
  }

  // Spawning Logic
  spawnObstacleOrPoint() {
    const rand = Math.random();
    const lane = Math.floor(Math.random() * 3);
    const laneX = LANES[lane];

    if (rand < 0.35) {
      // Spawn point (Floppy Disk)
      const floppy = createFloppyDiskModel();
      // Floppys float slightly above ground
      floppy.position.set(laneX, 0.4, SPAWN_START_Z);
      this.scene.add(floppy);
      this.points.push(floppy);
    } else {
      // Spawn obstacle (cassette, TV, or spike)
      const types = ['cassette', 'tv', 'spike'];
      const chosenType = types[Math.floor(Math.random() * types.length)];
      const obs = createObstacleModel(chosenType);
      obs.position.set(laneX, 0, SPAWN_START_Z);
      this.scene.add(obs);
      this.obstacles.push(obs);
    }
  }

  // Core Game Loop
  animate() {
    requestAnimationFrame(() => this.animate());

    const dt = this.clock.getDelta();

    if (this.state === 'PLAYING') {
      this.updatePlaying(dt);
    } else {
      this.updateMenu(dt);
    }

    // Camera shakes on impact
    if (this.cameraShakeTimer > 0) {
      this.cameraShakeTimer -= dt;
      const shakeAmt = 0.15;
      this.camera.position.x = (Math.random() - 0.5) * shakeAmt;
      this.camera.position.y = 3.2 + (Math.random() - 0.5) * shakeAmt;
      if (this.cameraShakeTimer <= 0) {
        this.resetCamera();
      }
    }

    this.renderer.render(this.scene, this.camera);
  }

  updateMenu(dt) {
    const time = this.clock.getElapsedTime();
    
    // Parallax background items move slowly in menu
    const slowSpeed = 2;
    this.roadGrid1.position.z += slowSpeed * dt;
    this.roadGrid2.position.z += slowSpeed * dt;

    if (this.roadGrid1.position.z >= 100) this.roadGrid1.position.z -= 200;
    if (this.roadGrid2.position.z >= 100) this.roadGrid2.position.z -= 200;

    // Shift mountains in menu
    this.scenery.forEach(m => {
      m.position.z += slowSpeed * dt;
      if (m.position.z > DESPAWN_Z) {
        m.position.z = SPAWN_START_Z - 50;
      }
    });

    // Make Sun slide slightly
    if (this.sun) {
      this.sun.rotation.z = time * 0.05;
    }
  }

  updatePlaying(dt) {
    const time = this.clock.getElapsedTime();

    // 1. Progress Stats
    this.distance += this.speed * dt;
    this.score += this.speed * dt * 0.1 * this.multiplier;
    
    // Slowly accelerate
    if (this.speed < this.maxSpeed) {
      this.speed += dt * 0.25;
    }

    // Update UI text
    this.domScore.textContent = Math.floor(this.score).toString().padStart(5, '0');
    this.domDistance.textContent = Math.floor(this.distance);
    this.domSpeed.textContent = Math.floor(this.speed * 4); // virtual km/h

    // 2. Loop & scroll highway grids
    this.roadGrid1.position.z += this.speed * dt;
    this.roadGrid2.position.z += this.speed * dt;

    if (this.roadGrid1.position.z >= 100) this.roadGrid1.position.z -= 200;
    if (this.roadGrid2.position.z >= 100) this.roadGrid2.position.z -= 200;

    // 3. Move mountains along the roadside
    this.scenery.forEach(m => {
      m.position.z += this.speed * dt;
      if (m.position.z > DESPAWN_Z) {
        m.position.z = SPAWN_START_Z - 20;
      }
    });

    // 4. Oscillate Sun scale/glow or rotate
    if (this.sun) {
      this.sun.rotation.z = time * 0.1;
    }

    // 5. Spawning items
    this.spawnTimer += dt;
    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnTimer = 0;
      this.spawnObstacleOrPoint();
      // Increase difficulty slightly over time
      this.spawnInterval = Math.max(0.8, 1.8 - (this.speed / 50));
    }

    // 6. Handle Player lane transition (lerping X coordinate)
    this.player.position.x = THREE.MathUtils.lerp(this.player.position.x, this.targetX, 15 * dt);

    // 7. Handle Player Jumping physics
    if (this.isJumping) {
      this.playerVelocityY += this.gravity * dt;
      this.playerY += this.playerVelocityY * dt;

      if (this.playerY <= 0) {
        this.playerY = 0;
        this.playerVelocityY = 0;
        this.isJumping = false;
      }
    }
    this.player.position.y = this.playerY;

    // 8. Player Voxel Running Animation
    const legs = this.player.userData;
    if (legs) {
      if (this.isJumping) {
        // Jumping pose (arms/legs stretched)
        legs.leftLeg.rotation.x = -0.5;
        legs.rightLeg.rotation.x = 0.5;
        legs.leftArm.rotation.x = 0.8;
        legs.rightArm.rotation.x = -0.8;
      } else {
        // Running cycle
        const swingSpeed = 16 + (this.speed * 0.1);
        const swingAngle = Math.sin(time * swingSpeed) * 0.6;
        legs.leftLeg.rotation.x = swingAngle;
        legs.rightLeg.rotation.x = -swingAngle;
        legs.leftArm.rotation.x = -swingAngle * 0.8;
        legs.rightArm.rotation.x = swingAngle * 0.8;
        
        // Torso bounces slightly while running
        legs.torso.position.y = 1.0 + Math.abs(Math.sin(time * swingSpeed * 2)) * 0.08;
      }
    }

    // 9. Invincibility flash effect
    if (this.isInvincible) {
      this.invincibilityTimer -= dt;
      // Oscillate visibility for standard retro flashing
      this.player.visible = Math.floor(time * 20) % 2 === 0;
      
      if (this.invincibilityTimer <= 0) {
        this.isInvincible = false;
        this.player.visible = true;
      }
    }

    // 10. Multiplier depletion
    if (this.multiplier > 1) {
      this.multiplierTimer -= dt;
      if (this.multiplierTimer <= 0) {
        this.multiplier = 1;
        this.domMultiplierContainer.classList.add('hidden');
      }
    }

    // 11. Move and Collide Obstacles
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const obs = this.obstacles[i];
      obs.position.z += this.speed * dt;

      // Obstacle rotation just for fun
      obs.rotation.y += dt;

      // Check collision
      if (!this.isInvincible && this.checkCollision(this.player, obs, 0.7, 0.8)) {
        this.handleHit();
        this.scene.remove(obs);
        this.obstacles.splice(i, 1);
        continue;
      }

      // Despawn check
      if (obs.position.z > DESPAWN_Z) {
        this.scene.remove(obs);
        this.obstacles.splice(i, 1);
      }
    }

    // 12. Move and Collide Floppy Disks
    for (let i = this.points.length - 1; i >= 0; i--) {
      const point = this.points[i];
      point.position.z += this.speed * dt;
      
      // Floppy Disk spinning
      point.rotation.y += 3 * dt;
      point.position.y = 0.4 + Math.sin(time * 5 + i) * 0.15; // Hovering wave

      // Check collision
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

  checkCollision(playerMesh, itemMesh, toleranceX, toleranceY) {
    const px = playerMesh.position.x;
    const py = playerMesh.position.y + 0.8; // player center is y=0.8
    const pz = PLAYER_START_Z;

    const ix = itemMesh.position.x;
    const iy = itemMesh.position.y + 0.4; // item center height
    const iz = itemMesh.position.z;

    // Check depth Z closeness first (very fast check)
    const distZ = Math.abs(pz - iz);
    if (distZ < 0.6) {
      // Check X lane and Y height difference
      const distX = Math.abs(px - ix);
      const distY = Math.abs(py - iy);
      if (distX < toleranceX && distY < toleranceY) {
        return true;
      }
    }
    return false;
  }

  handleHit() {
    this.lives--;
    this.updateHudLives();
    this.cameraShakeTimer = 0.25;
    audio.playHit();

    // Reset multiplier on hit
    this.multiplier = 1;
    this.domMultiplierContainer.classList.add('hidden');

    if (this.lives <= 0) {
      this.gameOver();
    } else {
      this.isInvincible = true;
      this.invincibilityTimer = 1.5; // 1.5s of invincibility
    }
  }

  handleCollect() {
    audio.playCollect();
    
    // Add score and boost multiplier
    this.multiplier = Math.min(4, this.multiplier + 1);
    this.score += 500 * this.multiplier;
    this.multiplierTimer = 4.0; // 4 seconds before multiplier expires

    this.domMultiplier.textContent = `x${this.multiplier}`;
    this.domMultiplierContainer.classList.remove('hidden');
  }
}

// Start Engine
window.addEventListener('DOMContentLoaded', () => {
  new GameEngine();
});
