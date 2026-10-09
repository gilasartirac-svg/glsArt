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

test('add-to-cart button emits an integration intent without performing a real cart operation', () => {
  assert.match(markup, /id="artwork-panel-cart"/);
  assert.match(markup, /id="artwork-panel-cart-message"/);
  assert.match(markup, /aria-live="polite"/);
  assert.match(script, /gilasart:cart:add/);
  assert.match(script, /quantity: 1/);
  assert.match(script, /اتصال سبد خرید هنوز فعال نشده است/);
  assert.match(styles, /\.artwork-panel__cart/);
});


test('gallery uses dark granite flooring, deep-brown velvet walls, and non-aggressive artwork lighting', () => {
  assert.match(script, /new THREE\.AmbientLight/);
  assert.match(script, /new THREE\.HemisphereLight/);
  assert.match(script, /new THREE\.Fog\(0x211d1a, 28, 105\)/);
  assert.match(script, /const velvetCanvas = document\.createElement\('canvas'\)/);
  assert.match(script, /roughness: \.97, metalness: 0/);
  assert.match(script, /const floorMaterial = new THREE\.MeshStandardMaterial\(\{ color: 0xc7c0b4, map: marbleTexture, roughness: \.34/);
  assert.match(script, /hitMeshes: \[inner\]/);
  assert.doesNotMatch(script, /new THREE\.SpotLight/);
  assert.doesNotMatch(script, /new THREE\.PointLight\(0xffd19a/);
  assert.match(markup, /gallery\.css\?v=7/);
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


test('gallery uses a realistic granite-and-velvet scene and natural field of view', () => {
  assert.match(script, /const marbleCanvas = document\.createElement\('canvas'\)/);
  assert.match(script, /marbleBase\.addColorStop\(0, '#252523'\)/);
  assert.match(script, /const velvetCanvas = document\.createElement\('canvas'\)/);
  assert.match(script, /new THREE\.PerspectiveCamera\(57/);
  assert.match(script, /camera\.fov = 57/);
  assert.match(markup, /gallery\.css\?v=7/);
  assert.match(markup, /gallery\.js\?v=12/);
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
});
test('virtual gallery hides category controls and always opens the complete active collection', () => {
  assert.doesNotMatch(markup, /data-gallery-category=/);
  assert.doesNotMatch(markup, /category-selector/);
  assert.match(script, /selectedGalleryCategory = 'all'/);
  assert.match(script, /galleryProducts = \[\.\.\.allGalleryProducts\]/);
  assert.match(script, /category_ids/);
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
  assert.match(script,/scene\.fog = new THREE\.Fog\(0xe9e5dc, 16, 38\)/);
});


test('virtual gallery keeps visible fallback artwork when a product image URL fails',()=>{
  assert.match(script,/const placeholderTexture = makeCanvasTexture\(index, title\)/);
  assert.doesNotMatch(script,/if \(record\.imageUrl\) inner\.material\.map = null/);
  assert.match(script,/record\.artworkMaterial\.map = record\.placeholderTexture/);
  assert.match(script,/record\.imageLoading = false; \}/);
});

test('switching gallery corridors rebuilds the scene using the selected product category',()=>{
  assert.match(script,/let sceneCategory = null/);
  assert.match(script,/sceneCategory = selectedGalleryCategory/);
  assert.match(script,/else if \(sceneCategory !== selectedGalleryCategory\)/);
  assert.match(script,/if \(!renderer\) renderer = new THREE\.WebGLRenderer/);
  assert.match(markup,/gallery\.js\?v=12/);
});


test('gallery entry camera faces the first wall artwork so portrait mobile users see art immediately',()=>{
  assert.match(script,/yaw = Math\.atan2\(5\.91, 3\.8\)/);
  assert.match(script,/camera\.rotation\.set\(0, yaw \* eased, 0, 'YXZ'\)/);
  assert.match(markup,/gallery\.js\?v=12/);
});
