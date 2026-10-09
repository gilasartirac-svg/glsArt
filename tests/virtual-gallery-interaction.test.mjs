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


test('luxury scene uses physically based materials, frameless artwork surfaces, and per-artwork spot lighting', () => {
  assert.match(script, /new THREE\.AmbientLight/);
  assert.match(script, /new THREE\.HemisphereLight/);
  assert.match(script, /new THREE\.Fog\(/);
  assert.match(script, /map: marbleTexture, roughness: \.24, metalness: \.055/);
  assert.match(script, /map: marbleTexture, roughness: \.38, metalness: \.025/);
  assert.match(script, /hitMeshes: \[inner\]/);
  assert.doesNotMatch(script, /const innerRim = new THREE\.Mesh/);
  assert.match(script, /const spotlight = new THREE\.SpotLight/);
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


test('virtual gallery environment uses a bright marble finish and natural lighting',()=>{
  assert.match(script,/new THREE\.Color\(0xe9e5dc\)/);
  assert.match(script,/const marbleCanvas = document\.createElement\('canvas'\)/);
  assert.match(script,/map: marbleTexture, roughness: \.24/);
  assert.match(script,/map: marbleTexture, roughness: \.38/);
  assert.match(script,/new THREE\.AmbientLight\(0xfff5e5, \.82\)/);
  assert.match(markup,/gallery\.css\?v=6/);
  assert.match(markup,/gallery\.js\?v=8/);
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
  assert.match(markup,/gallery\.js\?v=8/);
});


test('gallery builds enough corridor rows for every product instead of truncating at ten',()=>{
  assert.match(script,/const rows = Math\.max\(5, Math\.ceil\(galleryProducts\.length \/ 2\)\)/);
  assert.match(script,/for \(let i = 0; i < rows; i\+\+\)/);
  assert.match(script,/bounds\.zMin = -Math\.max\(10\.5, \(rows - 1\) \* 3\.1 \+ 4\.5\)/);
  assert.match(adapter,/limit = 5000/);
  assert.doesNotMatch(adapter,/if \(!image \|\| active === false/);
});

test('gallery entrance offers category corridors and filters using actual category IDs',()=>{
  assert.match(markup,/data-gallery-category="cat_gilas_religious"/);
  assert.match(markup,/data-gallery-category="cat_gilas_poetry"/);
  assert.match(markup,/data-gallery-category="cat_gilas_horizontal"/);
  assert.match(markup,/data-gallery-category="cat_gilas_vertical"/);
  assert.match(markup,/data-gallery-category="cat_gilas_square"/);
  assert.match(script,/function bindCategorySelector\(\)/);
  assert.match(script,/product\.categoryIds\?\.includes\(selectedGalleryCategory\)/);
  assert.match(adapter,/categoryIds: Array\.isArray\(raw\.category_ids\)/);
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
