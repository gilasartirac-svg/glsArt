let THREE;
const THREE_MODULE_URL = 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

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
let controlsBound = false;
let dragging = false;
let lastPointerX = 0;
let lastPointerY = 0;
let yaw = 0;
let pitch = 0;
const held = new Set();
let moveVector, targetVector, forward, right, raycaster, pointerNdc;
let focusTransition = null;
let focusReturn = null;
let activeArtwork = null;
let dragMoved = false;
let panelCloseTimer = 0;
let cameraTarget, cameraPosition;
const bounds = { x: 4.25, zMin: -10.5, zMax: 8.5 };
const galleryArt = [];
let galleryProducts = [];
const fallbackTitles = ['نقش و نگار','گرمای مس','روایت ایرانی','آرامش رنگ','هنر ماندگار','جزئیات هنر','طلایی گرم','بافت و فرم','گیلاس آرت','نقش ایرانی'];

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

function addWallArt(x, z, rotation, index, title, imageUrl = '', product = null) {
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
  const artworkMaterial = new THREE.MeshStandardMaterial({ map: makeCanvasTexture(index, title), roughness: .72, metalness: .05 });
  const inner = new THREE.Mesh(new THREE.PlaneGeometry(width, height), artworkMaterial);
  inner.position.z = .075; group.add(inner);
  if (imageUrl) {
    const imagePath = galleryImageUrl(imageUrl);
    if (imagePath) new THREE.TextureLoader().load(imagePath, texture => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = renderer?.capabilities.getMaxAnisotropy?.() || 1;
      const imageAspect = (texture.image?.width || width) / (texture.image?.height || height);
      const frameAspect = width / height;
      if (imageAspect > frameAspect) {
        texture.repeat.x = frameAspect / imageAspect;
        texture.offset.x = (1 - texture.repeat.x) / 2;
      } else {
        texture.repeat.y = imageAspect / frameAspect;
        texture.offset.y = (1 - texture.repeat.y) / 2;
      }
      artworkMaterial.map = texture; artworkMaterial.needsUpdate = true;
    }, undefined, () => {});
  }
  const glow = new THREE.PointLight(0xffd99a, 2.4, 4.2, 2);
  glow.position.set(0, 1.15, .55); group.add(glow);
  const spot = new THREE.Mesh(new THREE.SphereGeometry(.035, 12, 8), new THREE.MeshBasicMaterial({ color: 0xffe1a4 }));
  spot.position.set(0, 1.05, .15); group.add(spot);
  scene.add(group);
  const record = { group, title, index, product, hitMeshes: [backing, frameMesh, inner] };
  record.hitMeshes.forEach(mesh => { mesh.userData.galleryArtwork = record; });
  galleryArt.push(record);
}

function galleryImageUrl(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  try {
    const base = location.pathname.startsWith('/glsArt') ? '/glsArt' : '';
    const rooted = raw.startsWith('/') && base && !raw.startsWith(base + '/') ? base + raw : raw;
    const url = new URL(rooted.startsWith('/') ? rooted : '/' + rooted, location.origin);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
  } catch { return ''; }
}

function openArtworkPanel(record) {
  const panel = $('artwork-panel');
  const product = record?.product || {};
  if (!panel) return;
  clearTimeout(panelCloseTimer);
  const image = $('artwork-panel-image');
  const imageUrl = galleryImageUrl(product.image);
  image.hidden = !imageUrl;
  image.alt = String(product.name || record.title || 'اثر هنری');
  image.onerror = () => { image.hidden = true; };
  if (imageUrl) image.src = imageUrl;
  $('artwork-panel-title').textContent = String(product.name || record.title || 'اثر هنری');
  $('artwork-panel-sku').textContent = product.sku ? 'شناسه اثر: ' + String(product.sku) : 'مجموعه آثار گیلاس آرت';
  const price = Number(product.price_irt || 0);
  const priceNode = $('artwork-panel-price');
  priceNode.textContent = price > 0 ? new Intl.NumberFormat('fa-IR').format(price) + ' ریال' : 'برای اطلاع از قیمت، جزئیات اثر را ببینید';
  $('artwork-panel-description').textContent = String(product.description || 'برای مشاهده مشخصات کامل، ابعاد و جزئیات این اثر وارد صفحه محصول شوید.');
  const details = $('artwork-panel-details');
  const slug = String(product.slug || '').trim();
  details.href = slug ? '/product/' + encodeURIComponent(slug) : '/shop';
  panel.hidden = false;
  panel.setAttribute('aria-hidden', 'false');
  requestAnimationFrame(() => panel.classList.add('is-open'));
  statusText.textContent = 'نمای نزدیک اثر انتخاب‌شده؛ برای بازگشت، پنل را ببندید.';
  titleText.textContent = String(product.name || record.title || 'اثر هنری');
}

function closeArtworkPanel() {
  const panel = $('artwork-panel');
  if (panel) {
    panel.classList.remove('is-open');
    panel.setAttribute('aria-hidden', 'true');
    clearTimeout(panelCloseTimer);
    panelCloseTimer = setTimeout(() => { panel.hidden = true; }, 280);
  }
  if (focusReturn && entered) {
    const back = focusReturn;
    focusReturn = null;
    focusTransition = {
      fromPosition: cameraPosition.clone(), toPosition: back.position.clone(),
      fromYaw: yaw, toYaw: back.yaw, fromPitch: pitch, toPitch: back.pitch,
      startedAt: performance.now(), duration: 850
    };
    statusText.textContent = 'در حال بازگشت به نمای گالری...';
    titleText.textContent = 'گالری آثار گیلاس آرت';
  }
  activeArtwork = null;
}

function focusArtwork(record) {
  if (!record || !record.product || !entered) return;
  if (!focusReturn) focusReturn = { position: cameraPosition.clone(), yaw, pitch };
  const lookTarget = record.group.position.clone();
  const normal = new THREE.Vector3(0, 0, 1).applyQuaternion(record.group.quaternion).normalize();
  const destination = lookTarget.clone().addScaledVector(normal, 2.65);
  destination.y = lookTarget.y + 0.05;
  const dx = lookTarget.x - destination.x;
  const dy = lookTarget.y - destination.y;
  const dz = lookTarget.z - destination.z;
  const horizontal = Math.hypot(dx, dz);
  focusTransition = {
    fromPosition: cameraPosition.clone(), toPosition: destination,
    fromYaw: yaw, toYaw: Math.atan2(-dx, -dz),
    fromPitch: pitch, toPitch: Math.atan2(dy, horizontal),
    startedAt: performance.now(), duration: prefersReducedMotion ? 20 : 1250,
    artwork: record
  };
  activeArtwork = record;
  openArtworkPanel(record);
}

function onArtworkClick(event) {
  if (dragMoved) { dragMoved = false; return; }
  if (!raycaster || !camera || !entered) return;
  const rect = canvas.getBoundingClientRect();
  pointerNdc.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointerNdc.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointerNdc, camera);
  const hit = raycaster.intersectObjects(galleryArt.flatMap(art => art.hitMeshes), false)[0];
  const record = hit?.object?.userData?.galleryArtwork;
  if (record?.product) focusArtwork(record);
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
    const leftProduct = galleryProducts[i];
    const rightProduct = galleryProducts[i + 5];
    addWallArt(-5.91, z, Math.PI / 2, i, leftProduct?.name || fallbackTitles[i], leftProduct?.image || '', leftProduct || null);
    addWallArt(5.91, z, -Math.PI / 2, i + 1, rightProduct?.name || fallbackTitles[i + 5], rightProduct?.image || '', rightProduct || null);
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
  if (focusTransition) {
    const transition = focusTransition;
    const progress = Math.min(1, (performance.now() - transition.startedAt) / transition.duration);
    const eased = progress * progress * (3 - 2 * progress);
    cameraPosition.lerpVectors(transition.fromPosition, transition.toPosition, eased);
    const yawDelta = Math.atan2(Math.sin(transition.toYaw - transition.fromYaw), Math.cos(transition.toYaw - transition.fromYaw));
    yaw = transition.fromYaw + yawDelta * eased;
    pitch = transition.fromPitch + (transition.toPitch - transition.fromPitch) * eased;
    camera.position.copy(cameraPosition);
    camera.rotation.set(pitch, yaw, 0, 'YXZ');
    if (progress >= 1) {
      cameraPosition.copy(transition.toPosition);
      cameraTarget.copy(transition.toPosition);
      focusTransition = null;
    }
    return;
  }
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
  if (controlsBound) return;
  controlsBound = true;
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
    dragMoved = false;
    if (event.pointerType === 'touch') return;
    dragging = true; lastPointerX = event.clientX; lastPointerY = event.clientY;
    try { canvas.setPointerCapture(event.pointerId); } catch {}
  });
  canvas.addEventListener('pointermove', (event) => {
    if (!dragging) return;
    if (Math.abs(event.clientX - lastPointerX) + Math.abs(event.clientY - lastPointerY) > 5) dragMoved = true;
    yaw -= (event.clientX - lastPointerX) * .003;
    pitch -= (event.clientY - lastPointerY) * .002;
    pitch = THREE.MathUtils.clamp(pitch, -.32, .32);
    lastPointerX = event.clientX; lastPointerY = event.clientY;
  });
  const stopDrag = () => { dragging = false; };
  ['pointerup','pointercancel','lostpointercapture'].forEach(type => canvas.addEventListener(type, stopDrag));
  canvas.addEventListener('click', onArtworkClick);
  $('artwork-panel-close').addEventListener('click', closeArtworkPanel);
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
  focusTransition = null; focusReturn = null; activeArtwork = null;
  const panel = $('artwork-panel');
  if (panel) { panel.hidden = true; panel.classList.remove('is-open'); panel.setAttribute('aria-hidden', 'true'); }
  shell.hidden = true; welcome.hidden = false;
  document.body.style.overflow = 'hidden';
  if (renderer) renderer.setAnimationLoop(null);
}

async function loadGalleryProducts() {
  try {
    const root = location.pathname.startsWith('/glsArt') ? '/glsArt/' : '/';
    const response = await fetch(root + 'data/storefront-index.json', { cache: 'force-cache', credentials: 'same-origin' });
    if (!response.ok) return;
    const data = await response.json();
    galleryProducts = (Array.isArray(data.products) ? data.products : [])
      .filter(product => product && Number(product.active) !== 0 && typeof product.image === 'string' && product.image.trim())
      .slice(0, 10)
      .map(product => ({
        id: product.id ?? null,
        slug: String(product.slug || ''),
        sku: String(product.sku || ''),
        name: String(product.name || 'اثر هنری').slice(0, 90),
        description: String(product.description || '').slice(0, 800),
        price_irt: Number(product.price_irt || 0),
        image: String(product.image || '')
      }));
  } catch { galleryProducts = []; }
}

async function enterGallery() {
  if (entered) return;
  welcome.hidden = true; loading.hidden = false; errorBox.hidden = true;
  try {
    if (!THREE) THREE = await import(THREE_MODULE_URL);
    if (!cameraTarget) {
      cameraTarget = new THREE.Vector3(0, 1.65, 4.8);
      cameraPosition = new THREE.Vector3(0, 1.65, 8.8);
    }
    if (!moveVector) {
      moveVector = new THREE.Vector3();
      targetVector = new THREE.Vector3();
      forward = new THREE.Vector3();
      right = new THREE.Vector3();
      raycaster = new THREE.Raycaster();
      pointerNdc = new THREE.Vector2();
    }
    if (!renderer) { await loadGalleryProducts(); setupScene(); }
    bindControls();
    focusTransition = null; focusReturn = null; activeArtwork = null;
    closeArtworkPanel();
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
