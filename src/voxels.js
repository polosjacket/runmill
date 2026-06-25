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
 * addLEDLights - Helper function to attach glowing LED headlights and neon underglow to a vehicle.
 */
function addLEDLights(parentMesh, headlightX, headlightY, headlightZ, underglowY, underglowColor, isCybertruck = false) {
  // Headlight material
  const headlightMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xffffff,
    emissiveIntensity: 2.5,
    flatShading: true
  });

  if (isCybertruck) {
    // Cybertruck single light bar
    const barGeom = new THREE.BoxGeometry(0.8, 0.04, 0.04);
    const lightBar = new THREE.Mesh(barGeom, headlightMat);
    lightBar.position.set(0, headlightY, headlightZ);
    parentMesh.add(lightBar);

    // Light source
    const light = new THREE.PointLight(0xffffff, 3.0, 15);
    light.position.set(0, 0, 0.05);
    lightBar.add(light);
  } else {
    // Two headlights
    const eyeGeom = new THREE.BoxGeometry(0.12, 0.08, 0.08);
    
    const headlightL = new THREE.Mesh(eyeGeom, headlightMat);
    headlightL.position.set(-headlightX, headlightY, headlightZ);
    parentMesh.add(headlightL);

    const lightL = new THREE.PointLight(0xffffff, 2.0, 15);
    lightL.position.set(0, 0, 0.05);
    headlightL.add(lightL);

    const headlightR = new THREE.Mesh(eyeGeom, headlightMat);
    headlightR.position.set(headlightX, headlightY, headlightZ);
    parentMesh.add(headlightR);

    const lightR = new THREE.PointLight(0xffffff, 2.0, 15);
    lightR.position.set(0, 0, 0.05);
    headlightR.add(lightR);
  }

  // Underglow light
  const underglowLight = new THREE.PointLight(underglowColor, 3.5, 8);
  underglowLight.position.set(0, underglowY, 0);
  parentMesh.add(underglowLight);
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

  // Determine underglow color
  const underglowColor = bodyColor !== null ? bodyColor : (
    type === 'car' ? 0xfffa66 :
    type === 'monster_truck' ? 0xd666ff :
    type === 'truck' ? 0x80f7ff :
    type === 'cybertruck' ? 0x73ff66 :
    type === 'hovercraft' ? 0x80f7ff :
    0x73ff66 // tank
  );

  // Shared wheel/windshield materials - lightened and shinier
  const tireMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.7, flatShading: true }); // Rubber
  const hubMat = new THREE.MeshStandardMaterial({ color: 0xff66cc, emissive: 0xff66cc, emissiveIntensity: 1.2, flatShading: true }); // Pink hubs
  const glassMat = new THREE.MeshStandardMaterial({ color: 0x80f7ff, emissive: 0x80f7ff, emissiveIntensity: 1.4, flatShading: true }); // Windshield cyan glow

  if (type === 'car') {
    // 1. Sleek Retro Sports Car (Lighter body, pink spoiler) with emissive shine
    const bodyMat = new THREE.MeshStandardMaterial({ 
      color: bodyColor !== null ? bodyColor : 0xfffa66, 
      emissive: bodyColor !== null ? bodyColor : 0xfffa66,
      emissiveIntensity: 1.2, // LED glow
      roughness: 0.1,
      metalness: 0.5,
      flatShading: true 
    });
    const spoilerMat = new THREE.MeshStandardMaterial({ 
      color: 0xff66cc, 
      emissive: 0xff66cc,
      emissiveIntensity: 1.2, // LED glow
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

    // Add LED headlights and neon underglow
    addLEDLights(chassis, 0.35, 0.2, 0.9, -0.15, underglowColor);

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
      emissiveIntensity: 1.2, // LED glow
      roughness: 0.1,
      metalness: 0.5,
      flatShading: true 
    });
    const suspensionMat = new THREE.MeshStandardMaterial({ 
      color: 0xff66cc, 
      emissive: 0xff66cc,
      emissiveIntensity: 1.2, // LED glow
      flatShading: true 
    });
    const giantHubMat = new THREE.MeshStandardMaterial({ 
      color: 0x80f7ff, 
      emissive: 0x80f7ff,
      emissiveIntensity: 1.2, // LED glow
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

    // Add LED headlights and neon underglow
    addLEDLights(chassis, 0.38, 0.1, 0.8, -0.4, underglowColor);

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

  } else if (type === 'truck') {
    // 3. Garbage Truck (Industrial Green body, dark compactor hopper, yellow/black hazard lines, 6 wheels)
    const bodyMat = new THREE.MeshStandardMaterial({ 
      color: bodyColor !== null ? bodyColor : 0x2e7d32, // Dark Green
      emissive: bodyColor !== null ? bodyColor : 0x1b5e20,
      emissiveIntensity: 1.0, // LED glow
      roughness: 0.1,
      metalness: 0.5,
      flatShading: true 
    });
    const compactorMat = new THREE.MeshStandardMaterial({ 
      color: 0x333333, 
      roughness: 0.5,
      metalness: 0.8,
      flatShading: true 
    });
    const hazardYellowMat = new THREE.MeshStandardMaterial({
      color: 0xffea00,
      emissive: 0xffea00,
      emissiveIntensity: 0.8,
      flatShading: true
    });
    const hazardBlackMat = new THREE.MeshStandardMaterial({
      color: 0x111111,
      flatShading: true
    });

    // Cab
    const cab = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.75, 0.7), bodyMat);
    cab.position.set(0, 0.525, 0.65);
    cab.castShadow = true;
    cab.receiveShadow = true;
    group.add(cab);

    // windshield
    const windshield = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.3, 0.1), glassMat);
    windshield.position.set(0, 0.18, 0.36);
    cab.add(windshield);

    // Compactor container in back
    const compactor = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.95, 1.3), bodyMat);
    compactor.position.set(0, 0.625, -0.3);
    compactor.castShadow = true;
    compactor.receiveShadow = true;
    group.add(compactor);

    // Sloped rear loader hopper at the back
    const rearHopper = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.8, 0.3), compactorMat);
    rearHopper.position.set(0, 0.5, -1.05);
    rearHopper.rotation.x = -0.2;
    rearHopper.castShadow = true;
    group.add(rearHopper);

    // Rear hazard stripes
    const stripe1 = new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.08, 0.03), hazardYellowMat);
    stripe1.position.set(0, 0.75, -0.96);
    const stripe2 = new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.08, 0.03), hazardBlackMat);
    stripe2.position.set(0, 0.65, -0.96);
    const stripe3 = new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.08, 0.03), hazardYellowMat);
    stripe3.position.set(0, 0.55, -0.96);
    group.add(stripe1, stripe2, stripe3);

    // Side grabber arm (automated side-loader mechanism on the right)
    const armBase = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.15, 0.3), compactorMat);
    armBase.position.set(0.48, 0.45, 0.1);
    const armExt = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.08, 0.08), compactorMat);
    armExt.position.set(0.58, 0.45, 0.1);
    const grabberProng = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.15, 0.25), hazardYellowMat);
    grabberProng.position.set(0.7, 0.45, 0.1);
    group.add(armBase, armExt, grabberProng);

    // Add LED headlights and neon underglow
    addLEDLights(cab, 0.35, -0.1, 0.35, -0.3, underglowColor);

    // 6 wheels
    const wheelPositions = [
      [-0.5, 0.15, 0.65],   // Front Left
      [0.5, 0.15, 0.65],    // Front Right
      [-0.48, 0.15, -0.15], // Middle Left
      [0.48, 0.15, -0.15],  // Middle Right
      [-0.48, 0.15, -0.65], // Rear Left
      [0.48, 0.15, -0.65]   // Rear Right
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

  } else if (type === 'cybertruck') {
    // 4. Cyber Truck (Angular wedge shape, metallic silver, green highlights, magnet ability)
    const bodyMat = new THREE.MeshStandardMaterial({ 
      color: bodyColor !== null ? bodyColor : 0xcccccc, 
      emissive: bodyColor !== null ? bodyColor : 0xcccccc,
      emissiveIntensity: 1.0, // Sleek glowing metal
      roughness: 0.05,
      metalness: 0.9,
      flatShading: true 
    });
    const neonGreenMat = new THREE.MeshStandardMaterial({
      color: 0x73ff66,
      emissive: 0x73ff66,
      emissiveIntensity: 1.8, // Super bright green LED stripes
      flatShading: true
    });

    const base = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.3, 1.8), bodyMat);
    base.position.y = 0.35;
    base.castShadow = true;
    base.receiveShadow = true;
    group.add(base);

    const cabin = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.35, 1.3), bodyMat);
    cabin.position.set(0, 0.3, -0.1);
    cabin.castShadow = true;
    base.add(cabin);

    const roof = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.2, 0.7), bodyMat);
    roof.position.set(0, 0.5, -0.2);
    roof.castShadow = true;
    base.add(roof);

    const windshield = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.2, 0.3), glassMat);
    windshield.position.set(0, 0.42, 0.35);
    windshield.rotation.x = -0.7;
    base.add(windshield);

    const sideLightL = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.04, 1.3), neonGreenMat);
    sideLightL.position.set(-0.485, 0.05, -0.15);
    const sideLightR = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.04, 1.3), neonGreenMat);
    sideLightR.position.set(0.485, 0.05, -0.15);
    base.add(sideLightL, sideLightR);

    // Add horizontal LED light bar and neon underglow
    addLEDLights(base, 0, 0.25, 0.9, -0.2, underglowColor, true);

    const wheelPositions = [
      [-0.52, 0.2, 0.5],
      [0.52, 0.2, 0.5],
      [-0.52, 0.2, -0.5],
      [0.52, 0.2, -0.5]
    ];

    wheelPositions.forEach(([x, y, z]) => {
      const wheelGroup = new THREE.Group();
      wheelGroup.position.set(x, y, z);
      
      const tire = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.42, 0.42), tireMat);
      const hub = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.2, 0.2), neonGreenMat);
      
      wheelGroup.add(tire, hub);
      group.add(wheelGroup);
      wheels.push(wheelGroup);
    });

  } else if (type === 'hovercraft') {
    // 5. Hovercraft (No wheels, dual fans, floats/glides, spike immune)
    const bodyMat = new THREE.MeshStandardMaterial({ 
      color: bodyColor !== null ? bodyColor : 0x80f7ff,
      emissive: bodyColor !== null ? bodyColor : 0x80f7ff,
      emissiveIntensity: 1.2, // LED glow
      roughness: 0.1,
      flatShading: true 
    });
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.8, roughness: 0.2, flatShading: true });
    
    const hull = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.28, 1.7), bodyMat);
    hull.position.y = 0.4;
    hull.castShadow = true;
    hull.receiveShadow = true;
    group.add(hull);

    const wingL = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.6), bodyMat);
    wingL.position.set(-0.55, 0.05, -0.4);
    wingL.rotation.y = 0.25;
    const wingR = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.6), bodyMat);
    wingR.position.set(0.55, 0.05, -0.4);
    wingR.rotation.y = -0.25;
    hull.add(wingL, wingR);

    const cabin = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.3, 0.8), bodyMat);
    cabin.position.set(0, 0.28, 0.1);
    cabin.castShadow = true;
    hull.add(cabin);

    const windshield = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.22, 0.3), glassMat);
    windshield.position.set(0, 0.22, 0.4);
    windshield.rotation.x = -0.6;
    hull.add(windshield);

    // Add LED headlights and neon underglow
    addLEDLights(hull, 0.35, 0.0, 0.85, -0.15, underglowColor);

    const thrusterL = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.28, 0.4), metalMat);
    thrusterL.position.set(-0.3, 0.18, -0.85);
    const thrusterR = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.28, 0.4), metalMat);
    thrusterR.position.set(0.3, 0.18, -0.85);
    hull.add(thrusterL, thrusterR);

    const portL = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.04), glassMat);
    portL.position.set(0, 0, -0.21);
    thrusterL.add(portL);
    const portR = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.04), glassMat);
    portR.position.set(0, 0, -0.21);
    thrusterR.add(portR);

    const hoverSkirt = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.12, 1.5), glassMat);
    hoverSkirt.position.set(0, -0.2, 0);
    hull.add(hoverSkirt);

  } else if (type === 'tank') {
    // 6. Tank (Heavy treads, turret, 8 HP, shooting ability)
    const bodyMat = new THREE.MeshStandardMaterial({ 
      color: bodyColor !== null ? bodyColor : 0x00aa33, // Glowing sci-fi green body
      emissive: bodyColor !== null ? bodyColor : 0x00aa33,
      emissiveIntensity: 0.8,
      roughness: 0.2,
      metalness: 0.7,
      flatShading: true 
    });
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.8, roughness: 0.2, flatShading: true });
    const gunMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.9, roughness: 0.1, flatShading: true });
    
    const chassis = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.35, 1.8), bodyMat);
    chassis.position.y = 0.35;
    chassis.castShadow = true;
    chassis.receiveShadow = true;
    group.add(chassis);

    const trackL = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.42, 1.85), metalMat);
    trackL.position.set(-0.55, 0.02, 0);
    trackL.castShadow = true;
    chassis.add(trackL);

    const trackR = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.42, 1.85), metalMat);
    trackR.position.set(0.55, 0.02, 0);
    trackR.castShadow = true;
    chassis.add(trackR);

    const turret = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.32, 0.85), bodyMat);
    turret.position.set(0, 0.32, -0.05);
    turret.castShadow = true;
    chassis.add(turret);

    const barrel = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.85), gunMat);
    barrel.position.set(0, 0.05, 0.7);
    barrel.castShadow = true;
    turret.add(barrel);

    const visorL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.04), hubMat);
    visorL.position.set(-0.35, 0.1, 0.91);
    const visorR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.04), hubMat);
    visorR.position.set(0.35, 0.1, 0.91);
    chassis.add(visorL, visorR);

    // Add LED headlights and neon underglow
    addLEDLights(chassis, 0.38, 0.1, 0.9, -0.2, underglowColor);

    const wheelPositions = [
      [-0.55, 0.18, 0.6],
      [-0.55, 0.18, 0],
      [-0.55, 0.18, -0.6],
      [0.55, 0.18, 0.6],
      [0.55, 0.18, 0],
      [0.55, 0.18, -0.6]
    ];

    wheelPositions.forEach(([x, y, z]) => {
      const wheelGroup = new THREE.Group();
      wheelGroup.position.set(x, y, z);
      
      const tire = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.32, 0.32), tireMat);
      const hub = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.12, 0.12), gunMat);
      
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
  if (type === 'cybertruck') springY = 0.35;
  if (type === 'hovercraft') springY = 0.4;
  if (type === 'tank') springY = 0.35;
  
  spring.position.set(0, springY, 0);
  spring.scale.set(0.8, 0, 0.8);
  group.add(spring);

  group.userData = {
    type: type,
    wheels: wheels,
    spring: spring,
    springY: springY
  };

  return group;
}

/**
 * createCoinModel - Constructs a spinning 3D pixelated Coin.
 * @param {string} colorType - 'green' (value=1), 'yellow' (value=4), or 'black' (value=20)
 */
export function createCoinModel(colorType) {
  const group = new THREE.Group();
  
  let coreColor, glowColor, glowIntensity;
  if (colorType === 'green') {
    coreColor = 0x73ff66;
    glowColor = 0x73ff66;
    glowIntensity = 1.2;
  } else if (colorType === 'yellow') {
    coreColor = 0xfffa66;
    glowColor = 0xfffa66;
    glowIntensity = 1.2;
  } else {
    coreColor = 0x1a1a1a;
    glowColor = 0xff00ff; // bright neon magenta/pink glow for black coin
    glowIntensity = 1.5;
  }

  const coreMat = new THREE.MeshStandardMaterial({
    color: coreColor,
    emissive: coreColor,
    emissiveIntensity: colorType === 'black' ? 0.05 : glowIntensity,
    roughness: 0.15,
    flatShading: true
  });

  const rimMat = new THREE.MeshStandardMaterial({
    color: glowColor,
    emissive: glowColor,
    emissiveIntensity: glowIntensity,
    roughness: 0.15,
    flatShading: true
  });

  if (colorType === 'black') {
    // Outer glow rim
    const outerCyl = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.06, 8), rimMat);
    outerCyl.rotation.x = Math.PI / 2;
    outerCyl.castShadow = true;
    group.add(outerCyl);

    // Inner dark core
    const innerCyl = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.08, 8), coreMat);
    innerCyl.rotation.x = Math.PI / 2;
    group.add(innerCyl);
  } else {
    // Standard solid coin
    const cyl = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.08, 8), coreMat);
    cyl.rotation.x = Math.PI / 2;
    cyl.castShadow = true;
    group.add(cyl);
  }

  return group;
}

/**
 * createTankShellModel - Constructs a 3D neon laser projectile fired by the Tank.
 */
export function createTankShellModel() {
  const group = new THREE.Group();
  
  const shellMat = new THREE.MeshStandardMaterial({
    color: 0xff7733,
    emissive: 0xff4d00,
    emissiveIntensity: 1.5,
    roughness: 0.1,
    flatShading: true
  });
  
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.35, 8), shellMat);
  body.rotation.x = Math.PI / 2;
  body.castShadow = true;
  group.add(body);
  
  const tip = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.15, 8), shellMat);
  tip.position.z = -0.25;
  tip.rotation.x = -Math.PI / 2;
  tip.castShadow = true;
  group.add(tip);
  
  return group;
}

/**
 * createTrashBagModel - Constructs a 3D dark grey garbage bag with yellow ties.
 */
export function createTrashBagModel() {
  const group = new THREE.Group();
  
  const bagMat = new THREE.MeshStandardMaterial({
    color: 0x222222,
    roughness: 0.8,
    metalness: 0.1,
    flatShading: true
  });
  
  const tieMat = new THREE.MeshStandardMaterial({
    color: 0xffea00,
    emissive: 0xffea00,
    emissiveIntensity: 0.8,
    flatShading: true
  });
  
  // Main bag body
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.22, 0.35, 8), bagMat);
  body.position.y = 0.175;
  body.castShadow = true;
  group.add(body);
  
  // Knot/tie part
  const knot = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.08, 0.1, 8), bagMat);
  knot.position.y = 0.35 + 0.05;
  knot.castShadow = true;
  group.add(knot);

  // Yellow tie string
  const tie = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.03, 0.16), tieMat);
  tie.position.y = 0.35;
  group.add(tie);
  
  // Little ear/flaps of the tied bag
  const ear1 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.1, 0.04), bagMat);
  ear1.position.set(-0.04, 0.44, 0);
  ear1.rotation.z = 0.4;
  
  const ear2 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.1, 0.04), bagMat);
  ear2.position.set(0.04, 0.44, 0);
  ear2.rotation.z = -0.4;
  
  group.add(ear1, ear2);

  return group;
}

/**
 * createCockpitModel - Procedurally constructs a 3D cockpit dashboard mesh for 1st-person view.
 * 
 * @param {string} type - 'car', 'monster_truck', 'truck', 'cybertruck', 'hovercraft', or 'tank'
 * @param {string|number} colorNameOrHex - Chassis paint color parameter
 * @returns {THREE.Group} - Cockpit model assembly
 */
export function createCockpitModel(type, colorNameOrHex) {
  let bodyColor = null;
  if (colorNameOrHex !== undefined && colorNameOrHex !== null) {
    if (typeof colorNameOrHex === 'string' && colorMap[colorNameOrHex] !== undefined) {
      bodyColor = colorMap[colorNameOrHex];
    } else if (typeof colorNameOrHex === 'number') {
      bodyColor = colorNameOrHex;
    } else if (typeof colorNameOrHex === 'string' && colorNameOrHex.startsWith('#')) {
      bodyColor = parseInt(colorNameOrHex.substring(1), 16);
    }
  }
  if (bodyColor === null) {
    bodyColor = (
      type === 'car' ? 0xfffa66 :
      type === 'monster_truck' ? 0xd666ff :
      type === 'truck' ? 0x80f7ff :
      type === 'cybertruck' ? 0x73ff66 :
      type === 'hovercraft' ? 0x80f7ff :
      0x00aa33 // tank
    );
  }

  const group = new THREE.Group();

  // Materials
  const dashMat = new THREE.MeshStandardMaterial({ color: 0x222225, roughness: 0.8, flatShading: true });
  const frameMat = new THREE.MeshStandardMaterial({ color: 0x111113, roughness: 0.6, flatShading: true });
  const accentMat = new THREE.MeshStandardMaterial({
    color: bodyColor,
    emissive: bodyColor,
    emissiveIntensity: 0.5,
    roughness: 0.2,
    metalness: 0.8,
    flatShading: true
  });
  const wheelMat = new THREE.MeshStandardMaterial({ color: 0x151517, roughness: 0.7, flatShading: true });
  const columnMat = new THREE.MeshStandardMaterial({ color: 0x333337, metalness: 0.8, roughness: 0.3, flatShading: true });
  
  // LED Glowing materials (swapping visibility is cleaner, so these are the lit states)
  const ledCyan = new THREE.MeshStandardMaterial({ color: 0x00f0ff, emissive: 0x00f0ff, emissiveIntensity: 1.5, flatShading: true });
  const ledPink = new THREE.MeshStandardMaterial({ color: 0xff007f, emissive: 0xff007f, emissiveIntensity: 1.5, flatShading: true });
  const ledGreen = new THREE.MeshStandardMaterial({ color: 0x39ff14, emissive: 0x39ff14, emissiveIntensity: 1.5, flatShading: true });

  // Custom height/depth offsets for dashboard positioning relative to vehicle cabin height
  const config = {
    car: { dy: 0, hoodY: 0.32, hoodL: 0.85 },
    monster_truck: { dy: 0.53, hoodY: 0.88, hoodL: 0.75 },
    truck: { dy: 0.16, hoodY: 0.48, hoodL: 0.3 },
    cybertruck: { dy: 0.03, hoodY: 0.38, hoodL: 0.85 },
    hovercraft: { dy: -0.1, hoodY: 0.22, hoodL: 0.75 },
    tank: { dy: 0.13, hoodY: 0.48, hoodL: 0.85 }
  }[type] || { dy: 0, hoodY: 0.32, hoodL: 0.85 };

  const vehicleCamZ = {
    car: -0.15,
    monster_truck: 0.05,
    truck: 0.35,
    cybertruck: 0.0,
    hovercraft: -0.05,
    tank: 0.2
  }[type] || 0.0;

  const dy = config.dy;
  
  // Local positive Z targets relative to vehicleCamZ (since cab rotated 180, positive Z extends forward towards windshield)
  const zDash = vehicleCamZ + 0.55;
  const zPillars = vehicleCamZ + 0.55;
  const zGauges = vehicleCamZ + 0.53;
  const zControls = vehicleCamZ + 0.42;
  const zColumn = vehicleCamZ + 0.45;
  const zHood = vehicleCamZ + 0.55 + config.hoodL / 2;

  // 1. Dashboard panel block
  const dash = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.24, 0.25), dashMat);
  dash.position.set(0, 0.38 + dy, zDash);
  dash.castShadow = true;
  dash.receiveShadow = true;
  group.add(dash);

  // 2. Windshield Frame (A-Pillars & Roof Beam)
  const pillarL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.7, 0.06), frameMat);
  pillarL.position.set(-0.65, 0.65 + dy, zPillars);
  pillarL.rotation.z = -0.12;
  group.add(pillarL);

  const pillarR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.7, 0.06), frameMat);
  pillarR.position.set(0.65, 0.65 + dy, zPillars);
  pillarR.rotation.z = 0.12;
  group.add(pillarR);

  const topBar = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.06, 0.06), frameMat);
  topBar.position.set(0, 0.95 + dy, zPillars);
  group.add(topBar);

  // 3. Outer Hood visible through windshield
  const hood = new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.04, config.hoodL), accentMat);
  hood.position.set(0, config.hoodY, zHood);
  hood.castShadow = true;
  hood.receiveShadow = true;
  group.add(hood);

  // 4. Steering Controls (Steering wheel, yoke, or dual levers)
  if (type === 'hovercraft' || type === 'tank') {
    // Dual Levers
    const leverMat = columnMat;
    const gripColor = type === 'tank' ? 0x39ff14 : 0x00f0ff;
    const gripMat = new THREE.MeshStandardMaterial({
      color: gripColor,
      emissive: gripColor,
      emissiveIntensity: 0.8,
      flatShading: true
    });

    // Left Lever
    const leftLever = new THREE.Group();
    leftLever.name = "leftLever";
    leftLever.position.set(-0.25, 0.38 + dy, zControls);
    const rodL = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.15, 0.02), leverMat);
    rodL.position.y = 0.075;
    const gripL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.05), gripMat);
    gripL.position.y = 0.15;
    leftLever.add(rodL, gripL);
    group.add(leftLever);

    // Right Lever
    const rightLever = new THREE.Group();
    rightLever.name = "rightLever";
    rightLever.position.set(-0.07, 0.38 + dy, zControls);
    const rodR = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.15, 0.02), leverMat);
    rodR.position.y = 0.075;
    const gripR = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.05), gripMat);
    gripR.position.y = 0.15;
    rightLever.add(rodR, gripR);
    group.add(rightLever);
  } else {
    // Steering column
    const steeringColumn = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.2), columnMat);
    steeringColumn.position.set(-0.16, 0.42 + dy, zColumn);
    steeringColumn.rotation.x = 0.25;
    group.add(steeringColumn);

    // Steering Wheel Group
    const wheelGroup = new THREE.Group();
    wheelGroup.name = "steeringWheel";
    wheelGroup.position.set(-0.16, 0.44 + dy, zControls);
    wheelGroup.rotation.x = 0.25;

    if (type === 'cybertruck') {
      // Yoke Steering Wheel (Futuristic boxy yoke)
      const topPart = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.02, 0.02), wheelMat);
      topPart.position.y = 0.055;
      const bottomPart = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.02, 0.02), wheelMat);
      bottomPart.position.y = -0.055;
      const leftPart = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.11, 0.02), wheelMat);
      leftPart.position.x = -0.08;
      const rightPart = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.11, 0.02), wheelMat);
      rightPart.position.x = 0.08;
      const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.02, 0.015), wheelMat);
      wheelGroup.add(topPart, bottomPart, leftPart, rightPart, spoke);
    } else {
      // Standard Circular Voxel Steering Wheel
      const rim = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.015, 6, 16), wheelMat);
      const spokeH = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.018, 0.018), wheelMat);
      const spokeV = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.09, 0.018), wheelMat);
      spokeV.position.y = -0.045;
      wheelGroup.add(rim, spokeH, spokeV);
    }
    group.add(wheelGroup);
  }

  // 5. Speed Indicator LEDs (5 cyan boxes, toggled by visibility)
  for (let i = 0; i < 5; i++) {
    const led = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.02, 0.01), ledCyan);
    led.name = `speedLED_${i}`;
    led.position.set(-0.06 + i * 0.03, 0.44 + dy, zGauges);
    group.add(led);
  }

  // 6. Heart (HP) Indicator LEDs (4 pink boxes, toggled by visibility)
  for (let i = 0; i < 4; i++) {
    const heart = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.025, 0.01), ledPink);
    heart.name = `hpLED_${i}`;
    heart.position.set(-0.06 + i * 0.03, 0.40 + dy, zGauges);
    group.add(heart);
  }

  // 7. Special Ability indicator LED (grows green when ready)
  const specBtn = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.02), ledGreen);
  specBtn.name = "specialIndicatorBtn";
  specBtn.position.set(0.12, 0.42 + dy, zGauges);
  group.add(specBtn);

  // 8. Central Radar Screen
  const screenBg = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.12, 0.01), new THREE.MeshStandardMaterial({ color: 0x0a0a0f, roughness: 0.9 }));
  screenBg.position.set(0.24, 0.41 + dy, zGauges);
  group.add(screenBg);

  const screenLines = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.10, 0.012), new THREE.MeshStandardMaterial({
    color: type === 'tank' ? 0x39ff14 : 0x00f0ff,
    emissive: type === 'tank' ? 0x39ff14 : 0x00f0ff,
    emissiveIntensity: 0.6,
    wireframe: true
  }));
  screenLines.position.set(0.24, 0.41 + dy, zGauges);
  group.add(screenLines);

  return group;
}
