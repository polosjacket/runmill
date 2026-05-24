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
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0xff007f, flatShading: true }); // Neon Pink Torso
  const limbMat = new THREE.MeshStandardMaterial({ color: 0x00f0ff, flatShading: true }); // Neon Cyan limbs
  const headMat = new THREE.MeshStandardMaterial({ color: 0x111111, flatShading: true }); // Dark Helmet casing
  const visorMat = new THREE.MeshStandardMaterial({ color: 0xfff600, emissive: 0xfff600, flatShading: true }); // Yellow visor

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
  
  // Materials
  const casingMat = new THREE.MeshStandardMaterial({ color: 0x00f0ff, flatShading: true }); // Cyan shell
  const labelMat = new THREE.MeshStandardMaterial({ color: 0xffffff, flatShading: true }); // White sticker
  const sliderMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8, roughness: 0.2, flatShading: true }); // Metallic shutter
  
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
 * createObstacleModel - Procedurally structures obstacle objects based on type.
 * 
 * @param {string} type - 'tv' (CRT TV set), 'cassette' (Cassette Tape), or 'spike' (default pyramid)
 */
export function createObstacleModel(type) {
  const group = new THREE.Group();

  if (type === 'tv') {
    // CRT TV set built of casing, glowing screen, knobs, and antenna wireframes
    // Upgraded to safety neon orange and glowing yellow for maximum visibility
    const boxMat = new THREE.MeshStandardMaterial({ color: 0xff5500, emissive: 0x772200, flatShading: true });
    const screenMat = new THREE.MeshStandardMaterial({ color: 0xffff00, emissive: 0xffff00, emissiveIntensity: 0.9, flatShading: true }); // Bright yellow screen glow
    const knobMat = new THREE.MeshStandardMaterial({ color: 0x111111, flatShading: true });
    const antennaMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, flatShading: true });

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
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xfff600, emissive: 0x555500, flatShading: true });
    const labelMat = new THREE.MeshStandardMaterial({ color: 0xfffff0, flatShading: true });
    const spoolMat = new THREE.MeshStandardMaterial({ color: 0xff007f, emissive: 0xff007f, emissiveIntensity: 0.5, flatShading: true }); // Pink hubs

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

  } else {
    // Spikes: Upgraded from purple to a highly visible glowing red pyramid
    const spikeMat = new THREE.MeshStandardMaterial({ color: 0xff003c, emissive: 0xff003c, emissiveIntensity: 0.9, flatShading: true });
    
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
  
  // Grey metallic material
  const metalMat = new THREE.MeshStandardMaterial({ color: 0x999999, metalness: 0.8, roughness: 0.2, flatShading: true });
  
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
  pink: 0xff007f,
  cyan: 0x00f0ff,
  green: 0x39ff14,
  yellow: 0xfff600,
  purple: 0xbd00ff
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

  // Shared wheel/windshield materials
  const tireMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9, flatShading: true }); // Rubber
  const hubMat = new THREE.MeshStandardMaterial({ color: 0xff007f, flatShading: true }); // Pink hubs
  const glassMat = new THREE.MeshStandardMaterial({ color: 0x00f0ff, emissive: 0x00f0ff, emissiveIntensity: 0.3, flatShading: true }); // Windshield cyan glow

  if (type === 'car') {
    // 1. Sleek Retro Sports Car (Yellow/gold body, pink spoiler)
    const bodyMat = new THREE.MeshStandardMaterial({ color: bodyColor !== null ? bodyColor : 0xfff600, flatShading: true });
    const spoilerMat = new THREE.MeshStandardMaterial({ color: 0xff007f, flatShading: true });

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
    // 2. Monster Truck (Purple body, high pink shock struts, giant cyan wheels)
    const bodyMat = new THREE.MeshStandardMaterial({ color: bodyColor !== null ? bodyColor : 0xbd00ff, flatShading: true });
    const suspensionMat = new THREE.MeshStandardMaterial({ color: 0xff007f, flatShading: true });
    const giantHubMat = new THREE.MeshStandardMaterial({ color: 0x00f0ff, flatShading: true });

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
    // 3. Cargo Truck (Cyan cabin cab, grey trailer back, 6 wheels)
    const bodyMat = new THREE.MeshStandardMaterial({ color: bodyColor !== null ? bodyColor : 0x00f0ff, flatShading: true });
    const cargoMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, flatShading: true });

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

