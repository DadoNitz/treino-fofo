const CACHE='treino-fofo-v4';
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(['./','./index.html','./manifest.webmanifest'])).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  if(e.request.mode==='navigate'){
    e.respondWith(fetch(e.request).then(async r=>{
      const text=await r.clone().text();
      const fixed=text
        .replaceAll('./assets/kuromi-curl.webp','https://raw.githubusercontent.com/DadoNitz/treino-fofo/main/assets/kuromi-curl.webp?v=4')
        .replace("function showName(force=false){if(s.name&&!force)return;","function showName(force=false){if(localStorage.getItem('treinoFofo.onboarding.v4')&&!force)return;")
        .replace("s.name=n.slice(0,30);save();applyName();","s.name=n.slice(0,30);localStorage.setItem('treinoFofo.onboarding.v4','1');save();applyName();");
      return new Response(fixed,{status:r.status,statusText:r.statusText,headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'}})
    }).catch(()=>caches.match('./index.html')));
    return;
  }
  e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request)));
});
