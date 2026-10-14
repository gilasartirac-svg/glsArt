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
 assert.match(app,/const privateRoutes=new Set\(\['account','cart','checkout','payment','admin'\]\)/);
 assert.match(app,/applyRouteSeoPolicy\(p\)/);
});

test('phase 10: Torob sitemap lists only active product URLs from the offline storefront snapshot',()=>{
 assert.match(build,/const locales=\['fa','en','tr','ar'\]/);
 assert.match(build,/storefront-index\.json/);
 assert.match(build,/const productPages=\(snapshot\.products\|\|\[\]\)\.filter/);
 assert.match(build,/Number\(p\.active\)===1/);
 assert.match(build,/dist\/sitemap\.xml/);
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
test('phase 10: robots points to the canonical production sitemap and protects private paths',()=>{
 assert.match(robots,/Disallow: \/admin/);
 assert.match(robots,/Disallow: \/account/);
 assert.match(robots,/Disallow: \/checkout/);
 assert.match(robots,/Disallow: \/payment/);
 assert.match(robots,/Sitemap: https:\/\/gilasart\.ir\/sitemap\.xml/);
});
