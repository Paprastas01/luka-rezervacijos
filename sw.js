// Service worker: keeps the app shell offline and shows notifications.
// Pushes arrive empty; the worker asks the server what happened (op 'inbox').
var SHELL = 'luka-shell-v3';
var FILES = ['./', 'index.html', 'app.css', 'app.js', 'config.js', 'manifest.webmanifest',
  'ikonos/ikona-180.png', 'ikonos/ikona-192.png', 'ikonos/ikona-512.png'];
var CONFIG_URL = new URL('luka-config', self.registration.scope).href;

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(SHELL).then(function (c) { return c.addAll(FILES); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== SHELL && k !== 'luka-config'; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

// Shell files: answer from cache at once, refresh the cache in the background.
self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(caches.open(SHELL).then(function (c) {
    return c.match(req, { ignoreSearch: true }).then(function (hit) {
      var fresh = fetch(req).then(function (res) {
        if (res.ok) c.put(req, res.clone());
        return res;
      });
      if (hit) { e.waitUntil(fresh.catch(function () {})); return hit; }
      return fresh;
    });
  }));
});

function readConfig() {
  return caches.open('luka-config').then(function (c) { return c.match(CONFIG_URL); })
    .then(function (r) { return r ? r.json() : {}; });
}
function saveSince(since) {
  return readConfig().then(function (cfg) {
    cfg.since = since;
    return caches.open('luka-config').then(function (c) {
      return c.put(CONFIG_URL, new Response(JSON.stringify(cfg), { headers: { 'Content-Type': 'application/json' } }));
    });
  });
}

function tellApp(msg) {
  return self.clients.matchAll({ type: 'window' }).then(function (list) {
    list.forEach(function (c) { c.postMessage(msg); });
  });
}

self.addEventListener('push', function (e) {
  e.waitUntil(readConfig().then(function (cfg) {
    if (!cfg.api || !cfg.key) return [];
    return fetch(cfg.api, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ op: 'inbox', k: cfg.key, since: cfg.since || 0 })
    }).then(function (r) { return r.json(); }).then(function (res) {
      var events = res.ok ? res.events : [];
      if (events.length) return saveSince(events[events.length - 1].seq).then(function () { return events; });
      return events;
    });
  }).catch(function (err) {
    console.error('Pranešimo turinys:', err);
    return [];
  }).then(function (events) {
    // A push must always show something, otherwise the phone may stop delivering them.
    var shown = events.slice(-3);
    if (!shown.length) shown = [{ title: 'Rezervacijos', body: 'Atsidarykite programėlę ir pažiūrėkite naujienas.' }];
    return Promise.all(shown.map(function (ev) {
      return self.registration.showNotification(ev.title, {
        body: ev.body,
        tag: ev.seq ? 'luka-' + ev.seq : 'luka',
        icon: 'ikonos/ikona-192.png',
        data: { view: ev.view || '', date: ev.date || '' }
      });
    })).then(function () { return tellApp({ type: 'changed' }); });
  }));
});

self.addEventListener('notificationclick', function (e) {
  e.notification.close();
  var d = e.notification.data || {};
  var q = d.view ? '?view=' + encodeURIComponent(d.view) : d.date ? '?date=' + encodeURIComponent(d.date) : '';
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (list) {
    if (list.length) {
      list[0].postMessage({ type: 'open', view: d.view, date: d.date });
      return list[0].focus();
    }
    return self.clients.openWindow(new URL(q || './', self.registration.scope).href);
  }));
});
