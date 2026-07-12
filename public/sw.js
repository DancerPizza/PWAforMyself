// Cache-First：僅快取靜態資源（HTML / JS / CSS / icons）
// localStorage 由瀏覽器獨立管理，不在此快取範圍內
const CACHE_NAME = 'expo-pwa-tools-static-v2';

const STATIC_PATH_PATTERN =
  /\.(?:html?|js|css|ico|png|svg|json|woff2?|ttf|eot)$/i;

function isStaticAssetRequest(request) {
  if (request.method !== 'GET') {
    return false;
  }

  const url = new URL(request.url);

  if (url.origin !== self.location.origin) {
    return false;
  }

  if (url.pathname.startsWith('/_expo/')) {
    return true;
  }

  return STATIC_PATH_PATTERN.test(url.pathname);
}

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', (event) => {
  if (!isStaticAssetRequest(event.request)) {
    return;
  }

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(event.request);

      if (cached) {
        return cached;
      }

      const response = await fetch(event.request);

      if (response.ok) {
        cache.put(event.request, response.clone());
      }

      return response;
    })()
  );
});
