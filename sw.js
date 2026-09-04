const CACHE='treino-fofo-v6';
const ASSETS=['./','./index.html','./manifest.webmanifest','./assets/kuromi-modal.svg','./assets/kuromi-hero.svg','./assets/kuromi-decor.svg'];

self.addEventListener('install',e=>e.waitUntil(
  caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())
));

self.addEventListener('activate',e=>e.waitUntil(
  caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())
));

self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET') return;

  if(e.request.mode==='navigate'){
    e.respondWith(fetch(e.request,{cache:'no-store'}).then(async r=>{
      let fixed=await r.clone().text();
      fixed=fixed.replace('./assets/kuromi-curl.webp','./assets/kuromi-modal.svg?v=6');
      fixed=fixed.replace('./assets/kuromi-curl.webp','./assets/kuromi-hero.svg?v=6');
      fixed=fixed.replace('./assets/kuromi-curl.webp','./assets/kuromi-decor.svg?v=6');
      return new Response(fixed,{status:r.status,statusText:r.statusText,headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'}});
    }).catch(()=>caches.match('./index.html')));
    return;
  }

  e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request).then(r=>{
    if(r && r.status===200 && new URL(e.request.url).origin===self.location.origin){
      const copy=r.clone();
      caches.open(CACHE).then(c=>c.put(e.request,copy));
    }
    return r;
  })));
});
