const VERSION='gilasart-shell-__GILASART_VERSION__';
const CACHE=VERSION;
const STATIC=['./','./index.html','./styles.css','./app.js','./site.webmanifest','./mobile-release.json','./i18n/fa.json','./data/storefront-manifest.json','./data/storefront-index.json','./data/home.json'];

self.addEventListener('install',event=>{
 event.waitUntil(caches.open(CACHE).then(c=>c.addAll(STATIC).catch(()=>{})).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
 event.waitUntil(caches.keys().then(keys=>Promise.all(
   keys.filter(k=>k.startsWith('gilasart-shell-')&&k!==CACHE).map(k=>caches.delete(k))
 )).then(()=>self.clients.claim()));
});
self.addEventListener('message',event=>{if(event.data?.type==='SKIP_WAITING')self.skipWaiting()});

function isApi(url){return url.pathname.includes('/api/')||url.hostname.includes('workers.dev')}
function cachePut(req,res){if(res?.ok)caches.open(CACHE).then(c=>c.put(req,res.clone())).catch(()=>{})}
function cacheFirst(req){return caches.match(req).then(cached=>cached||fetch(req,{cache:'default'}).then(r=>{cachePut(req,r);return r}))}
function networkFirst(req,cachedFallback=false){return fetch(req,{cache:'no-store'}).then(r=>{cachePut(req,r);return r}).catch(()=>cachedFallback?caches.match(req):Response.error())}

self.addEventListener('fetch',event=>{
 const req=event.request,url=new URL(req.url);
 if(req.method!=='GET'||isApi(url)||url.origin!==location.origin)return;

 if(req.mode==='navigate'){
   event.respondWith(networkFirst(req,true));
   return;
 }

 if(url.pathname.endsWith('/data/storefront-manifest.json')){
   event.respondWith(networkFirst(req,true));
   return;
 }

 if(/\.json$/i.test(url.pathname)){
   event.respondWith(networkFirst(req,true));
   return;
 }

 if(/\.(?:js|css|svg|png|jpg|jpeg|webp|woff2?)$/i.test(url.pathname)){
   event.respondWith(cacheFirst(req));
   return;
 }

 event.respondWith(fetch(req,{cache:'default'}).catch(()=>caches.match(req)));
});
