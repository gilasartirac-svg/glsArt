import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const app=await readFile('frontend/src/app.js','utf8');
const build=await readFile('scripts/build-frontend.mjs','utf8');
const robots=await readFile('frontend/public/robots.txt','utf8');

test('phase 10: canonical and hreflang SEO links are generated from the active locale route',()=>{
 assert.match(app,/function updateSeoLinks\(\)/);
 assert.match(app,/hreflang=l/);
 assert.match(app,/hreflang='x-default'/);
 assert.match(app,/canonicalEl\.href=canonical/);
 assert.match(app,/og:url/);
 assert.match(app,/twitter:title/);
 assert.match(app,/twitter:description/);
 assert.match(app,/og:type/);
});

test('phase 10: SEO metadata and JSON-LD are updated for rendered pages',()=>{
 assert.match(app,/function setSeo\(\{title,description,image,type='website',jsonLd,indexable=true\}\=\{\}\)/);
 assert.match(app,/'@type':'WebPage'/);
 assert.match(app,/setRobots\(indexable\)/);
 assert.match(app,/JSON\.stringify\(data\)/);
});

test('phase 10: private application routes are noindex',()=>{
 assert.ok(app.includes("privateRoutes=new Set(['account','cart','rewards','checkout','payment','admin'])"));
 assert.match(app,/applyRouteSeoPolicy\(p\)/);
});

test('phase 10: Torob sitemap lists only active product URLs from the offline storefront snapshot',()=>{
 assert.match(build,/const locales=\['fa','en','tr','ar'\]/);
 assert.match(build,/storefront-index\.json/);
 assert.match(build,/storefront-attributes\.json/);
 assert.match(build,/productDetails\[String\(p\.id\)\]/);
 assert.match(build,/detail\.seo_title/);
 assert.match(build,/detail\.seo_description/);
 assert.match(build,/const productPages=\(snapshot\.products\|\|\[\]\)\.filter/);
 assert.match(build,/Number\(p\.active\)===1/);
 assert.match(build,/dist\/sitemap\.xml/);
 assert.ok(build.includes("const publicPagePaths=['/','/shop/','/about/','/contact/','/news/','/articles/','/terms/'];"));
 assert.match(build,/dist\/sitemap-pages\.xml/);
 assert.match(build,/dist\/sitemap-index\.xml/);
 assert.match(build,/async function refreshHtmlAssetVersions\(dir\)/);
 assert.match(build,/await refreshHtmlAssetVersions\('dist'\)/);
 assert.match(build,/sitemap-pages\.xml/);
 assert.match(build,/siteOrigin='https:\/\/gilasart\.ir'/);
 assert.match(build,/const loc=siteOrigin\+'\/'\+encodeURIComponent\(slug\)\+'\/'/);
 assert.doesNotMatch(build,/publicRoutes=\[/);
 assert.doesNotMatch(build,/snapshot\?\.articles|snapshot\?\.news/);
 assert.match(build,/Could not prepare crawlable product HTML/);
 assert.match(build,/name="product_id"/);
 assert.match(build,/name="product_name"/);
 assert.match(build,/property="og:image"/);
 assert.match(build,/name="product_price"/);
 assert.match(build,/name="product_old_price"/);
 assert.match(build,/name="availability"/);
 assert.match(build,/const currentPrice=saleActive\?salePrice:basePrice/);
 assert.match(build,/Number\(p\.stock\)>0\?'instock':'outofstock'/);
 assert.match(build,/price:currentPrice,priceCurrency:'IRR'/);
});
test('phase 10: robots exposes private noindex directives and blocks only admin/API paths',()=>{
 assert.match(robots,/Disallow: \/admin/);
 assert.match(robots,/Disallow: \/api\//);
 assert.doesNotMatch(robots,/Disallow: \/(account|cart|checkout|payment|rewards)/);
 assert.match(robots,/Sitemap: https:\/\/gilasart\.ir\/sitemap-index\.xml/);
});

test('phase 10: requested public routes receive static page-specific SEO metadata and crawlable headings',()=>{
 for(const path of ['/shop/','/about/','/contact/','/news/','/articles/','/terms/']){
  assert.ok(build.includes("path:'"+path+"'"),'missing route SEO definition: '+path);
 }
 assert.match(build,/routeSeoPages/);
 assert.match(build,/seo-prerender/);
 assert.match(build,/CollectionPage/);
 assert.match(build,/ContactPage/);
 assert.match(build,/meta name="twitter:title"/);
 assert.match(build,/privateSeoPages/);
 assert.match(build,/noindex,follow/);
});
test('phase 10: account, cart, rewards, checkout and payment are noindex and not blocked by robots.txt',()=>{
 assert.ok(app.includes("privateRoutes=new Set(['account','cart','rewards','checkout','payment','admin'])"));
 assert.doesNotMatch(robots,/Disallow: \/(account|cart|checkout|payment|rewards)/);
 assert.match(robots,/Disallow: \/admin/);
});
test('phase 10: canonical and alternate links always use the production non-www domain and normalized trailing slashes',()=>{
 assert.match(app,/const canonicalPath=/);
 assert.ok(app.includes("const canonical='https://gilasart.ir'+localePath(canonicalPath,currentLocale);"));
 assert.ok(app.includes("a.href='https://gilasart.ir'+localePath(canonicalPath,l);"));
 assert.ok(build.includes("const siteOrigin='https://gilasart.ir'"));
});

test('phase 10: build provides initial crawlable homepage and social metadata for public and private routes',()=>{
 assert.match(build,/homeCrawlable/);
 assert.match(build,/homeProductImage/);
 assert.match(build,/twitter:image/);
 assert.match(build,/seo-prerender/);
 assert.match(build,/privateSeoPages/);
});
