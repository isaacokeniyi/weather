const CACHE_NAME = "weather-cache-v4";

const ASSETS = [
  "/",
  "/index.html",
  "/styles/style.css",
  "/images/icon-192x192.png",
  "/images/favicon.ico",
  "/scripts/app.js",
  "/manifest.json",
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.url.includes("/weather?")) {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const clonedRes = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clonedRes));
          return res;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  event.respondWith(caches.match(request).then((response) => response || fetch(request)));
});
