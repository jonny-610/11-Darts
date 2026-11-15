// 11 Darts service worker: shows phone notifications. It does not cache or change the site.
self.addEventListener("install",()=>self.skipWaiting());
self.addEventListener("activate",e=>e.waitUntil(self.clients.claim()));
self.addEventListener("push",e=>{let d={};try{d=e.data?e.data.json():{}}catch(_){d={body:e.data?e.data.text():""}}
  e.waitUntil(self.registration.showNotification(d.title||"11 Darts",{body:d.body||"Something needs you on 11 Darts.",icon:"icon-192.png",badge:"icon-192.png",tag:d.kind||"11darts",renotify:true,data:{url:d.url||self.registration.scope}}))});
self.addEventListener("notificationclick",e=>{e.notification.close();const url=(e.notification.data&&e.notification.data.url)||self.registration.scope;
  e.waitUntil(self.clients.matchAll({type:"window",includeUncontrolled:true}).then(cs=>{for(const c of cs){if("focus" in c)return c.focus()}return self.clients.openWindow(url)}))});
