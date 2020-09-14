// Cache
const FILES_TO_CACHE = [
    '/',
    '/index.html',
    '/index.js',
    '/manifest.webmanifest',
    '/styles.css',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
  ];

  // Saves html, css, js, images
  const CACHE_NAME = "static-cache-v2";

  // Saves json and data from api requests
  const DATA_CACHE_NAME = "data-cache-v1";

  // Install
  self.addEventListener("install", function(event) {
    event.waitUntil(
      caches.open(CACHE_NAME).then(cache => {
        console.log("Files pre-cached successfully.");
        return cache.addAll(FILES_TO_CACHE);
      })
    );
  
    self.skipWaiting();
  });

  // Activate
  self.addEventListener("activate", function(event) {
    event.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(
                keyList.map(key => {
                    if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
                        console.log("Removing old cache", key);
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    // claim
    self.clients.claim();
  });

  // Fetch
  self.addEventListener("fetch", function(event) {
      // API will return JSON
      if (event.request.url.includes("/api")) {
          event.respondWith(
            caches.open(DATA_CACHE_NAME).then(cache => {
                return fetch(event.request).then(response => {
                    // Clone and store in cache with successful response
                    if (response.status === 200) {
                        cache.put(event.request.url, response.clone());
                    }
                    return response;
                }).catch(err => {
                    return cache.match(event.request);
                });
            }).catch(err => console.log(err))
          );
      } else {
          event.respondWith(
              caches.open(CACHE_NAME).then(cache => {
                  return cache.match(event.request).then(response => {
                      return response || fetch(event.request);
                  });
              })
          );
      }
  });