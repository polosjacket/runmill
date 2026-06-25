import * as THREE from 'three';
import { createVehicleModel, createCoinModel, createTankShellModel, createHeartItemModel, createObstacleModel, createTrashBagModel, createCockpitModel } from './voxels.js';
import { audio } from './audio.js';

// Multi-Language Translation Dictionaries
const TRANSLATIONS = {
  en: {
    world: "WORLD",
    score: "SCORE",
    speed: "SPEED",
    distance: "DISTANCE",
    coins: "COINS",
    next_world: "NEXT WORLD",
    victory_in: "VICTORY IN",
    game_subtitle: "CYBER GRID RUNNER v1.9.0",
    wallet: "WALLET:",
    choose_vehicle: "CHOOSE VEHICLE",
    car: "CAR",
    monster: "MONSTER",
    garbage: "GARBAGE",
    cyber: "CYBER (1K)",
    hover: "HOVER (1.5K)",
    tank: "TANK (5K)",
    vehicle_color: "VEHICLE COLOR",
    audio_system: "AUDIO SYSTEM",
    volume: "VOLUME",
    run_program: "RUN PROGRAM",
    controls_title: "CONTROLS:",
    controls_left: "← / A : MOVE LEFT",
    controls_right: "→ / D : MOVE RIGHT",
    controls_jump: "SPACE / W : JUMP",
    controls_special: "↓ / S : SPIN (CAR) / BASH (MONSTER) / SHOOT (TANK)",
    controls_specials_cyber: "SPECIALS: CYBER TRUCK = COIN MAGNET",
    controls_specials_hover: "HOVERCRAFT = GLIDE OVER SPIKES",
    top_runners: "TOP RUNNERS",
    afk_mode: "AFK MODE",
    music_on: "MUSIC: ON",
    music_off: "MUSIC: OFF",
    sfx_on: "SFX: ON",
    sfx_off: "SFX: OFF",
    language_select: "LANGUAGE SELECT",
    settings_title: "SYSTEM SETTINGS",
    font_select: "TEXT FONT",
    grid_color_title: "GRID COLOR",
    text_color_title: "TEXT COLOR",
    back: "BACK",
    connection_lost: "CONNECTION LOST",
    session_terminated: "SESSION TERMINATED",
    final_score_label: "FINAL SCORE:",
    distance_label: "DISTANCE:",
    new_high_score: "NEW HIGH SCORE UNLOCKED!",
    enter_initials: "ENTER INITIALS",
    upload: "UPLOAD",
    reboot_menu: "REBOOT MENU",
    paused_title: "PAUSED",
    paused_subtitle: "SYSTEM EXECUTION SUSPENDED",
    resume_btn: "RESUME",
    program_completed: "PROGRAM COMPLETED",
    cyber_grid_dominated: "CYBER-GRID DOMINATED",
    legendary_runner: "YOU ARE A LEGENDARY RUNNER!",
    afk_system_engaged: "AFK SYSTEM ENGAGED",
    mining_coins: "MINING DATA COINS...",
    next_payout: "NEXT PAYOUT IN:",
    coins_mined: "COINS MINED:",
    return_to_system: "RETURN TO SYSTEM",
    bash: "BASH",
    spin: "SPIN",
    fire: "FIRE",
    magnet: "MAGNET",
    hover: "HOVER",
    trash: "TRASH",
    ready: "READY",
    spinning: "SPINNING",
    bashing: "BASHING",
    active: "ACTIVE",
    hovering: "HOVERING",
    saving: "SAVING..."
  },
  es: {
    world: "MUNDO",
    score: "PUNTOS",
    speed: "VELOCIDAD",
    distance: "DISTANCIA",
    coins: "MONEDAS",
    next_world: "SIG. MUNDO",
    victory_in: "VICTORIA EN",
    game_subtitle: "CORREDOR CIBERNÉTICO v1.9.0",
    wallet: "BILLETERA:",
    choose_vehicle: "ELEGIR VEHÍCULO",
    car: "AUTO",
    monster: "MONSTRUO",
    garbage: "BASURA",
    cyber: "CYBER (1K)",
    hover: "HOVER (1.5K)",
    tank: "TANQUE (5K)",
    vehicle_color: "COLOR DE VEHÍCULO",
    audio_system: "SISTEMA DE AUDIO",
    volume: "VOLUMEN",
    run_program: "EJECUTAR PROGRAMA",
    controls_title: "CONTROLES:",
    controls_left: "← / A : MOVER IZQUIERDA",
    controls_right: "→ / D : MOVER DERECHA",
    controls_jump: "ESPACIO / W : SALTAR",
    controls_special: "↓ / S : GIRO (AUTO) / CHOQUE (MONS.) / DISPARO (TANQ.)",
    controls_specials_cyber: "ESPECIALES: CYBER TRUCK = IMÁN COINS",
    controls_specials_hover: "HOVERCRAFT = FLOTAR SOBRE PICOS",
    top_runners: "MEJORES MARCAS",
    afk_mode: "MODO AFK",
    music_on: "MÚSICA: SÍ",
    music_off: "MÚSICA: NO",
    sfx_on: "SFX: SÍ",
    sfx_off: "SFX: NO",
    language_select: "ELEGIR IDIOMA",
    settings_title: "AJUSTES DEL SISTEMA",
    font_select: "FUENTE DE TEXTO",
    grid_color_title: "COLOR DE REJILLA",
    text_color_title: "COLOR DE TEXTO",
    back: "VOLVER",
    connection_lost: "CONEXIÓN PERDIDA",
    session_terminated: "SESIÓN TERMINADA",
    final_score_label: "PUNTAJE FINAL:",
    distance_label: "DISTANCIA:",
    new_high_score: "¡NUEVA MARCA MÁXIMA!",
    enter_initials: "INICIALES",
    upload: "SUBIR",
    reboot_menu: "REINICIAR MENÚ",
    paused_title: "PAUSADO",
    paused_subtitle: "EJECUCIÓN DEL SISTEMA SUSPENDIDA",
    resume_btn: "REANUDAR",
    program_completed: "PROGRAMA COMPLETADO",
    cyber_grid_dominated: "CIBER-REJILLA DOMINADA",
    legendary_runner: "¡ERES UN CORREDOR LEGENDARIO!",
    afk_system_engaged: "SISTEMA AFK ACTIVO",
    mining_coins: "MINANDO MONEDAS DE DATOS...",
    next_payout: "SIG. PAGO EN:",
    coins_mined: "MONEDAS MINADAS:",
    return_to_system: "VOLVER AL SISTEMA",
    bash: "CHOCAR",
    spin: "GIRAR",
    fire: "DISPARAR",
    magnet: "IMÁN",
    hover: "FLOTAR",
    trash: "BASURA",
    ready: "LISTO",
    spinning: "GIRANDO",
    bashing: "CHOCANDO",
    active: "ACTIVO",
    hovering: "FLOTANDO",
    saving: "GUARDANDO..."
  },
  ja: {
    world: "ワールド",
    score: "スコア",
    speed: "スピード",
    distance: "キョリ",
    coins: "コイン",
    next_world: "次ワールド",
    victory_in: "ビクトリーまで",
    game_subtitle: "サイバーグリッドランナー v1.9.0",
    wallet: "ウォレット:",
    choose_vehicle: "マシンせんたく",
    car: "スポーツカー",
    monster: "モンスター",
    garbage: "ゴミシュウシュウ",
    cyber: "サイバー (1K)",
    hover: "ホバー (1.5K)",
    tank: "戦車 (5K)",
    vehicle_color: "ボディーカラー",
    audio_system: "オーディオ",
    volume: "ボリューム",
    run_program: "プログラム起動",
    controls_title: "操作方法:",
    controls_left: "← / A : 左に移動",
    controls_right: "→ / D : 右に移動",
    controls_jump: "スペース / W : ジャンプ",
    controls_special: "↓ / S : スピン(スポーツ) / バッシュ(モンスタ) / ショット(戦車)",
    controls_specials_cyber: "トクベツ: サイバー = コインすいよせ",
    controls_specials_hover: "ホバー = トゲ無効化",
    top_runners: "トップスコア",
    afk_mode: "AFKモード",
    music_on: "音楽: オン",
    music_off: "音楽: オフ",
    sfx_on: "効果音: オン",
    sfx_off: "効果音: オフ",
    language_select: "げんごせんたく",
    settings_title: "システム設定",
    font_select: "フォント",
    grid_color_title: "グリッドカラー",
    text_color_title: "テキストカラー",
    back: "もどる",
    connection_lost: "オフライン",
    session_terminated: "セッション終了",
    final_score_label: "最終スコア:",
    distance_label: "走行距離:",
    new_high_score: "ハイスコア更新！",
    enter_initials: "イニシャル",
    upload: "アップロード",
    reboot_menu: "メニュー再起動",
    paused_title: "一時停止",
    paused_subtitle: "システム実行一時停止中",
    resume_btn: "再開",
    program_completed: "プログラム完了",
    cyber_grid_dominated: "グリッド制覇",
    legendary_runner: "キミは伝説 of ランナーだ！",
    afk_system_engaged: "AFKシステム起動中",
    mining_coins: "データコイン収穫中...",
    next_payout: "次回支払まで:",
    coins_mined: "獲得コイン:",
    return_to_system: "システムに戻る",
    bash: "突進",
    spin: "スピン",
    fire: "ファイア",
    magnet: "じしゃく",
    hover: "ホバー",
    trash: "ゴミ投げ",
    ready: "準備完了",
    spinning: "スピン中",
    bashing: "突進中",
    active: "アクティブ",
    hovering: "ホバー中",
    saving: "保存中..."
  }
};

// Comprehensive list of supported languages for dynamic translation
const LANGUAGES_SUPPORTED = {
  en: "English",
  es: "Español",
  ja: "日本語",
  fr: "Français",
  de: "Deutsch",
  it: "Italiano",
  pt: "Português",
  zh: "中文 (简体)",
  zt: "中文 (繁體)",
  ko: "한국어",
  ru: "Русский",
  ar: "العربية",
  hi: "हिन्दी",
  tr: "Türkçe",
  pl: "Polski",
  nl: "Nederlands",
  sv: "Svenska",
  vi: "Tiếng Việt",
  th: "ไทย",
  id: "Bahasa Indonesia",
  el: "Ελληνικά",
  he: "עברית (Hebrew)",
  uk: "Українська",
  da: "Dansk",
  fi: "Suomi",
  no: "Norsk",
  cs: "Čeština",
  ro: "Română",
  hu: "Magyar"
};

// Game Configuration Constants
const VEHICLES_CONFIG = {
  car: { cost: 0, maxLives: 3 },
  monster_truck: { cost: 0, maxLives: 4 },
  truck: { cost: 0, maxLives: 6 },
  cybertruck: { cost: 1000, maxLives: 5 },
  hovercraft: { cost: 1500, maxLives: 3 },
  tank: { cost: 5000, maxLives: 8 }
};

const LANE_WIDTH = 2.0;
const LANES = [-LANE_WIDTH, 0, LANE_WIDTH]; // Left, Middle, Right lane X-coordinates
const PLAYER_START_Z = 5.0;                // Camera-relative Z position of player
const SPAWN_START_Z = -80.0;               // Z coordinate where obstacles spawn far away
const DESPAWN_Z = 12.0;                    // Z coordinate where obstacles are deleted (passed player)

const WORLD_THEMES = {
  1: {
    name: "CYBER CITY",
    gridColor: 0x80f7ff,      // Electric Cyan
    mountainColor: 0x80f7ff,  // Electric Cyan
    sunColors: [0xfffa66, 0xff66cc], // Yellow to Pink
    ambientColor: 0x8833ff,   // Bright Purple
    ambientIntensity: 2.6,
    dirColor: 0xff4da6,       // Pink
    dirIntensity: 3.2,
    frontColor: 0x80f7ff,     // Lighter Cyan
    frontIntensity: 4.5,
    bgColor: 0x19082b
  },
  2: {
    name: "ACID GRID",
    gridColor: 0x73ff66,      // Electric Green
    mountainColor: 0x73ff66,  // Electric Green
    sunColors: [0xfffa66, 0x1db200], // Yellow to Green
    ambientColor: 0x1db200,   // Green
    ambientIntensity: 2.8,
    dirColor: 0x73ff66,       // Bright Green
    dirIntensity: 3.5,
    frontColor: 0xfffa66,     // Yellow
    frontIntensity: 4.5,
    bgColor: 0x051a05
  },
  3: {
    name: "TOKYO DRIFT",
    gridColor: 0xfffa66,      // Glowing Yellow
    mountainColor: 0xfffa66,  // Yellow
    sunColors: [0xff7733, 0xff003c], // Orange to Red
    ambientColor: 0xff5500,   // Orange
    ambientIntensity: 3.0,
    dirColor: 0xffaa00,       // Golden
    dirIntensity: 3.8,
    frontColor: 0xfffa66,     // Yellow
    frontIntensity: 5.0,
    bgColor: 0x220a00
  },
  4: {
    name: "SYNTH WAVE",
    gridColor: 0xff66cc,      // Glowing Pink
    mountainColor: 0xff66cc,  // Pink
    sunColors: [0xd666ff, 0x80f7ff], // Purple to Cyan
    ambientColor: 0xcc33ff,   // Purple
    ambientIntensity: 3.2,
    dirColor: 0xff66cc,       // Hot Pink
    dirIntensity: 4.0,
    frontColor: 0x80f7ff,     // Cyan
    frontIntensity: 5.0,
    bgColor: 0x1e002a
  },
  5: {
    name: "MATRIX CODES",
    gridColor: 0xffffff,      // Pure LED White
    mountainColor: 0x80f7ff,  // Glowing Ice Blue
    sunColors: [0xffffff, 0x80f7ff], // White to Cyan
    ambientColor: 0x1f3f5f,   // Ice Blue
    ambientIntensity: 3.4,
    dirColor: 0xffffff,       // White
    dirIntensity: 4.5,
    frontColor: 0x80f7ff,     // Ice Blue
    frontIntensity: 5.5,
    bgColor: 0x081018
  }
};

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
    this.maxLives = 3;              // Maximum health points
    this.isInvincible = false;      // Flag tracking if player is in recovery after a hit
    this.invincibilityTimer = 0;    // Time remaining for recovery flashing
    this.cameraShakeTimer = 0;      // Time remaining for crash impact camera shake
    this.multiplier = 1;            // Floyd disk collection score multiplier
    this.multiplierTimer = 0;       // Expiry countdown for active score multiplier
    this.selectedCharacter = 'car';  // Selected vehicle ('car', 'monster_truck', 'truck')
    this.selectedColor = 'pink';     // Selected vehicle color
    this.bashTimer = 0;
    this.bashCooldownTimer = 0;
    this.currentHoverHeight = 0.35;
    this.worldTime = 0;              // Elapsed time in current world (seconds)
    this.wallet = parseInt(localStorage.getItem('runmill_coins') || '0', 10);
    this.coinsCollected = 0;
    this.shells = [];
    this.trashBags = [];

    // 3. Player Movement & Physics
    this.currentLane = 1;           // Starting lane index (Middle)
    this.targetX = 0;               // Desired X coordinate target (lane coordinate)
    this.playerY = 0;               // Current jump height
    this.playerVelocityY = 0;       // Vertical velocity vector for jumps
    this.gravity = -10;             // Downward acceleration force (lower gravity for longer airtime)
    this.jumpForce = 7.5;           // Initial upward impulse force (adjusted for exact 1.5s jump)
    this.isJumping = false;         // Flag tracking if player is in mid-air
    this.jumpTimeElapsed = 0;       // Time since the jump started

    // 4. Scene Collections
    this.player = null;             // Reference to player's 3D voxel group
    this.cockpit = null;            // Reference to 1st person 3D dashboard cockpit
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
    this.domPauseScreen = document.getElementById('pause-screen');
    this.btnResume = document.getElementById('resume-btn');
    this.btnPauseExit = document.getElementById('pause-exit-btn');
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
    this.domWorld = document.getElementById('hud-world');
    this.domTimer = document.getElementById('hud-timer');
    this.domTimerLabel = document.querySelector('#hud-timer-container .label');
    this.domCoins = document.getElementById('hud-coins');

    // Victory Screen DOM Bindings
    this.domVictoryScreen = document.getElementById('victory-screen');
    this.domVicFinalScore = document.getElementById('vic-final-score');
    this.domVicFinalDistance = document.getElementById('vic-final-distance');
    this.domVicHighScoreForm = document.getElementById('vic-high-score-form');
    this.domVicPlayerName = document.getElementById('vic-player-name');

    // 7. Event Buttons
    this.btnStart = document.getElementById('start-btn');
    this.btnRestart = document.getElementById('restart-btn');
    this.btnSubmitScore = document.getElementById('submit-score-btn');
    this.btnTouchBash = document.getElementById('touch-bash');
    this.btnVicSubmitScore = document.getElementById('vic-submit-score-btn');
    this.btnVicRestart = document.getElementById('vic-restart-btn');

    // AFK Mode and Audio Settings Elements
    this.btnAfk = document.getElementById('afk-btn');
    this.btnExitAfk = document.getElementById('exit-afk-btn');
    this.domAfkScreen = document.getElementById('afk-screen');
    this.domAfkTimer = document.getElementById('afk-timer');
    this.domAfkEarned = document.getElementById('afk-earned');
    this.btnToggleMusic = document.getElementById('toggle-music-btn');
    this.btnToggleSfx = document.getElementById('toggle-sfx-btn');
    this.sliderVolume = document.getElementById('volume-slider');
    this.displayVolume = document.getElementById('volume-display');

    // Settings & Language DOM Elements
    this.btnSettings = document.getElementById('settings-btn');
    this.modalSettings = document.getElementById('settings-modal');
    this.btnCloseSettings = document.getElementById('close-settings-btn');
    this.selectLang = document.getElementById('lang-select');
    this.selectFont = document.getElementById('font-select');
    this.gridColorContainer = document.getElementById('grid-color-select');
    this.textColorContainer = document.getElementById('text-color-select');
    this.btnCamera = document.getElementById('camera-btn');

    this.currentLanguage = localStorage.getItem('runmill_language') || 'en';
    this.currentLanguageDict = TRANSLATIONS[this.currentLanguage] || TRANSLATIONS.en;

    // Load custom settings preferences
    this.cameraView = localStorage.getItem('runmill_camera_view') || 'third';
    const savedGridColor = localStorage.getItem('runmill_grid_color');
    this.customGridColorOverride = savedGridColor && savedGridColor !== 'default' ? parseInt(savedGridColor, 16) : null;
    this.customTextColorOverride = localStorage.getItem('runmill_text_color') || 'default';
    this.customFontOverride = localStorage.getItem('runmill_font') || 'mono';

    // 8. Core Initialization Steps
    this.initThree();
    this.setupLighting();
    this.createStaticScenery();
    this.setupEventListeners();
    this.initAudioSettingsUI();
    this.populateLanguageDropdown();
    this.applyLanguage(this.currentLanguage);
    this.applyTextColor(this.customTextColorOverride);
    this.applyFont(this.customFontOverride);
    this.syncSettingsUI();
    this.updateCameraBtnUI();
    this.fetchLeaderboard();
    this.updateWalletDisplay();
    this.updateVehicleButtons();
    
    // Start background music when window gets focus or becomes visible (entering the tab)
    const playMusicOnTabEntry = () => {
      if (this.state === 'START' || this.state === 'AFK') {
        audio.startMusic('menu');
      } else if (this.state === 'PLAYING') {
        audio.startMusic('game');
      }
    };

    const pauseMusicOnTabLeave = () => {
      audio.stopMusic();
    };

    window.addEventListener('focus', playMusicOnTabEntry);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        playMusicOnTabEntry();
      } else {
        pauseMusicOnTabLeave();
      }
    });

    // Also trigger on first click for browsers blocking focus-based autoplay initially
    const startMenuMusicOnInteraction = () => {
      playMusicOnTabEntry();
      document.removeEventListener('click', startMenuMusicOnInteraction);
      document.removeEventListener('pointerdown', startMenuMusicOnInteraction);
    };
    document.addEventListener('click', startMenuMusicOnInteraction);
    document.addEventListener('pointerdown', startMenuMusicOnInteraction);

    // Begin main render loop recursion
    this.animate();
  }

  /**
   * updateWalletDisplay - Updates the coin count shown in the start menu wallet.
   */
  updateWalletDisplay() {
    const amountEl = document.getElementById('menu-wallet-amount');
    if (amountEl) {
      amountEl.textContent = this.wallet.toLocaleString();
    }
  }

  /**
   * initAudioSettingsUI - Populates the audio sliders and buttons from current state.
   */
  initAudioSettingsUI() {
    if (this.sliderVolume) {
      this.sliderVolume.value = audio.masterVolume;
    }
    this.updateAudioSettingsUI();
  }

  /**
   * updateAudioSettingsUI - Syncs the audio settings DOM buttons and labels.
   */
  updateAudioSettingsUI() {
    const dict = this.currentLanguageDict || TRANSLATIONS.en;

    if (this.btnToggleMusic) {
      if (audio.musicMuted) {
        this.btnToggleMusic.classList.remove('active');
        this.btnToggleMusic.textContent = dict.music_off;
      } else {
        this.btnToggleMusic.classList.add('active');
        this.btnToggleMusic.textContent = dict.music_on;
      }
    }
    if (this.btnToggleSfx) {
      if (audio.sfxMuted) {
        this.btnToggleSfx.classList.remove('active');
        this.btnToggleSfx.textContent = dict.sfx_off;
      } else {
        this.btnToggleSfx.classList.add('active');
        this.btnToggleSfx.textContent = dict.sfx_on;
      }
    }
    if (this.displayVolume) {
      this.displayVolume.textContent = Math.round(audio.masterVolume * 100) + '%';
    }
  }

  /**
   * applyTextColor - Dynamic CSS property overrides for standard text labels.
   */
  applyTextColor(val) {
    this.customTextColorOverride = val;
    localStorage.setItem('runmill_text_color', val);
    
    let colorHex = '#f1e4ff'; // default lilac
    if (val !== 'default' && val !== null) {
      colorHex = val;
    }
    document.documentElement.style.setProperty('--text-color', colorHex);
  }

  /**
   * applyFont - Dynamic CSS font family overrides globally.
   */
  applyFont(fontKey) {
    this.customFontOverride = fontKey;
    localStorage.setItem('runmill_font', fontKey);
    
    let pixelFont = "'Press Start 2P', monospace";
    let cyberFont = "'Orbitron', sans-serif";
    let monoFont = "'Share Tech Mono', monospace";
    
    if (fontKey === 'pixel') {
      pixelFont = "'Press Start 2P', monospace";
      cyberFont = "'Press Start 2P', monospace";
      monoFont = "'Press Start 2P', monospace";
    } else if (fontKey === 'cyber') {
      pixelFont = "'Orbitron', sans-serif";
      cyberFont = "'Orbitron', sans-serif";
      monoFont = "'Orbitron', sans-serif";
    } else if (fontKey === 'sans') {
      pixelFont = "'Outfit', sans-serif";
      cyberFont = "'Outfit', sans-serif";
      monoFont = "'Outfit', sans-serif";
    }

    document.documentElement.style.setProperty('--font-pixel', pixelFont);
    document.documentElement.style.setProperty('--font-cyber', cyberFont);
    document.documentElement.style.setProperty('--font-mono', monoFont);

    if (this.selectFont) {
      this.selectFont.value = fontKey;
    }
  }

  /**
   * syncSettingsUI - Synchronizes active neon classes and selectors with localStorage on load.
   */
  syncSettingsUI() {
    if (this.gridColorContainer) {
      const savedGridColor = localStorage.getItem('runmill_grid_color') || 'default';
      this.gridColorContainer.querySelectorAll('.color-btn').forEach(btn => {
        const val = btn.getAttribute('data-grid-color');
        if (val === savedGridColor) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }

    if (this.textColorContainer) {
      const savedTextColor = localStorage.getItem('runmill_text_color') || 'default';
      this.textColorContainer.querySelectorAll('.color-btn').forEach(btn => {
        const val = btn.getAttribute('data-text-color');
        if (val === savedTextColor) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }
  }

  /**
   * updateCameraBtnUI - Syncs the HUD button text representing current view mode.
   */
  updateCameraBtnUI() {
    if (this.btnCamera) {
      this.btnCamera.textContent = this.cameraView === 'first' ? '1ST' : '3RD';
    }
  }

  /**
   * populateLanguageDropdown - Populates the retro-select element with supported options.
   */
  populateLanguageDropdown() {
    if (!this.selectLang) return;
    this.selectLang.innerHTML = '';
    Object.keys(LANGUAGES_SUPPORTED).forEach(lang => {
      const opt = document.createElement('option');
      opt.value = lang;
      opt.textContent = LANGUAGES_SUPPORTED[lang].toUpperCase();
      this.selectLang.appendChild(opt);
    });
  }

  /**
   * fetchTranslations - Dynamically fetches and parses translations for any language using the Google Translate Free API.
   * Caches results in localStorage.
   */
  async fetchTranslations(lang) {
    if (TRANSLATIONS[lang]) {
      return TRANSLATIONS[lang];
    }

    const cacheKey = `runmill_lang_cache_v4_${lang}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        console.error("Failed to parse cached translation", e);
      }
    }

    const baseDict = TRANSLATIONS.en;
    const keys = Object.keys(baseDict);
    const values = keys.map(k => baseDict[k]);
    const joinedText = values.join('\n');

    let apiLang = lang;
    if (lang === 'zh') apiLang = 'zh-CN';
    if (lang === 'zt') apiLang = 'zh-TW';

    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${apiLang}&dt=t&q=${encodeURIComponent(joinedText)}`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      
      const newDict = {};
      Object.assign(newDict, baseDict);

      // Clean string utility to strip all non-alphanumeric characters for absolute matching robustness
      const cleanString = (str) => str.replace(/[^A-Z0-9]/gi, '').toUpperCase();

      // 1. Primary match: value-based matching (robust against Google Translate spacing/punctuation changes, e.g., "v1.8.0" vs "v 1.8.0")
      if (data && data[0]) {
        data[0].forEach(segment => {
          const trans = segment[0];
          const orig = segment[1];
          if (trans && orig) {
            const cleanOrig = cleanString(orig);
            const cleanTrans = trans.trim();
            if (cleanOrig !== '') {
              keys.forEach(k => {
                const cleanBase = cleanString(baseDict[k]);
                if (cleanBase === cleanOrig) {
                  newDict[k] = cleanTrans;
                }
              });
            }
          }
        });
      }

      // Extract full translated text for index-based matching fallback
      let translatedText = '';
      if (data && data[0]) {
        data[0].forEach(segment => {
          if (segment[0]) {
            translatedText += segment[0];
          }
        });
      }

      // 2. Secondary fallback: match using index order for any key that wasn't successfully matched by value
      const translatedLines = translatedText.split('\n');
      keys.forEach((key, index) => {
        if (newDict[key] === baseDict[key] && translatedLines[index] !== undefined && translatedLines[index].trim() !== '') {
          newDict[key] = translatedLines[index].trim();
        }
      });

      localStorage.setItem(cacheKey, JSON.stringify(newDict));
      return newDict;
    } catch (err) {
      console.error(`Failed to fetch translations for ${lang}`, err);
      return baseDict;
    }
  }

  /**
   * applyLanguage - Persists language selection and updates DOM nodes translation text.
   */
  async applyLanguage(lang) {
    this.currentLanguage = lang;
    localStorage.setItem('runmill_language', lang);

    if (this.selectLang) {
      this.selectLang.value = lang;
    }

    const titleEl = document.getElementById('settings-modal-title');
    if (titleEl) {
      titleEl.textContent = "...";
    }

    const dict = await this.fetchTranslations(lang);
    this.currentLanguageDict = dict;

    // 1. Update text content for translatable keys
    document.querySelectorAll('[data-lang-key]').forEach(el => {
      const key = el.getAttribute('data-lang-key');
      if (dict[key]) {
        el.textContent = dict[key];
      }
    });

    // 2. Update input placeholders
    document.querySelectorAll('[data-lang-placeholder]').forEach(el => {
      const key = el.getAttribute('data-lang-placeholder');
      if (dict[key]) {
        el.setAttribute('placeholder', dict[key]);
      }
    });

    // 3. Update Modal Titles & Labels
    if (titleEl) {
      titleEl.textContent = dict.language_select || "LANGUAGE SELECT";
    }
    const closeEl = document.getElementById('close-settings-btn');
    if (closeEl && dict.back) {
      closeEl.textContent = dict.back;
    }

    // 4. Update audio labels immediately
    this.updateAudioSettingsUI();
  }

  /**
   * enterAfkMode - Swaps to the AFK mining screensaver and starts timers.
   */
  enterAfkMode() {
    audio.init();
    this.state = 'AFK';
    this.afkTimer = 60;
    this.afkCoinsEarned = 0;
    
    audio.playCollect();

    this.domStartScreen.classList.add('hidden');
    this.domAfkScreen.classList.remove('hidden');
    
    if (this.domAfkTimer) this.domAfkTimer.textContent = '60s';
    if (this.domAfkEarned) this.domAfkEarned.textContent = '0';
  }

  /**
   * exitAfkMode - Returns back to the main startup menu.
   */
  exitAfkMode() {
    this.state = 'START';
    audio.playCollect();

    this.domAfkScreen.classList.add('hidden');
    this.domStartScreen.classList.remove('hidden');

    this.updateWalletDisplay();
    this.updateVehicleButtons();
  }

  /**
   * updateAfk - Handles ticking the AFK countdown timer and payout of data coins.
   */
  updateAfk(dt) {
    this.afkTimer -= dt;
    if (this.afkTimer <= 0) {
      this.afkTimer = 60;
      this.afkCoinsEarned += 100;
      this.wallet += 100;
      localStorage.setItem('runmill_coins', this.wallet);
      
      audio.playCollect();
      if (this.domAfkEarned) {
        this.domAfkEarned.textContent = this.afkCoinsEarned;
      }
    }
    
    if (this.domAfkTimer) {
      this.domAfkTimer.textContent = Math.ceil(this.afkTimer) + 's';
    }
  }

  /**
   * isUnlocked - Checks if a vehicle type is unlocked for the player.
   */
  isUnlocked(charType) {
    if (!VEHICLES_CONFIG[charType]) return true;
    if (VEHICLES_CONFIG[charType].cost === 0) return true;
    return localStorage.getItem(`runmill_unlocked_${charType}`) === 'true';
  }

  /**
   * updateVehicleButtons - Adds/removes the locked styling class to select buttons.
   */
  updateVehicleButtons() {
    this.domCharButtons.forEach(btn => {
      const charType = btn.getAttribute('data-char');
      if (this.isUnlocked(charType)) {
        btn.classList.remove('locked');
      } else {
        btn.classList.add('locked');
      }
    });
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
    this.scene.background = new THREE.Color(0x19082b); // Lighter glowing cyber-indigo sky backdrop
    
    // Exponential fog mimics retro screen depth, fading meshes into the background color
    this.scene.fog = new THREE.FogExp2(0x19082b, 0.015);

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
    // 1. Neon purple ambient fill light (lighter and more vibrant base color to shine)
    this.ambientLight = new THREE.AmbientLight(0x8833ff, 2.6);
    this.scene.add(this.ambientLight);

    // 2. Directional Cyber Sun light (lighter neon pink)
    this.dirLight = new THREE.DirectionalLight(0xff4da6, 3.2);
    this.dirLight.position.set(0, 15, -60);
    this.dirLight.castShadow = true;
    this.dirLight.shadow.mapSize.width = 1024;
    this.dirLight.shadow.mapSize.height = 1024;
    this.dirLight.shadow.camera.near = 0.5;
    this.dirLight.shadow.camera.far = 150;
    this.dirLight.shadow.camera.left = -10;
    this.dirLight.shadow.camera.right = 10;
    this.dirLight.shadow.camera.top = 15;
    this.dirLight.shadow.camera.bottom = -5;
    this.scene.add(this.dirLight);

    // 3. Neon cyan point light centered on player (lighter neon cyan spotlight to shine like light)
    this.frontLight = new THREE.PointLight(0x80f7ff, 4.5, 45);
    this.frontLight.position.set(0, 5, PLAYER_START_Z + 2);
    this.scene.add(this.frontLight);
  }

  /**
   * createStaticScenery - Builds grid roads, distant striped sun, background starfield.
   */
  createStaticScenery() {
    const size = 100;
    const divisions = 50;
    
    // We add two adjacent 100m GridHelpers.
    // As one moves past the screen, we scroll both backward and reset positions to form an infinite road loop.
    // Both center and grid lines are set to a lighter, glowing electric cyan.
    let gridColorVal = 0x80f7ff;
    if (this.customGridColorOverride !== undefined && this.customGridColorOverride !== null) {
      gridColorVal = this.customGridColorOverride;
    } else {
      const theme = WORLD_THEMES[this.world || 1];
      if (theme) gridColorVal = theme.gridColor;
    }

    this.roadGrid1 = new THREE.GridHelper(size, divisions, gridColorVal, gridColorVal);
    this.roadGrid1.position.set(0, 0, 0);
    this.scene.add(this.roadGrid1);

    this.roadGrid2 = new THREE.GridHelper(size, divisions, gridColorVal, gridColorVal);
    this.roadGrid2.position.set(0, 0, -size);
    this.scene.add(this.roadGrid2);

    // Dark black underlay plane below the grid to block stars showing under the road
    const roadGeom = new THREE.PlaneGeometry(30, size * 2);
    const roadMat = new THREE.MeshStandardMaterial({ 
      color: 0x05010a,
      roughness: 0.8,
      metalness: 0.1
    });
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
    
    const theme = WORLD_THEMES[this.world || 1];
    const mColor = theme ? theme.mountainColor : 0x80f7ff;

    // Wireframe lighter cyan mesh with double emissive intensity to shine like bright laser light beams
    const mat = new THREE.MeshStandardMaterial({
      color: mColor,
      emissive: mColor,
      emissiveIntensity: 1.2,
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
      // Toggle pause state
      if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        this.togglePause();
        return;
      }

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
        const charType = btn.getAttribute('data-char');
        if (this.isUnlocked(charType)) {
          this.domCharButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.selectedCharacter = charType;
        } else {
          // Attempt to purchase!
          const cost = VEHICLES_CONFIG[charType].cost;
          if (this.wallet >= cost) {
            this.wallet -= cost;
            localStorage.setItem('runmill_coins', this.wallet);
            localStorage.setItem(`runmill_unlocked_${charType}`, 'true');
            audio.playCollect(); // purchase success chime
            this.updateWalletDisplay();
            this.updateVehicleButtons();
            
            // Select the purchased vehicle
            this.domCharButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            this.selectedCharacter = charType;
          } else {
            // Failed purchase: play hit sound and shake button
            btn.classList.add('shake-lock');
            audio.playHit();
            setTimeout(() => {
              btn.classList.remove('shake-lock');
            }, 400);
          }
        }
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
      audio.startMusic('menu');
      this.fetchLeaderboard();
      this.updateWalletDisplay();
      this.updateVehicleButtons();
    });
    this.btnSubmitScore.addEventListener('click', () => this.submitHighScore());

    // Victory Screen event listeners
     this.btnVicRestart.addEventListener('click', () => {
      this.domVictoryScreen.classList.add('hidden');
      this.domStartScreen.classList.remove('hidden');
      this.state = 'START';
      audio.startMusic('menu');
      this.fetchLeaderboard();
      this.updateWalletDisplay();
      this.updateVehicleButtons();
    });
    this.btnVicSubmitScore.addEventListener('click', () => this.submitVicHighScore());

    // Pause Screen Listeners
    if (this.btnResume) {
      this.btnResume.addEventListener('click', () => this.togglePause());
    }
    if (this.btnPauseExit) {
      this.btnPauseExit.addEventListener('click', () => {
        if (this.domPauseScreen) this.domPauseScreen.classList.add('hidden');
        this.domStartScreen.classList.remove('hidden');
        this.state = 'START';
        audio.startMusic('menu');
        this.fetchLeaderboard();
        this.updateWalletDisplay();
        this.updateVehicleButtons();
        if (this.player) this.scene.remove(this.player);
        if (this.cockpit) this.scene.remove(this.cockpit);
        this.resetCamera();
      });
    }

    // AFK Mode Listeners
    if (this.btnAfk) {
      this.btnAfk.addEventListener('click', () => this.enterAfkMode());
    }
    if (this.btnExitAfk) {
      this.btnExitAfk.addEventListener('click', () => this.exitAfkMode());
    }

    // Audio Control Listeners
    if (this.btnToggleMusic) {
      this.btnToggleMusic.addEventListener('click', () => {
        audio.toggleMusic();
        this.updateAudioSettingsUI();
      });
    }
    if (this.btnToggleSfx) {
      this.btnToggleSfx.addEventListener('click', () => {
        audio.toggleSfx();
        this.updateAudioSettingsUI();
      });
    }
    if (this.sliderVolume) {
      this.sliderVolume.addEventListener('input', (e) => {
        audio.setMasterVolume(parseFloat(e.target.value));
        this.updateAudioSettingsUI();
      });
    }

    // Settings Gear click
    if (this.btnSettings) {
      this.btnSettings.addEventListener('click', () => {
        this.modalSettings.classList.remove('hidden');
      });
    }

    // Settings Back click
    if (this.btnCloseSettings) {
      this.btnCloseSettings.addEventListener('click', () => {
        this.modalSettings.classList.add('hidden');
      });
    }

    // Language selector dropdown change handler
    if (this.selectLang) {
      this.selectLang.addEventListener('change', (e) => {
        const lang = e.target.value;
        this.applyLanguage(lang);
      });
    }

    // Camera toggle button click handler
    if (this.btnCamera) {
      this.btnCamera.addEventListener('click', () => {
        this.cameraView = this.cameraView === 'third' ? 'first' : 'third';
        localStorage.setItem('runmill_camera_view', this.cameraView);
        this.updateCameraBtnUI();
        if (this.player) {
          this.player.visible = (this.cameraView !== 'first');
        }
        if (this.cockpit) {
          this.cockpit.visible = (this.cameraView === 'first');
        }
        // Snap camera immediately on toggle to prevent long lerping transitions
        if (this.cameraView === 'first' && this.player) {
          const config = {
            car: { camX: -0.15, camY: 0.62, camZ: -0.15 },
            monster_truck: { camX: -0.15, camY: 1.15, camZ: 0.05 },
            truck: { camX: -0.15, camY: 0.78, camZ: 0.35 },
            cybertruck: { camX: -0.15, camY: 0.65, camZ: 0.0 },
            hovercraft: { camX: -0.15, camY: 0.52, camZ: -0.05 },
            tank: { camX: -0.15, camY: 0.75, camZ: 0.2 }
          }[this.selectedCharacter] || { camX: -0.15, camY: 0.65, camZ: 0.0 };
          this.camera.position.set(this.player.position.x + config.camX, this.player.position.y + config.camY, this.player.position.z + config.camZ);
        }
      });
    }

    // Font select change handler
    if (this.selectFont) {
      this.selectFont.addEventListener('change', (e) => {
        this.applyFont(e.target.value);
      });
    }

    // Grid color buttons change handler
    if (this.gridColorContainer) {
      this.gridColorContainer.querySelectorAll('.color-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const val = e.currentTarget.getAttribute('data-grid-color');
          this.gridColorContainer.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
          e.currentTarget.classList.add('active');

          if (val === 'default') {
            this.customGridColorOverride = null;
            localStorage.setItem('runmill_grid_color', 'default');
          } else {
            this.customGridColorOverride = parseInt(val, 16);
            localStorage.setItem('runmill_grid_color', val);
          }
          this.applyWorldTheme(this.world || 1);
        });
      });
    }

    // Text color buttons change handler
    if (this.textColorContainer) {
      this.textColorContainer.querySelectorAll('.color-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const val = e.currentTarget.getAttribute('data-text-color');
          this.textColorContainer.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
          e.currentTarget.classList.add('active');
          this.applyTextColor(val);
        });
      });
    }
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
    this.jumpTimeElapsed = 0;
    audio.playJump();
  }

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
    } else if (this.selectedCharacter === 'tank') {
      this.shoot();
    } else if (this.selectedCharacter === 'cybertruck') {
      this.bashTimer = 1.5;          // 1.5s active magnet duration
      this.bashCooldownTimer = 5.5;   // 5.5s total cooldown (4s after active magnet ends)
      audio.playCollect();           // Play collect chime on activation
    } else if (this.selectedCharacter === 'hovercraft') {
      this.bashTimer = 2.0;          // 2.0s active flight duration
      this.bashCooldownTimer = 8.0;   // 8.0s total cooldown (6s after active flight ends)
      audio.playWorldTransition();   // Play futuristic whine sound
    } else if (this.selectedCharacter === 'truck') {
      this.throwTrashBag();
    }
  }

  shoot() {
    this.bashCooldownTimer = 1.5; // 1.5s fire cooldown
    audio.playShoot();

    const shellMesh = createTankShellModel();
    shellMesh.position.set(this.player.position.x, this.player.position.y + 0.65, PLAYER_START_Z - 0.95);
    this.scene.add(shellMesh);

    this.shells.push({
      mesh: shellMesh,
      lane: this.currentLane,
      z: PLAYER_START_Z - 0.95
    });
  }

  /**
   * throwTrashBag - Garbage Truck throws a trashbag in a parabolic arc.
   */
  throwTrashBag() {
    this.bashCooldownTimer = 4.0; // 4.0s total cooldown
    audio.playThrow();

    const bagMesh = createTrashBagModel();
    // Position it at the truck's cab front center, slightly raised
    bagMesh.position.set(this.player.position.x, this.player.position.y + 0.5, PLAYER_START_Z - 1.0);
    this.scene.add(bagMesh);

    this.trashBags.push({
      mesh: bagMesh,
      lane: this.currentLane,
      vy: 6.0,
      vz: -28.0,
      y: this.player.position.y + 0.5,
      z: PLAYER_START_Z - 1.0
    });
  }

  /**
   * startGame - Resets variables and turns on active running states.
   */
  startGame() {
    // Activates Web Audio Context (mandatory on click event)
    audio.init();
    
    // Acquire focus on window for immediate keyboard controls responsiveness
    window.focus();

    if (this.btnCamera) {
      this.btnCamera.classList.remove('hidden');
      this.updateCameraBtnUI();
    }

    // Reset game counters
    this.score = 0;
    this.distance = 0;
    this.speed = 18;
    this.world = 1;
    this.worldTime = 0;
    this.applyWorldTheme(1);
    if (this.domWorld) this.domWorld.textContent = '1';
    if (this.domTimer) this.domTimer.textContent = '01:00';
    const dict = this.currentLanguageDict || TRANSLATIONS.en;
    if (this.domTimerLabel) this.domTimerLabel.textContent = dict.next_world;
    let startLives = VEHICLES_CONFIG[this.selectedCharacter] ? VEHICLES_CONFIG[this.selectedCharacter].maxLives : 3;
    this.lives = startLives;
    this.maxLives = startLives;
    this.coinsCollected = 0;
    if (this.domCoins) this.domCoins.textContent = '0';
    this.isInvincible = false;
    this.currentLane = 1;
    this.targetX = 0;
    this.playerY = 0;
    this.playerVelocityY = 0;
    this.isJumping = false;
    this.jumpTimeElapsed = 0;
    this.multiplier = 1;
    this.multiplierTimer = 0;

    // Flush hazards from scene
    this.clearObstaclesAndPoints();

    // Spawn player mesh
    if (this.player) this.scene.remove(this.player);
    this.player = createVehicleModel(this.selectedCharacter, this.selectedColor);
    this.player.position.set(0, 0, PLAYER_START_Z);
    this.player.visible = (this.cameraView !== 'first');
    this.scene.add(this.player);

    // Spawn cockpit mesh
    if (this.cockpit) this.scene.remove(this.cockpit);
    this.cockpit = createCockpitModel(this.selectedCharacter, this.selectedColor);
    this.cockpit.position.set(0, 0, PLAYER_START_Z);
    this.cockpit.visible = (this.cameraView === 'first');
    this.scene.add(this.cockpit);

    // Snap camera immediately to prevent start menu transition slides
    if (this.cameraView === 'first') {
      const config = {
        car: { camX: -0.15, camY: 0.62, camZ: -0.15 },
        monster_truck: { camX: -0.15, camY: 1.15, camZ: 0.05 },
        truck: { camX: -0.15, camY: 0.78, camZ: 0.35 },
        cybertruck: { camX: -0.15, camY: 0.65, camZ: 0.0 },
        hovercraft: { camX: -0.15, camY: 0.52, camZ: -0.05 },
        tank: { camX: -0.15, camY: 0.75, camZ: 0.2 }
      }[this.selectedCharacter] || { camX: -0.15, camY: 0.65, camZ: 0.0 };
      this.camera.position.set(config.camX, config.camY, PLAYER_START_Z + config.camZ);
      this.camera.lookAt(config.camX, config.camY - 0.08, PLAYER_START_Z + config.camZ - 15.0);
    } else {
      this.resetCamera();
    }

    // Sync HUD DOM elements
    this.updateHudLives();
    this.domScore.textContent = '00000';
    this.domDistance.textContent = '0';
    this.domSpeed.textContent = '0';
    this.domMultiplierContainer.classList.add('hidden');

    // Reset BASH state
    this.bashTimer = 0;
    this.bashCooldownTimer = 0;
    this.currentHoverHeight = 0.35;

    // Toggle BASH/SPIN/FIRE/MAGNET/HOVER/TRASH UI indicators based on character selection
    const hudLabel = document.querySelector('#hud-bash-container .label');
    if (this.selectedCharacter === 'monster_truck') {
      this.domBashContainer.classList.remove('hidden');
      this.domBashContainer.classList.remove('cooldown');
      if (hudLabel) hudLabel.textContent = dict.bash;
      this.domBash.textContent = dict.ready;
      this.btnTouchBash.classList.remove('hidden');
      this.btnTouchBash.classList.remove('cooldown');
      this.btnTouchBash.textContent = dict.bash;
    } else if (this.selectedCharacter === 'car') {
      this.domBashContainer.classList.remove('hidden');
      this.domBashContainer.classList.remove('cooldown');
      if (hudLabel) hudLabel.textContent = dict.spin;
      this.domBash.textContent = dict.ready;
      this.btnTouchBash.classList.remove('hidden');
      this.btnTouchBash.classList.remove('cooldown');
      this.btnTouchBash.textContent = dict.spin;
    } else if (this.selectedCharacter === 'tank') {
      this.domBashContainer.classList.remove('hidden');
      this.domBashContainer.classList.remove('cooldown');
      if (hudLabel) hudLabel.textContent = dict.fire;
      this.domBash.textContent = dict.ready;
      this.btnTouchBash.classList.remove('hidden');
      this.btnTouchBash.classList.remove('cooldown');
      this.btnTouchBash.textContent = dict.fire;
    } else if (this.selectedCharacter === 'cybertruck') {
      this.domBashContainer.classList.remove('hidden');
      this.domBashContainer.classList.remove('cooldown');
      if (hudLabel) hudLabel.textContent = dict.magnet;
      this.domBash.textContent = dict.ready;
      this.btnTouchBash.classList.remove('hidden');
      this.btnTouchBash.classList.remove('cooldown');
      this.btnTouchBash.textContent = dict.magnet;
    } else if (this.selectedCharacter === 'hovercraft') {
      this.domBashContainer.classList.remove('hidden');
      this.domBashContainer.classList.remove('cooldown');
      if (hudLabel) hudLabel.textContent = dict.hover;
      this.domBash.textContent = dict.ready;
      this.btnTouchBash.classList.remove('hidden');
      this.btnTouchBash.classList.remove('cooldown');
      this.btnTouchBash.textContent = dict.hover;
    } else if (this.selectedCharacter === 'truck') {
      this.domBashContainer.classList.remove('hidden');
      this.domBashContainer.classList.remove('cooldown');
      if (hudLabel) hudLabel.textContent = dict.trash;
      this.domBash.textContent = dict.ready;
      this.btnTouchBash.classList.remove('hidden');
      this.btnTouchBash.classList.remove('cooldown');
      this.btnTouchBash.textContent = dict.trash;
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

  /**
   * togglePause - Toggles between PLAYING and PAUSED states.
   */
  togglePause() {
    if (this.state === 'PLAYING') {
      this.state = 'PAUSED';
      audio.playCollect();
      if (audio.musicGain) {
        this.originalMusicGain = audio.musicGain.gain.value;
        audio.musicGain.gain.setValueAtTime(this.originalMusicGain * 0.15, audio.ctx.currentTime);
      }
      if (this.domPauseScreen) {
        this.domPauseScreen.classList.remove('hidden');
      }
    } else if (this.state === 'PAUSED') {
      this.state = 'PLAYING';
      audio.playCollect();
      if (audio.musicGain) {
        audio.musicGain.gain.setValueAtTime(this.originalMusicGain !== undefined ? this.originalMusicGain : 0.3, audio.ctx.currentTime);
      }
      if (this.domPauseScreen) {
        this.domPauseScreen.classList.add('hidden');
      }
    }
  }

  clearObstaclesAndPoints() {
    this.obstacles.forEach(o => this.scene.remove(o));
    this.points.forEach(p => this.scene.remove(p));
    if (this.particles) {
      this.particles.forEach(p => this.scene.remove(p.mesh));
    }
    if (this.shells) {
      this.shells.forEach(s => this.scene.remove(s.mesh));
    }
    if (this.trashBags) {
      this.trashBags.forEach(tb => this.scene.remove(tb.mesh));
    }
    this.obstacles = [];
    this.points = [];
    this.particles = [];
    this.shells = [];
    this.trashBags = [];
  }

  /**
   * gameOver - Stops music and opens ending overlays.
   */
  gameOver() {
    this.state = 'GAMEOVER';
    audio.playGameOver();

    if (this.cockpit) this.cockpit.visible = false;
    this.resetCamera();

    if (this.btnCamera) this.btnCamera.classList.add('hidden');
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
    this.domLives.innerHTML = '';
    for (let i = 0; i < this.maxLives; i++) {
      const heart = document.createElement('div');
      heart.className = 'heart';
      if (i < this.lives) {
        heart.classList.add('active');
      }
      this.domLives.appendChild(heart);
    }
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
      const dict = this.currentLanguageDict || TRANSLATIONS.en;
      this.btnSubmitScore.textContent = dict.saving;
      
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
      const dict = this.currentLanguageDict || TRANSLATIONS.en;
      this.btnSubmitScore.textContent = dict.upload;
    }
  }

  /**
   * triggerWorldTransitionUI - Displays the transition banner overlay and sets dynamic values.
   */
  triggerWorldTransitionUI() {
    const theme = WORLD_THEMES[this.world];
    if (!theme) return;

    const transitionEl = document.getElementById('world-transition');
    const titleEl = transitionEl.querySelector('.transition-title');
    const subtitleEl = transitionEl.querySelector('.transition-subtitle');
    
    const dict = this.currentLanguageDict || TRANSLATIONS.en;
    titleEl.textContent = `${dict.world} ${this.world}`;
    const colorHexStr = `#${theme.gridColor.toString(16).padStart(6, '0')}`;
    const subColorHexStr = `#${theme.dirColor.toString(16).padStart(6, '0')}`;

    titleEl.style.color = colorHexStr;
    titleEl.style.textShadow = `0 0 10px ${colorHexStr}, 0 0 30px ${colorHexStr}`;
    
    subtitleEl.textContent = theme.name;
    subtitleEl.style.color = subColorHexStr;
    subtitleEl.style.textShadow = `0 0 10px ${subColorHexStr}`;
    
    transitionEl.classList.remove('hidden');
    
    setTimeout(() => {
      if (this.state === 'PLAYING') {
        transitionEl.classList.add('hidden');
      }
    }, 2500);
  }

  /**
   * applyWorldTheme - Changes scene lighting, grids, mountains, and sun colors dynamically.
   */
  applyWorldTheme(worldNum) {
    const theme = WORLD_THEMES[worldNum];
    if (!theme) return;

    if (this.domWorld) {
      this.domWorld.textContent = worldNum.toString();
    }

    this.scene.background.setHex(theme.bgColor);
    if (this.scene.fog) {
      this.scene.fog.color.setHex(theme.bgColor);
    }

    if (this.ambientLight) {
      this.ambientLight.color.setHex(theme.ambientColor);
      this.ambientLight.intensity = theme.ambientIntensity;
    }
    if (this.dirLight) {
      this.dirLight.color.setHex(theme.dirColor);
      this.dirLight.intensity = theme.dirIntensity;
    }
    if (this.frontLight) {
      this.frontLight.color.setHex(theme.frontColor);
      this.frontLight.intensity = theme.frontIntensity;
    }

    if (this.roadGrid1 && this.roadGrid2) {
      const z1 = this.roadGrid1.position.z;
      const z2 = this.roadGrid2.position.z;
      this.scene.remove(this.roadGrid1);
      this.scene.remove(this.roadGrid2);

      const size = 100;
      const divisions = 50;
      let col = theme.gridColor;
      if (this.customGridColorOverride !== undefined && this.customGridColorOverride !== null) {
        col = this.customGridColorOverride;
      }

      this.roadGrid1 = new THREE.GridHelper(size, divisions, col, col);
      this.roadGrid1.position.set(0, 0, z1);
      this.scene.add(this.roadGrid1);

      this.roadGrid2 = new THREE.GridHelper(size, divisions, col, col);
      this.roadGrid2.position.set(0, 0, z2);
      this.scene.add(this.roadGrid2);
    }

    this.scenery.forEach(cone => {
      if (cone && cone.material) {
        cone.material.color.setHex(theme.mountainColor);
        cone.material.emissive.setHex(theme.mountainColor);
      }
    });

    if (this.sun) {
      const stripeCount = this.sun.children.length;
      this.sun.children.forEach((segment, i) => {
        if (segment && segment.material) {
          const mixRatio = i / stripeCount;
          const color = new THREE.Color().lerpColors(
            new THREE.Color(theme.sunColors[0]),
            new THREE.Color(theme.sunColors[1]),
            mixRatio
          );
          segment.material.color.copy(color);
        }
      });
    }
  }

  /**
   * victory - Celebrates 5-world completion victory ending.
   */
  victory() {
    this.state = 'VICTORY';
    audio.playVictory();

    if (this.cockpit) this.cockpit.visible = false;
    this.resetCamera();

    if (this.btnCamera) this.btnCamera.classList.add('hidden');
    this.domHud.classList.add('hidden');
    document.getElementById('touch-controls').classList.add('hidden');
    document.getElementById('world-transition').classList.add('hidden');

    this.domVicFinalScore.textContent = Math.floor(this.score);
    this.domVicFinalDistance.textContent = Math.floor(this.distance);

    this.domVicHighScoreForm.classList.remove('hidden');
    this.domVicPlayerName.value = '';

    this.domVictoryScreen.classList.remove('hidden');
  }

  /**
   * submitVicHighScore - Posts initials and score to scores API from Victory screen.
   */
  async submitVicHighScore() {
    const nameInput = this.domVicPlayerName.value.trim().toUpperCase();
    if (!nameInput) return;

    try {
      this.btnVicSubmitScore.disabled = true;
      const dict = this.currentLanguageDict || TRANSLATIONS.en;
      this.btnVicSubmitScore.textContent = dict.saving;
      
      await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: nameInput, score: Math.floor(this.score) })
      });
      
      this.domVicHighScoreForm.classList.add('hidden');
      this.domVictoryScreen.classList.add('hidden');
      this.domStartScreen.classList.remove('hidden');
      this.state = 'START';
      this.fetchLeaderboard(); // Refresh scores list
    } catch (e) {
      console.error(e);
    } finally {
      this.btnVicSubmitScore.disabled = false;
      const dict = this.currentLanguageDict || TRANSLATIONS.en;
      this.btnVicSubmitScore.textContent = dict.upload;
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
      // Spawn floppy disk point pickup or health recovery heart
      const isHeart = Math.random() < 0.15; // 15% chance to spawn a heart instead of a floppy disk
      if (isHeart) {
        const heart = createHeartItemModel();
        heart.position.set(laneX, 0.45, SPAWN_START_Z);
        heart.userData = {
          type: 'heart',
          isKnockedOut: false
        };
        this.scene.add(heart);
        this.points.push(heart);
      } else {
        const coinRand = Math.random();
        let coinType = 'green';
        let coinVal = 1;
        if (coinRand < 0.06) {
          coinType = 'black';
          coinVal = 20;
        } else if (coinRand < 0.3) {
          coinType = 'yellow';
          coinVal = 4;
        } else {
          coinType = 'green';
          coinVal = 1;
        }

        const coin = createCoinModel(coinType);
        coin.position.set(laneX, 0.4, SPAWN_START_Z);
        coin.userData = {
          type: 'coin',
          coinType: coinType,
          coinValue: coinVal,
          isKnockedOut: false
        };
        this.scene.add(coin);
        this.points.push(coin);
      }
    } else {
      // Spawn standard obstacle block (include shield)
      const types = ['cassette', 'tv', 'spike', 'shield'];
      const chosenType = types[Math.floor(Math.random() * types.length)];
      const obs = createObstacleModel(chosenType);
      obs.userData = { 
        type: chosenType, 
        isKnockedOut: false 
      };
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
    } else if (this.state === 'AFK') {
      this.updateAfk(dt);
      this.updateMenu(dt);
    } else {
      this.updateMenu(dt);
    }

    // Update Cockpit mesh position/rotation and interactive dashboard gauges
    if (this.cockpit) {
      if (this.player) {
        this.cockpit.position.copy(this.player.position);
        this.cockpit.rotation.copy(this.player.rotation);
      }
      
      // Update interactive steering wheel / sticks
      const deltaX = this.targetX - (this.player ? this.player.position.x : 0);
      
      const wheel = this.cockpit.getObjectByName("steeringWheel");
      if (wheel) {
        wheel.rotation.z = THREE.MathUtils.lerp(wheel.rotation.z, -deltaX * 1.5, 1 - Math.exp(-15 * dt));
      }
      
      const leftLever = this.cockpit.getObjectByName("leftLever");
      const rightLever = this.cockpit.getObjectByName("rightLever");
      if (leftLever && rightLever) {
        let targetLeverX = 0;
        if (deltaX > 0.05) targetLeverX = -0.3;
        else if (deltaX < -0.05) targetLeverX = 0.3;
        leftLever.rotation.x = THREE.MathUtils.lerp(leftLever.rotation.x, targetLeverX, 1 - Math.exp(-15 * dt));
        rightLever.rotation.x = THREE.MathUtils.lerp(rightLever.rotation.x, -targetLeverX, 1 - Math.exp(-15 * dt));
      }

      // Dynamic Speed HUD lights
      const speedPct = Math.min(this.speed / 30.0, 1.0);
      const speedLedsCount = Math.floor(speedPct * 5);
      for (let i = 0; i < 5; i++) {
        const led = this.cockpit.getObjectByName(`speedLED_${i}`);
        if (led) led.visible = (i <= speedLedsCount);
      }

      // HP Hearts HUD lights
      for (let i = 0; i < 4; i++) {
        const hpLed = this.cockpit.getObjectByName(`hpLED_${i}`);
        if (hpLed) hpLed.visible = (i < this.lives);
      }

      // Special Ability Status button indicator light
      const specLed = this.cockpit.getObjectByName("specialIndicatorBtn");
      if (specLed) specLed.visible = (this.bashCooldownTimer <= 0);
    }

    let camX, camY, camZ;
    let lookTargetX, lookTargetY, lookTargetZ;

    if (this.cameraView === 'first') {
      const config = {
        car: { camX: -0.15, camY: 0.62, camZ: -0.15 },
        monster_truck: { camX: -0.15, camY: 1.15, camZ: 0.05 },
        truck: { camX: -0.15, camY: 0.78, camZ: 0.35 },
        cybertruck: { camX: -0.15, camY: 0.65, camZ: 0.0 },
        hovercraft: { camX: -0.15, camY: 0.52, camZ: -0.05 },
        tank: { camX: -0.15, camY: 0.75, camZ: 0.2 }
      }[this.selectedCharacter] || { camX: -0.15, camY: 0.65, camZ: 0.0 };

      const targetCamX = (this.player ? this.player.position.x : 0) + config.camX;
      const targetCamY = (this.player ? this.player.position.y : 0) + config.camY;
      const targetCamZ = (this.player ? this.player.position.z : PLAYER_START_Z) + config.camZ;

      // Lock Y and Z to the vehicle coordinates to prevent clipping and dashboard occlusion.
      // Lerp and clamp X coordinate relative to the player to simulate G-force steering drift safely.
      const playerX = this.player ? this.player.position.x : 0;
      const currentLocalX = this.camera.position.x - playerX;
      const nextLocalX = THREE.MathUtils.lerp(currentLocalX, config.camX, 1 - Math.exp(-6 * dt));
      const clampedLocalX = THREE.MathUtils.clamp(nextLocalX, -0.45, 0.15);

      camX = playerX + clampedLocalX;
      camY = targetCamY;
      camZ = targetCamZ;
      
      if (this.cameraShakeTimer > 0) {
        this.cameraShakeTimer -= dt;
        const shakeAmt = 0.15;
        camX += (Math.random() - 0.5) * shakeAmt;
        camY += (Math.random() - 0.5) * shakeAmt;
      }
      
      lookTargetX = camX;
      lookTargetY = camY - 0.08;
      lookTargetZ = camZ - 15.0;
    } else {
      // Third Person (Default)
      let targetCamX = 0;
      if (this.state === 'PLAYING' && this.player) {
        targetCamX = this.player.position.x * 0.45;
      }
      const currentCamX = THREE.MathUtils.lerp(this.camera.position.x, targetCamX, 1 - Math.exp(-5 * dt));
      
      camX = currentCamX;
      camY = 3.2;
      camZ = PLAYER_START_Z + 4.5;
      
      if (this.cameraShakeTimer > 0) {
        this.cameraShakeTimer -= dt;
        const shakeAmt = 0.15;
        camX += (Math.random() - 0.5) * shakeAmt;
        camY += (Math.random() - 0.5) * shakeAmt;
      }
      
      lookTargetX = targetCamX * 0.5;
      lookTargetY = 1.2;
      lookTargetZ = PLAYER_START_Z - 5;
    }

    this.camera.position.set(camX, camY, camZ);
    this.camera.lookAt(lookTargetX, lookTargetY, lookTargetZ);

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

    // World time progression (W minutes for World W)
    this.worldTime += dt;
    const maxTime = this.world * 60; // 60s for World 1, 120s for World 2, etc.
    const timeLeft = Math.max(0, maxTime - this.worldTime);

    // Format countdown timer (MM:SS)
    if (this.domTimer) {
      const mins = Math.floor(timeLeft / 60);
      const secs = Math.floor(timeLeft % 60);
      this.domTimer.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    // Toggle timer label on World 5
    if (this.domTimerLabel) {
      const dict = this.currentLanguageDict || TRANSLATIONS.en;
      this.domTimerLabel.textContent = this.world === 5 ? dict.victory_in : dict.next_world;
    }

    if (this.worldTime >= maxTime) {
      if (this.world < 5) {
        this.world++;
        this.worldTime = 0; // reset elapsed time for the new world
        audio.playWorldTransition();
        this.triggerWorldTransitionUI();
        this.applyWorldTheme(this.world);
      } else {
        // Win game when finishing World 5
        this.victory();
      }
    }

    // Sync HUD numbers
    this.domScore.textContent = Math.floor(this.score).toString().padStart(5, '0');
    this.domDistance.textContent = Math.floor(this.distance);
    this.domSpeed.textContent = Math.floor(this.speed * 4); // Virtual MPH

    // Update BASH/SPIN/FIRE/MAGNET/HOVER/TRASH cooldowns and HUD
    if (this.selectedCharacter === 'monster_truck' || this.selectedCharacter === 'car' || this.selectedCharacter === 'tank' || this.selectedCharacter === 'cybertruck' || this.selectedCharacter === 'hovercraft' || this.selectedCharacter === 'truck') {
      if (this.bashCooldownTimer > 0) {
        this.bashCooldownTimer -= dt;
        if (this.bashCooldownTimer < 0) this.bashCooldownTimer = 0;
      }
      
      if (this.bashTimer > 0) {
        this.bashTimer -= dt;
        if (this.bashTimer < 0) this.bashTimer = 0;
      }

      const dict = this.currentLanguageDict || TRANSLATIONS.en;
      const activeText = this.selectedCharacter === 'car' ? dict.spinning : (this.selectedCharacter === 'monster_truck' ? dict.bashing : (this.selectedCharacter === 'cybertruck' ? dict.active : (this.selectedCharacter === 'hovercraft' ? dict.hovering : dict.ready)));

      // Sync BASH/SPIN/FIRE/MAGNET/HOVER UI
      if (this.bashTimer > 0) {
        this.domBash.textContent = activeText;
        this.domBashContainer.classList.add('cooldown');
        this.btnTouchBash.classList.add('cooldown');
      } else if (this.bashCooldownTimer > 0) {
        this.domBash.textContent = this.bashCooldownTimer.toFixed(1) + 's';
        this.domBashContainer.classList.add('cooldown');
        this.btnTouchBash.classList.add('cooldown');
      } else {
        this.domBash.textContent = dict.ready;
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
    const prevX = this.player.position.x;
    this.player.position.x = THREE.MathUtils.lerp(this.player.position.x, this.targetX, 1 - Math.exp(-15 * dt));
    const deltaX = this.player.position.x - prevX;
    
    // Calculate lateral velocity (units per second)
    const driftSpeed = deltaX / (dt || 0.016);

    // Initialize drift values if undefined
    if (this.driftYaw === undefined) this.driftYaw = 0;
    if (this.driftRoll === undefined) this.driftRoll = 0;

    let targetYaw = 0;
    let targetRoll = 0;

    // Define vehicle-specific drift characteristics (body rolls & steering angles)
    if (this.selectedCharacter === 'hovercraft') {
      // Hovercraft leans heavily INTO the turn (like a motorcycle/jet ski)
      targetYaw = -driftSpeed * 0.045;
      targetRoll = driftSpeed * 0.035;
    } else if (this.selectedCharacter === 'monster_truck' || this.selectedCharacter === 'truck') {
      // Large trucks lean heavily AWAY from the turn (simulating high-center-of-gravity body roll)
      targetYaw = -driftSpeed * 0.02;
      targetRoll = -driftSpeed * 0.045;
    } else if (this.selectedCharacter === 'car' || this.selectedCharacter === 'cybertruck') {
      // Sports cars slide/drift with moderate weight-transfer roll away from turn
      targetYaw = -driftSpeed * 0.035;
      targetRoll = -driftSpeed * 0.02;
    } else if (this.selectedCharacter === 'tank') {
      // Tanks stay extremely flat and steer slowly
      targetYaw = -driftSpeed * 0.015;
      targetRoll = 0;
    } else {
      targetYaw = -driftSpeed * 0.03;
      targetRoll = -driftSpeed * 0.02;
    }

    // Clamp values to prevent excessive rotations (yaw max ~23 deg, roll max ~14 deg)
    targetYaw = Math.max(-0.4, Math.min(0.4, targetYaw));
    targetRoll = Math.max(-0.25, Math.min(0.25, targetRoll));

    // Smoothly lerp towards target drift angles to prevent jitter
    this.driftYaw = THREE.MathUtils.lerp(this.driftYaw, targetYaw, 1 - Math.exp(-12 * dt));
    this.driftRoll = THREE.MathUtils.lerp(this.driftRoll, targetRoll, 1 - Math.exp(-12 * dt));

    // Spawn drift visual effects (tire smoke or thruster sparks) if moving laterally fast on the ground
    if (!this.isJumping && Math.abs(driftSpeed) > 1.5) {
      if (Math.random() < 0.35) {
        const pX = this.player.position.x;
        const pY = this.player.position.y;
        const pZ = this.player.position.z;

        if (this.selectedCharacter === 'hovercraft') {
          // Hovercraft thruster dust: spawn glowing cyan/ice blue sparks from left/right exhaust ports
          this.spawnDriftSmoke(pX - 0.3, pY + 0.1, pZ + 0.5, 0x80f7ff, 0.5);
          this.spawnDriftSmoke(pX + 0.3, pY + 0.1, pZ + 0.5, 0x80f7ff, 0.5);
        } else if (this.selectedCharacter === 'tank') {
          // Tank exhaust: spawn thick dark smoke puffs
          this.spawnDriftSmoke(pX, pY + 0.3, pZ + 0.6, 0x444444, 0.6);
        } else {
          // Cars & trucks: spawn tire smoke from left and right rear wheel contact points
          this.spawnDriftSmoke(pX - 0.4, pY, pZ + 0.5, 0xdddddd, 0.6);
          this.spawnDriftSmoke(pX + 0.4, pY, pZ + 0.5, 0xdddddd, 0.6);
        }
      }
    }

    // Surge player Z position forward if bashing
    if (this.selectedCharacter === 'monster_truck' && this.bashTimer > 0) {
      const bashProgress = this.bashTimer / 0.4; // goes from 1.0 down to 0.0
      // Parabolic surge forward
      const zOffset = -Math.sin(bashProgress * Math.PI) * 1.5;
      this.player.position.z = PLAYER_START_Z + zOffset;

      // Nose-dive tilt down during surge (peaks at center of bash, positive tilt when facing -Z)
      const tiltAngle = Math.sin(bashProgress * Math.PI) * 0.18;
      this.player.rotation.x = tiltAngle;
      this.player.rotation.y = Math.PI; // Maintain facing away
      this.player.rotation.z = 0; // Reset roll during bash
    } else if (this.selectedCharacter === 'car' && this.bashTimer > 0) {
      const spinProgress = this.bashTimer / 0.5; // goes from 1.0 down to 0.0
      // Rotate 720 degrees (2 full spins) during the spin duration, starting and ending facing away (Math.PI)
      this.player.rotation.y = Math.PI + spinProgress * Math.PI * 4;
      this.player.position.z = PLAYER_START_Z;
      this.player.rotation.x = 0;
      this.player.rotation.z = 0; // Reset roll during spin
    } else {
      this.player.position.z = PLAYER_START_Z;
      this.player.rotation.x = 0;
      this.player.rotation.y = Math.PI + this.driftYaw; // Apply drift steering rotation
      this.player.rotation.z = this.driftRoll;           // Apply drift body roll/tilt
    }

    // 7. Gravity physics calculation
    if (this.isJumping) {
      this.jumpTimeElapsed += dt;
      this.playerVelocityY += this.gravity * dt;
      this.playerY += this.playerVelocityY * dt;

      // Ground hit check
      if (this.playerY <= 0) {
        this.playerY = 0;
        this.playerVelocityY = 0;
        this.isJumping = false;
        this.jumpTimeElapsed = 0;
      }
    }
    if (this.selectedCharacter === 'hovercraft') {
      const targetHeight = (this.bashTimer > 0) ? 1.6 : 0.35;
      this.currentHoverHeight = THREE.MathUtils.lerp(this.currentHoverHeight, targetHeight, 1 - Math.exp(-6 * dt));
      const bobbing = Math.sin(time * 6) * 0.12;
      this.player.position.y = this.playerY + this.currentHoverHeight + bobbing;
    } else {
      this.player.position.y = this.playerY;
    }

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
        if (this.isJumping && this.jumpTimeElapsed < 0.2) {
          // During the initial phase of the jump, the spring shoots out to touch the ground
          let totalHeight = this.playerY + vehicleData.springY;
          if (this.selectedCharacter === 'hovercraft') {
            totalHeight += this.currentHoverHeight; // account for dynamic hovering height
          }
          const targetScaleY = totalHeight / 0.6;
          
          spring.scale.y = THREE.MathUtils.lerp(spring.scale.y, targetScaleY, 1 - Math.exp(-25 * dt));
        } else {
          // Retract spring inside the vehicle (scale Y back to 0) in the air/when grounded
          spring.scale.y = THREE.MathUtils.lerp(spring.scale.y, 0, 1 - Math.exp(-15 * dt));
        }
      }
    }

    // 9. Invincibility flash visibility loop
    if (this.isInvincible) {
      this.invincibilityTimer -= dt;
      const isVisibleFlash = Math.floor(time * 20) % 2 === 0;
      
      if (this.cameraView === 'first') {
        if (this.player) this.player.visible = false;
        if (this.cockpit) this.cockpit.visible = isVisibleFlash;
      } else {
        if (this.player) this.player.visible = isVisibleFlash;
        if (this.cockpit) this.cockpit.visible = false;
      }
      
      if (this.invincibilityTimer <= 0) {
        this.isInvincible = false;
        if (this.player) this.player.visible = (this.cameraView !== 'first');
        if (this.cockpit) this.cockpit.visible = (this.cameraView === 'first');
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

    // Update tank shells
    if (this.shells) {
      for (let i = this.shells.length - 1; i >= 0; i--) {
        const shell = this.shells[i];
        shell.mesh.position.z -= 60 * dt;
        
        if (shell.mesh.position.z < SPAWN_START_Z - 20) {
          this.scene.remove(shell.mesh);
          this.shells.splice(i, 1);
          continue;
        }
        
        let hitObstacle = false;
        for (let j = this.obstacles.length - 1; j >= 0; j--) {
          const obs = this.obstacles[j];
          if (obs.userData.isKnockedOut) continue;
          
          const dx = Math.abs(shell.mesh.position.x - obs.position.x);
          const dy = Math.abs(shell.mesh.position.y - (obs.position.y + 0.45));
          const dz = Math.abs(shell.mesh.position.z - obs.position.z);
          
          if (dx < 0.8 && dy < 1.0 && dz < 1.0) {
            this.explodeObstacle(obs);
            this.scene.remove(obs);
            this.obstacles.splice(j, 1);
            hitObstacle = true;
            break;
          }
        }
        
        if (hitObstacle) {
          this.scene.remove(shell.mesh);
          this.shells.splice(i, 1);
        }
      }
    }

    // Update trash bags
    if (this.trashBags) {
      for (let i = this.trashBags.length - 1; i >= 0; i--) {
        const bag = this.trashBags[i];
        
        bag.vy += this.gravity * dt;
        bag.y += bag.vy * dt;
        bag.z += bag.vz * dt;
        
        bag.mesh.position.y = bag.y;
        bag.mesh.position.z = bag.z;
        bag.mesh.rotation.x += 5 * dt;
        bag.mesh.rotation.y += 2 * dt;
        
        if (bag.z < SPAWN_START_Z - 20) {
          this.scene.remove(bag.mesh);
          this.trashBags.splice(i, 1);
          continue;
        }
        
        if (bag.y <= 0) {
          this.explodeTrashBag(bag);
          this.scene.remove(bag.mesh);
          this.trashBags.splice(i, 1);
          continue;
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
      // Do not rotate shields (they should stay flat-aligned to the highway)
      if (obs.userData && obs.userData.type !== 'shield') {
        obs.rotation.y += dt;
      }

      // Check Car Spin Proximity Fling (shield is immune and cannot be flung)
      const isCarSpinning = (this.selectedCharacter === 'car' && this.bashTimer > 0);
      if (isCarSpinning && !obs.userData.isKnockedOut && obs.userData.type !== 'shield') {
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
        if (this.selectedCharacter === 'hovercraft') {
          // Hovercraft glides smoothly over spikes without collision, and over all obstacles when actively hovering
          if (obs.userData.type === 'spike' || this.bashTimer > 0) {
            continue;
          }
        }

        // Monster Truck Bash can knock out items except shields (you must jump or avoid shields)
        if (this.selectedCharacter === 'monster_truck' && this.bashTimer > 0 && obs.userData.type !== 'shield') {
          // Knock out the obstacle!
          obs.userData.isKnockedOut = true;
          
          // Target one of the three highway lanes randomly
          const targetLaneX = LANES[Math.floor(Math.random() * 3)];
          const vy0 = Math.random() * 6 + 14;
          obs.userData.velocityY = vy0;
          
          // Calculate exact velocityX to land on targetLaneX
          const tAir = vy0 / (Math.abs(this.gravity) / 2);
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

      // Cyber Truck & Hovercraft Coin Magnet pull (active ability during bashTimer)
      const isMagnetActive = (this.selectedCharacter === 'cybertruck' && this.bashTimer > 0) || (this.selectedCharacter === 'hovercraft' && this.bashTimer > 0);
      if (isMagnetActive && !point.userData.isKnockedOut) {
        const dx = point.position.x - this.player.position.x;
        const dy = point.position.y - this.player.position.y;
        const dz = point.position.z - PLAYER_START_Z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        const pullRadius = this.selectedCharacter === 'hovercraft' ? 12.0 : 10.0;
        if (dist < pullRadius) { // Pull radius of 12.0 for hovercraft as requested, 10.0 for cybertruck
          point.position.x = THREE.MathUtils.lerp(point.position.x, this.player.position.x, 1 - Math.exp(-10 * dt));
          point.position.y = THREE.MathUtils.lerp(point.position.y, this.player.position.y + 0.4, 1 - Math.exp(-10 * dt));
          point.position.z = THREE.MathUtils.lerp(point.position.z, PLAYER_START_Z, 1 - Math.exp(-10 * dt));
        }
      }

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
        if (point.userData && point.userData.type === 'heart') {
          this.handleHeartCollect();
        } else if (point.userData && point.userData.type === 'coin') {
          this.handleCoinCollect(point);
        } else {
          this.handleCollect();
        }
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
    } else if (type === 'cybertruck') {
      centerY = 0.45;
      toleranceX = defaultToleranceX * 1.1;
      toleranceY = defaultToleranceY * 1.1;
    } else if (type === 'hovercraft') {
      centerY = 0.4;
      toleranceX = defaultToleranceX * 1.1;
      toleranceY = defaultToleranceY * 1.1;
    } else if (type === 'tank') {
      centerY = 0.4;
      toleranceX = defaultToleranceX * 1.2;
      toleranceY = defaultToleranceY * 1.1;
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
   * handleHeartCollect - Handles heart recovery item accumulation.
   */
  handleHeartCollect() {
    audio.playHeartCollect();
    
    // Restore health if not already full
    if (this.lives < this.maxLives) {
      this.lives = Math.min(this.maxLives, this.lives + 1);
      this.updateHudLives();
    }
    
    // Give a flat score reward for collecting it
    this.score += 200 * this.multiplier;
  }

  /**
   * handleCoinCollect - Handles coin item accumulation.
   */
  handleCoinCollect(point) {
    audio.playCollect();
    const val = point.userData.coinValue || 1;
    this.coinsCollected += val;
    this.wallet += val;
    localStorage.setItem('runmill_coins', this.wallet);
    this.updateWalletDisplay();

    // Add to score based on coin value * multiplier
    this.score += 150 * val * this.multiplier;

    // Increment active score multiplier
    this.multiplier = Math.min(4, this.multiplier + 1);
    this.multiplierTimer = 4.0; // Multiplier lasts 4s before resetting

    this.domMultiplier.textContent = `x${this.multiplier}`;
    this.domMultiplierContainer.classList.remove('hidden');

    if (this.domCoins) {
      this.domCoins.textContent = this.coinsCollected;
    }
  }

  /**
   * spawnDriftSmoke - Spawns a custom smoke or exhaust spark particle for drifting.
   */
  spawnDriftSmoke(x, y, z, color = 0xcccccc, opacity = 0.6) {
    const size = Math.random() * 0.12 + 0.08;
    const geom = new THREE.BoxGeometry(size, size, size);
    const mat = new THREE.MeshBasicMaterial({ 
      color: color, 
      transparent: true, 
      opacity: opacity, 
      fog: true 
    });
    const mesh = new THREE.Mesh(geom, mat);
    mesh.position.set(x, y, z);
    this.scene.add(mesh);

    this.particles.push({
      mesh: mesh,
      vx: (Math.random() - 0.5) * 1.5,
      vy: Math.random() * 2 + 1.0, 
      vz: this.speed + (Math.random() - 0.5) * 3,
      life: 0.4,
      maxLife: 0.4
    });
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
      // Shields are immune to blastwave flinging
      if (other === obs || other.userData.isKnockedOut || other.userData.type === 'shield') continue;

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

  explodeTrashBag(bag) {
    const explX = bag.mesh.position.x;
    const explY = 0;
    const explZ = bag.mesh.position.z;

    // Trigger visual/audio feedback
    audio.playTrashExplosion();
    this.cameraShakeTimer = 0.25;

    // Spawn rubbish/trash explosion particles!
    const particleCount = 28;
    const trashColors = [
      0x4caf50, 0x8bc34a, // Toxic green/brown
      0x795548, 0x5d4037, // Rotten brown
      0x9e9e9e, 0xe0e0e0, // Aluminum cans/foil
      0xffffff, 0xf5f5f5, // Crumpled paper
      0xffeb3b, 0xffc107  // Banana peel yellow / orange peel
    ];

    for (let k = 0; k < particleCount; k++) {
      const sizeX = Math.random() * 0.18 + 0.06;
      const sizeY = Math.random() * 0.18 + 0.06;
      const sizeZ = Math.random() * 0.18 + 0.06;
      
      const color = trashColors[Math.floor(Math.random() * trashColors.length)];
      const geom = new THREE.BoxGeometry(sizeX, sizeY, sizeZ);
      const mat = new THREE.MeshStandardMaterial({ 
        color: color, 
        roughness: 0.8,
        flatShading: true 
      });
      const mesh = new THREE.Mesh(geom, mat);
      
      mesh.position.set(
        explX + (Math.random() - 0.5) * 0.6,
        explY + 0.1,
        explZ + (Math.random() - 0.5) * 0.6
      );
      mesh.castShadow = true;
      this.scene.add(mesh);

      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 4;
      this.particles.push({
        mesh: mesh,
        vx: Math.cos(angle) * speed,
        vy: Math.random() * 11 + 6,
        vz: Math.sin(angle) * speed - 5,
        life: 0.8,
        maxLife: 0.8
      });
    }

    // Explode nearby obstacles in a 7.0 unit radius
    const radius = 7.0;
    for (let j = 0; j < this.obstacles.length; j++) {
      const other = this.obstacles[j];
      if (other.userData.isKnockedOut || other.userData.type === 'shield') continue;

      const dx = other.position.x - explX;
      const dz = other.position.z - explZ;
      const dist = Math.sqrt(dx * dx + dz * dz);
      
      if (dist < radius) {
        other.userData.isKnockedOut = true;
        const force = 12 + (radius - dist) * 3;
        
        const targetLaneX = LANES[Math.floor(Math.random() * 3)];
        const vy0 = Math.random() * 5 + 12;
        other.userData.velocityY = vy0;
        
        const tAir = vy0 / 12.5;
        other.userData.velocityX = (targetLaneX - other.position.x) / tAir;
        other.userData.velocityZ = -(force + 8);
        
        other.userData.rotX = (Math.random() - 0.5) * 15;
        other.userData.rotY = (Math.random() - 0.5) * 15;
        other.userData.rotZ = (Math.random() - 0.5) * 15;

        // Add to score for blasting obstacles with garbage!
        this.score += 250 * this.multiplier;
      }
    }
  }
}

// Start GameEngine instance when page completes loading
window.addEventListener('DOMContentLoaded', () => {
  new GameEngine();
});
