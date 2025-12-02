const CACHE_NAME = "farmstellar-v1";
const CORE_ASSETS = [
  "/",
  "/login",
  "/dashboard",
  "/manifest.json",
  "/icons/icon-192.svg",
  "/icons/icon-512.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      try {
        return cache.addAll(CORE_ASSETS);
      } catch (e) {
        // fallback: individually add
        return Promise.all(
          CORE_ASSETS.map((u) => cache.add(u).catch(() => {}))
        );
      }
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((k) => {
          if (k !== CACHE_NAME) return caches.delete(k);
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  // Only handle GET requests
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // For navigation requests, try cache-first to provide offline app shell
  if (event.request.mode === "navigate") {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request)
          .then((res) => {
            // cache a copy for next time
            const r = res.clone();
            caches
              .open(CACHE_NAME)
              .then((cache) => cache.put(event.request, r));
            return res;
          })
          .catch(() => caches.match("/"));
      })
    );
    return;
  }

  // For other requests, try network first then cache fallback for images and assets
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Optionally cache static responses
        if (response && response.status === 200 && response.type === "basic") {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, copy).catch(() => {});
          });
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
