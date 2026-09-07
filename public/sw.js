const CACHE = "alma-shell-v2";
const OFFLINE_SHELL = ["/manifest.webmanifest", "/alma-icon.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(OFFLINE_SHELL)).catch(() => undefined),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/")) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request, { cache: "no-store" }).catch(async () => {
        const cached = await caches.match(request);
        return cached || caches.match("/");
      }),
    );
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok && ["style", "script", "image", "font"].includes(request.destination)) {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy)).catch(() => undefined);
        }
        return response;
      })
      .catch(() => caches.match(request)),
  );
});
