import * as THREE from 'three';

function createDigitTexture(char) {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, size, size);
  ctx.font = 'bold 88px "IBM Plex Mono", "Courier New", monospace';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(char, size / 2, size / 2 + 4);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export function initParticles(canvas) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 55;

  const tex0 = createDigitTexture('0');
  const tex1 = createDigitTexture('1');

  const palette = [0xffee00, 0xe8e8e8, 0x33ff66, 0x888888, 0xffffff];
  const COUNT = 320;
  const bits = [];
  const group = new THREE.Group();
  scene.add(group);

  for (let i = 0; i < COUNT; i++) {
    const isOne = Math.random() > 0.48;
    const color = palette[Math.floor(Math.random() * palette.length)];
    const baseOpacity = 0.25 + Math.random() * 0.55;
    const scale = 0.9 + Math.random() * 1.4;

    const material = new THREE.SpriteMaterial({
      map: isOne ? tex1 : tex0,
      color,
      transparent: true,
      opacity: baseOpacity,
      depthWrite: false,
    });

    const sprite = new THREE.Sprite(material);
    sprite.position.set(
      (Math.random() - 0.5) * 130,
      (Math.random() - 0.5) * 90,
      (Math.random() - 0.5) * 50
    );
    sprite.scale.set(scale, scale, 1);

    group.add(sprite);

    bits.push({
      sprite,
      material,
      baseOpacity,
      baseScale: scale,
      phase: Math.random() * Math.PI * 2,
      floatSpeed: 0.4 + Math.random() * 1.2,
      slideX: (Math.random() - 0.5) * 0.025,
      slideY: Math.random() * 0.02 + 0.005,
      rain: Math.random() > 0.65,
      rainSpeed: 0.04 + Math.random() * 0.12,
      wobble: Math.random() * 0.02,
      bounds: {
        x: 65,
        y: 45,
        z: 30,
      },
    });
  }

  // Connection lines between nearby bits
  const LINE_SAMPLE = 80;
  const maxSegments = LINE_SAMPLE * LINE_SAMPLE;
  const linePositions = new Float32Array(maxSegments * 6);
  const lineGeometry = new THREE.BufferGeometry();
  lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0xffee00,
    transparent: true,
    opacity: 0.06,
  });
  const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
  scene.add(lines);

  const mouse = { x: 0, y: 0 };
  const targetMouse = { x: 0, y: 0 };
  const clock = new THREE.Clock();

  window.addEventListener('mousemove', (e) => {
    targetMouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
    targetMouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
  });

  function updateLines() {
    const linePos = lineGeometry.attributes.position.array;
    let idx = 0;
    const threshold = 12;
    const step = Math.max(1, Math.floor(bits.length / LINE_SAMPLE));

    for (let a = 0; a < LINE_SAMPLE; a++) {
      const bitA = bits[a * step];
      if (!bitA) break;
      const posA = bitA.sprite.position;

      for (let b = a + 1; b < LINE_SAMPLE; b++) {
        const bitB = bits[b * step];
        if (!bitB) break;
        const posB = bitB.sprite.position;

        const dx = posA.x - posB.x;
        const dy = posA.y - posB.y;
        const dz = posA.z - posB.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < threshold && idx < linePos.length - 6) {
          linePos[idx++] = posA.x;
          linePos[idx++] = posA.y;
          linePos[idx++] = posA.z;
          linePos[idx++] = posB.x;
          linePos[idx++] = posB.y;
          linePos[idx++] = posB.z;
        }
      }
    }

    lineGeometry.attributes.position.needsUpdate = true;
    lineGeometry.setDrawRange(0, idx / 3);
  }

  let frame = 0;

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    frame++;

    mouse.x += (targetMouse.x - mouse.x) * 0.04;
    mouse.y += (targetMouse.y - mouse.y) * 0.04;

    const mx = mouse.x * 45;
    const my = mouse.y * 28;

    for (const bit of bits) {
      const { sprite, material, phase, floatSpeed, slideX, slideY, rain, rainSpeed, wobble, bounds } = bit;
      const pos = sprite.position;

      // Sine float + drift
      pos.x += slideX + Math.sin(t * floatSpeed + phase) * wobble;
      pos.y += Math.cos(t * floatSpeed * 0.7 + phase) * 0.018;

      // Matrix rain slide on subset
      if (rain) {
        pos.y -= rainSpeed;
        pos.x += Math.sin(t * 2 + phase) * 0.008;
      } else {
        pos.y += slideY * Math.sin(t * 0.5 + phase);
      }

      // Mouse repulsion
      const dx = pos.x - mx;
      const dy = pos.y - my;
      const dist = Math.sqrt(dx * dx + dy * dy) + 0.1;
      if (dist < 18) {
        pos.x += (dx / dist) * 0.12;
        pos.y += (dy / dist) * 0.12;
      }

      // Wrap bounds
      if (pos.x > bounds.x) pos.x = -bounds.x;
      if (pos.x < -bounds.x) pos.x = bounds.x;
      if (pos.y > bounds.y) pos.y = -bounds.y;
      if (pos.y < -bounds.y) pos.y = bounds.y;
      if (pos.z > bounds.z) pos.z = -bounds.z;
      if (pos.z < -bounds.z) pos.z = bounds.z;

      // Pulse opacity + scale breathe
      material.opacity = bit.baseOpacity + Math.sin(t * 2.5 + phase) * 0.12;
      const breathe = 1 + Math.sin(t * 1.8 + phase) * 0.08;
      sprite.scale.set(bit.baseScale * breathe, bit.baseScale * breathe, 1);

      // Subtle Z depth slide
      pos.z += Math.sin(t * 0.6 + phase) * 0.006;
    }

    if (frame % 4 === 0) updateLines();

    // Parallax tilt on entire field
    group.rotation.x = mouse.y * 0.12 + Math.sin(t * 0.15) * 0.04;
    group.rotation.y = mouse.x * 0.12 + Math.cos(t * 0.12) * 0.03;
    group.position.x = mouse.x * 3;
    group.position.y = mouse.y * 2;

    // Slow global rotation
    group.rotation.z = Math.sin(t * 0.08) * 0.02;

    lineMaterial.opacity = 0.04 + Math.sin(t * 0.5) * 0.025;

    renderer.render(scene, camera);
  }

  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  window.addEventListener('resize', onResize);
  animate();

  return { renderer, scene, camera };
}
