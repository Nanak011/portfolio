import * as THREE from 'three';

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
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 50;

  const PARTICLE_COUNT = 900;
  const LINE_SAMPLE = 120;
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const velocities = new Float32Array(PARTICLE_COUNT * 3);
  const colors = new Float32Array(PARTICLE_COUNT * 3);

  const palette = [
    new THREE.Color(0xffee00),
    new THREE.Color(0xe8e8e8),
    new THREE.Color(0x888888),
    new THREE.Color(0x33ff66),
  ];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 120;
    positions[i3 + 1] = (Math.random() - 0.5) * 80;
    positions[i3 + 2] = (Math.random() - 0.5) * 60;

    velocities[i3] = (Math.random() - 0.5) * 0.02;
    velocities[i3 + 1] = (Math.random() - 0.5) * 0.02;
    velocities[i3 + 2] = (Math.random() - 0.5) * 0.01;

    const c = palette[Math.floor(Math.random() * palette.length)];
    colors[i3] = c.r;
    colors[i3 + 1] = c.g;
    colors[i3 + 2] = c.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.35,
    vertexColors: true,
    transparent: true,
    opacity: 0.7,
    sizeAttenuation: true,
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  const maxSegments = LINE_SAMPLE * LINE_SAMPLE;
  const linePositions = new Float32Array(maxSegments * 6);
  const lineGeometry = new THREE.BufferGeometry();
  lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0xffee00,
    transparent: true,
    opacity: 0.04,
  });
  const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
  scene.add(lines);

  const mouse = { x: 0, y: 0 };
  const targetMouse = { x: 0, y: 0 };

  window.addEventListener('mousemove', (e) => {
    targetMouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
    targetMouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
  });

  function updateLines() {
    const pos = geometry.attributes.position.array;
    const linePos = lineGeometry.attributes.position.array;
    let idx = 0;
    const threshold = 10;
    const step = Math.floor(PARTICLE_COUNT / LINE_SAMPLE);

    for (let a = 0; a < LINE_SAMPLE; a++) {
      const i = a * step;
      const i3 = i * 3;
      for (let b = a + 1; b < LINE_SAMPLE; b++) {
        const j = b * step;
        const j3 = j * 3;
        const dx = pos[i3] - pos[j3];
        const dy = pos[i3 + 1] - pos[j3 + 1];
        const dz = pos[i3 + 2] - pos[j3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < threshold && idx < linePos.length - 6) {
          linePos[idx++] = pos[i3];
          linePos[idx++] = pos[i3 + 1];
          linePos[idx++] = pos[i3 + 2];
          linePos[idx++] = pos[j3];
          linePos[idx++] = pos[j3 + 1];
          linePos[idx++] = pos[j3 + 2];
        }
      }
    }

    lineGeometry.attributes.position.needsUpdate = true;
    lineGeometry.setDrawRange(0, idx / 3);
  }

  let frame = 0;

  function animate() {
    requestAnimationFrame(animate);
    frame++;

    mouse.x += (targetMouse.x - mouse.x) * 0.05;
    mouse.y += (targetMouse.y - mouse.y) * 0.05;

    const pos = geometry.attributes.position.array;
    const vel = velocities;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;

      // Mouse repulsion
      const mx = mouse.x * 40;
      const my = mouse.y * 25;
      const dx = pos[i3] - mx;
      const dy = pos[i3 + 1] - my;
      const dist = Math.sqrt(dx * dx + dy * dy) + 0.1;
      if (dist < 15) {
        vel[i3] += (dx / dist) * 0.003;
        vel[i3 + 1] += (dy / dist) * 0.003;
      }

      pos[i3] += vel[i3];
      pos[i3 + 1] += vel[i3 + 1];
      pos[i3 + 2] += vel[i3 + 2];

      // Damping
      vel[i3] *= 0.99;
      vel[i3 + 1] *= 0.99;
      vel[i3 + 2] *= 0.99;

      // Bounds wrap
      if (pos[i3] > 60) pos[i3] = -60;
      if (pos[i3] < -60) pos[i3] = 60;
      if (pos[i3 + 1] > 40) pos[i3 + 1] = -40;
      if (pos[i3 + 1] < -40) pos[i3 + 1] = 40;
    }

    geometry.attributes.position.needsUpdate = true;

    if (frame % 3 === 0) updateLines();

    particles.rotation.y += 0.0003;
    particles.rotation.x = mouse.y * 0.05;
    particles.rotation.y += mouse.x * 0.0005;

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
