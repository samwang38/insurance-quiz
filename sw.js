/* 保險題庫 Service Worker
   策略：App Shell 快取優先 → 背景更新 → 有新版就通知頁面。
   使用者永遠是「秒開」，更新在背景默默完成，不會卡在轉圈畫面。 */

const VERSION = 'v2.3.1';
const CACHE = `insurance-quiz-${VERSION}`;

const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-192.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon-32.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k.startsWith('insurance-quiz-') && k !== CACHE)
            .map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

async function notifyUpdate() {
  const clients = await self.clients.matchAll({ type: 'window' });
  clients.forEach(c => c.postMessage({ type: 'UPDATE_READY' }));
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  /* 導覽請求：先給快取的 index.html（秒開），同時背景抓新版 */
  if (req.mode === 'navigate') {
    e.respondWith((async () => {
      const cache = await caches.open(CACHE);
      const cached = await cache.match('./index.html');
      const network = fetch(req).then(async res => {
        if (res && res.ok) {
          const fresh = res.clone();
          const oldBody = cached ? await cached.clone().text() : '';
          const newBody = await fresh.clone().text();
          await cache.put('./index.html', fresh);
          if (oldBody && oldBody !== newBody) notifyUpdate();
        }
        return res;
      }).catch(() => null);

      return cached || (await network) || new Response(
        '<meta charset="utf-8"><p style="font:16px system-ui;padding:2rem">目前離線，而且這台裝置還沒把題庫存下來。連上網路後開一次就可以離線使用了。</p>',
        { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
      );
    })());
    return;
  }

  /* 其他靜態檔：快取優先，背景補快取 */
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(req);
    if (cached) {
      fetch(req).then(res => { if (res && res.ok) cache.put(req, res); }).catch(() => {});
      return cached;
    }
    try {
      const res = await fetch(req);
      if (res && res.ok) cache.put(req, res.clone());
      return res;
    } catch (err) {
      return new Response('', { status: 504 });
    }
  })());
});

self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});
