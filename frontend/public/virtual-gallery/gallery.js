let THREE;
const THREE_MODULE_URLS = [
  'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js',
  'https://unpkg.com/three@0.180.0/build/three.module.js',
  'https://esm.sh/three@0.180.0'
];
async function loadThreeModule() {
  let lastError;
  for (const url of THREE_MODULE_URLS) {
    try { return await import(url); }
    catch (error) { lastError = error; }
  }
  throw new Error('کتابخانه گالری سه‌بعدی بارگذاری نشد. اتصال اینترنت یا دسترسی به سرویس‌های کتابخانه را بررسی کنید.', { cause: lastError });
}

const $ = (id) => document.getElementById(id);
const welcome = $('welcome');
const loading = $('loading');
const shell = $('scene-shell');
const canvas = $('gallery-canvas');
const errorBox = $('gallery-error');
const statusText = $('scene-status');
const titleText = $('scene-title');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// The gallery always opens the complete active collection; category controls are intentionally hidden.

let renderer, scene, camera, clock, animationFrame = 0;
let entered = false;
let controlsBound = false;
let dragging = false;
let lastPointerX = 0;
let lastPointerY = 0;
const touchPointers = new Map();
let previousTouchGesture = null;
let yaw = 0;
let pitch = 0;
const held = new Set();
let moveVector, targetVector, forward, right, raycaster, pointerNdc;
let focusTransition = null;
let focusReturn = null;
let activeArtwork = null;
let dragMoved = false;
let panelCloseTimer = 0;
let cameraTarget, cameraPosition, cameraVelocity, desiredVelocity;
let yawVelocity = 0, pitchVelocity = 0;
const bounds = { x: 6.6, zMin: -10.5, zMax: 8.5 };
const movementTuning = { walkSpeed: 3.2, sprintSpeed: 6.2, acceleration: 8.5, damping: 4.2, turnDamping: 5.2, boundarySpring: 7.5 };
const galleryArt = [];
const artworkQueue = [];
let nextArtworkIndex = 0;
const ARTWORK_BATCH_SIZE = 10;
const ARTWORK_BUILD_DISTANCE = 14;
let sceneCategory = null;
let galleryProducts = [];
let allGalleryProducts = [];
let selectedGalleryCategory = 'all';
let galleryTextureLoader = null;
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
  const maxWidth = 1.82, maxHeight = 2.08;
  // Always keep a visible local artwork texture while the real product image loads or if its URL fails.
  const placeholderTexture = makeCanvasTexture(index, title);
  const artworkMaterial = new THREE.MeshStandardMaterial({
    map: placeholderTexture, color: imageUrl ? 0xf4efe6 : 0xffffff,
    roughness: .86, metalness: .01, side: THREE.DoubleSide
  });
  const inner = new THREE.Mesh(new THREE.PlaneGeometry(maxWidth, maxHeight), artworkMaterial);
  inner.position.z = .025;
  group.add(inner);
  // No per-artwork spotlights: keep image surfaces evenly lit and free of glare.
  scene.add(group);
  const record = {
    group, title, index, product, hitMeshes: [inner], inner,
    imageUrl: imageUrl ? galleryImageUrl(imageUrl) : '',
    placeholderTexture, artworkMaterial, imageLoaded: false, imageLoading: false,
    maxWidth, maxHeight, lastNearAt: 0
  };
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
  const price = Number(product.price?.amount ?? product.price_irt ?? 0);
  const priceNode = $('artwork-panel-price');
  priceNode.textContent = price > 0 ? new Intl.NumberFormat('fa-IR').format(price) + ' ریال' : 'برای اطلاع از قیمت، جزئیات اثر را ببینید';
  $('artwork-panel-description').textContent = String(product.description || 'برای مشاهده مشخصات کامل، ابعاد و جزئیات این اثر وارد صفحه محصول شوید.');
  const details = $('artwork-panel-details');
  const slug = String(product.slug || '').trim();
  details.href = product.url || (slug ? '/product/' + encodeURIComponent(slug) : '/shop');
  const cartButton = $('artwork-panel-cart');
  const cartMessage = $('artwork-panel-cart-message');
  if (cartButton) {
    cartButton.dataset.productId = String(product.id || '');
    cartButton.dataset.productSlug = slug;
    cartButton.dataset.productSku = String(product.sku || '');
  }
  if (cartMessage) cartMessage.textContent = '';
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
  const material = new THREE.MeshStandardMaterial({ color: 0xe7e0d3, roughness: .38, metalness: .035 });
  const pillar = new THREE.Mesh(new THREE.BoxGeometry(.3, 4.3, .3), material);
  pillar.position.set(x, 2.15, z); scene.add(pillar);
  const trim = new THREE.Mesh(new THREE.BoxGeometry(.38, .06, .38), new THREE.MeshStandardMaterial({ color: 0x967044, metalness: .55, roughness: .38 }));
  trim.position.set(x, 3.8, z); scene.add(trim);
}

function setupScene() {
  const rows = Math.max(5, Math.ceil(galleryProducts.length / 2));
  const corridorLength = Math.max(30, (rows - 1) * 3.1 + 12);
  bounds.zMin = -Math.max(10.5, (rows - 1) * 3.1 + 4.5);
  const corridorCenter = (bounds.zMax + bounds.zMin) / 2;
  galleryArt.length = 0;
  scene = new THREE.Scene();
  sceneCategory = selectedGalleryCategory;
  scene.background = new THREE.Color(0x211d1a);
  scene.fog = new THREE.Fog(0x211d1a, 28, 105);
  camera = new THREE.PerspectiveCamera(57, window.innerWidth / window.innerHeight, .1, 90);
  camera.position.copy(cameraPosition);
  camera.rotation.order = 'YXZ';
  if (!renderer) renderer = new THREE.WebGLRenderer({ canvas, antialias: !/Android|iPhone|iPad/i.test(navigator.userAgent), alpha: false, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.18;

  // Generate a reusable ivory marble texture with soft, branching grey-gold veins.
  const marbleCanvas = document.createElement('canvas');
  marbleCanvas.width = 768; marbleCanvas.height = 768;
  const marbleContext = marbleCanvas.getContext('2d');
  const marbleBase = marbleContext.createLinearGradient(0, 0, 768, 768);
  marbleBase.addColorStop(0, '#252523'); marbleBase.addColorStop(.48, '#4a4742'); marbleBase.addColorStop(1, '#302e2a');
  marbleContext.fillStyle = marbleBase; marbleContext.fillRect(0, 0, 768, 768);
  let marbleSeed = 4317;
  const marbleRandom = () => { marbleSeed = (marbleSeed * 16807) % 2147483647; return (marbleSeed - 1) / 2147483646; };
  for (let vein = 0; vein < 24; vein++) {
    let x = marbleRandom() * 768, y = marbleRandom() * 768;
    marbleContext.beginPath(); marbleContext.moveTo(x, y);
    const segments = 5 + Math.floor(marbleRandom() * 8);
    for (let s = 0; s < segments; s++) {
      const bendX = x + (marbleRandom() - .5) * 150;
      const bendY = y + 28 + marbleRandom() * 90;
      x += (marbleRandom() - .5) * 90; y += 35 + marbleRandom() * 70;
      marbleContext.quadraticCurveTo(bendX, bendY, x, y);
    }
    marbleContext.strokeStyle = vein % 5 === 0 ? 'rgba(190,157,112,.25)' : 'rgba(205,201,192,.12)';
    marbleContext.lineWidth = vein % 5 === 0 ? 2.1 : .9;
    marbleContext.stroke();
    marbleContext.strokeStyle = 'rgba(255,255,255,.72)'; marbleContext.lineWidth = .7; marbleContext.stroke();
  }
  const marbleTexture = new THREE.CanvasTexture(marbleCanvas);
  marbleTexture.colorSpace = THREE.SRGBColorSpace;
  marbleTexture.wrapS = marbleTexture.wrapT = THREE.RepeatWrapping;
  marbleTexture.repeat.set(2, 5);
  marbleTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  // Warm room-wide illumination; no concentrated beam is aimed at artwork faces.
  const ambient = new THREE.AmbientLight(0xffe7c7, .78); scene.add(ambient);
  const hemisphere = new THREE.HemisphereLight(0xf8e9d2, 0x33251d, .72); scene.add(hemisphere);
  const galleryFill = new THREE.DirectionalLight(0xffd9a6, .48); galleryFill.position.set(-3, 7, 5); scene.add(galleryFill);
  const ceilingMaterial = new THREE.MeshStandardMaterial({ color: 0x302820, roughness: .94, metalness: 0, side: THREE.DoubleSide });
  const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(18, corridorLength), ceilingMaterial);
  ceiling.rotation.x = Math.PI / 2; ceiling.position.set(0, 4.2, corridorCenter); scene.add(ceiling);
  const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xc7c0b4, map: marbleTexture, roughness: .34, metalness: .025, side: THREE.DoubleSide });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(18, corridorLength), floorMaterial);
  floor.rotation.x = -Math.PI / 2; floor.position.set(0, 0, corridorCenter); scene.add(floor);
  const floorGrid = new THREE.GridHelper(18, 48, 0x8b6a45, 0x5b554e);
  floorGrid.position.y = .014; floorGrid.material.transparent = true; floorGrid.material.opacity = .045; scene.add(floorGrid);

  // Deep-brown velvet wall texture with subtle vertical nap.
  const velvetCanvas = document.createElement('canvas'); velvetCanvas.width = 512; velvetCanvas.height = 512;
  const velvetContext = velvetCanvas.getContext('2d');
  const velvetBase = velvetContext.createLinearGradient(0, 0, 512, 0);
  velvetBase.addColorStop(0, '#241713'); velvetBase.addColorStop(.48, '#3b251d'); velvetBase.addColorStop(1, '#291a15');
  velvetContext.fillStyle = velvetBase; velvetContext.fillRect(0, 0, 512, 512);
  let velvetSeed = 7129;
  const velvetRandom = () => { velvetSeed = (velvetSeed * 48271) % 2147483647; return (velvetSeed - 1) / 2147483646; };
  for (let i = 0; i < 1700; i++) {
    const x = velvetRandom() * 512, y = velvetRandom() * 512;
    velvetContext.strokeStyle = velvetRandom() > .52 ? 'rgba(226,177,125,.035)' : 'rgba(0,0,0,.08)';
    velvetContext.lineWidth = .5 + velvetRandom() * 1.1;
    velvetContext.beginPath(); velvetContext.moveTo(x, y); velvetContext.lineTo(x + (velvetRandom() - .5) * 2, y + 4 + velvetRandom() * 16); velvetContext.stroke();
  }
  const velvetTexture = new THREE.CanvasTexture(velvetCanvas);
  velvetTexture.wrapS = velvetTexture.wrapT = THREE.RepeatWrapping;
  velvetTexture.repeat.set(Math.max(2, corridorLength / 8), 1); velvetTexture.colorSpace = THREE.SRGBColorSpace;
  const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, map: velvetTexture, roughness: .97, metalness: 0, side: THREE.DoubleSide });
  const backWall = new THREE.Mesh(new THREE.PlaneGeometry(18, 4.2), wallMaterial);
  backWall.position.set(0, 2.1, bounds.zMin - 2); scene.add(backWall);
  const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(corridorLength, 4.2), wallMaterial);
  leftWall.rotation.y = Math.PI / 2; leftWall.position.set(-9, 2.1, corridorCenter); scene.add(leftWall);
  const rightWall = leftWall.clone(); rightWall.rotation.y = -Math.PI / 2; rightWall.position.x = 9; scene.add(rightWall);
  const baseTrimMaterial = new THREE.MeshStandardMaterial({ color: 0x6c4827, roughness: .42, metalness: .68 });
  const leftBaseTrim = new THREE.Mesh(new THREE.BoxGeometry(.055, .12, corridorLength), baseTrimMaterial);
  leftBaseTrim.position.set(-8.94, .08, corridorCenter); scene.add(leftBaseTrim);
  const rightBaseTrim = leftBaseTrim.clone(); rightBaseTrim.position.x = 8.94; scene.add(rightBaseTrim);
  const ceilingTrim = new THREE.Mesh(new THREE.BoxGeometry(18, .045, .045), baseTrimMaterial);
  ceilingTrim.position.set(0, 4.02, -2); scene.add(ceilingTrim);

  artworkQueue.length = 0; nextArtworkIndex = 0;
  galleryProducts.forEach((product, index) => {
    const row = Math.floor(index / 2), left = index % 2 === 0;
    artworkQueue.push({ product, index, x: left ? -8.91 : 8.91, z: 1 - row * 3.1, rotation: left ? Math.PI / 2 : -Math.PI / 2 });
  });
  // Wider architectural piers break up the long-hall rhythm.
  for (let i = 0; i < rows; i += 4) { const z = -2.2 - i * 3.1; addPillar(-7.25, z); addPillar(7.25, z - 1.45); }
  const endGlow = new THREE.PointLight(0x8d512b, 2.2, 16, 1.8); endGlow.position.set(0, 2.4, bounds.zMin + 1.5); scene.add(endGlow);
  galleryTextureLoader = new THREE.TextureLoader();
  clock = new THREE.Clock();
}

function clampCamera() {
  cameraPosition.x = THREE.MathUtils.clamp(cameraPosition.x, -bounds.x, bounds.x);
  cameraPosition.z = THREE.MathUtils.clamp(cameraPosition.z, bounds.zMin, bounds.zMax);
  cameraPosition.y = THREE.MathUtils.clamp(cameraPosition.y, 1.35, 2.15);
}

function updateMovement(delta) {
  const dt = Math.min(delta, .04);
  if (focusTransition) {
    const transition = focusTransition;
    const progress = Math.min(1, (performance.now() - transition.startedAt) / transition.duration);
    const eased = 1 - Math.pow(1 - progress, 5);
    cameraPosition.lerpVectors(transition.fromPosition, transition.toPosition, eased);
    const yawDelta = Math.atan2(Math.sin(transition.toYaw - transition.fromYaw), Math.cos(transition.toYaw - transition.fromYaw));
    yaw = transition.fromYaw + yawDelta * eased;
    pitch = transition.fromPitch + (transition.toPitch - transition.fromPitch) * eased;
    cameraVelocity.set(0, 0, 0);
    yawVelocity = 0; pitchVelocity = 0;
    camera.position.copy(cameraPosition);
    camera.rotation.set(pitch, yaw, 0, 'YXZ');
    if (progress >= 1) {
      cameraPosition.copy(transition.toPosition);
      cameraTarget.copy(transition.toPosition);
      focusTransition = null;
    }
    return;
  }

  forward.set(-Math.sin(yaw), 0, -Math.cos(yaw)).normalize();
  right.set(Math.cos(yaw), 0, -Math.sin(yaw)).normalize();
  moveVector.set(0, 0, 0);
  if (held.has('forward') || held.has('w') || held.has('arrowup')) moveVector.add(forward);
  if (held.has('back') || held.has('s') || held.has('arrowdown')) moveVector.sub(forward);
  if (held.has('right') || held.has('d') || held.has('arrowright')) moveVector.add(right);
  if (held.has('left') || held.has('a') || held.has('arrowleft')) moveVector.sub(right);

  const maxSpeed = held.has('shift') ? movementTuning.sprintSpeed : movementTuning.walkSpeed;
  if (moveVector.lengthSq() > 0) {
    moveVector.normalize().multiplyScalar(maxSpeed);
    desiredVelocity.copy(moveVector);
    cameraVelocity.lerp(desiredVelocity, 1 - Math.exp(-movementTuning.acceleration * dt));
  } else {
    cameraVelocity.multiplyScalar(Math.exp(-movementTuning.damping * dt));
  }

  // Soft spring forces begin before the hard boundary, so the camera eases away from walls.
  const softX = bounds.x - .32;
  const softMinZ = bounds.zMin + .38;
  const softMaxZ = bounds.zMax - .38;
  if (cameraPosition.x > softX) cameraVelocity.x -= (cameraPosition.x - softX) * movementTuning.boundarySpring * dt;
  if (cameraPosition.x < -softX) cameraVelocity.x += (-softX - cameraPosition.x) * movementTuning.boundarySpring * dt;
  if (cameraPosition.z < softMinZ) cameraVelocity.z += (softMinZ - cameraPosition.z) * movementTuning.boundarySpring * dt;
  if (cameraPosition.z > softMaxZ) cameraVelocity.z -= (cameraPosition.z - softMaxZ) * movementTuning.boundarySpring * dt;

  cameraPosition.addScaledVector(cameraVelocity, dt);
  if (cameraPosition.x > bounds.x || cameraPosition.x < -bounds.x) {
    cameraPosition.x = THREE.MathUtils.clamp(cameraPosition.x, -bounds.x, bounds.x);
    cameraVelocity.x *= -.12;
  }
  if (cameraPosition.z > bounds.zMax || cameraPosition.z < bounds.zMin) {
    cameraPosition.z = THREE.MathUtils.clamp(cameraPosition.z, bounds.zMin, bounds.zMax);
    cameraVelocity.z *= -.12;
  }
  cameraPosition.y = 1.65;

  yaw += yawVelocity * dt;
  pitch += pitchVelocity * dt;
  yawVelocity *= Math.exp(-movementTuning.turnDamping * dt);
  pitchVelocity *= Math.exp(-movementTuning.turnDamping * dt);
  pitch = THREE.MathUtils.clamp(pitch, -.32, .32);
  if (Math.abs(yawVelocity) < .001) yawVelocity = 0;
  if (Math.abs(pitchVelocity) < .001) pitchVelocity = 0;

  cameraTarget.copy(cameraPosition);
  camera.position.copy(cameraPosition);
  camera.rotation.set(pitch, yaw, 0, 'YXZ');
}

function buildNearbyArtworkBatch() {
  if (!cameraPosition || !scene || nextArtworkIndex >= artworkQueue.length) return;
  const next = artworkQueue[nextArtworkIndex];
  if (Math.hypot(next.x - cameraPosition.x, next.z - cameraPosition.z) > ARTWORK_BUILD_DISTANCE) return;
  const end = Math.min(nextArtworkIndex + ARTWORK_BATCH_SIZE, artworkQueue.length);
  while (nextArtworkIndex < end) {
    const item = artworkQueue[nextArtworkIndex++];
    addWallArt(item.x, item.z, item.rotation, item.index, item.product.name, item.product.image, item.product);
  }
}

function updateArtworkTextures() {
  if (!cameraPosition || !galleryTextureLoader) return;
  const now = performance.now();
  for (const record of galleryArt) {
    if (!record.imageUrl) continue;
    const distance = Math.hypot(record.group.position.x - cameraPosition.x, record.group.position.z - cameraPosition.z);
    if (distance <= 16) {
      record.lastNearAt = now;
      if (!record.imageLoaded && !record.imageLoading) {
        record.imageLoading = true;
        galleryTextureLoader.load(record.imageUrl, texture => {
          record.imageLoading = false;
          if (!renderer || !scene) { texture.dispose(); return; }
          const currentDistance = Math.hypot(record.group.position.x - cameraPosition.x, record.group.position.z - cameraPosition.z);
          if (currentDistance > 28) { texture.dispose(); return; }
          texture.colorSpace = THREE.SRGBColorSpace;
          texture.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy() || 1);
          texture.generateMipmaps = true;
          texture.minFilter = THREE.LinearMipmapLinearFilter;
          const imageAspect = (texture.image?.width || 1) / (texture.image?.height || 1);
          const width = Math.min(record.maxWidth, record.maxHeight * imageAspect);
          const height = Math.min(record.maxHeight, record.maxWidth / imageAspect);
          record.inner.geometry.dispose();
          record.inner.geometry = new THREE.PlaneGeometry(width, height);
          record.artworkMaterial.map = texture;
          record.artworkMaterial.color.set(0xffffff);
          record.artworkMaterial.needsUpdate = true;
          record.imageLoaded = true;
        }, undefined, () => { record.imageLoading = false; });
      }
    } else if (distance > 30 && record.imageLoaded && now - record.lastNearAt > 900) {
      const texture = record.artworkMaterial.map;
      record.artworkMaterial.map = record.placeholderTexture;
      record.artworkMaterial.color.set(0xffffff);
      record.artworkMaterial.needsUpdate = true;
      record.inner.geometry.dispose();
      record.inner.geometry = new THREE.PlaneGeometry(record.maxWidth, record.maxHeight);
      record.imageLoaded = false;
      if (texture && texture !== record.placeholderTexture) texture.dispose();
    }
  }
}

function animate() {
  if (!entered) return;
  animationFrame = requestAnimationFrame(animate);
  const delta = clock.getDelta();
  updateMovement(delta);
  buildNearbyArtworkBatch();
  updateArtworkTextures();
  renderer.render(scene, camera);
}

function onResize() {
  if (!renderer || !camera) return;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.fov = 57;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
  renderer.setSize(window.innerWidth, window.innerHeight, false);
}

function setHeld(name, on) {
  if (on) held.add(name); else held.delete(name);
  document.querySelectorAll('[data-move="' + name + '"]').forEach(button => button.classList.toggle('is-active', on));
}

function navigateToWallArtwork(side) {
  if (!entered || focusTransition || !galleryArt.length) return;
  const candidates = galleryArt.filter(record => side === 'left' ? record.group.position.x < 0 : record.group.position.x > 0);
  if (!candidates.length) return;
  // Pick the closest frame along the corridor, then move to a centered, front-facing viewing position.
  candidates.sort((a, b) => Math.abs(a.group.position.z - cameraPosition.z) - Math.abs(b.group.position.z - cameraPosition.z));
  const record = candidates[0];
  const normal = new THREE.Vector3(0, 0, 1).applyQuaternion(record.group.quaternion).normalize();
  const destination = record.group.position.clone().addScaledVector(normal, 2.65);
  destination.y = 1.65;
  const dx = record.group.position.x - destination.x;
  const dy = record.group.position.y - destination.y;
  const dz = record.group.position.z - destination.z;
  const horizontal = Math.hypot(dx, dz);
  const destinationYaw = Math.atan2(-dx, -dz);
  const destinationPitch = Math.atan2(dy, horizontal);
  focusTransition = {
    fromPosition: cameraPosition.clone(), toPosition: destination,
    fromYaw: yaw, toYaw: destinationYaw,
    fromPitch: pitch, toPitch: destinationPitch,
    startedAt: performance.now(), duration: prefersReducedMotion ? 20 : 950,
    artwork: record
  };
  cameraVelocity.set(0, 0, 0);
  held.clear();
  document.querySelectorAll('[data-move]').forEach(button => button.classList.remove('is-active'));
  statusText.textContent = 'در حال قرارگیری دقیق روبه‌روی تابلو...';
  titleText.textContent = String(record.product?.name || record.title || 'گالری آثار گیلاس آرت');
}

function bindControls() {
  if (controlsBound) return;
  controlsBound = true;
  document.querySelectorAll('[data-move]').forEach(button => {
    const name = button.dataset.move;
    const down = (event) => {
      event.preventDefault();
      if (name === 'left' || name === 'right') {
        navigateToWallArtwork(name);
        button.classList.add('is-active');
        setTimeout(() => button.classList.remove('is-active'), 180);
        return;
      }
      setHeld(name, true);
      try { button.setPointerCapture(event.pointerId); } catch {}
    };
    const up = (event) => { event.preventDefault(); setHeld(name, false); };
    button.addEventListener('pointerdown', down);
    ['pointerup','pointercancel','lostpointercapture','pointerleave'].forEach(type => button.addEventListener(type, up));
    button.addEventListener('contextmenu', e => e.preventDefault());
  });
  window.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    const map = { w:'forward', arrowup:'forward', s:'back', arrowdown:'back', a:'left', arrowleft:'left', d:'right', arrowright:'right', shift:'shift' };
    if (map[key]) {
      event.preventDefault();
      if (map[key] === 'left' || map[key] === 'right') {
        if (!event.repeat) navigateToWallArtwork(map[key]);
      } else setHeld(map[key], true);
    }
    if (key === 'escape' && entered) exitGallery();
  });
  window.addEventListener('keyup', (event) => {
    const key = event.key.toLowerCase();
    const map = { w:'forward', arrowup:'forward', s:'back', arrowdown:'back', a:'left', arrowleft:'left', d:'right', arrowright:'right', shift:'shift' };
    if (map[key]) setHeld(map[key], false);
  });
  window.addEventListener('blur', () => held.clear());
  canvas.style.touchAction = 'none';
  canvas.addEventListener('pointerdown', (event) => {
    dragMoved = false;
    try { canvas.setPointerCapture(event.pointerId); } catch {}
    if (event.pointerType === 'touch') {
      event.preventDefault();
      touchPointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      previousTouchGesture = getTouchGesture();
      dragging = true;
      return;
    }
    dragging = true; lastPointerX = event.clientX; lastPointerY = event.clientY;
  });
  canvas.addEventListener('pointermove', (event) => {
    if (event.pointerType === 'touch' && touchPointers.has(event.pointerId)) {
      event.preventDefault();
      const previous = touchPointers.get(event.pointerId);
      if (Math.abs(event.clientX - previous.x) + Math.abs(event.clientY - previous.y) > 4) dragMoved = true;
      touchPointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      const current = getTouchGesture();
      if (current && previousTouchGesture) {
        if (current.count === 1 && previousTouchGesture.count === 1) {
          // One finger: look around the gallery.
          yawVelocity -= (current.x - previousTouchGesture.x) * .042;
          pitchVelocity -= (current.y - previousTouchGesture.y) * .03;
        } else if (current.count >= 2 && previousTouchGesture.count >= 2) {
          // Two fingers: pan through the gallery and pinch to move closer/farther.
          const dx = current.x - previousTouchGesture.x;
          const dy = current.y - previousTouchGesture.y;
          const direction = new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw));
          const strafe = new THREE.Vector3(Math.cos(yaw), 0, -Math.sin(yaw));
          cameraPosition.addScaledVector(strafe, -dx * .035);
          cameraPosition.addScaledVector(direction, -dy * .035);
          const pinchDelta = current.distance - previousTouchGesture.distance;
          if (Math.abs(pinchDelta) > 1) cameraPosition.addScaledVector(direction, pinchDelta * .055);
          clampCamera();
          cameraVelocity.set(0, 0, 0);
          cameraTarget.copy(cameraPosition);
        }
      }
      previousTouchGesture = current;
      lastPointerX = event.clientX; lastPointerY = event.clientY;
      return;
    }
    if (!dragging || event.pointerType === 'touch') return;
    if (Math.abs(event.clientX - lastPointerX) + Math.abs(event.clientY - lastPointerY) > 5) dragMoved = true;
    const deltaX = event.clientX - lastPointerX;
    const deltaY = event.clientY - lastPointerY;
    // Convert mouse deltas into short angular impulses; damping supplies the after-motion.
    yawVelocity -= deltaX * .042;
    pitchVelocity -= deltaY * .03;
    lastPointerX = event.clientX; lastPointerY = event.clientY;
  });
  function getTouchGesture() {
    const points = [...touchPointers.values()];
    if (!points.length) return null;
    const x = points.reduce((sum, point) => sum + point.x, 0) / points.length;
    const y = points.reduce((sum, point) => sum + point.y, 0) / points.length;
    let distance = 0;
    if (points.length >= 2) distance = Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
    return { count: points.length, x, y, distance };
  }
  const stopDrag = (event) => {
    if (event?.pointerId != null) touchPointers.delete(event.pointerId);
    previousTouchGesture = getTouchGesture();
    dragging = touchPointers.size > 0;
    if (!dragging) { dragging = false; previousTouchGesture = null; }
  };
  ['pointerup','pointercancel','lostpointercapture'].forEach(type => canvas.addEventListener(type, stopDrag));
  canvas.addEventListener('click', onArtworkClick);
  $('artwork-panel-close').addEventListener('click', closeArtworkPanel);
  $('artwork-panel-cart')?.addEventListener('click', () => {
    const product = activeArtwork?.product;
    if (!product) return;
    const intent = {
      productId: product.id,
      slug: product.slug,
      sku: product.sku,
      quantity: 1,
      price: product.price,
      source: 'virtual-gallery'
    };
    window.dispatchEvent(new CustomEvent('gilasart:cart:add', { detail: intent }));
    const message = $('artwork-panel-cart-message');
    if (message) message.textContent = 'اتصال سبد خرید هنوز فعال نشده است؛ انتخاب محصول برای اتصال آینده آماده شد.';
    statusText.textContent = 'سبد خرید در حال حاضر فعال نیست.';
  });
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
  const { loadGalleryProducts: loadProductsFromSource } = await import('./product-adapter.js');
  const root = location.pathname.startsWith('/glsArt') ? '/glsArt/' : '/';
  allGalleryProducts = await loadProductsFromSource({
    fallbackUrl: root + 'data/storefront-index.json'
  });
  if (!allGalleryProducts.length) throw new Error('فهرست آثار گالری بارگذاری نشد؛ برای جلوگیری از نمایش گالری ناقص، دوباره تلاش کنید.');
  applySelectedGalleryCategory();
}
function applySelectedGalleryCategory() {
  selectedGalleryCategory = 'all';
  galleryProducts = [...allGalleryProducts];
}

async function enterGallery() {
  if (entered) return;
  welcome.hidden = true; loading.hidden = false; errorBox.hidden = true;
  try {
    if (!THREE) THREE = await loadThreeModule();
    if (!cameraTarget) {
      cameraTarget = new THREE.Vector3(0, 1.65, 4.8);
      cameraPosition = new THREE.Vector3(0, 1.65, 8.8);
      cameraVelocity = new THREE.Vector3();
      desiredVelocity = new THREE.Vector3();
    }
    if (!moveVector) {
      moveVector = new THREE.Vector3();
      targetVector = new THREE.Vector3();
      forward = new THREE.Vector3();
      right = new THREE.Vector3();
      raycaster = new THREE.Raycaster();
      pointerNdc = new THREE.Vector2();
    }
    if (!renderer) {
      await loadGalleryProducts();
      setupScene();
    }
    bindControls();
    focusTransition = null; focusReturn = null; activeArtwork = null;
    closeArtworkPanel();
    cameraTarget.set(0, 1.65, 4.8);
    cameraPosition.set(0, 1.65, 8.8);
    cameraVelocity.set(0, 0, 0); desiredVelocity.set(0, 0, 0);
    yawVelocity = 0; pitchVelocity = 0;
    // Face the first left-wall artwork on entry; portrait mobile FOV otherwise hides side-wall art.
    yaw = Math.atan2(8.91, 3.8); pitch = 0; camera.position.copy(cameraPosition); camera.rotation.set(0, 0, 0);
    shell.hidden = false;
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    loading.hidden = true;
    entered = true;
    statusText.textContent = 'از کنترل‌ها برای قدم‌زدن در گالری استفاده کنید.';
    titleText.textContent = 'گالری آثار گیلاس آرت';
    if (!prefersReducedMotion) {
      cameraPosition.set(0, 2.15, 10.5);
      buildNearbyArtworkBatch();
      cameraTarget.set(0, 1.65, 4.8);
      cameraVelocity.set(0, 0, 0);
      const start = performance.now();
      const duration = 2100;
      const intro = () => {
        if (!entered) return;
        const t = Math.min(1, (performance.now() - start) / duration);
        const eased = 1 - Math.pow(1 - t, 4);
        camera.position.set(0, 2.15 - .5 * eased, 10.5 - 5.7 * eased);
        camera.rotation.set(0, yaw * eased, 0, 'YXZ');
        renderer.render(scene, camera);
        if (t < 1) requestAnimationFrame(intro);
        else { cameraPosition.copy(cameraTarget); cameraVelocity.set(0, 0, 0); animate(); }
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
