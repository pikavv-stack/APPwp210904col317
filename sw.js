const CACHE = 'wp-publisher-v1';
const ASSETS = [
  '/APPwp210904col317/',
  '/APPwp210904col317/index.html',
  '/APPwp210904col317/manifest.json',
];

self.addEventListener('install', function(e){
  e.waitUntil(
    caches.open(CACHE).then(function(cache){ return cache.addAll(ASSETS); })
  );
});

self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.filter(function(k){ return k !== CACHE; }).map(function(k){ return caches.delete(k); }));
    })
  );
});

self.addEventListener('fetch', function(e){
  if(e.request.url.includes('raw.githubusercontent.com') || e.request.url.includes('api.github.com')){
    return;
  }
  e.respondWith(
    caches.match(e.request).then(function(cached){
      return cached || fetch(e.request);
    })
  );
});
