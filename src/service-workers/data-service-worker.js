const CACHENAME = 'api-data';

self.addEventListener('install', (event) => {
  console.log('data service worker installed', event);
});

self.addEventListener('activate', (event) => {
  console.log('data service worker activated', event);
});

self.addEventListener('resize', (event) => {
  console.log('resized');
})

self.addEventListener('fetch', (event) => {
  console.log('[event]', event);

  event.respondWith(
    caches.open(CACHENAME).then((cache) => {
      return cache.match(event.request).then((response) => {
        return response || fetch(event.request).then((response) => {
          console.log('[fething from network]');
          return caches.open(CACHENAME).then((cache) => {
            cache.put(event.request, response.clone);
            return response;
          });
        });
      })
    }));
  });


// https://itnext.io/service-workers-your-first-step-towards-progressive-web-apps-pwa-e4e11d1a2e85
// https://samdutton.github.io/ilt/pwa/data/
// https://developers.google.com/web/ilt/pwa/caching-files-with-service-worker
// https://hackernoon.com/service-workers-62a7b14aa63a
