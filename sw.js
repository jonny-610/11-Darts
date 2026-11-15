// 11 Darts service worker: phone notifications, and what makes the site installable as an app.
// Pages always come fresh from the internet. A saved copy of the home page is only used when there is no signal.
const OFFLINE="11d-offline-v1";
self.addEventListener("install",e=>{e.waitUntil(caches.open(OFFLINE).then(c=>c.addAll(["/","/icon-192.png","/icon-512.png"])).catch(()=>{}));self.skipWaiting()});
self.addEventListener("activate",e=>e.waitUntil((async()=>{const ks=await caches.keys();await Promise.all(ks.filter(k=>k!==OFFLINE).map(k=>caches.delete(k)));await self.clients.claim()})()));
self.addEventListener("fetch",e=>{const r=e.request;if(r.method!=="GET")return;const u=new URL(r.url);if(u.origin!==self.location.origin)return;
  if(r.mode==="navigate"){e.respondWith((async()=>{try{const res=await fetch(r);if(res&&res.ok&&u.pathname==="/"){const c=await caches.open(OFFLINE);c.put("/",res.clone())}return res}
    catch(_){const c=await caches.match("/");return c||new Response("<h1>No signal</h1><p>11 Darts needs the internet. Check your connection and try again.</p>",{headers:{"Content-Type":"text/html; charset=utf-8"}})}})());return}
  if(/\/icon-(192|512)\.png$/.test(u.pathname))e.respondWith(fetch(r).catch(()=>caches.match(r)))});
self.addEventListener("push",e=>{let d={};try{d=e.data?e.data.json():{}}catch(_){d={body:e.data?e.data.text():""}}
  e.waitUntil(self.registration.showNotification(d.title||"11 Darts",{body:d.body||"Something needs you on 11 Darts.",icon:"icon-192.png",badge:"icon-192.png",tag:d.kind||"11darts",renotify:true,data:{url:d.url||self.registration.scope}}))});
self.addEventListener("notificationclick",e=>{e.notification.close();const url=(e.notification.data&&e.notification.data.url)||self.registration.scope;
  e.waitUntil(self.clients.matchAll({type:"window",includeUncontrolled:true}).then(cs=>{for(const c of cs){if("focus" in c)return c.focus()}return self.clients.openWindow(url)}))});
