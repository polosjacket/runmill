import * as THREE from 'three';

/**
 * createPlayerModel - Procedurally constructs the player's 3D voxel character.
 * 
 * The model has a hierarchical structure:
 * - A base Group container.
 * - A Torso mesh at the center of coordinates.
 * - Head and limbs connected to the Torso using pivot Groups.
 * - Pivots allow rotating the legs and arms around their joint positions (hip/shoulder)
 *   to create a realistic running animation in the game loop.
 * 
 * Colors follow the neon cyber-grid palette (Pink body, Cyan limbs, Yellow visor).
 */
export function createPlayerModel() {
  const group = new THREE.Group();
  
  // Materials configured with flatShading: true to force solid retro flat voxel faces
  // Materials configured with flatShading: true to force solid retro flat voxel faces
  // Added emissive properties and reduced roughness to make them shine like light
  const bodyMat = new THREE.MeshStandardMaterial({ 
    color: 0xff66cc, // Lighter neon pink
    emissive: 0xff66cc, 
    emissiveIntensity: 0.35, 
    roughness: 0.15, 
    metalness: 0.3,
    flatShading: true 
  }); 
  const limbMat = new THREE.MeshStandardMaterial({ 
    color: 0x80f7ff, // Lighter neon cyan
    emissive: 0x80f7ff, 
    emissiveIntensity: 0.35, 
    roughness: 0.15, 
    metalness: 0.3,
    flatShading: true 
  }); 
  const headMat = new THREE.MeshStandardMaterial({ 
    color: 0x1a1a2e, // Lighter helmet casing
    emissive: 0x1a1a2e, 
    emissiveIntensity: 0.15, 
    roughness: 0.1, 
    metalness: 0.8, 
    flatShading: true 
  }); 
  const visorMat = new THREE.MeshStandardMaterial({ 
    color: 0xfffa66, // Lighter neon yellow
    emissive: 0xfffa66, 
    emissiveIntensity: 1.3, 
    flatShading: true 
  });

  // Torso (Main container for child body parts)
  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.0, 0.5), bodyMat);
  torso.position.y = 1.0;
  torso.castShadow = true;
  torso.receiveShadow = true;
  group.add(torso);

  // Head
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 0.6), headMat);
  head.position.set(0, 0.8, 0);
  head.castShadow = true;
  torso.add(head);

  // Helmet Visor (glowing yellow plate)
  const visor = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.15, 0.1), visorMat);
  visor.position.set(0, 0.05, 0.3);
  head.add(visor);

  // Left Leg Pivot (anchored at the hip socket - top of leg)
  const leftLegPivot = new THREE.Group();
  leftLegPivot.position.set(-0.25, -0.5, 0);
  const leftLeg = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.6, 0.25), limbMat);
  leftLeg.position.y = -0.3; // Center offset to place leg underneath the hip joint
  leftLeg.castShadow = true;
  leftLegPivot.add(leftLeg);
  torso.add(leftLegPivot);

  // Right Leg Pivot (anchored at the hip socket)
  const rightLegPivot = new THREE.Group();
  rightLegPivot.position.set(0.25, -0.5, 0);
  const rightLeg = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.6, 0.25), limbMat);
  rightLeg.position.y = -0.3;
  rightLeg.castShadow = true;
  rightLegPivot.add(rightLeg);
  torso.add(rightLegPivot);

  // Left Arm Pivot (anchored at the shoulder socket)
  const leftArmPivot = new THREE.Group();
  leftArmPivot.position.set(-0.5, 0.3, 0);
  const leftArm = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.6, 0.2), limbMat);
  leftArm.position.y = -0.3;
  leftArm.castShadow = true;
  leftArmPivot.add(leftArm);
  torso.add(leftArmPivot);

  // Right Arm Pivot (anchored at the shoulder socket)
  const rightArmPivot = new THREE.Group();
  rightArmPivot.position.set(0.5, 0.3, 0);
  const rightArm = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.6, 0.2), limbMat);
  rightArm.position.y = -0.3;
  rightArm.castShadow = true;
  rightArmPivot.add(rightArm);
  torso.add(rightArmPivot);

  // Expose child part references under userData to animators in the game engine
  group.userData = {
    leftLeg: leftLegPivot,
    rightLeg: rightLegPivot,
    leftArm: leftArmPivot,
    rightArm: rightArmPivot,
    torso: torso
  };

  return group;
}

/**
 * createFloppyDiskModel - Constructs a 3D pixelated floppy disk for score points.
 * 
 * Design details:
 * - A cyan flat square box body.
 * - A white label sticker on the bottom front face.
 * - A grey metallic sliding shutter piece on the top face.
 */
export function createFloppyDiskModel() {
  const group = new THREE.Group();
  
  // Materials with lighter shades and emissive glow to shine like light
  const casingMat = new THREE.MeshStandardMaterial({ 
    color: 0x80f7ff, // Lighter cyan
    emissive: 0x80f7ff, 
    emissiveIntensity: 0.4, 
    roughness: 0.15, 
    flatShading: true 
  }); 
  const labelMat = new THREE.MeshStandardMaterial({ 
    color: 0xffffff, 
    emissive: 0xffffff, 
    emissiveIntensity: 0.25, 
    roughness: 0.15, 
    flatShading: true 
  }); 
  const sliderMat = new THREE.MeshStandardMaterial({ 
    color: 0xaaaaaa, // Lighter metallic shutter
    emissive: 0x333333,
    emissiveIntensity: 0.2,
    metalness: 0.95, 
    roughness: 0.05, 
    flatShading: true 
  });
  
  // Floppy main body
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 0.08), casingMat);
  body.castShadow = true;
  group.add(body);
  
  // Label paper sticker
  const label = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.25, 0.02), labelMat);
  label.position.set(0, -0.12, 0.045);
  body.add(label);
  
  // Sliding metal cover
  const shutter = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.2, 0.09), sliderMat);
  shutter.position.set(-0.1, 0.18, 0);
  body.add(shutter);

  return group;
}

/**
 * createHeartItemModel - Constructs a 3D pixelated heart item for health recovery.
 */
export function createHeartItemModel() {
  const group = new THREE.Group();
  
  // Vibrant neon pink/red material with lighter colors and higher emissive glow to shine like light
  const heartMat = new THREE.MeshStandardMaterial({ 
    color: 0xff4da6, // Lighter pink
    emissive: 0xff4da6, 
    emissiveIntensity: 1.3, 
    roughness: 0.1, 
    flatShading: true 
  });
  
  const vSize = 0.12;
  // 5x5 retro heart coordinates layout
  const voxels = [
    [-1, 2], [1, 2],
    [-2, 1], [-1, 1], [0, 1], [1, 1], [2, 1],
    [-2, 0], [-1, 0], [0, 0], [1, 0], [2, 0],
    [-1, -1], [0, -1], [1, -1],
    [0, -2]
  ];
  
  voxels.forEach(([vx, vy]) => {
    const box = new THREE.Mesh(new THREE.BoxGeometry(vSize, vSize, vSize * 1.5), heartMat);
    box.position.set(vx * vSize, vy * vSize, 0);
    box.castShadow = true;
    group.add(box);
  });
  
  return group;
}


/**
 * createObstacleModel - Procedurally structures obstacle objects based on type.
 * 
 * @param {string} type - 'tv' (CRT TV set), 'cassette' (Cassette Tape), or 'spike' (default pyramid)
 */
export function createObstacleModel(type) {
  const group = new THREE.Group();

  if (type === 'tv') {
    // CRT TV set built of casing, glowing screen, knobs, and antenna wireframes
    // Upgraded to safety neon orange and glowing yellow for maximum visibility
    const boxMat = new THREE.MeshStandardMaterial({ 
      color: 0xff7733, // Lighter orange
      emissive: 0xff7733, 
      emissiveIntensity: 0.45, 
      roughness: 0.15,
      flatShading: true 
    });
    const screenMat = new THREE.MeshStandardMaterial({ 
      color: 0xfffa66, // Lighter yellow
      emissive: 0xfffa66, 
      emissiveIntensity: 1.3, 
      flatShading: true 
    }); // Bright yellow screen glow
    const knobMat = new THREE.MeshStandardMaterial({ color: 0x222222, flatShading: true });
    const antennaMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee, metalness: 0.95, roughness: 0.05, flatShading: true });

    // TV Box Casing
    const tvBody = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.9, 0.9), boxMat);
    tvBody.position.y = 0.45; // offsets so bottom of TV rests on ground (y = 0)
    tvBody.castShadow = true;
    tvBody.receiveShadow = true;
    group.add(tvBody);

    // Glowing static display screen
    const screen = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.65, 0.1), screenMat);
    screen.position.set(-0.1, 0.05, 0.43);
    tvBody.add(screen);

    // Adjustment knobs
    const knob1 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.05), knobMat);
    knob1.position.set(0.45, 0.15, 0.45);
    const knob2 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.05), knobMat);
    knob2.position.set(0.45, -0.05, 0.45);
    tvBody.add(knob1, knob2);

    // V-shaped antennae wires
    const ant1 = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.5, 0.04), antennaMat);
    ant1.position.set(-0.2, 0.6, 0);
    ant1.rotation.z = 0.5;
    tvBody.add(ant1);

    const ant2 = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.5, 0.04), antennaMat);
    ant2.position.set(0.2, 0.6, 0);
    ant2.rotation.z = -0.5;
    tvBody.add(ant2);

  } else if (type === 'cassette') {
    // Retro music cassette tape upgraded to glowing neon yellow and hot pink hubs
    const bodyMat = new THREE.MeshStandardMaterial({ 
      color: 0xfffa66, // Lighter yellow
      emissive: 0xfffa66, 
      emissiveIntensity: 0.4, 
      roughness: 0.15,
      flatShading: true 
    });
    const labelMat = new THREE.MeshStandardMaterial({ color: 0xffffff, flatShading: true });
    const spoolMat = new THREE.MeshStandardMaterial({ 
      color: 0xff66cc, // Lighter pink
      emissive: 0xff66cc, 
      emissiveIntensity: 0.9, 
      flatShading: true 
    }); // Pink hubs

    // Cassette shell casing
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.8, 0.18), bodyMat);
    body.position.y = 0.4;
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);

    // Center record label
    const label = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.5, 0.2), labelMat);
    label.position.set(0, 0.05, 0);
    body.add(label);

    // Left and right spool holes
    const spoolL = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.22), spoolMat);
    spoolL.position.set(-0.28, 0.05, 0);
    const spoolR = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.22), spoolMat);
    spoolR.position.set(0.28, 0.05, 0);
    body.add(spoolL, spoolR);

  } else if (type === 'shield') {
    // Cyber blue energy shield barrier (un-bashable, un-spinnable)
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.85, roughness: 0.15, flatShading: true });
    const shieldMat = new THREE.MeshStandardMaterial({
      color: 0x80f7ff, // Lighter cyan
      emissive: 0x80f7ff,
      emissiveIntensity: 1.3,
      transparent: true,
      opacity: 0.75,
      flatShading: true
    });
    const gridMat = new THREE.MeshStandardMaterial({
      color: 0xff66cc, // Lighter pink
      emissive: 0xff66cc,
      emissiveIntensity: 0.9,
      flatShading: true
    });

    // Base feet
    const base = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.15, 0.4), metalMat);
    base.position.y = 0.075;
    base.castShadow = true;
    base.receiveShadow = true;
    group.add(base);

    // Energy Shield Screen
    const screen = new THREE.Mesh(new THREE.BoxGeometry(1.3, 1.1, 0.08), shieldMat);
    screen.position.y = 0.7;
    screen.castShadow = true;
    group.add(screen);

    // Outer framing struts
    const frameL = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.25, 0.1), metalMat);
    frameL.position.set(-0.65, 0.625, 0);
    const frameR = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.25, 0.1), metalMat);
    frameR.position.set(0.65, 0.625, 0);
    const frameTop = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.1, 0.1), metalMat);
    frameTop.position.set(0, 1.2, 0);
    group.add(frameL, frameR, frameTop);

    // Glowing neon cross bars representing grid
    const barH = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.06, 0.12), gridMat);
    barH.position.set(0, 0.7, 0);
    const barV1 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.0, 0.12), gridMat);
    barV1.position.set(-0.3, 0.7, 0);
    const barV2 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.0, 0.12), gridMat);
    barV2.position.set(0.3, 0.7, 0);
    group.add(barH, barV1, barV2);

  } else {
    // Spikes: Lighter glowing red-pink pyramid that shines like light
    const spikeMat = new THREE.MeshStandardMaterial({ 
      color: 0xff4d6d, // Lighter glowing pinkish red
      emissive: 0xff4d6d, 
      emissiveIntensity: 1.3, 
      roughness: 0.1,
      flatShading: true 
    });
    
    // Cone geometry with 4 radial segments generates a perfectly pixelated pyramid
    const spike = new THREE.Mesh(new THREE.ConeGeometry(0.6, 1.0, 4), spikeMat);
    spike.position.y = 0.5; // align base with ground
    spike.rotation.y = Math.PI / 4; // aligns edges facing flat to camera
    spike.castShadow = true;
    spike.receiveShadow = true;
    group.add(spike);
  }

  return group;
}

/**
 * createSpringModel - Procedurally creates a metal spiral coil spring mesh.
 * 
 * It stacks 5 rectangular loops vertically with offset rotations.
 * The child parts are shifted downwards relative to the group origin (y = 0).
 * Thus, scaling the group on Y (e.g. scale.y = 3) causes it to stretch downwards
 * while remaining anchored at the vehicle chassis at the top.
 */
export function createSpringModel() {
  const springGroup = new THREE.Group();
  
  // Lighter grey metallic material with lower roughness to shine like light
  const metalMat = new THREE.MeshStandardMaterial({ color: 0xbbbbbb, metalness: 0.9, roughness: 0.1, flatShading: true });
  
  const coilCount = 5;
  const coilHeight = 0.15;
  for (let i = 0; i < coilCount; i++) {
    const coilPart = new THREE.Mesh(new THREE.BoxGeometry(0.5, coilHeight, 0.5), metalMat);
    // Rotate each loop slightly to form a spiral pattern
    coilPart.rotation.y = (i * Math.PI) / 4;
    coilPart.position.y = i * coilHeight;
    coilPart.castShadow = true;
    springGroup.add(coilPart);
  }
  
  // Shift all elements so the top coil sits at y = 0
  const topOffset = (coilCount - 1) * coilHeight;
  springGroup.children.forEach(child => {
    child.position.y -= topOffset;
  });
  
  return springGroup;
}

/**
 * createVehicleModel - Procedurally constructs Car, Monster Truck, and Truck voxel models.
 * 
 * @param {string} type - 'car', 'monster_truck', or 'truck'
 * @returns {THREE.Group} - The complete vehicle assembly containing a spring underneath
 */
const colorMap = {
  pink: 0xff66cc,     // Lighter pink
  cyan: 0x80f7ff,     // Lighter cyan
  green: 0x73ff66,    // Lighter green
  yellow: 0xfffa66,   // Lighter yellow
  purple: 0xd666ff    // Lighter purple
};

export function createVehicleModel(type, colorNameOrHex) {
  let bodyColor = null;
  if (colorNameOrHex !== undefined) {
    if (typeof colorNameOrHex === 'string' && colorMap[colorNameOrHex] !== undefined) {
      bodyColor = colorMap[colorNameOrHex];
    } else if (typeof colorNameOrHex === 'number') {
      bodyColor = colorNameOrHex;
    }
  }

  const group = new THREE.Group();
  const wheels = [];

  // Shared wheel/windshield materials - lightened and shinier
  const tireMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.7, flatShading: true }); // Rubber
  const hubMat = new THREE.MeshStandardMaterial({ color: 0xff66cc, emissive: 0xff66cc, emissiveIntensity: 0.4, flatShading: true }); // Pink hubs
  const glassMat = new THREE.MeshStandardMaterial({ color: 0x80f7ff, emissive: 0x80f7ff, emissiveIntensity: 0.6, flatShading: true }); // Windshield cyan glow

  if (type === 'car') {
    // 1. Sleek Retro Sports Car (Lighter body, pink spoiler) with emissive shine
    const bodyMat = new THREE.MeshStandardMaterial({ 
      color: bodyColor !== null ? bodyColor : 0xfffa66, 
      emissive: bodyColor !== null ? bodyColor : 0xfffa66,
      emissiveIntensity: 0.25,
      roughness: 0.15,
      metalness: 0.4,
      flatShading: true 
    });
    const spoilerMat = new THREE.MeshStandardMaterial({ 
      color: 0xff66cc, 
      emissive: 0xff66cc,
      emissiveIntensity: 0.3,
      flatShading: true 
    });

    // Chassis Base
    const chassis = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.25, 1.8), bodyMat);
    chassis.position.y = 0.3;
    chassis.castShadow = true;
    chassis.receiveShadow = true;
    group.add(chassis);

    // Roof/Cabin
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.3, 0.9), bodyMat);
    cabin.position.set(0, 0.25, -0.15);
    cabin.castShadow = true;
    chassis.add(cabin);

    // Windshield glass
    const windshield = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.22, 0.25), glassMat);
    windshield.position.set(0, 0.18, 0.4);
    windshield.rotation.x = -0.5;
    chassis.add(windshield);

    // Spoiler wings
    const spoilerStrutL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.2, 0.08), bodyMat);
    spoilerStrutL.position.set(-0.35, 0.15, -0.8);
    const spoilerStrutR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.2, 0.08), bodyMat);
    spoilerStrutR.position.set(0.35, 0.15, -0.8);
    const spoilerWing = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.06, 0.3), spoilerMat);
    spoilerWing.position.set(0, 0.25, -0.8);
    chassis.add(spoilerStrutL, spoilerStrutR, spoilerWing);

    // 4 Wheels
    const wheelPositions = [
      [-0.5, 0.15, 0.5],   // Front Left
      [0.5, 0.15, 0.5],    // Front Right
      [-0.5, 0.15, -0.5],  // Rear Left
      [0.5, 0.15, -0.5]    // Rear Right
    ];

    wheelPositions.forEach(([x, y, z]) => {
      const wheelGroup = new THREE.Group();
      wheelGroup.position.set(x, y, z);
      
      const tire = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.35, 0.35), tireMat);
      const hub = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.15, 0.15), hubMat);
      
      wheelGroup.add(tire, hub);
      group.add(wheelGroup);
      wheels.push(wheelGroup);
    });

  } else if (type === 'monster_truck') {
    // 2. Monster Truck (Lighter purple body, high pink shock struts, giant cyan wheels)
    const bodyMat = new THREE.MeshStandardMaterial({ 
      color: bodyColor !== null ? bodyColor : 0xd666ff, 
      emissive: bodyColor !== null ? bodyColor : 0xd666ff,
      emissiveIntensity: 0.25,
      roughness: 0.15,
      metalness: 0.4,
      flatShading: true 
    });
    const suspensionMat = new THREE.MeshStandardMaterial({ 
      color: 0xff66cc, 
      emissive: 0xff66cc,
      emissiveIntensity: 0.3,
      flatShading: true 
    });
    const giantHubMat = new THREE.MeshStandardMaterial({ 
      color: 0x80f7ff, 
      emissive: 0x80f7ff,
      emissiveIntensity: 0.4,
      flatShading: true 
    });

    // Elevated body cab
    const chassis = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.6, 1.6), bodyMat);
    chassis.position.y = 0.95; // highly elevated ground clearance
    chassis.castShadow = true;
    chassis.receiveShadow = true;
    group.add(chassis);

    // Windshield
    const windshield = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.3, 0.4), glassMat);
    windshield.position.set(0, 0.4, 0.2);
    chassis.add(windshield);

    // Truck cargo bed rim walls
    const bedWallL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.3, 0.8), bodyMat);
    bedWallL.position.set(-0.46, 0.15, -0.5);
    const bedWallR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.3, 0.8), bodyMat);
    bedWallR.position.set(0.46, 0.15, -0.5);
    const bedWallBack = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.3, 0.08), bodyMat);
    bedWallBack.position.set(0, 0.15, -0.9);
    chassis.add(bedWallL, bedWallR, bedWallBack);

    // 4 High-shock suspension struts
    const shockPositions = [
      [-0.45, 0.5, 0.55],
      [0.45, 0.5, 0.55],
      [-0.45, 0.5, -0.55],
      [0.45, 0.5, -0.55]
    ];
    shockPositions.forEach(([x, y, z]) => {
      const strut = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.6, 0.12), suspensionMat);
      strut.position.set(x, y, z);
      strut.rotation.z = x > 0 ? -0.15 : 0.15;
      group.add(strut);
    });

    // 4 Giant wheels
    const wheelPositions = [
      [-0.6, 0.45, 0.55],
      [0.6, 0.45, 0.55],
      [-0.6, 0.45, -0.55],
      [0.6, 0.45, -0.55]
    ];

    wheelPositions.forEach(([x, y, z]) => {
      const wheelGroup = new THREE.Group();
      wheelGroup.position.set(x, y, z);
      
      const tire = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.8, 0.8), tireMat);
      const hub = new THREE.Mesh(new THREE.BoxGeometry(0.47, 0.35, 0.35), giantHubMat);
      
      wheelGroup.add(tire, hub);
      group.add(wheelGroup);
      wheels.push(wheelGroup);
    });

  } else {
    // 3. Cargo Truck (Lighter Cyan cabin cab, light grey trailer back, 6 wheels)
    const bodyMat = new THREE.MeshStandardMaterial({ 
      color: bodyColor !== null ? bodyColor : 0x80f7ff, 
      emissive: bodyColor !== null ? bodyColor : 0x80f7ff,
      emissiveIntensity: 0.25,
      roughness: 0.15,
      metalness: 0.4,
      flatShading: true 
    });
    const cargoMat = new THREE.MeshStandardMaterial({ 
      color: 0xeeeeee, 
      emissive: 0x333333,
      emissiveIntensity: 0.15,
      roughness: 0.2,
      flatShading: true 
    });

    // Cab
    const cab = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.8, 0.7), bodyMat);
    cab.position.set(0, 0.55, 0.65);
    cab.castShadow = true;
    cab.receiveShadow = true;
    group.add(cab);

    // windshield
    const windshield = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.3, 0.1), glassMat);
    windshield.position.set(0, 0.22, 0.36);
    cab.add(windshield);

    // Large rectangular cargo container
    const trailer = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.9, 1.4), cargoMat);
    trailer.position.set(0, 0.6, -0.35);
    trailer.castShadow = true;
    trailer.receiveShadow = true;
    group.add(trailer);

    // 6 wheels
    const wheelPositions = [
      [-0.5, 0.15, 0.65],  // Front Left
      [0.5, 0.15, 0.65],   // Front Right
      [-0.48, 0.15, -0.2], // Middle Left
      [0.48, 0.15, -0.2],  // Middle Right
      [-0.48, 0.15, -0.7], // Rear Left
      [0.48, 0.15, -0.7]   // Rear Right
    ];

    wheelPositions.forEach(([x, y, z]) => {
      const wheelGroup = new THREE.Group();
      wheelGroup.position.set(x, y, z);
      
      const tire = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.35, 0.35), tireMat);
      const hub = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.15, 0.15), hubMat);
      
      wheelGroup.add(tire, hub);
      group.add(wheelGroup);
      wheels.push(wheelGroup);
    });
  }

  // Generate jumping spring
  const spring = createSpringModel();
  
  // Set default attachment height depending on type
  let springY = 0.3;
  if (type === 'monster_truck') springY = 0.9;
  if (type === 'truck') springY = 0.55;
  
  spring.position.set(0, springY, 0);
  // Initially compressed inside chassis (height scale = 0)
  spring.scale.set(0.8, 0, 0.8);
  group.add(spring);

  // Expose variables for gameplay logic animations
  group.userData = {
    type: type,
    wheels: wheels,
    spring: spring,
    springY: springY
  };

  return group;
}

