import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const [script, markup, styles, adapter] = await Promise.all([
  readFile(new URL('../frontend/public/virtual-gallery/gallery.js', import.meta.url), 'utf8'),
  readFile(new URL('../frontend/public/virtual-gallery/index.html', import.meta.url), 'utf8'),
  readFile(new URL('../frontend/public/virtual-gallery/gallery.css', import.meta.url), 'utf8'),
  readFile(new URL('../frontend/public/virtual-gallery/product-adapter.js', import.meta.url), 'utf8')
]);

test('virtual gallery loads real storefront artwork images and product metadata', () => {
  assert.match(script, /storefront-index\.json/);
  assert.match(script, /galleryTextureLoader\.load\(/);
  assert.match(adapter, /price_irt/);
  assert.match(adapter, /description:/);
});

test('clicking a frameless artwork triggers a cinematic camera focus and product panel', () => {
  assert.match(script, /raycaster\.intersectObjects/);
  assert.match(script, /function focusArtwork\(/);
  assert.match(script, /duration: prefersReducedMotion \? 20 : 1250/);
  assert.match(markup, /id="artwork-panel"/);
  assert.match(markup, /id="artwork-panel-close"/);
  assert.match(markup, /id="artwork-panel-details"/);
  assert.match(styles, /\.artwork-panel\.is-open/);
  assert.match(styles, /@media\(max-width:650px\)/);
});

test('Three.js objects are initialized only after the module is loaded', () => {
  assert.match(script, /let moveVector, targetVector, forward, right, raycaster, pointerNdc/);
  assert.match(script, /let cameraTarget, cameraPosition(?:, cameraVelocity, desiredVelocity)?;/);
  assert.doesNotMatch(script.slice(0, script.indexOf('async function enterGallery')), /const camera(?:Target|Position) = new THREE\.Vector3/);
  assert.match(script, /const THREE_MODULE_URLS = \[[\s\S]*?unpkg\.com\/three@0\.180\.0[\s\S]*?esm\.sh\/three@0\.180\.0/);
  assert.match(script, /if \(!THREE\) THREE = await loadThreeModule\(\);[\s\S]{0,250}if \(!cameraTarget\) \{[\s\S]{0,150}cameraPosition = new THREE\.Vector3/);
});

test('gallery products use an API-ready normalized contract with static JSON as current source', () => {
  assert.match(script, /import\(['"]\.\/product-adapter\.js['"]\)/);
  assert.match(adapter, /export function normalizeGalleryProduct/);
  assert.match(adapter, /id,\s*slug,\s*sku,/);
  assert.match(adapter, /price:\s*\{/);
  assert.match(adapter, /currency:/);
  assert.match(adapter, /availability:/);
  assert.match(adapter, /productsApiUrl/);
  assert.match(adapter, /fallbackUrl/);
  assert.match(adapter, /payload\.products/);
});

test('gallery add-to-cart uses the existing authenticated store API and CSRF token', () => {
  assert.match(markup, /id="artwork-panel-cart"/);
  assert.match(markup, /id="artwork-panel-cart-message"/);
  assert.match(markup, /aria-live="polite"/);
  assert.match(script, /https:\/\/api\.gilasart\.ir/);
  assert.match(script, /request\('\/api\/me'\)/);
  assert.match(script, /session\.csrfToken/);
  assert.match(script, /request\('\/api\/cart',[\s\S]*?method: 'POST'/);
  assert.match(script, /productId: product\.id, quantity: 1, options: \[\]/);
  assert.match(script, /gilasart:cart:added/);
  assert.doesNotMatch(script, /اتصال سبد خرید هنوز فعال نشده است/);
  assert.match(styles, /\.artwork-panel__cart/);
});


test('gallery uses warm fixed lighting, real stone surfaces, and no direct artwork spotlights', () => {
  assert.match(script, /new THREE\.AmbientLight/);
  assert.match(script, /new THREE\.HemisphereLight/);
  assert.match(script, /new THREE\.Fog\(0xf0e7d8, 38, 118\)/);
  assert.match(script, /marble_01_diff_1k\.jpg/);
  assert.match(script, /loadStoneSurface\(floorMaterial/);
  assert.match(script, /loadVelvetSurface\(wallMaterial/);
  assert.match(script, /velour_velvet_diff_1k\.jpg/);
  assert.match(script, /roughness: \.68, metalness: 0/);
  assert.match(script, /new THREE\.MeshBasicMaterial\(\{ color: 0xf4efe6, side: THREE\.DoubleSide, toneMapped: false \}\)/);
  assert.doesNotMatch(script, /new THREE\.SpotLight/);
  assert.match(markup, /gallery\.css\?v=8/);
});

test('camera motion uses velocity damping, angular inertia, and cinematic focus easing', () => {
  assert.match(script, /let cameraTarget, cameraPosition, cameraVelocity, desiredVelocity/);
  assert.match(script, /movementTuning\.acceleration/);
  assert.match(script, /movementTuning\.damping/);
  assert.match(script, /yawVelocity \*= Math\.exp/);
  assert.match(script, /pitchVelocity \*= Math\.exp/);
  assert.match(script, /const eased = 1 - Math\.pow\(1 - progress, 5\)/);
  assert.match(script, /Soft spring forces begin before the hard boundary/);
  assert.match(script, /walkSpeed: 3\.2/);
});


test('gallery has a bright stone finish, decorative rugs and vases, and a fixed field of view', () => {
  assert.match(script, /const marbleCanvas = document\.createElement\('canvas'\)/);
  assert.match(script, /marbleBase\.addColorStop\(0, '#e8ddca'\)/);
  assert.match(script, /function addGalleryDecor\(/);
  assert.match(script, /#681c25/);
  assert.match(script, /new THREE\.LatheGeometry/);
  assert.match(script, /new THREE\.PerspectiveCamera\(57/);
  assert.match(script, /camera\.fov = 57/);
  assert.match(markup, /gallery\.css\?v=8/);
  assert.match(markup, /gallery\.js\?v=16/);
});

test('left and right controls navigate to a centered, front-facing artwork view',()=>{
  assert.match(script,/function navigateToWallArtwork\(side\)/);
  assert.match(script,/candidates\.sort\(\(a, b\) => Math\.abs\(a\.group\.position\.z - cameraPosition\.z\)/);
  assert.match(script,/record\.group\.position\.clone\(\)\.addScaledVector\(normal, 2\.65\)/);
  assert.match(script,/const destinationYaw = Math\.atan2\(-dx, -dz\)/);
  assert.match(script,/if \(name === 'left' \|\| name === 'right'\)\s*\{\s*navigateToWallArtwork\(name\)/);
});


test('virtual gallery supports one-finger look and faster two-finger pan/pinch on touch screens',()=>{
  assert.match(script,/const touchPointers = new Map\(\)/);
  assert.match(script,/canvas\.style\.touchAction = 'none'/);
  assert.match(script,/One finger: look around the gallery/);
  assert.match(script,/Two fingers: pan through the gallery and pinch to move closer\/farther/);
  assert.match(script,/getTouchGesture\(\)/);
  assert.match(script,/cameraPosition\.addScaledVector\(direction, pinchDelta \* \.055\)/);
  assert.match(markup,/gallery\.js\?v=\d+/);
});


test('gallery creates every active product in progressive batches of ten without an artificial cap', () => {
  assert.match(script, /const rows = Math\.max\(5, Math\.ceil\(galleryProducts\.length \/ 2\)\)/);
  assert.match(script, /const ARTWORK_BATCH_SIZE = 10/);
  assert.match(script, /const ARTWORK_BUILD_DISTANCE = 14/);
  assert.match(script, /function buildNearbyArtworkBatch\(\)/);
  assert.match(script, /nextArtworkIndex \+ ARTWORK_BATCH_SIZE/);
  assert.match(script, /buildNearbyArtworkBatch\(\);/);
  assert.doesNotMatch(adapter, /limit = 5000/);
  assert.doesNotMatch(adapter, /slice\(0, limit\)/);
  assert.doesNotMatch(script, /limit: 5000/);
  assert.match(script, /if \(!allGalleryProducts\.length\) throw new Error/);
});
test('virtual gallery hides category controls and always opens the complete active collection', () => {
  assert.doesNotMatch(markup, /data-gallery-category=/);
  assert.doesNotMatch(markup, /category-selector/);
  assert.match(script, /selectedGalleryCategory = 'all'/);
  assert.match(script, /galleryProducts = \[\.\.\.allGalleryProducts\]/);
});

test('artwork wall surfaces do not add a second frame around framed product photos',()=>{
  assert.match(script,/hitMeshes: \[inner\]/);
  assert.doesNotMatch(script,/const outerFrame = new THREE\.Mesh/);
  assert.doesNotMatch(script,/const frameMesh = new THREE\.Mesh/);
});
test('product textures load near the visitor and unload at a distance to preserve memory',()=>{
  assert.match(script,/function updateArtworkTextures\(\)/);
  assert.match(script,/if \(distance <= 16\)/);
  assert.match(script,/distance > 30 && record\.imageLoaded/);
  assert.match(script,/updateArtworkTextures\(\);/);
  assert.match(script,/ARTWORK_BUILD_DISTANCE = 14/);
});


test('product artwork uses the original image texture without synthetic art or color treatment', () => {
  assert.match(script, /new THREE\.MeshBasicMaterial\(\{ color: 0xf4efe6, side: THREE\.DoubleSide, toneMapped: false \}\)/);
  assert.match(script, /texture\.colorSpace = THREE\.SRGBColorSpace/);
  assert.match(script, /const imageAspect = \(texture\.image\?\.width \|\| 1\) \/ \(texture\.image\?\.height \|\| 1\)/);
  assert.match(script, /const width = Math\.min\(record\.maxWidth, record\.maxHeight \* imageAspect\)/);
  assert.match(script, /record\.artworkMaterial\.map = texture/);
  assert.doesNotMatch(script, /makeCanvasTexture\(index, title\)/);
  assert.doesNotMatch(script, /record\.placeholderTexture/);
});

test('mobile and tablet use separate look and movement joysticks plus the client-local clock', () => {
  assert.match(markup, /data-joystick="look"/);
  assert.match(markup, /data-joystick="move"/);
  assert.match(markup, /id="client-clock"/);
  assert.match(script, /function bindJoysticks\(/);
  assert.match(markup, /جوی‌استیک سمت چپ برای چرخش و نگاه ۳۶۰ درجه است/);
  assert.match(markup, /جوی‌استیک سمت راست برای حرکت جلو و عقب/);
  assert.match(script, /joystickState\.lookX/);
  assert.match(script, /joystickState\.moveY/);
  assert.match(script, /new Intl\.DateTimeFormat\('fa-IR'/);
  assert.match(styles, /\.joystick-controls\{display:none/);
  assert.match(styles, /@media\(max-width:1024px\)/);
  assert.match(styles, /\.movement-controls\{display:none\}/);
});

test('virtual gallery uses a single renderer and the complete collection without category switching', () => {
  assert.match(script, /if \(!renderer\) renderer = new THREE\.WebGLRenderer/);
  assert.match(script, /galleryProducts = \[\.\.\.allGalleryProducts\]/);
  assert.doesNotMatch(markup, /data-gallery-category=/);
  assert.match(markup, /gallery\.js\?v=\d+/);
});

test('gallery entry camera faces the first wall artwork so portrait mobile users see art immediately',()=>{
  assert.match(script,/yaw = Math\.atan2\(8\.91, 3\.8\)/);
  assert.match(script,/camera\.rotation\.set\(0, yaw \* eased, 0, 'YXZ'\)/);
  assert.match(markup,/gallery\.js\?v=\d+/);
});
