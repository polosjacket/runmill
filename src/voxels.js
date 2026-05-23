import * as THREE from 'three';

// Create a standard low-poly pixelated player group
export function createPlayerModel() {
  const group = new THREE.Group();
  
  // Materials
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0xff007f, flatShading: true }); // Pink torso
  const limbMat = new THREE.MeshStandardMaterial({ color: 0x00f0ff, flatShading: true }); // Cyan limbs
  const headMat = new THREE.MeshStandardMaterial({ color: 0x111111, flatShading: true }); // Dark helmet
  const visorMat = new THREE.MeshStandardMaterial({ color: 0xfff600, emissive: 0xfff600, flatShading: true }); // Yellow visor

  // Torso
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

  // Visor
  const visor = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.15, 0.1), visorMat);
  visor.position.set(0, 0.05, 0.3);
  head.add(visor);

  // Left Leg (pivot at top of leg)
  const leftLegPivot = new THREE.Group();
  leftLegPivot.position.set(-0.25, -0.5, 0);
  const leftLeg = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.6, 0.25), limbMat);
  leftLeg.position.y = -0.3;
  leftLeg.castShadow = true;
  leftLegPivot.add(leftLeg);
  torso.add(leftLegPivot);

  // Right Leg
  const rightLegPivot = new THREE.Group();
  rightLegPivot.position.set(0.25, -0.5, 0);
  const rightLeg = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.6, 0.25), limbMat);
  rightLeg.position.y = -0.3;
  rightLeg.castShadow = true;
  rightLegPivot.add(rightLeg);
  torso.add(rightLegPivot);

  // Left Arm
  const leftArmPivot = new THREE.Group();
  leftArmPivot.position.set(-0.5, 0.3, 0);
  const leftArm = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.6, 0.2), limbMat);
  leftArm.position.y = -0.3;
  leftArm.castShadow = true;
  leftArmPivot.add(leftArm);
  torso.add(leftArmPivot);

  // Right Arm
  const rightArmPivot = new THREE.Group();
  rightArmPivot.position.set(0.5, 0.3, 0);
  const rightArm = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.6, 0.2), limbMat);
  rightArm.position.y = -0.3;
  rightArm.castShadow = true;
  rightArmPivot.add(rightArm);
  torso.add(rightArmPivot);

  // Keep references to moving parts for animations
  group.userData = {
    leftLeg: leftLegPivot,
    rightLeg: rightLegPivot,
    leftArm: leftArmPivot,
    rightArm: rightArmPivot,
    torso: torso
  };

  return group;
}

export function createFloppyDiskModel() {
  const group = new THREE.Group();
  
  // Materials
  const casingMat = new THREE.MeshStandardMaterial({ color: 0x00f0ff, flatShading: true }); // Cyan casing
  const labelMat = new THREE.MeshStandardMaterial({ color: 0xffffff, flatShading: true }); // White label
  const sliderMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8, roughness: 0.2, flatShading: true }); // Metal slider
  
  // Main disk square
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 0.08), casingMat);
  body.castShadow = true;
  group.add(body);
  
  // White label on front
  const label = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.25, 0.02), labelMat);
  label.position.set(0, -0.12, 0.045);
  body.add(label);
  
  // Metal shutter on top
  const shutter = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.2, 0.09), sliderMat);
  shutter.position.set(-0.1, 0.18, 0);
  body.add(shutter);

  return group;
}

export function createObstacleModel(type) {
  const group = new THREE.Group();

  if (type === 'tv') {
    // CRT TV
    const boxMat = new THREE.MeshStandardMaterial({ color: 0x3a3a3a, flatShading: true });
    const screenMat = new THREE.MeshStandardMaterial({ color: 0xff007f, emissive: 0xff007f, emissiveIntensity: 0.5, flatShading: true });
    const knobMat = new THREE.MeshStandardMaterial({ color: 0x111111, flatShading: true });
    const antennaMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, flatShading: true });

    // TV body
    const tvBody = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.9, 0.9), boxMat);
    tvBody.position.y = 0.45;
    tvBody.castShadow = true;
    tvBody.receiveShadow = true;
    group.add(tvBody);

    // Screen
    const screen = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.65, 0.1), screenMat);
    screen.position.set(-0.1, 0.05, 0.43);
    tvBody.add(screen);

    // Knobs
    const knob1 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.05), knobMat);
    knob1.position.set(0.45, 0.15, 0.45);
    const knob2 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.05), knobMat);
    knob2.position.set(0.45, -0.05, 0.45);
    tvBody.add(knob1, knob2);

    // Antenna 1
    const ant1 = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.5, 0.04), antennaMat);
    ant1.position.set(-0.2, 0.6, 0);
    ant1.rotation.z = 0.5;
    tvBody.add(ant1);

    // Antenna 2
    const ant2 = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.5, 0.04), antennaMat);
    ant2.position.set(0.2, 0.6, 0);
    ant2.rotation.z = -0.5;
    tvBody.add(ant2);

  } else if (type === 'cassette') {
    // Cassette Tape
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x1e1e1e, flatShading: true });
    const labelMat = new THREE.MeshStandardMaterial({ color: 0xfffff0, flatShading: true });
    const spoolMat = new THREE.MeshStandardMaterial({ color: 0xfff600, flatShading: true });

    // Cassette Body
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.8, 0.18), bodyMat);
    body.position.y = 0.4;
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);

    // Cassette Label
    const label = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.5, 0.2), labelMat);
    label.position.set(0, 0.05, 0);
    body.add(label);

    // Spools (left and right holes)
    const spoolL = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.22), spoolMat);
    spoolL.position.set(-0.28, 0.05, 0);
    const spoolR = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.22), spoolMat);
    spoolR.position.set(0.28, 0.05, 0);
    body.add(spoolL, spoolR);

  } else {
    // Spikes (Default)
    const spikeMat = new THREE.MeshStandardMaterial({ color: 0xbd00ff, emissive: 0xbd00ff, emissiveIntensity: 0.2, flatShading: true });
    
    // Cone geometry with 4 radial segments to make it a pixelated pyramid
    const spike = new THREE.Mesh(new THREE.ConeGeometry(0.6, 1.0, 4), spikeMat);
    spike.position.y = 0.5;
    spike.rotation.y = Math.PI / 4; // Align flat faces
    spike.castShadow = true;
    spike.receiveShadow = true;
    group.add(spike);
  }

  return group;
}
