const VERSION='gilasart-shell-20261005-01';
const CACHE=VERSION;
const STATIC=['./','./index.html','./styles.css?v=20261005.01','./app.js?v=20261005.01','./site.webmanifest','./mobile-release.json','./data/storefront-manifest.json'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(c=>c.addAll(STATIC).catch(()=>{})).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('gilasart-shell-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('message',event=>{if(event.data?.type==='SKIP_WAITING')self.skipWaiting()});
function isApi(url){return url.pathname.includes('/api/')||url.hostname.includes('workers.dev')}
self.addEventListener('fetch',event=>{
 const req=event.request,url=new URL(req.url);
 if(req.method!=='GET'||isApi(url))return;
 if(url.origin!==location.origin)return;
 if(req.mode==='navigate'){
   event.respondWith(fetch(req,{cache:'no-store'}).then(r=>{if(r.ok){const copy=r.clone();caches.open(CACHE).then(c=>c.put('./index.html',copy));return r;}return caches.match('./index.html').then(cached=>cached||r)}).catch(()=>caches.match('./index.html')));
   return;
 }
 event.respondWith(fetch(req,{cache:'no-store'}).then(r=>{if(r.ok&&/\.(?:js|css|svg|png|jpg|jpeg|webp|json|woff2?)$/i.test(url.pathname)){const copy=r.clone();caches.open(CACHE).then(c=>c.put(req,copy));}return r}).catch(()=>caches.match(req)));
});