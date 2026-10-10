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
const joystickState = { lookX: 0, lookY: 0, moveX: 0, moveY: 0 };
let clientClockTimer = 0;
let lastClockSecond = -1;
let grandfatherClock = null;
let artworkLoadingHideTimer = 0;
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

function addWallArt(x, z, rotation, index, title, imageUrl = '', product = null) {
  const group = new THREE.Group();
  group.position.set(x, 2.05, z);
  group.rotation.y = rotation;
  const maxWidth = 1.82, maxHeight = 2.08;
  // Use an untinted, unlit surface: product images keep their original color and aspect ratio.
  const artworkMaterial = new THREE.MeshBasicMaterial({ color: 0xf4efe6, side: THREE.DoubleSide, toneMapped: false });
  const inner = new THREE.Mesh(new THREE.PlaneGeometry(maxWidth, maxHeight), artworkMaterial);
  inner.position.z = .025;
  group.add(inner);
  scene.add(group);
  const record = {
    group, title, index, product, hitMeshes: [inner], inner,
    imageUrl: imageUrl ? galleryImageUrl(imageUrl) : '',
    artworkMaterial, imageLoaded: false, imageLoading: false, imageLoadFailed: false,
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

function addEntranceDoor(wallMaterial, doorMaterial, floorMaterial, ceilingMaterial) {
  const wallZ = bounds.zMax + 2.6, doorZ = wallZ - .78;
  const entranceDepth = wallZ - bounds.zMax;
  const extensionFloor = new THREE.Mesh(new THREE.PlaneGeometry(18, entranceDepth), floorMaterial);
  extensionFloor.rotation.x = -Math.PI / 2; extensionFloor.position.set(0, .006, (wallZ + bounds.zMax) / 2); scene.add(extensionFloor);
  const extensionCeiling = new THREE.Mesh(new THREE.PlaneGeometry(18, entranceDepth), ceilingMaterial);
  extensionCeiling.rotation.x = Math.PI / 2; extensionCeiling.position.set(0, 4.2, (wallZ + bounds.zMax) / 2); scene.add(extensionCeiling);
  for (const side of [-1, 1]) {
    const extension = new THREE.Mesh(new THREE.PlaneGeometry(entranceDepth, 4.2), wallMaterial);
    extension.rotation.y = side < 0 ? Math.PI / 2 : -Math.PI / 2;
    extension.position.set(side * 9, 2.1, (wallZ + bounds.zMax) / 2); scene.add(extension);
  }
  const sideWidth = (18 - 3.7) / 2;
  for (const side of [-1, 1]) {
    const panel = new THREE.Mesh(new THREE.PlaneGeometry(sideWidth, 4.2), wallMaterial);
    panel.position.set(side * (1.85 + sideWidth / 2), 2.1, wallZ); scene.add(panel);
  }
  const upperPanel = new THREE.Mesh(new THREE.PlaneGeometry(3.7, .62), wallMaterial);
  upperPanel.position.set(0, 3.89, wallZ); scene.add(upperPanel);
  const gold = new THREE.MeshStandardMaterial({ color: 0x9b6b31, metalness: .62, roughness: .32 });
  for (const side of [-1, 1]) {
    const post = new THREE.Mesh(new THREE.BoxGeometry(.19, 3.78, .16), gold);
    post.position.set(side * 1.82, 1.89, doorZ); scene.add(post);
    const capital = new THREE.Mesh(new THREE.BoxGeometry(.34, .16, .23), gold);
    capital.position.set(side * 1.82, 3.78, doorZ); scene.add(capital);
  }
  const lintel = new THREE.Mesh(new THREE.BoxGeometry(3.82, .22, .18), gold);
  lintel.position.set(0, 3.78, doorZ); scene.add(lintel);
  const crown = new THREE.Mesh(new THREE.BoxGeometry(4.05, .12, .24), gold);
  crown.position.set(0, 3.94, doorZ); scene.add(crown);
  const leaf = new THREE.Group();
  leaf.position.set(-1.72, 0, doorZ - .03); leaf.rotation.y = -.58; scene.add(leaf);
  const slab = new THREE.Mesh(new THREE.BoxGeometry(3.28, 3.52, .14), doorMaterial);
  slab.position.set(1.64, 1.76, 0); leaf.add(slab);
  for (const y of [.62, 1.78, 2.82]) {
    const h = y === 1.78 ? .78 : .62;
    const trim = new THREE.Mesh(new THREE.BoxGeometry(2.68, h, .035), gold);
    trim.position.set(1.64, y, .09); leaf.add(trim);
    const inset = new THREE.Mesh(new THREE.BoxGeometry(2.5, h - .16, .04), doorMaterial);
    inset.position.set(1.64, y, .115); leaf.add(inset);
  }
  for (const x of [.25, 3.03]) {
    const stile = new THREE.Mesh(new THREE.BoxGeometry(.07, 3.35, .04), gold);
    stile.position.set(x, 1.76, .105); leaf.add(stile);
  }
  const knob = new THREE.Mesh(new THREE.SphereGeometry(.095, 16, 12), new THREE.MeshStandardMaterial({ color: 0xe1bd68, metalness: .78, roughness: .2 }));
  knob.position.set(2.92, 1.72, .18); leaf.add(knob);
  const rosette = new THREE.Mesh(new THREE.TorusGeometry(.14, .025, 8, 24), gold);
  rosette.position.set(2.92, 1.72, .17); leaf.add(rosette);
  const light = new THREE.PointLight(0xffd99a, .42, 8, 1.8);
  light.position.set(0, 3.15, doorZ - .35); scene.add(light);
}
function addCeilingTileGrid(corridorLength, corridorCenter) {
  const grout = new THREE.MeshStandardMaterial({ color: 0x8c785c, roughness: .88, metalness: .02, transparent: true, opacity: .68 });
  const y = 4.16;
  for (let x = -8.25; x <= 8.25; x += 1.5) {
    const line = new THREE.Mesh(new THREE.BoxGeometry(.018, .025, corridorLength), grout);
    line.position.set(x, y, corridorCenter); scene.add(line);
  }
  for (let z = bounds.zMin + .5; z < bounds.zMax; z += 1.5) {
    const line = new THREE.Mesh(new THREE.BoxGeometry(18, .025, .018), grout);
    line.position.set(0, y, z); scene.add(line);
  }
}
function addGrandfatherClock(woodMaterial) {
  const root = new THREE.Group(); root.position.set(-7.75, .04, 4.15); root.rotation.y = Math.PI / 2; scene.add(root);
  const wood = woodMaterial;
  const body = new THREE.Mesh(new THREE.BoxGeometry(.82, 2.82, .48), wood); body.position.set(0, 1.41, 0); root.add(body);
  const plinth = new THREE.Mesh(new THREE.BoxGeometry(1.02, .18, .62), wood); plinth.position.set(0, .09, .02); root.add(plinth);
  const crown = new THREE.Mesh(new THREE.BoxGeometry(1.04, .2, .62), wood); crown.position.set(0, 2.8, .02); root.add(crown);
  const arch = new THREE.Mesh(new THREE.SphereGeometry(.48, 24, 14, 0, Math.PI * 2, 0, Math.PI / 2), wood);
  arch.scale.set(1, .55, .65); arch.position.set(0, 2.88, .02); root.add(arch);
  const brass = new THREE.MeshStandardMaterial({ color: 0xc7a15c, metalness: .72, roughness: .28 });
  const face = new THREE.Mesh(new THREE.CircleGeometry(.3, 40), new THREE.MeshStandardMaterial({ color: 0xf0e5cd, roughness: .78 }));
  face.position.set(0, 2.28, .255); root.add(face);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(.32, .035, 10, 48), brass); rim.position.set(0, 2.28, .26); root.add(rim);
  for (let i = 0; i < 12; i++) {
    const a = i * Math.PI / 6, mark = new THREE.Mesh(new THREE.BoxGeometry(.018, .055, .012), brass);
    mark.position.set(Math.sin(a) * .245, 2.28 + Math.cos(a) * .245, .272); mark.rotation.z = -a; root.add(mark);
  }
  const hand = (length, width, color, z) => {
    const g = new THREE.Group(); g.position.set(0, 2.28, z);
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, length, .012), new THREE.MeshStandardMaterial({ color, metalness: .35, roughness: .38 }));
    mesh.position.y = length / 2; g.add(mesh); root.add(g); return g;
  };
  const hourHand = hand(.16, .025, 0x5c3820, .29), minuteHand = hand(.22, .018, 0x4a3323, .30), secondHand = hand(.245, .008, 0x9d422f, .31);
  const pendulum = new THREE.Group(); pendulum.position.set(0, 1.73, .255); root.add(pendulum);
  const rod = new THREE.Mesh(new THREE.BoxGeometry(.025, .62, .025), brass); rod.position.y = -.32; pendulum.add(rod);
  const bob = new THREE.Mesh(new THREE.SphereGeometry(.135, 20, 16), brass); bob.scale.set(1, 1.18, .38); bob.position.y = -.66; pendulum.add(bob);
  const glass = new THREE.Mesh(new THREE.PlaneGeometry(.62, 1), new THREE.MeshPhysicalMaterial({ color: 0x9b8667, transparent: true, opacity: .12, roughness: .1 }));
  glass.position.set(0, 1.05, .27); root.add(glass);
  grandfatherClock = { root, pendulum, hourHand, minuteHand, secondHand }; updateGrandfatherClockHands(new Date());
}
function updateGrandfatherClockHands(now = new Date()) {
  if (!grandfatherClock) return;
  const seconds = now.getSeconds() + now.getMilliseconds() / 1000, minutes = now.getMinutes() + seconds / 60, hours = (now.getHours() % 12) + minutes / 60;
  grandfatherClock.secondHand.rotation.z = -(seconds / 60) * Math.PI * 2;
  grandfatherClock.minuteHand.rotation.z = -(minutes / 60) * Math.PI * 2;
  grandfatherClock.hourHand.rotation.z = -(hours / 12) * Math.PI * 2;
}

function addGalleryDecor(corridorLength, corridorCenter) {
  const rugCanvas = document.createElement('canvas'); rugCanvas.width = 256; rugCanvas.height = 512;
  const rc = rugCanvas.getContext('2d');
  rc.fillStyle = '#681c25'; rc.fillRect(0, 0, 256, 512);
  rc.fillStyle = '#7e2630'; rc.fillRect(14, 14, 228, 484);
  rc.strokeStyle = '#c7a05c'; rc.lineWidth = 5; rc.strokeRect(20, 20, 216, 472);
  rc.lineWidth = 1.5; rc.strokeRect(30, 30, 196, 452);
  for (let y = 44; y < 480; y += 24) {
    rc.beginPath(); rc.moveTo(36, y); rc.lineTo(220, y);
    rc.strokeStyle = 'rgba(224,187,119,.24)'; rc.lineWidth = 1; rc.stroke();
    rc.fillStyle = '#d9b875'; rc.fillRect(26, y - 3, 4, 6); rc.fillRect(226, y - 3, 4, 6);
  }
  const rugTexture = new THREE.CanvasTexture(rugCanvas); rugTexture.colorSpace = THREE.SRGBColorSpace;
  const rugMaterial = new THREE.MeshStandardMaterial({ map: rugTexture, roughness: .98, metalness: 0, side: THREE.DoubleSide });
  // Continuous Persian-red carpet from the entrance to the far end of the corridor.
  const carpetLength = Math.max(8, corridorLength - .45);
  const carpet = new THREE.Mesh(new THREE.PlaneGeometry(3.6, carpetLength), rugMaterial);
  carpet.rotation.x = -Math.PI / 2; carpet.position.set(0, .025, corridorCenter); scene.add(carpet);
  const carpetEdgeMaterial = new THREE.MeshStandardMaterial({ color: 0xb18a46, roughness: .76, metalness: .12 });
  for (const side of [-1, 1]) {
    const edge = new THREE.Mesh(new THREE.BoxGeometry(.035, .012, carpetLength), carpetEdgeMaterial);
    edge.position.set(side * 1.82, .03, corridorCenter); scene.add(edge);
  }
  const ceramic = new THREE.MeshStandardMaterial({ color: 0x9a4b32, roughness: .32, metalness: .04 });
  const ceramicAccent = new THREE.MeshStandardMaterial({ color: 0xd0ad70, roughness: .42, metalness: .45 });
  const vaseGeometry = new THREE.LatheGeometry([
    new THREE.Vector2(0, 0), new THREE.Vector2(.18, .03), new THREE.Vector2(.28, .18),
    new THREE.Vector2(.3, .42), new THREE.Vector2(.22, .62), new THREE.Vector2(.12, .72),
    new THREE.Vector2(.1, .82), new THREE.Vector2(.14, .88), new THREE.Vector2(.11, .91)
  ], 20);
  for (let z = 2.5, i = 0; z > bounds.zMin + 2.5; z -= 10.2, i++) {
    const x = i % 2 ? 6.8 : -6.8;
    const vase = new THREE.Mesh(vaseGeometry, ceramic);
    vase.position.set(x, .04, z); vase.scale.set(1.05, 1.18, 1.05); scene.add(vase);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(.125, .018, 6, 24), ceramicAccent);
    ring.rotation.x = Math.PI / 2; ring.position.set(x, .88, z); scene.add(ring);
    for (let leaf = 0; leaf < 4; leaf++) {
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(.012, .018, .48 + leaf * .08, 5),
        new THREE.MeshStandardMaterial({ color: 0x586747, roughness: .95 }));
      stem.position.set(x + Math.sin(leaf * 1.7) * .12, 1.28 + leaf * .025, z + Math.cos(leaf * 1.7) * .1);
      stem.rotation.z = (leaf - 1.5) * .18; scene.add(stem);
      const leafMesh = new THREE.Mesh(new THREE.SphereGeometry(.11, 7, 5),
        new THREE.MeshStandardMaterial({ color: leaf % 2 ? 0x75845b : 0x4e6845, roughness: .98 }));
      leafMesh.scale.set(1.8, .45, .72);
      leafMesh.position.set(stem.position.x + Math.sin(leaf) * .14, stem.position.y + .18, stem.position.z + Math.cos(leaf) * .12);
      leafMesh.rotation.z = stem.rotation.z; scene.add(leafMesh);
    }
  }
}

function setupScene() {
  const rows = Math.max(5, Math.ceil(galleryProducts.length / 2));
  const corridorLength = Math.max(30, (rows - 1) * 3.1 + 12);
  bounds.zMin = -Math.max(10.5, (rows - 1) * 3.1 + 4.5);
  const corridorCenter = (bounds.zMax + bounds.zMin) / 2;
  galleryArt.length = 0;
  scene = new THREE.Scene();
  sceneCategory = selectedGalleryCategory;
  // Fixed exhibition ambience: independent of real-world time and the website theme.
  scene.background = new THREE.Color(0xf0e7d8);
  scene.fog = new THREE.Fog(0xf0e7d8, 38, 118);
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
  marbleBase.addColorStop(0, '#e8ddca'); marbleBase.addColorStop(.48, '#d6c8b1'); marbleBase.addColorStop(1, '#f3eadb');
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
    marbleContext.strokeStyle = vein % 5 === 0 ? 'rgba(142,111,73,.24)' : 'rgba(132,119,100,.13)';
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
  const ambient = new THREE.AmbientLight(0xfff0d8, 1.05); scene.add(ambient);
  const hemisphere = new THREE.HemisphereLight(0xfff7e9, 0x81705b, .88); scene.add(hemisphere);
  const galleryFill = new THREE.DirectionalLight(0xffe6bf, .24); galleryFill.position.set(-3, 7, 5); galleryFill.castShadow = false; scene.add(galleryFill);
  const ceilingMaterial = new THREE.MeshStandardMaterial({ color: 0xf2e7d5, roughness: .98, metalness: 0, side: THREE.DoubleSide });
  const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(18, corridorLength), ceilingMaterial);
  ceiling.rotation.x = Math.PI / 2; ceiling.position.set(0, 4.2, corridorCenter); scene.add(ceiling);
  const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, map: marbleTexture, roughness: .68, metalness: 0, side: THREE.DoubleSide });
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
  const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xf4ead8, map: velvetTexture, roughness: .98, metalness: 0, side: THREE.DoubleSide });
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

  // Real CC0 marble texture from Poly Haven; procedural stone remains the offline fallback.
  const surfaceLoader = new THREE.TextureLoader();
  surfaceLoader.setCrossOrigin('anonymous');
  const stoneTextureUrl = 'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/marble_01/marble_01_diff_1k.jpg';
  const velvetTextureUrl = 'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/velour_velvet/velour_velvet_diff_1k.jpg';
  const loadSurfaceTexture = (material, textureUrl, repeatX, repeatY, tint = 0xffffff) => surfaceLoader.load(textureUrl, texture => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(repeatX, repeatY);
    texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy() || 1);
    material.map = texture;
    material.color.setHex(tint);
    material.needsUpdate = true;
  }, undefined, () => { /* Keep the local procedural texture if the remote texture is unavailable. */ });
  const loadStoneSurface = (material, repeatX, repeatY) => loadSurfaceTexture(material, stoneTextureUrl, repeatX, repeatY);
  const loadVelvetSurface = (material, repeatX, repeatY) => loadSurfaceTexture(material, velvetTextureUrl, repeatX, repeatY, 0x98745d);
  loadStoneSurface(floorMaterial, 2.4, Math.max(4, corridorLength / 5));
  const ceilingTilesUrl = 'https://dl.polyhaven.org/file/ph-assets/Textures/png/1k/large_floor_tiles_02/large_floor_tiles_02_diff_1k.png';
  loadSurfaceTexture(ceilingMaterial, ceilingTilesUrl, 4, Math.max(5, corridorLength / 2.2), 0xf2e7d5);
  addCeilingTileGrid(corridorLength, corridorCenter);
  const woodTextureUrl = 'https://dl.polyhaven.org/file/ph-assets/Textures/png/1k/dark_wooden_planks/dark_wooden_planks_diff_1k.png';
  const doorMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: .42, metalness: .08, side: THREE.DoubleSide });
  const clockWoodMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: .5, metalness: .04 });
  loadSurfaceTexture(doorMaterial, woodTextureUrl, 1.2, 1, 0xffffff);
  loadSurfaceTexture(clockWoodMaterial, woodTextureUrl, 1.1, 1.2, 0xffffff);
  addEntranceDoor(wallMaterial, doorMaterial, floorMaterial, ceilingMaterial);
  addGrandfatherClock(clockWoodMaterial);
  loadVelvetSurface(wallMaterial, Math.max(2, corridorLength / 9), 1.25);
  addGalleryDecor(corridorLength, corridorCenter);

  artworkQueue.length = 0; nextArtworkIndex = 0;
  galleryProducts.forEach((product, index) => {
    const row = Math.floor(index / 2), left = index % 2 === 0;
    artworkQueue.push({ product, index, x: left ? -8.91 : 8.91, z: 1 - row * 3.1, rotation: left ? Math.PI / 2 : -Math.PI / 2 });
  });
  // Wider architectural piers break up the long-hall rhythm.
  for (let i = 0; i < rows; i += 4) { const z = -2.2 - i * 3.1; addPillar(-7.25, z); addPillar(7.25, z - 1.45); }
  const endGlow = new THREE.PointLight(0xffe3b8, .65, 16, 1.8); endGlow.position.set(0, 2.4, bounds.zMin + 1.5); scene.add(endGlow);
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
  if (Math.abs(joystickState.lookX) > .08) yawVelocity = -joystickState.lookX * 1.9;
  if (Math.abs(joystickState.lookY) > .12) pitchVelocity = joystickState.lookY * .85;
  moveVector.set(0, 0, 0);
  if (held.has('forward') || held.has('w') || held.has('arrowup')) moveVector.add(forward);
  if (held.has('back') || held.has('s') || held.has('arrowdown')) moveVector.sub(forward);
  if (held.has('right') || held.has('d') || held.has('arrowright')) moveVector.add(right);
  if (held.has('left') || held.has('a') || held.has('arrowleft')) moveVector.sub(right);
  if (Math.abs(joystickState.moveY) > .08) moveVector.addScaledVector(forward, -joystickState.moveY);
  if (Math.abs(joystickState.moveX) > .12) moveVector.addScaledVector(right, joystickState.moveX * .7);

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

function syncArtworkLoadingIndicator(message = '') {
  const node = $('artwork-loading'); if (!node) return;
  clearTimeout(artworkLoadingHideTimer);
  const count = galleryArt.filter(record => record.imageLoading).length, label = $('artwork-loading-text');
  if (count) { node.hidden = false; if (label) label.textContent = count === 1 ? 'در حال بارگذاری تصویر اثر...' : 'در حال بارگذاری ' + count + ' تصویر...'; }
  else if (message) { node.hidden = false; if (label) label.textContent = message; artworkLoadingHideTimer = window.setTimeout(() => { node.hidden = true; }, 2200); }
  else node.hidden = true;
}

function updateArtworkTextures() {
  if (!cameraPosition || !galleryTextureLoader) return;
  const now = performance.now();
  for (const record of galleryArt) {
    if (!record.imageUrl) continue;
    const distance = Math.hypot(record.group.position.x - cameraPosition.x, record.group.position.z - cameraPosition.z);
    if (distance <= 16) {
      record.lastNearAt = now;
      if (!record.imageLoaded && !record.imageLoading && !record.imageLoadFailed) {
        record.imageLoading = true; syncArtworkLoadingIndicator();
        galleryTextureLoader.load(record.imageUrl, texture => {
          record.imageLoading = false; syncArtworkLoadingIndicator();
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
        }, undefined, () => { record.imageLoading = false; record.imageLoadFailed = true; syncArtworkLoadingIndicator('بارگذاری تصویر این اثر انجام نشد.'); });
      }
    } else if (distance > 30 && record.imageLoadFailed) {
      record.imageLoadFailed = false;
    } else if (distance > 30 && record.imageLoaded && now - record.lastNearAt > 900) {
      const texture = record.artworkMaterial.map;
      record.artworkMaterial.map = null;
      record.artworkMaterial.color.set(0xf4efe6);
      record.artworkMaterial.needsUpdate = true;
      record.inner.geometry.dispose();
      record.inner.geometry = new THREE.PlaneGeometry(record.maxWidth, record.maxHeight);
      record.imageLoaded = false;
      if (texture) texture.dispose();
    }
  }
}

function animate() {
  if (!entered) return;
  animationFrame = requestAnimationFrame(animate);
  const delta = clock.getDelta();
  if (grandfatherClock?.pendulum) grandfatherClock.pendulum.rotation.z = Math.sin(performance.now() * .00165) * .22;
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

function updateClientClock() {
  const node = $('client-clock');
  if (!node) return;
  const now = new Date();
  const second = Math.floor(now.getTime() / 1000);
  if (second === lastClockSecond) return;
  lastClockSecond = second;
  node.dateTime = now.toISOString();
  node.textContent = new Intl.DateTimeFormat('fa-IR', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23'
  }).format(now);
  updateGrandfatherClockHands(now);
}
function startClientClock() {
  clearInterval(clientClockTimer);
  updateClientClock();
  clientClockTimer = window.setInterval(updateClientClock, 1000);
}
function bindJoysticks() {
  document.querySelectorAll('[data-joystick]').forEach(base => {
    const kind = base.dataset.joystick;
    const knob = base.querySelector('.joystick__knob');
    if (!knob || base.dataset.bound === 'true') return;
    base.dataset.bound = 'true';
    let pointerId = null;
    const update = event => {
      if (pointerId !== event.pointerId) return;
      event.preventDefault();
      const rect = base.getBoundingClientRect();
      const radius = Math.min(rect.width, rect.height) * .34;
      let dx = event.clientX - (rect.left + rect.width / 2);
      let dy = event.clientY - (rect.top + rect.height / 2);
      const length = Math.hypot(dx, dy);
      if (length > radius) { dx = dx / length * radius; dy = dy / length * radius; }
      const nx = dx / radius, ny = dy / radius;
      knob.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
      if (kind === 'combined') { joystickState.lookX = nx; joystickState.lookY = 0; joystickState.moveX = 0; joystickState.moveY = ny; }
      else if (kind === 'look') { joystickState.lookX = nx; joystickState.lookY = ny; }
      else { joystickState.moveX = nx; joystickState.moveY = ny; }
    };
    const release = event => {
      if (pointerId !== event.pointerId) return;
      pointerId = null;
      try { base.releasePointerCapture(event.pointerId); } catch {}
      knob.style.transform = 'translate(0,0)';
      if (kind === 'combined') { joystickState.lookX = 0; joystickState.lookY = 0; joystickState.moveX = 0; joystickState.moveY = 0; }
      else if (kind === 'look') { joystickState.lookX = 0; joystickState.lookY = 0; }
      else { joystickState.moveX = 0; joystickState.moveY = 0; }
    };
    base.addEventListener('pointerdown', event => {
      event.preventDefault(); pointerId = event.pointerId;
      try { base.setPointerCapture(pointerId); } catch {}
      update(event);
    });
    base.addEventListener('pointermove', update);
    ['pointerup','pointercancel','lostpointercapture'].forEach(type => base.addEventListener(type, release));
    base.addEventListener('contextmenu', event => event.preventDefault());
  });
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
  bindJoysticks();
  startClientClock();
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
  $('artwork-panel-cart')?.addEventListener('click', async event => {
    const product = activeArtwork?.product;
    const button = event.currentTarget;
    const message = $('artwork-panel-cart-message');
    if (!product || !button || button.disabled) return;
    button.disabled = true;
    const originalLabel = button.textContent;
    button.textContent = 'در حال افزودن…';
    if (message) message.textContent = 'در حال بررسی حساب و افزودن اثر به سبد خرید…';
    const apiOrigins = ['https://api.gilasart.ir', 'https://gilasartworker.gilasart-ir-ac.workers.dev'];
    const request = async (path, options = {}) => {
      let lastError;
      for (const origin of apiOrigins) {
        try {
          const response = await fetch(origin + path, {
            ...options,
            credentials: 'include',
            cache: 'no-store',
            headers: { Accept: 'application/json', ...(options.headers || {}) }
          });
          const raw = await response.text();
          let data = {};
          try { data = raw ? JSON.parse(raw) : {}; } catch {}
          if (!response.ok) {
            const error = new Error(String(data.error || data.message || 'درخواست انجام نشد.'));
            error.status = response.status;
            if ([502, 503, 504].includes(response.status)) { lastError = error; continue; }
            throw error;
          }
          return data;
        } catch (error) {
          if (error instanceof TypeError) { lastError = error; continue; }
          throw error;
        }
      }
      throw lastError || new Error('ارتباط با سرویس فروشگاه برقرار نشد.');
    };
    try {
      const session = await request('/api/me');
      if (!session?.user) {
        if (message) message.textContent = 'برای افزودن اثر، ابتدا وارد حساب کاربری شوید.';
        window.location.assign('/account');
        return;
      }
      const token = String(session.csrfToken || '');
      if (!token) throw new Error('جلسه خرید معتبر نیست؛ لطفاً دوباره وارد حساب شوید.');
      await request('/api/cart', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-csrf-token': token },
        body: JSON.stringify({ productId: product.id, quantity: 1, options: [] })
      });
      if (message) message.textContent = 'این اثر با موفقیت به سبد خرید اضافه شد.';
      button.textContent = 'افزوده شد ✓';
      statusText.textContent = 'اثر به سبد خرید شما اضافه شد.';
      window.dispatchEvent(new CustomEvent('gilasart:cart:added', { detail: { productId: product.id, source: 'virtual-gallery' } }));
      window.setTimeout(() => { if (button.isConnected) button.textContent = originalLabel; }, 1800);
    } catch (error) {
      console.error('[GilasArt virtual gallery cart]', error);
      if (message) message.textContent = error?.status === 401 || error?.status === 403
        ? 'برای افزودن اثر، وارد حساب کاربری شوید.'
        : (error?.message || 'افزودن اثر به سبد خرید انجام نشد؛ لطفاً از صفحه محصول دوباره تلاش کنید.');
      if (error?.status === 401 || error?.status === 403) window.location.assign('/account');
      button.textContent = originalLabel;
    } finally {
      button.disabled = false;
    }
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
  joystickState.lookX = joystickState.lookY = joystickState.moveX = joystickState.moveY = 0;
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
      cameraPosition = new THREE.Vector3(0, 1.65, 7.8);
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
    cameraPosition.set(0, 1.65, 7.8);
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
      cameraPosition.set(0, 2.15, 8.0);
      buildNearbyArtworkBatch();
      cameraTarget.set(0, 1.65, 4.8);
      cameraVelocity.set(0, 0, 0);
      const start = performance.now();
      const duration = 2100;
      const intro = () => {
        if (!entered) return;
        const t = Math.min(1, (performance.now() - start) / duration);
        const eased = 1 - Math.pow(1 - t, 4);
        camera.position.set(0, 2.15 - .5 * eased, 8.0 - 3.2 * eased);
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
