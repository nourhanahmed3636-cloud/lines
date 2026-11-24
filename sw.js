const C="lines-v1795547522";
const CORE=["./","./index.html","./manifest.json","./icon-180.png","./icon-192.png","./icon-512.png","./jszip.min.js"];
const THUMBS=["./bg/t/aurora.jpg", "./bg/t/cotton.jpg", "./bg/t/darkglass.jpg", "./bg/t/dawn.jpg", "./bg/t/dusk.jpg", "./bg/t/glass.jpg", "./bg/t/glowtide.jpg", "./bg/t/midsilk.jpg", "./bg/t/mistlake.jpg", "./bg/t/moonlake.jpg", "./bg/t/night.jpg", "./bg/t/nightbokeh.jpg", "./bg/t/northern.jpg", "./bg/t/peachsilk.jpg", "./bg/t/ribbons.jpg", "./bg/t/rosecloud.jpg", "./bg/t/sea.jpg", "./bg/t/silk.jpg", "./bg/t/swirl.jpg"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(CORE.map(u=>new Request(u,{cache:"reload"}))).then(()=>c.addAll(THUMBS).catch(()=>{}))));self.skipWaiting()});
const LIB="lines-lib-1";
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C&&x!==LIB).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener("fetch",e=>{const r=e.request;if(r.method!=="GET")return;const u=new URL(r.url);if(u.pathname.includes("/hd/")||u.pathname.includes("/download/"))return;
  const sameOrigin=u.origin===location.origin;
  if(sameOrigin&&(u.pathname.includes("/lib/")||u.pathname.includes("/snd/"))){e.respondWith(caches.open(LIB).then(c=>c.match(r).then(hit=>hit||fetch(r).then(res=>{if(res.ok)c.put(r,res.clone());return res}))));return}
  // pages: always try the newest version first (2.5 s), fall back to the saved copy when offline or slow
  if(r.mode==="navigate"||(sameOrigin&&/\/(index\.html)?$/.test(u.pathname))){
    e.respondWith(caches.open(C).then(async c=>{const hit=await c.match("./index.html");
      let usedOld=false;const oldTag=hit&&hit.headers.get("etag");
      const net=fetch(new Request(r.url,{cache:"no-store",credentials:"same-origin"})).then(res=>{if(res.ok){c.put("./index.html",res.clone());const nt=res.headers.get("etag");
        if(usedOld&&nt&&nt!==oldTag)setTimeout(()=>self.clients.matchAll({type:"window"}).then(cs=>cs.forEach(cl=>cl.postMessage("lines-updated"))),1500)}return res});
      if(!hit)return net;return Promise.race([net.catch(()=>hit),new Promise(ok=>setTimeout(()=>{usedOld=true;ok(hit)},2500))])}));return}
  // images, icons, fonts, libraries: cache first
  e.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(res=>{if(res.ok||res.type==="opaque"){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp))}return res})));
});
