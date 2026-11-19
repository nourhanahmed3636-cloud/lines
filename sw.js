const C="lines-v1795092063";
const CORE=["./","./index.html","./manifest.json","./icon-180.png","./icon-192.png","./icon-512.png"];
const THUMBS=["./bg/t/aurora.jpg", "./bg/t/cotton.jpg", "./bg/t/darkglass.jpg", "./bg/t/dawn.jpg", "./bg/t/dusk.jpg", "./bg/t/glass.jpg", "./bg/t/glowtide.jpg", "./bg/t/midsilk.jpg", "./bg/t/mistlake.jpg", "./bg/t/moonlake.jpg", "./bg/t/night.jpg", "./bg/t/nightbokeh.jpg", "./bg/t/northern.jpg", "./bg/t/peachsilk.jpg", "./bg/t/ribbons.jpg", "./bg/t/rosecloud.jpg", "./bg/t/sea.jpg", "./bg/t/silk.jpg", "./bg/t/swirl.jpg"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(CORE).then(()=>c.addAll(THUMBS).catch(()=>{}))));self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener("fetch",e=>{const r=e.request;if(r.method!=="GET")return;const u=new URL(r.url);
  const sameOrigin=u.origin===location.origin;
  // pages: show the cached copy instantly, refresh it in the background (stale-while-revalidate)
  if(r.mode==="navigate"||(sameOrigin&&/\/(index\.html)?$/.test(u.pathname))){
    e.respondWith(caches.open(C).then(async c=>{const hit=await c.match("./index.html");const net=fetch(r).then(res=>{if(res.ok)c.put("./index.html",res.clone());return res}).catch(()=>hit);return hit||net}));return}
  // images, icons, fonts, libraries: cache first
  e.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(res=>{if(res.ok||res.type==="opaque"){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp))}return res})));
});
