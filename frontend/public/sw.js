const VERSION='gilasart-shell-__GILASART_VERSION__';
const CACHE=VERSION;
const STATIC=['./','./index.html','./styles.css','./app.js','./site.webmanifest','./mobile-release.json','./i18n/fa.json','./i18n/en.json','./i18n/ar.json','./i18n/tr.json','./data/storefront-manifest.json','./data/home.json','./fa/','./fa/index.html','./en/','./en/index.html','./tr/','./tr/index.html','./ar/','./ar/index.html'];
const NETWORK_FIRST=new Set(['json']);
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(c=>c.addAll(STATIC).catch(()=>{})).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('gilasart-shell-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('message',event=>{if(event.data?.type==='SKIP_WAITING')self.skipWaiting()});
function isApi(url){return url.pathname.includes('/api/')||url.hostname.includes('workers.dev')}
function cachePut(req,res){if(res?.ok)caches.open(CACHE).then(c=>c.put(req,res.clone())).catch(()=>{})}
function networkFirst(req,cachedFallback=true){
 return fetch(req,{cache:'no-store'}).then(r=>{cachePut(req,r);return r}).catch(()=>cachedFallback?caches.match(req):Response.error());
}
self.addEventListener('fetch',event=>{
 const req=event.request,url=new URL(req.url);
 if(req.method!=='GET'||isApi(url)||url.origin!==location.origin)return;
 if(req.mode==='navigate'){
   event.respondWith(networkFirst(req,true));
   return;
 }
 if(/\.json$/i.test(url.pathname)){
   event.respondWith(networkFirst(req,true));
   return;
 }
 if(/\.(?:js|css|svg|png|jpg|jpeg|webp|woff2?)$/i.test(url.pathname)){
   event.respondWith(caches.match(req).then(cached=>cached||fetch(req,{cache:'no-store'}).then(r=>{cachePut(req,r);return r})));
   return;
 }
 event.respondWith(fetch(req).catch(()=>caches.match(req)));
});