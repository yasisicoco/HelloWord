const CACHE_NAME = 'pwa-cache-v1';
const urlsToCache = [
  '/', // 홈 페이지
  '/index.html', // 메인 HTML 파일
  '/icons/android-chrome-192x192.png', // 아이콘
  '/icons/android-chrome-512x512.png', // 아이콘
  '/icons/apple-touch-icon.png', // 아이콘
  '/icons/favicon.ico', // 파비콘
  '/gameThumbnail/game1.png', // 게임 이미지
  '/gameThumbnail/game2.png', // 게임 이미지
  '/gameThumbnail/game3.png', // 게임 이미지
  '/gameThumbnail/game4.png', // 게임 이미지
];

// Service Worker 설치 이벤트 - 캐싱
self.addEventListener('install', (event) => {
  console.log('Service Worker installing and caching files.');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    }),
  );
});

// Service Worker 활성화 이벤트 - 오래된 캐시 정리
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating.');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Old cache removed:', cacheName);
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
});

// 네트워크 요청 가로채기 (fetch 이벤트) - 캐시된 파일 제공
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // 캐시에 있으면 캐시된 파일 반환, 없으면 네트워크 요청
      return response || fetch(event.request);
    }),
  );
});
