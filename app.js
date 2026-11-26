// Luka rezervacijos: phone app for owners and staff. Talks to the Google Apps Script
// (programa.js) with POST text/plain JSON. Plain JS, no build step.
(function () {
  'use strict';

  var API = window.LUKA_API;
  var KEY_STORE = 'luka.key';

  var T = {
    appName: 'Luka rezervacijos',
    tabs: { list: 'Sąrašas', book: 'Nauja', remind: 'Priminimai', more: 'Nustatymai' },
    today: 'Šiandien', tomorrow: 'Rytoj', otherDate: 'Kita data',
    loading: 'Kraunama…',
    network: 'Nėra ryšio su sąrašu. Patikrinkite internetą ir bandykite dar kartą.',
    error: 'Nepavyko. Bandykite dar kartą.',
    retry: 'Bandyti dar kartą',
    // join
    joinTitle: 'Luka rezervacijos',
    joinText: 'Įveskite kodą, kurį gavote iš vadovo.',
    joinCode: 'Prisijungimo kodas',
    joinBtn: 'Prisijungti',
    joinBad: 'Kodas neteisingas arba nebegalioja. Paprašykite vadovo naujo kodo.',
    joinWait: 'Per daug bandymų. Palaukite 15 minučių.',
    iosTitle: 'Pirma įsidėkite programėlę į pradžios ekraną',
    iosSteps: ['Apačioje paspauskite „Bendrinti“ (kvadratas su rodykle į viršų).',
      'Pasirinkite „Į pradžios ekraną“ (Add to Home Screen).',
      'Atsidarykite „Rezervacijos“ iš pradžios ekrano ir ten įveskite kodą.'],
    iosWhy: 'Tik taip telefonas rodys pranešimus apie naujas rezervacijas.',
    iosSkip: 'Tęsti naršyklėje',
    install: 'Įdiegti programėlę',
    // list
    people: function (n) { return n + ' žm.'; },
    summary: function (n, p) { return n + ' ' + plural(n, 'rezervacija', 'rezervacijos', 'rezervacijų') + ' · ' + p + ' ' + plural(p, 'žmogus', 'žmonės', 'žmonių'); },
    empty: 'Šiai dienai rezervacijų nėra.',
    cancelledTitle: 'Atšauktos',
    src: { puslapis: 'puslapis', telefonu: 'telefonu' },
    call: 'Skambinti',
    cancel: 'Atšaukti',
    cancelQ: 'Atšaukti rezervaciją?',
    cancelYes: 'Taip, atšaukti',
    no: 'Ne',
    cancelled: 'Rezervacija atšaukta. Vieta atsilaisvino.',
    already: 'Ši rezervacija jau atšaukta.',
    // booking
    bookTitle: 'Nauja rezervacija',
    bookSub: 'Kai svečias skambina',
    date: 'Data', peopleQ: 'Kiek žmonių', more: 'Daugiau', time: 'Laikas',
    pickFirst: 'Pasirinkite datą ir žmonių skaičių.',
    noTimes: 'Šiai dienai tokiai grupei laisvų laikų nebėra.',
    tooBig: function (n) { return 'Didesnei nei ' + n + ' žmonių grupei rezervacija derinama atskirai.'; },
    name: 'Vardas', phone: 'Telefonas', phonePh: '+34 600 000 000',
    consent: 'Svečias sutinka gauti priminimą WhatsApp dieną prieš atvykimą',
    save: 'Įrašyti rezervaciją',
    saved: 'Rezervacija įrašyta',
    newOne: 'Nauja rezervacija',
    seeDay: 'Žiūrėti dienos sąrašą',
    full: 'Tuo laiku vietos nebėra. Pasirinkite kitą laiką.',
    closed: 'Tą dieną restoranas nedirba.',
    badName: 'Įrašykite vardą (bent 2 raidės).',
    badPhone: 'Patikrinkite telefono numerį.',
    badField: 'Patikrinkite laukelius.',
    // reminders
    remindTitle: 'Rytojaus priminimai',
    remindHelp: 'Spauskite „WhatsApp“, išsiųskite paruoštą žinutę ir pažymėkite „Išsiųsta“.',
    remindNone: 'Rytojui priminimų siųsti nereikia.',
    whatsapp: 'WhatsApp',
    markSent: 'Išsiųsta',
    sent: 'išsiųsta',
    waiting: 'laukia',
    noConsent: 'Nesutiko gauti priminimo',
    // settings
    moreTitle: 'Nustatymai',
    you: 'Jūs',
    role: { vadovas: 'vadovas', darbuotojas: 'darbuotojas' },
    notif: 'Pranešimai',
    notifOn: 'Įjungti. Šis telefonas praneš apie naujas ir atšauktas rezervacijas.',
    notifOff: 'Išjungti. Šis telefonas apie naujas rezervacijas nepraneš.',
    notifEnable: 'Įjungti pranešimus',
    notifDisable: 'Išjungti',
    notifTest: 'Išbandyti',
    notifTestSent: 'Išsiųsta. Pranešimas turėtų ateiti per kelias sekundes.',
    notifIos: 'Pranešimai veikia tik tada, kai programėlė pridėta prie pradžios ekrano ir atidaryta iš ten.',
    notifNo: 'Ši naršyklė pranešimų nepalaiko.',
    notifDenied: 'Pranešimai užblokuoti. Įjunkite juos telefono nustatymuose šiai programėlei.',
    notifAsk: 'Įjungti pranešimus?',
    notifAskText: 'Telefonas praneš, kai kas nors užsirezervuos per puslapį ar atšauks rezervaciją.',
    later: 'Vėliau',
    peopleTitle: 'Žmonės',
    active: 'prisijungta',
    invited: function (until) { return 'laukia prisijungimo, kodas galioja iki ' + until; },
    pushOn: 'pranešimai įjungti', pushOff: 'pranešimai išjungti',
    remove: 'Pašalinti',
    removeQ: function (n) { return 'Pašalinti ' + n + '?'; },
    removeText: 'Šio žmogaus telefonas nebematys rezervacijų. Vėliau galite pakviesti iš naujo.',
    removed: 'Pašalinta.',
    inviteTitle: 'Pakviesti žmogų',
    inviteName: 'Vardas',
    inviteRole: 'Teisės',
    roleStaff: 'Darbuotojas',
    roleManager: 'Vadovas (gali kviesti žmones)',
    inviteBtn: 'Sukurti kodą',
    inviteCode: 'Prisijungimo kodas',
    inviteUntil: function (u) { return 'Galioja iki ' + u + ', vienam telefonui.'; },
    inviteShare: 'Siųsti kodą',
    inviteCopied: 'Nukopijuota.',
    inviteText: function (code) {
      return 'Luka rezervacijos. Atsidarykite ' + location.origin + location.pathname +
        ' telefone, įsidėkite į pradžios ekraną ir įveskite kodą ' + code + '.';
    },
    logout: 'Atsijungti šiame telefone',
    logoutQ: 'Atsijungti šiame telefone?',
    logoutText: 'Norint vėl prisijungti, reikės naujo kodo iš vadovo.',
    logoutYes: 'Atsijungti',
    managerOnly: 'Tai gali tik vadovas.'
  };

  var WD = ['sekmadienis', 'pirmadienis', 'antradienis', 'trečiadienis', 'ketvirtadienis', 'penktadienis', 'šeštadienis'];
  var WD_SHORT = ['Sk', 'Pr', 'An', 'Tr', 'Kt', 'Pn', 'Št'];

  var ICONS = {
    list: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M8 6h13M8 12h13M8 18h13"/><circle cx="3.5" cy="6" r="1"/><circle cx="3.5" cy="12" r="1"/><circle cx="3.5" cy="18" r="1"/></svg>',
    book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/></svg>',
    remind: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8.5 8.5 0 0 1-12.6 7.4L3 21l1.6-5.2A8.5 8.5 0 1 1 21 12z"/></svg>',
    more: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/></svg>',
    check: '<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>'
  };

  var app = document.getElementById('app');
  var state = {
    key: localStorage.getItem(KEY_STORE),
    start: null,
    tab: 'list',
    date: null,
    day: null,
    open: null, // id of the reservation whose buttons are shown
    book: null,
    reminders: null,
    people: null,
    invite: null,
    error: '',
    busy: false,
    showIosSteps: true,
    installPrompt: null
  };

  // ---------- helpers ----------

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function plural(n, one, few, many) {
    var t = n % 10, h = n % 100;
    if (t === 1 && h !== 11) return one;
    if (t >= 2 && t <= 9 && (h < 10 || h >= 20)) return few;
    return many;
  }
  function addDays(date, n) {
    var d = new Date(date + 'T12:00:00Z');
    d.setUTCDate(d.getUTCDate() + n);
    return d.toISOString().slice(0, 10);
  }
  function weekday(date) { return new Date(date + 'T12:00:00Z').getUTCDay(); }
  function dateLong(date) { var w = WD[weekday(date)]; return w.charAt(0).toUpperCase() + w.slice(1) + ', ' + date.slice(5); }
  function dateChip(date) {
    var today = state.start.today;
    if (date === today) return T.today;
    if (date === addDays(today, 1)) return T.tomorrow;
    return WD_SHORT[weekday(date)] + ' ' + date.slice(5);
  }
  function isIos() {
    return /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  }
  function standalone() {
    return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  }
  function pushSupported() {
    return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
  }

  var toastTimer;
  function toast(text) {
    var el = document.getElementById('toast');
    el.textContent = text;
    el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.hidden = true; }, 3200);
  }

  function call(op, data) {
    var body = Object.assign({ op: op, k: state.key }, data || {});
    return fetch(API, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(body) })
      .then(function (r) { return r.json(); })
      .catch(function () { return { ok: false, reason: 'network' }; })
      .then(function (res) {
        if (!res.ok && res.reason === 'auth' && op !== 'join') {
          forget();
          renderJoin();
        }
        return res;
      });
  }

  function forget() {
    state.key = null;
    state.start = null;
    localStorage.removeItem(KEY_STORE);
    saveSwConfig({ key: null });
  }

  // The service worker can't read localStorage: it gets the address and key from Cache Storage.
  var SW_CONFIG = new URL('luka-config', location.href).href;
  function readSwConfig() {
    if (!('caches' in window)) return Promise.resolve({});
    return caches.open('luka-config').then(function (c) { return c.match(SW_CONFIG); })
      .then(function (r) { return r ? r.json() : {}; })
      .catch(function () { return {}; });
  }
  function saveSwConfig(patch) {
    if (!('caches' in window)) return Promise.resolve();
    return readSwConfig().then(function (cfg) {
      var next = Object.assign({ api: API }, cfg, patch);
      return caches.open('luka-config').then(function (c) {
        return c.put(SW_CONFIG, new Response(JSON.stringify(next), { headers: { 'Content-Type': 'application/json' } }));
      });
    });
  }

  function sheet(html) {
    closeSheet();
    var wrap = document.createElement('div');
    wrap.className = 'backdrop';
    wrap.innerHTML = '<div class="sheet" role="dialog" aria-modal="true">' + html + '</div>';
    wrap.addEventListener('click', function (e) { if (e.target === wrap) closeSheet(); });
    document.body.appendChild(wrap);
    var first = wrap.querySelector('button, a, input');
    if (first) first.focus();
    return wrap;
  }
  function closeSheet() {
    var old = document.querySelector('.backdrop');
    if (old) old.remove();
  }

  // ---------- join ----------

  function renderJoin(message) {
    var iosOutside = isIos() && !standalone() && state.showIosSteps;
    var html = '<div class="join">' +
      '<img class="logo" src="ikonos/ikona-192.png" alt="">' +
      '<h1>' + esc(T.joinTitle) + '</h1>';
    if (iosOutside) {
      html += '<p class="muted">' + esc(T.iosWhy) + '</p>' +
        '<div class="card"><p style="margin:16px 16px 0;font-weight:650">' + esc(T.iosTitle) + '</p><ol class="steps">' +
        T.iosSteps.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ol></div>' +
        '<p style="margin-top:20px"><button class="btn block" data-act="ios-skip">' + esc(T.iosSkip) + '</button></p>';
    } else {
      html += '<p class="muted">' + esc(T.joinText) + '</p>' +
        '<form data-form="join">' +
        '<label class="field"><span>' + esc(T.joinCode) + '</span>' +
        '<input class="code-input" name="code" type="text" inputmode="text" autocomplete="one-time-code" autocapitalize="characters" spellcheck="false" maxlength="9" placeholder="XXXX-XXXX" required></label>' +
        (message ? '<div class="error">' + esc(message) + '</div>' : '') +
        '<button class="btn primary block" type="submit">' + esc(T.joinBtn) + '</button>' +
        '</form>';
      if (state.installPrompt) html += '<p style="margin-top:12px"><button class="btn block" data-act="install">' + esc(T.install) + '</button></p>';
    }
    html += '</div>';
    app.innerHTML = html;
    var input = app.querySelector('input[name=code]');
    if (input) input.addEventListener('input', function () {
      var v = input.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
      input.value = v.length > 4 ? v.slice(0, 4) + '-' + v.slice(4) : v;
    });
  }

  function join(code) {
    var device = (navigator.userAgent.match(/\(([^)]+)\)/) || [])[1] || '';
    return call('join', { code: code, device: device }).then(function (res) {
      if (!res.ok) {
        renderJoin(res.reason === 'wait' ? T.joinWait : res.reason === 'network' ? T.network : T.joinBad);
        return;
      }
      state.key = res.key;
      localStorage.setItem(KEY_STORE, res.key);
      saveSwConfig({ key: res.key });
      return boot().then(function () {
        if (pushSupported() && Notification.permission === 'default' && (!isIos() || standalone())) askPush();
      });
    });
  }

  // ---------- frame ----------

  function frame(title, sub, body) {
    var tabs = ['list', 'book', 'remind', 'more'];
    var unsent = state.reminders ? state.reminders.items.filter(function (r) { return !r.reminder; }).length : 0;
    app.innerHTML = '<div class="shell">' +
      '<header class="top"><h1>' + esc(title) + '</h1>' + (sub ? '<div class="sub">' + esc(sub) + '</div>' : '') + '</header>' +
      '<main class="content">' + body + '</main></div>' +
      '<nav class="tabbar" aria-label="Skiltys"><div class="tabbar-in">' + tabs.map(function (t) {
        var badge = t === 'remind' && unsent ? '<span class="badge">' + unsent + '</span>' : '';
        return '<button class="tab" data-tab="' + t + '"' + (state.tab === t ? ' aria-current="page"' : '') + '>' +
          '<span class="dot">' + ICONS[t] + badge + '</span>' + esc(T.tabs[t]) + '</button>';
      }).join('') + '</div></nav>';
  }

  function render() {
    if (!state.key) return renderJoin();
    if (!state.start) return;
    if (state.tab === 'list') return renderList();
    if (state.tab === 'book') return renderBook();
    if (state.tab === 'remind') return renderReminders();
    return renderMore();
  }

  function errorBox(text) {
    return '<div class="error">' + esc(text) + '</div><button class="btn block" data-act="retry">' + esc(T.retry) + '</button>';
  }

  // ---------- day list ----------

  function dateChips(selected, act, dates) {
    return '<div class="chips" role="group">' + dates.map(function (d) {
      return '<button class="chip" data-act="' + act + '" data-date="' + d + '" aria-pressed="' + (d === selected) + '">' + esc(dateChip(d)) + '</button>';
    }).join('') + '</div>';
  }

  function listDates() {
    var out = [];
    for (var i = 0; i < 7; i++) out.push(addDays(state.start.today, i));
    if (out.indexOf(state.date) === -1) out.push(state.date);
    return out;
  }

  function renderList() {
    var d = state.day && state.day.date === state.date ? state.day : null;
    var body = dateChips(state.date, 'pick-day', listDates()) +
      '<label class="field" style="margin-top:10px"><span class="muted" style="font-weight:500">' + esc(T.otherDate) + '</span>' +
      '<input type="date" data-act="pick-other" value="' + state.date + '"></label>';
    if (state.error) body += errorBox(state.error);
    else if (!d) body += '<div class="empty">' + esc(T.loading) + '</div>';
    else {
      var live = d.items.filter(function (r) { return r.status === 'patvirtinta'; });
      var gone = d.items.filter(function (r) { return r.status !== 'patvirtinta'; });
      var ppl = live.reduce(function (s, r) { return s + Number(r.people); }, 0);
      body += '<div class="summary"><b>' + esc(T.summary(live.length, ppl)) + '</b></div>';
      body += live.length ? '<div class="list">' + live.map(resCard).join('') + '</div>' : '<div class="card empty">' + esc(T.empty) + '</div>';
      if (gone.length) body += '<div class="section-title">' + esc(T.cancelledTitle) + '</div><div class="list">' + gone.map(resCard).join('') + '</div>';
    }
    frame(dateLong(state.date), state.start.restaurantName, body);
  }

  function resCard(r) {
    var cancelled = r.status !== 'patvirtinta';
    var src = '<span class="tag' + (r.source === 'puslapis' ? ' web' : '') + '">' + esc(T.src[r.source] || r.source) + '</span>';
    var open = state.open === r.id && !cancelled;
    return '<div class="card res' + (cancelled ? ' cancelled' : '') + '" data-act="toggle" data-id="' + esc(r.id) + '" role="button" tabindex="0" aria-expanded="' + open + '">' +
      '<div class="time">' + esc(r.time) + '</div>' +
      '<div class="who"><div class="name">' + esc(r.name) + '</div><div class="meta">' + src + ' ' + esc(r.phone) + '</div></div>' +
      '<div class="people">' + esc(T.people(r.people)) + '</div>' +
      (open ? '<div class="actions"><a class="btn small" href="tel:' + esc(r.phone.replace(/[^\d+]/g, '')) + '">' + esc(T.call) + '</a>' +
        '<button class="btn small danger" data-act="cancel" data-id="' + esc(r.id) + '">' + esc(T.cancel) + '</button></div>' : '') +
      '</div>';
  }

  function loadDay(date) {
    state.date = date;
    state.error = '';
    if (state.tab === 'list') render();
    return call('day', { date: date }).then(function (res) {
      if (!state.key) return;
      if (res.ok) state.day = res;
      else state.error = res.reason === 'network' ? T.network : T.error;
      if (state.tab === 'list' && state.date === date) render();
    });
  }

  function askCancel(id) {
    var r = (state.day.items || []).filter(function (x) { return x.id === id; })[0];
    if (!r) return;
    sheet('<h2>' + esc(T.cancelQ) + '</h2><p class="muted">' + esc(dateLong(state.date) + ' ' + r.time + ' · ' + T.people(r.people) + ' · ' + r.name) + '</p>' +
      '<div class="row"><button class="btn" data-act="close">' + esc(T.no) + '</button>' +
      '<button class="btn primary" data-act="cancel-yes" data-id="' + esc(id) + '">' + esc(T.cancelYes) + '</button></div>');
  }

  function doCancel(id, btn) {
    btn.disabled = true;
    call('cancel', { id: id }).then(function (res) {
      closeSheet();
      if (res.ok) toast(T.cancelled);
      else toast(res.reason === 'already' ? T.already : res.reason === 'network' ? T.network : T.error);
      state.open = null;
      loadDay(state.date);
    });
  }

  // ---------- new booking ----------

  function newBooking(date) {
    state.book = { date: date || state.start.today, people: 0, bigPeople: false, time: '', times: null, loadingTimes: false,
      name: '', phone: '', consent: false, error: '' };
  }

  function renderBook() {
    var b = state.book;
    var s = state.start;
    var body = '<div class="section-title" style="margin-top:4px">' + esc(T.date) + '</div>' + dateChips(b.date, 'b-date', s.dates);
    body += '<div class="section-title">' + esc(T.peopleQ) + '</div><div class="grid">';
    for (var n = 1; n <= 7; n++) {
      body += '<button class="chip" data-act="b-people" data-n="' + n + '" aria-pressed="' + (b.people === n && !b.bigPeople) + '">' + n + '</button>';
    }
    body += '<button class="chip" data-act="b-big" aria-pressed="' + b.bigPeople + '">' + esc(T.more) + '</button></div>';
    if (b.bigPeople) {
      body += '<label class="field"><span>' + esc(T.peopleQ) + '</span><input type="number" inputmode="numeric" min="8" max="' + s.maxPhoneGroup +
        '" data-act="b-people-input" value="' + (b.people >= 8 ? b.people : '') + '" placeholder="8"></label>';
    }
    body += '<div class="section-title">' + esc(T.time) + '</div>';
    if (!b.people) body += '<p class="muted">' + esc(T.pickFirst) + '</p>';
    else if (b.people > s.maxPhoneGroup) body += '<p class="muted">' + esc(T.tooBig(s.maxPhoneGroup)) + '</p>';
    else if (b.loadingTimes || !b.times) body += '<p class="muted">' + esc(T.loading) + '</p>';
    else if (!b.times.length) body += '<p class="muted">' + esc(T.noTimes) + '</p>';
    else {
      body += '<div class="grid">' + b.times.map(function (t) {
        return '<button class="chip" data-act="b-time" data-t="' + t + '" aria-pressed="' + (b.time === t) + '">' + t + '</button>';
      }).join('') + '</div>';
    }
    body += '<form data-form="book" novalidate>' +
      '<label class="field"><span>' + esc(T.name) + '</span><input type="text" name="name" autocomplete="off" maxlength="60" value="' + esc(b.name) + '"></label>' +
      '<label class="field"><span>' + esc(T.phone) + '</span><input type="tel" name="phone" autocomplete="off" placeholder="' + esc(T.phonePh) + '" value="' + esc(b.phone) + '"></label>' +
      '<label class="check"><input type="checkbox" name="consent"' + (b.consent ? ' checked' : '') + '><span>' + esc(T.consent) + '</span></label>' +
      (b.error ? '<div class="error">' + esc(b.error) + '</div>' : '') +
      '<button class="btn primary block" type="submit"' + (b.time ? '' : ' disabled') + '>' + esc(T.save) + '</button></form>';
    frame(T.bookTitle, T.bookSub, body);
  }

  function keepTyped() {
    var f = app.querySelector('form[data-form=book]');
    if (!f || !state.book) return;
    state.book.name = f.name.value;
    state.book.phone = f.phone.value;
    state.book.consent = f.consent.checked;
  }

  function loadTimes() {
    var b = state.book;
    b.time = '';
    b.times = null;
    if (!b.people || b.people > state.start.maxPhoneGroup) return render();
    b.loadingTimes = true;
    render();
    var asked = b.date + '/' + b.people;
    call('slots', { date: b.date, people: b.people }).then(function (res) {
      if (state.book !== b || asked !== b.date + '/' + b.people) return;
      b.loadingTimes = false;
      b.times = res.ok ? res.times : [];
      if (!res.ok) b.error = res.reason === 'network' ? T.network : T.error;
      if (state.tab === 'book') { keepTyped(); render(); }
    });
  }

  function saveBooking(form) {
    keepTyped();
    var b = state.book;
    b.error = '';
    var btn = form.querySelector('button[type=submit]');
    btn.disabled = true;
    call('book', { date: b.date, time: b.time, people: b.people, name: b.name.trim(), phone: b.phone.trim(), consent: b.consent }).then(function (res) {
      if (res.ok) {
        var it = res.item;
        sheet('<div class="ok-mark">' + ICONS.check + '</div><h2>' + esc(T.saved) + '</h2>' +
          '<p class="muted">' + esc(dateLong(it.date || b.date) + ' ' + it.time + ' · ' + T.people(it.people) + ' · ' + it.name) + '</p>' +
          '<div class="row"><button class="btn" data-act="book-again">' + esc(T.newOne) + '</button>' +
          '<button class="btn primary" data-act="see-day" data-date="' + esc(b.date) + '">' + esc(T.seeDay) + '</button></div>');
        newBooking(b.date);
        render();
        return;
      }
      if (res.reason === 'full') { b.error = T.full; loadTimes(); return; }
      b.error = res.reason === 'closed' ? T.closed :
        res.reason === 'network' ? T.network :
        res.field === 'name' ? T.badName :
        res.field === 'phone' ? T.badPhone :
        res.reason === 'invalid' ? T.badField : T.error;
      render();
    });
  }

  // ---------- reminders ----------

  function loadReminders() {
    return call('reminders').then(function (res) {
      if (res.ok) state.reminders = res;
      if (state.tab === 'remind') render();
      else if (state.start && state.key) render(); // badge
    });
  }

  function renderReminders() {
    var r = state.reminders;
    var body;
    if (!r) body = '<div class="empty">' + esc(T.loading) + '</div>';
    else {
      body = r.items.length ? '<p class="muted" style="margin-top:0">' + esc(T.remindHelp) + '</p><div class="list">' + r.items.map(function (x) {
        var done = !!x.reminder;
        return '<div class="card res"><div class="time">' + esc(x.time) + '</div>' +
          '<div class="who"><div class="name">' + esc(x.name) + '</div><div class="meta">' +
          '<span class="tag' + (done ? ' done' : '') + '">' + esc(done ? T.sent : T.waiting) + '</span> ' + esc(x.phone) + '</div></div>' +
          '<div class="people">' + esc(T.people(x.people)) + '</div>' +
          '<div class="actions"><a class="btn small' + (done ? '' : ' primary') + '" href="' + esc(x.whatsapp) + '" target="_blank" rel="noopener">' + esc(T.whatsapp) + '</a>' +
          (done ? '' : '<button class="btn small" data-act="mark-sent" data-id="' + esc(x.id) + '">✓ ' + esc(T.markSent) + '</button>') + '</div></div>';
      }).join('') + '</div>' : '<div class="card empty">' + esc(T.remindNone) + '</div>';
      if (r.noConsent.length) {
        body += '<div class="section-title">' + esc(T.noConsent) + '</div><div class="card" style="padding:4px 14px">' +
          r.noConsent.map(function (x) { return '<p>' + esc(x.time + ' · ' + x.name + ' · ' + T.people(x.people)) + '</p>'; }).join('') + '</div>';
      }
    }
    frame(T.remindTitle, r ? dateLong(r.date) : '', body);
  }

  function markSent(id, btn) {
    btn.disabled = true;
    call('remind', { id: id }).then(function (res) {
      if (!res.ok) { btn.disabled = false; toast(res.reason === 'network' ? T.network : T.error); return; }
      loadReminders();
    });
  }

  // ---------- settings ----------

  function pushState() {
    if (isIos() && !standalone()) return 'ios';
    if (!pushSupported()) return 'none';
    if (Notification.permission === 'denied') return 'denied';
    return state.start.me.push && Notification.permission === 'granted' ? 'on' : 'off';
  }

  function renderMore() {
    var me = state.start.me;
    var ps = pushState();
    var body = '<div class="card person"><div class="who"><div class="name">' + esc(me.name) + '</div><div class="meta">' + esc(T.you + ' · ' + T.role[me.role]) + '</div></div></div>';
    body += '<div class="section-title">' + esc(T.notif) + '</div><div class="card" style="padding:14px">';
    if (ps === 'on') {
      body += '<p style="margin-top:0">' + esc(T.notifOn) + '</p><div style="display:flex;gap:8px">' +
        '<button class="btn small" data-act="push-test">' + esc(T.notifTest) + '</button>' +
        '<button class="btn small" data-act="push-off">' + esc(T.notifDisable) + '</button></div>';
    } else if (ps === 'off') {
      body += '<p style="margin-top:0">' + esc(T.notifOff) + '</p><button class="btn primary block" data-act="push-on">' + esc(T.notifEnable) + '</button>';
    } else {
      body += '<p style="margin:0">' + esc(ps === 'ios' ? T.notifIos : ps === 'denied' ? T.notifDenied : T.notifNo) + '</p>';
    }
    body += '</div>';
    if (me.role === 'vadovas') {
      body += '<div class="section-title">' + esc(T.peopleTitle) + '</div>';
      if (!state.people) body += '<div class="card empty">' + esc(T.loading) + '</div>';
      else body += '<div class="list">' + state.people.map(function (p) {
        var meta = p.status === 'pakviestas' ? T.invited(p.codeUntil) : T.role[p.role] + ' · ' + T.active + ' · ' + (p.push ? T.pushOn : T.pushOff);
        var self = p.id === me.id;
        return '<div class="card person"><div class="who"><div class="name">' + esc(p.name) + '</div><div class="meta">' + esc(meta) + '</div></div>' +
          (self ? '' : '<button class="btn small danger" data-act="remove" data-id="' + esc(p.id) + '" data-name="' + esc(p.name) + '">' + esc(T.remove) + '</button>') + '</div>';
      }).join('') + '</div>';
      body += '<div class="section-title">' + esc(T.inviteTitle) + '</div><div class="card" style="padding:4px 14px 14px">';
      if (state.invite) {
        body += '<div class="code-box"><div class="muted">' + esc(state.invite.name + ' · ' + T.inviteCode) + '</div>' +
          '<div class="code">' + esc(state.invite.code) + '</div><div class="muted">' + esc(T.inviteUntil(state.invite.until)) + '</div></div>' +
          '<button class="btn primary block" data-act="share">' + esc(T.inviteShare) + '</button>';
      }
      body += '<form data-form="invite"><label class="field"><span>' + esc(T.inviteName) + '</span><input type="text" name="name" maxlength="40" autocomplete="off"></label>' +
        '<label class="field"><span>' + esc(T.inviteRole) + '</span><select name="role"><option value="darbuotojas">' + esc(T.roleStaff) + '</option>' +
        '<option value="vadovas">' + esc(T.roleManager) + '</option></select></label>' +
        '<button class="btn block" type="submit">' + esc(T.inviteBtn) + '</button></form></div>';
    }
    body += '<p style="margin-top:28px"><button class="btn block danger" data-act="logout">' + esc(T.logout) + '</button></p>';
    frame(T.moreTitle, state.start.restaurantName, body);
  }

  function loadPeople() {
    if (state.start.me.role !== 'vadovas') return;
    call('people').then(function (res) {
      if (res.ok) state.people = res.items;
      if (state.tab === 'more') render();
    });
  }

  function b64ToBytes(b64) {
    var s = atob(b64.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((b64.length + 3) % 4));
    var out = new Uint8Array(s.length);
    for (var i = 0; i < s.length; i++) out[i] = s.charCodeAt(i);
    return out;
  }

  // Must start from a tap: iPhone only asks for permission then.
  function enablePush() {
    if (!pushSupported()) return Promise.resolve();
    return Notification.requestPermission().then(function (perm) {
      if (perm !== 'granted') { render(); return; }
      return navigator.serviceWorker.ready.then(function (reg) {
        return reg.pushManager.getSubscription().then(function (old) {
          return old || reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64ToBytes(state.start.vapidPublic) });
        });
      }).then(function (sub) {
        return call('subscribe', { sub: { endpoint: sub.endpoint } });
      }).then(function (res) {
        if (res.ok) state.start.me.push = true;
        else toast(res.reason === 'network' ? T.network : T.error);
        render();
      });
    }).catch(function (err) {
      console.error('Pranešimų įjungimas:', err);
      toast(T.error);
    });
  }

  function disablePush() {
    var done = function () { return call('unsubscribe').then(function () { state.start.me.push = false; render(); }); };
    if (!pushSupported()) return done();
    return navigator.serviceWorker.ready.then(function (reg) { return reg.pushManager.getSubscription(); })
      .then(function (sub) { return sub && sub.unsubscribe(); })
      .then(done, done);
  }

  // Phone changed its push address (or the server forgot it): send the current one again.
  function refreshPush() {
    if (!pushSupported() || Notification.permission !== 'granted') return;
    navigator.serviceWorker.ready.then(function (reg) { return reg.pushManager.getSubscription(); }).then(function (sub) {
      if (sub) call('subscribe', { sub: { endpoint: sub.endpoint } }).then(function (res) { if (res.ok) state.start.me.push = true; });
    }).catch(function (err) { console.error('Pranešimų atnaujinimas:', err); });
  }

  function askPush() {
    sheet('<h2>' + esc(T.notifAsk) + '</h2><p class="muted">' + esc(T.notifAskText) + '</p>' +
      '<div class="row"><button class="btn" data-act="close">' + esc(T.later) + '</button>' +
      '<button class="btn primary" data-act="push-on-sheet">' + esc(T.notifEnable) + '</button></div>');
  }

  function shareInvite() {
    var text = T.inviteText(state.invite.code);
    if (navigator.share) {
      navigator.share({ text: text }).catch(function () { /* closed by the user */ });
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(function () { toast(T.inviteCopied); });
    }
  }

  // ---------- events ----------

  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-act], [data-tab]');
    if (!el) return;
    if (el.dataset.tab) return switchTab(el.dataset.tab);
    var act = el.dataset.act;
    var id = el.dataset.id;
    switch (act) {
      case 'ios-skip': state.showIosSteps = false; renderJoin(); break;
      case 'install':
        state.installPrompt.prompt();
        state.installPrompt = null;
        break;
      case 'retry': state.error = ''; loadDay(state.date); break;
      case 'pick-day': state.open = null; loadDay(el.dataset.date); break;
      case 'toggle':
        if (e.target.closest('a, button')) return;
        state.open = state.open === id ? null : id;
        render();
        break;
      case 'cancel': askCancel(id); break;
      case 'cancel-yes': doCancel(id, el); break;
      case 'close': closeSheet(); break;
      case 'b-date': keepTyped(); state.book.date = el.dataset.date; state.book.error = ''; loadTimes(); break;
      case 'b-people': keepTyped(); state.book.bigPeople = false; state.book.people = Number(el.dataset.n); state.book.error = ''; loadTimes(); break;
      case 'b-big': keepTyped(); state.book.bigPeople = true; state.book.people = 0; state.book.time = ''; render(); focusLater('[data-act=b-people-input]'); break;
      case 'b-time': keepTyped(); state.book.time = el.dataset.t; state.book.error = ''; render(); break;
      case 'book-again': closeSheet(); break;
      case 'see-day': closeSheet(); state.tab = 'list'; state.day = null; loadDay(el.dataset.date); break;
      case 'mark-sent': markSent(id, el); break;
      case 'push-on': enablePush(); break;
      case 'push-on-sheet': closeSheet(); enablePush(); break;
      case 'push-off': disablePush(); break;
      case 'push-test':
        el.disabled = true;
        call('testpush').then(function (res) {
          el.disabled = false;
          toast(res.ok ? T.notifTestSent : res.reason === 'network' ? T.network : T.error);
        });
        break;
      case 'remove':
        sheet('<h2>' + esc(T.removeQ(el.dataset.name)) + '</h2><p class="muted">' + esc(T.removeText) + '</p>' +
          '<div class="row"><button class="btn" data-act="close">' + esc(T.no) + '</button>' +
          '<button class="btn primary" data-act="remove-yes" data-id="' + esc(id) + '">' + esc(T.remove) + '</button></div>');
        break;
      case 'remove-yes':
        el.disabled = true;
        call('remove', { id: id }).then(function (res) {
          closeSheet();
          toast(res.ok ? T.removed : T.error);
          loadPeople();
        });
        break;
      case 'share': shareInvite(); break;
      case 'logout':
        sheet('<h2>' + esc(T.logoutQ) + '</h2><p class="muted">' + esc(T.logoutText) + '</p>' +
          '<div class="row"><button class="btn" data-act="close">' + esc(T.no) + '</button>' +
          '<button class="btn primary" data-act="logout-yes">' + esc(T.logoutYes) + '</button></div>');
        break;
      case 'logout-yes':
        closeSheet();
        disablePush().then(function () { forget(); renderJoin(); });
        break;
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeSheet();
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[data-act=toggle]')) { e.preventDefault(); e.target.click(); }
  });

  document.addEventListener('change', function (e) {
    var el = e.target;
    if (el.dataset.act === 'pick-other' && el.value) { state.open = null; loadDay(el.value); }
  });

  var peopleTimer;
  document.addEventListener('input', function (e) {
    if (e.target.dataset.act !== 'b-people-input') return;
    var n = Number(e.target.value);
    clearTimeout(peopleTimer);
    peopleTimer = setTimeout(function () {
      keepTyped();
      state.book.people = n >= 1 ? Math.floor(n) : 0;
      loadTimes();
      focusLater('[data-act=b-people-input]', true);
    }, 600);
  });

  function focusLater(sel, toEnd) {
    setTimeout(function () {
      var el = app.querySelector(sel);
      if (!el) return;
      el.focus();
      if (toEnd) { var v = el.value; el.value = ''; el.value = v; }
    }, 0);
  }

  document.addEventListener('submit', function (e) {
    var f = e.target;
    e.preventDefault();
    if (f.dataset.form === 'join') {
      f.querySelector('button').disabled = true;
      join(f.code.value);
    } else if (f.dataset.form === 'book') {
      saveBooking(f);
    } else if (f.dataset.form === 'invite') {
      var btn = f.querySelector('button');
      btn.disabled = true;
      call('invite', { name: f.name.value, role: f.role.value }).then(function (res) {
        btn.disabled = false;
        if (!res.ok) { toast(res.reason === 'invalid' ? T.badName : res.reason === 'manager' ? T.managerOnly : T.error); return; }
        state.invite = res;
        loadPeople();
        render();
        var box = app.querySelector('.code-box');
        if (box) box.scrollIntoView({ block: 'center' });
      });
    }
  });

  function switchTab(tab) {
    if (state.tab === 'book') keepTyped();
    state.tab = tab;
    closeSheet();
    if (tab === 'list') loadDay(state.date);
    if (tab === 'book' && !state.book) newBooking(state.date >= state.start.today ? state.date : state.start.today);
    if (tab === 'book' && state.book.people && !state.book.times) return loadTimes();
    if (tab === 'remind') loadReminders();
    if (tab === 'more') { state.invite = null; loadPeople(); }
    render();
    window.scrollTo(0, 0);
  }

  // Opened from a notification, or the service worker says something changed.
  function openFrom(params) {
    if (params.view === 'reminders') return switchTab('remind');
    if (params.date) { state.tab = 'list'; state.day = null; loadDay(params.date); }
  }

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(function (err) { console.error('Service worker:', err); });
    navigator.serviceWorker.addEventListener('message', function (e) {
      if (!state.start || !e.data) return;
      if (e.data.type === 'open') openFrom(e.data);
      if (e.data.type === 'changed') { if (state.tab === 'list') loadDay(state.date); loadReminders(); }
    });
  }
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    state.installPrompt = e;
    if (!state.key) renderJoin();
  });

  // Fresh list when the phone comes back to the app, and every minute while open.
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible' && state.start) { if (state.tab === 'list') loadDay(state.date); loadReminders(); }
  });
  setInterval(function () {
    if (document.visibilityState === 'visible' && state.start && state.tab === 'list') loadDay(state.date);
  }, 60000);

  // ---------- start ----------

  function boot() {
    app.innerHTML = '<div class="empty" style="padding-top:40vh">' + esc(T.loading) + '</div>';
    return call('start').then(function (res) {
      if (!res.ok) {
        if (res.reason !== 'auth') app.innerHTML = '<div class="join">' + errorBox(res.reason === 'network' ? T.network : T.error) + '</div>';
        return;
      }
      state.start = res;
      var q = new URLSearchParams(location.search);
      state.date = /^\d{4}-\d{2}-\d{2}$/.test(q.get('date') || '') ? q.get('date') : res.today;
      // Events already in the inbox are not news for this phone.
      call('inbox', { since: 0 }).then(function (r) {
        var last = r.ok && r.events.length ? r.events[r.events.length - 1].seq : 0;
        readSwConfig().then(function (cfg) { saveSwConfig({ key: state.key, since: Math.max(cfg.since || 0, last) }); });
      });
      refreshPush();
      loadReminders();
      if (q.get('view') === 'reminders') switchTab('remind');
      else loadDay(state.date);
      if (q.has('view') || q.has('date')) history.replaceState(null, '', location.pathname);
    });
  }

  app.addEventListener('click', function (e) {
    var b = e.target.closest('[data-act=retry]');
    if (b && !state.start) boot();
  });

  if (state.key) boot();
  else renderJoin();
})();
