const VERSION='gilasart-shell-20261006-04';
const CACHE=VERSION;
const STATIC=['./','./index.html','./styles.css?v=20261006.01','./app.js?v=20261006.02','./site.webmanifest','./mobile-release.json','./data/storefront-manifest.json','./data/home.json','./fa/','./fa/index.html','./en/','./en/index.html','./tr/','./tr/index.html','./ar/','./ar/index.html'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(c=>c.addAll(STATIC).catch(()=>{})).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('gilasart-shell-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('message',event=>{if(event.data?.type==='SKIP_WAITING')self.skipWaiting()});
function isApi(url){return url.pathname.includes('/api/')||url.hostname.includes('workers.dev')}
self.addEventListener('fetch',event=>{
 const req=event.request,url=new URL(req.url);
 if(req.method!=='GET'||isApi(url))return;
 if(url.origin!==location.origin)return;
 if(req.mode==='navigate'){
   event.respondWith(caches.match(req).then(cached=>{const refresh=fetch(req,{cache:'no-store'}).then(r=>{if(r.ok)caches.open(CACHE).then(c=>c.put(req,r.clone()));return r}).catch(()=>cached);return cached||refresh}));
   return;
 }
 if(/\.(?:js|css|svg|png|jpg|jpeg|webp|json|woff2?)$/i.test(url.pathname)){event.respondWith(caches.match(req).then(cached=>{const fresh=fetch(req,{cache:'no-store'}).then(r=>{if(r.ok)caches.open(CACHE).then(c=>c.put(req,r.clone()));return r}).catch(()=>cached);return cached||fresh}));return;} event.respondWith(fetch(req).catch(()=>caches.match(req)));
});