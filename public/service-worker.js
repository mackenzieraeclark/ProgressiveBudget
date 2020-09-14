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
  self.addEventListener("install", function(evt) {
    evt.waitUntil(
      caches.open(CACHE_NAME).then(cache => {
        console.log("Your files pre-cached successfully.");
        return cache.addAll(FILES_TO_CACHE);
      })
    );
  
    self.skipWaiting();
  });

  // Activate

  // Fetch