import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

const $ = (id) => document.getElementById(id);
const welcome = $('welcome');
const loading = $('loading');
const shell = $('scene-shell');
const canvas = $('gallery-canvas');
const errorBox = $('gallery-error');
const statusText = $('scene-status');
const titleText = $('scene-title');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let renderer, scene, camera, clock, animationFrame = 0;
let entered = false;
let dragging = false;
let lastPointerX = 0;
let lastPointerY = 0;
let yaw = 0;
let pitch = 0;
const held = new Set();
const moveVector = new THREE.Vector3();
const targetVector = new THREE.Vector3();
const forward = new THREE.Vector3();
const right = new THREE.Vector3();
const cameraTarget = new THREE.Vector3(0, 1.65, 4.8);
const cameraPosition = new THREE.Vector3(0, 1.65, 8.8);
const bounds = { x: 4.25, zMin: -10.5, zMax: 8.5 };
const galleryArt = [];

function makeCanvasTexture(index, title) {
  const art = document.createElement('canvas');
  art.width = 512; art.height = 640;
  const ctx = art.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, 512, 640);
  const palettes = [
    ['#231a17','#9a633b','#e2bd78'],
    ['#111a22','#42626a','#d9a441'],
    ['#291c1d','#8f4536','#e5c18a'],
    ['#17231e','#596f51','#d5ad5e'],
    ['#211b2a','#67506c','#c49c61'],
    ['#201a12','#8b7447','#e1c48b']
  ];
  const colors = palettes[index % palettes.length];
  gradient.addColorStop(0, colors[0]); gradient.addColorStop(.62, colors[1]); gradient.addColorStop(1, colors[2]);
  ctx.fillStyle = gradient; ctx.fillRect(0, 0, 512, 640);
  ctx.globalAlpha = .8;
  for (let i = 0; i < 7; i++) {
    ctx.beginPath();
    ctx.ellipse(256 + Math.sin(i * 1.7 + index) * 70, 310 + Math.cos(i * 1.3) * 90, 70 + i * 14, 150 - i * 9, i * .23, 0, Math.PI * 2);
    ctx.strokeStyle = i % 2 ? '#f0d39b' : '#241b17'; ctx.lineWidth = 3 + (i % 3);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  ctx.fillStyle = 'rgba(7,8,10,.64)'; ctx.fillRect(0, 550, 512, 90);
  ctx.fillStyle = '#f3dfb7'; ctx.font = 'bold 23px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText(title, 256, 594);
  ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.font = '13px sans-serif'; ctx.fillText('GILASART · ART COLLECTION', 256, 619);
  const texture = new THREE.CanvasTexture(art);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = renderer?.capabilities.getMaxAnisotropy?.() || 1;
  return texture;
}

function addWallArt(x, z, rotation, index, title, imageUrl = '') {
  const group = new THREE.Group();
  group.position.set(x, 2.05, z);
  group.rotation.y = rotation;
  const width = 1.36, height = 1.7, frame = .095;
  const frameMaterial = new THREE.MeshStandardMaterial({ color: index % 2 ? 0x9a6336 : 0xc7a15b, metalness: .72, roughness: .3 });
  const darkFrame = new THREE.MeshStandardMaterial({ color: 0x17130f, metalness: .4, roughness: .35 });
  const backing = new THREE.Mesh(new THREE.BoxGeometry(width + frame * 2, height + frame * 2, .12), darkFrame);
  backing.position.z = -.055; group.add(backing);
  const frameMesh = new THREE.Mesh(new THREE.BoxGeometry(width + frame, height + frame, .11), frameMaterial);
  frameMesh.position.z = .012; group.add(frameMesh);
  const inner = new THREE.Mesh(new THREE.PlaneGeometry(width, height), new THREE.MeshStandardMaterial({ map: makeCanvasTexture(index, title), roughness: .72, metalness: .05 }));
  inner.position.z = .075; group.add(inner);
  const glow = new THREE.PointLight(0xffd99a, 2.4, 4.2, 2);
  glow.position.set(0, 1.15, .55); group.add(glow);
  const spot = new THREE.Mesh(new THREE.SphereGeometry(.035, 12, 8), new THREE.MeshBasicMaterial({ color: 0xffe1a4 }));
  spot.position.set(0, 1.05, .15); group.add(spot);
  scene.add(group);
  galleryArt.push({ group, title, index });
}

function addPillar(x, z) {
  const material = new THREE.MeshStandardMaterial({ color: 0x24201b, roughness: .72, metalness: .12 });
  const pillar = new THREE.Mesh(new THREE.BoxGeometry(.3, 4.3, .3), material);
  pillar.position.set(x, 2.15, z); scene.add(pillar);
  const trim = new THREE.Mesh(new THREE.BoxGeometry(.38, .06, .38), new THREE.MeshStandardMaterial({ color: 0x967044, metalness: .55, roughness: .38 }));
  trim.position.set(x, 3.8, z); scene.add(trim);
}

function setupScene() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x090a0d);
  scene.fog = new THREE.FogExp2(0x090a0d, .037);
  camera = new THREE.PerspectiveCamera(66, window.innerWidth / window.innerHeight, .1, 80);
  camera.position.copy(cameraPosition);
  camera.rotation.order = 'YXZ';
  renderer = new THREE.WebGLRenderer({ canvas, antialias: !/Android|iPhone|iPad/i.test(navigator.userAgent), alpha: false, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;

  const ambient = new THREE.HemisphereLight(0xead8b7, 0x18110c, 1.35); scene.add(ambient);
  const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(12, 24), new THREE.MeshStandardMaterial({ color: 0x17171a, roughness: .9, side: THREE.DoubleSide }));
  ceiling.rotation.x = Math.PI / 2; ceiling.position.set(0, 4.2, -2); scene.add(ceiling);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(12, 30), new THREE.MeshStandardMaterial({ color: 0x28221b, roughness: .32, metalness: .16 }));
  floor.rotation.x = -Math.PI / 2; floor.position.set(0, 0, -2); scene.add(floor);
  const floorGrid = new THREE.GridHelper(12, 32, 0x59442b, 0x332b21);
  floorGrid.position.y = .012; floorGrid.material.transparent = true; floorGrid.material.opacity = .24; scene.add(floorGrid);

  const backWall = new THREE.Mesh(new THREE.PlaneGeometry(12, 4.2), new THREE.MeshStandardMaterial({ color: 0x151518, roughness: .86, side: THREE.DoubleSide }));
  backWall.position.set(0, 2.1, -14); scene.add(backWall);
  const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(30, 4.2), new THREE.MeshStandardMaterial({ color: 0x171719, roughness: .9, side: THREE.DoubleSide }));
  leftWall.rotation.y = Math.PI / 2; leftWall.position.set(-6, 2.1, -2); scene.add(leftWall);
  const rightWall = leftWall.clone(); rightWall.rotation.y = -Math.PI / 2; rightWall.position.x = 6; scene.add(rightWall);

  for (let i = 0; i < 5; i++) {
    const z = 1 - i * 3.1;
    addWallArt(-5.91, z, Math.PI / 2, i, ['نقش و نگار','گرمای مس','روایت ایرانی','آرامش رنگ','هنر ماندگار'][i]);
    addWallArt(5.91, z, -Math.PI / 2, i + 1, ['نقش ایرانی','جزئیات هنر','طلایی گرم','بافت و فرم','گیلاس آرت'][i]);
    const lamp = new THREE.SpotLight(0xffd9a0, 22, 8, Math.PI / 5, .65, 1.4);
    lamp.position.set(i % 2 ? -2 : 2, 3.95, z); lamp.target.position.set(0, 1.7, z); scene.add(lamp, lamp.target);
  }
  for (let i = 0; i < 4; i++) { addPillar(-4.6, -1.2 - i * 3.8); addPillar(4.6, -2.6 - i * 3.8); }
  const endGlow = new THREE.PointLight(0xb76d32, 8, 11, 1.6); endGlow.position.set(0, 2.4, -12.5); scene.add(endGlow);
  clock = new THREE.Clock();
}

function clampCamera() {
  cameraTarget.x = THREE.MathUtils.clamp(cameraTarget.x, -bounds.x, bounds.x);
  cameraTarget.z = THREE.MathUtils.clamp(cameraTarget.z, bounds.zMin, bounds.zMax);
  cameraTarget.y = THREE.MathUtils.clamp(cameraTarget.y, 1.35, 2.15);
}

function updateMovement(delta) {
  const speed = (held.has('shift') ? 3.2 : 1.8) * Math.min(delta, .05);
  forward.set(-Math.sin(yaw), 0, -Math.cos(yaw)).normalize();
  right.set(Math.cos(yaw), 0, -Math.sin(yaw)).normalize();
  moveVector.set(0, 0, 0);
  if (held.has('forward') || held.has('w') || held.has('arrowup')) moveVector.add(forward);
  if (held.has('back') || held.has('s') || held.has('arrowdown')) moveVector.sub(forward);
  if (held.has('right') || held.has('d') || held.has('arrowright')) moveVector.add(right);
  if (held.has('left') || held.has('a') || held.has('arrowleft')) moveVector.sub(right);
  if (moveVector.lengthSq()) { moveVector.normalize().multiplyScalar(speed); cameraTarget.add(moveVector); clampCamera(); }
  cameraPosition.lerp(cameraTarget, 1 - Math.exp(-5.5 * Math.min(delta, .05)));
  camera.position.copy(cameraPosition);
  camera.rotation.set(pitch, yaw, 0, 'YXZ');
}

function animate() {
  if (!entered) return;
  animationFrame = requestAnimationFrame(animate);
  const delta = clock.getDelta();
  updateMovement(delta);
  renderer.render(scene, camera);
}

function onResize() {
  if (!renderer || !camera) return;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.fov = window.innerWidth < 600 ? 72 : 66;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
  renderer.setSize(window.innerWidth, window.innerHeight, false);
}

function setHeld(name, on) {
  if (on) held.add(name); else held.delete(name);
  document.querySelectorAll('[data-move="' + name + '"]').forEach(button => button.classList.toggle('is-active', on));
}

function bindControls() {
  document.querySelectorAll('[data-move]').forEach(button => {
    const name = button.dataset.move;
    const down = (event) => { event.preventDefault(); setHeld(name, true); try { button.setPointerCapture(event.pointerId); } catch {} };
    const up = (event) => { event.preventDefault(); setHeld(name, false); };
    button.addEventListener('pointerdown', down);
    ['pointerup','pointercancel','lostpointercapture','pointerleave'].forEach(type => button.addEventListener(type, up));
    button.addEventListener('contextmenu', e => e.preventDefault());
  });
  window.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    const map = { w:'forward', arrowup:'forward', s:'back', arrowdown:'back', a:'left', arrowleft:'left', d:'right', arrowright:'right', shift:'shift' };
    if (map[key]) { event.preventDefault(); setHeld(map[key], true); }
    if (key === 'escape' && entered) exitGallery();
  });
  window.addEventListener('keyup', (event) => {
    const key = event.key.toLowerCase();
    const map = { w:'forward', arrowup:'forward', s:'back', arrowdown:'back', a:'left', arrowleft:'left', d:'right', arrowright:'right', shift:'shift' };
    if (map[key]) setHeld(map[key], false);
  });
  window.addEventListener('blur', () => held.clear());
  canvas.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'touch') return;
    dragging = true; lastPointerX = event.clientX; lastPointerY = event.clientY;
    try { canvas.setPointerCapture(event.pointerId); } catch {}
  });
  canvas.addEventListener('pointermove', (event) => {
    if (!dragging) return;
    yaw -= (event.clientX - lastPointerX) * .003;
    pitch -= (event.clientY - lastPointerY) * .002;
    pitch = THREE.MathUtils.clamp(pitch, -.32, .32);
    lastPointerX = event.clientX; lastPointerY = event.clientY;
  });
  const stopDrag = () => { dragging = false; };
  ['pointerup','pointercancel','lostpointercapture'].forEach(type => canvas.addEventListener(type, stopDrag));
  $('help-toggle').addEventListener('click', () => {
    const panel = $('help-panel'); panel.hidden = !panel.hidden;
    $('help-toggle').setAttribute('aria-expanded', String(!panel.hidden));
  });
  $('exit-gallery').addEventListener('click', exitGallery);
  window.addEventListener('resize', onResize, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { held.clear(); cancelAnimationFrame(animationFrame); }
    else if (entered) { clock.getDelta(); animate(); }
  });
}

function exitGallery() {
  entered = false; cancelAnimationFrame(animationFrame); held.clear();
  shell.hidden = true; welcome.hidden = false;
  document.body.style.overflow = 'hidden';
  if (renderer) renderer.setAnimationLoop(null);
}

async function enterGallery() {
  if (entered) return;
  welcome.hidden = true; loading.hidden = false; errorBox.hidden = true;
  try {
    if (!renderer) setupScene();
    bindControls();
    cameraTarget.set(0, 1.65, 4.8);
    cameraPosition.set(0, 1.65, 8.8);
    yaw = 0; pitch = 0; camera.position.copy(cameraPosition); camera.rotation.set(0, 0, 0);
    shell.hidden = false;
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    loading.hidden = true;
    entered = true;
    statusText.textContent = 'از کنترل‌ها برای قدم‌زدن در گالری استفاده کنید.';
    titleText.textContent = 'گالری آثار گیلاس آرت';
    if (!prefersReducedMotion) {
      cameraPosition.set(0, 2.15, 10.5);
      cameraTarget.set(0, 1.65, 4.8);
      const start = performance.now();
      const duration = 1700;
      const intro = () => {
        if (!entered) return;
        const t = Math.min(1, (performance.now() - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        camera.position.set(0, 2.15 - .5 * eased, 10.5 - 5.7 * eased);
        camera.rotation.set(0, 0, 0);
        renderer.render(scene, camera);
        if (t < 1) requestAnimationFrame(intro);
        else { cameraPosition.copy(cameraTarget); animate(); }
      };
      requestAnimationFrame(intro);
    } else animate();
  } catch (error) {
    console.error('[GilasArt virtual gallery]', error);
    loading.hidden = true; shell.hidden = false; errorBox.hidden = false;
    const retry = document.createElement('button');
    retry.className = 'button button--gold'; retry.type = 'button'; retry.textContent = 'تلاش دوباره';
    retry.addEventListener('click', () => { retry.remove(); enterGallery(); }, { once: true });
    errorBox.append(document.createElement('br'), retry);
  }
}

$('enter-gallery').addEventListener('click', enterGallery);
window.addEventListener('pagehide', () => {
  cancelAnimationFrame(animationFrame);
  if (renderer) { renderer.dispose(); }
});
