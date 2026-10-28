// Service worker for the Would? By Marty PWA.
// - Pages: network-first, so a fresh Instagram feed shows when online; cached copy offline.
// - /assets/*: cache-first (Vite filenames are content-hashed).
// - Everything else same-origin (Instagram images, icons, manifest): stale-while-revalidate.
// - Video (the hero reel) bypasses the worker: browsers stream it with range requests.

const VERSION = 'v3';
const PAGE_CACHE = `wbm-pages-${VERSION}`;
const STATIC_CACHE = `wbm-static-${VERSION}`;
const RUNTIME_CACHE = `wbm-runtime-${VERSION}`;
const RUNTIME_MAX_ENTRIES = 60;
const PRECACHE = ['/', '/manifest.webmanifest', '/icons/icon-192.png', '/icons/icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(PAGE_CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  const current = [PAGE_CACHE, STATIC_CACHE, RUNTIME_CACHE];
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => !current.includes(key)).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

async function trimCache(name, maxEntries) {
  const cache = await caches.open(name);
  const keys = await cache.keys();
  await Promise.all(keys.slice(0, Math.max(0, keys.length - maxEntries)).map((key) => cache.delete(key)));
}

async function networkFirst(request) {
  const cache = await caches.open(PAGE_CACHE);
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch {
    return (await cache.match(request)) || (await cache.match('/')) || Response.error();
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) cache.put(request, response.clone());
  return response;
}

async function staleWhileRevalidate(event) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(event.request);
  const network = fetch(event.request)
    .then(async (response) => {
      if (response.ok) {
        await cache.put(event.request, response.clone());
        await trimCache(RUNTIME_CACHE, RUNTIME_MAX_ENTRIES);
      }
      return response;
    })
    .catch(() => cached || Response.error());
  if (cached) {
    event.waitUntil(network);
    return cached;
  }
  return network;
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;
  if (request.headers.has('range') || request.destination === 'video') return;

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request));
  } else if (url.pathname.startsWith('/assets/')) {
    event.respondWith(cacheFirst(request));
  } else {
    event.respondWith(staleWhileRevalidate(event));
  }
});
