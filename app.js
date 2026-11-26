// Luka rezervacijos: phone app for owners and staff. Talks to the Google Apps Script
// (programa.js) with POST text/plain JSON. Plain JS, no build step.
(function () {
  'use strict';

  var API = window.LUKA_API;
  var KEY_STORE = 'luka.key';

  var T = {
    appName: 'Luka rezervacijos',
    tabs: { list: 'Sąrašas', book: 'Nauja', remind: 'Priminimai', more: 'Nustatymai' },
    today: 'Šiandien', tomorrow: 'Rytoj', otherDate: 'Kita data', back: 'Atgal',
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
    managerOnly: 'Tai gali tik vadovas.',
    // day navigation and calendar
    prevDay: 'Ankstesnė diena', nextDay: 'Kita diena',
    calTitle: 'Pasirinkite datą',
    prevMonth: 'Ankstesnis mėnuo', nextMonth: 'Kitas mėnuo',
    calClosed: 'Pilkos dienos: restoranas nedirba.',
    months: ['sausis', 'vasaris', 'kovas', 'balandis', 'gegužė', 'birželis', 'liepa', 'rugpjūtis', 'rugsėjis', 'spalis', 'lapkritis', 'gruodis'],
    // search
    searchPh: 'Ieškoti pagal vardą ar telefoną',
    searchLabel: 'Paieška',
    searchNone: 'Nieko nerasta.',
    searchMore: 'Rodomos 30 rezervacijų. Patikslinkite paiešką.',
    // arrival
    arrived: 'Atvyko', noShow: 'Neatvyko', unmark: 'Nuimti žymą',
    tagArrived: 'atvyko', tagNoShow: 'neatvyko',
    marks: function (a, n) { return [a ? 'atvyko ' + a : '', n ? 'neatvyko ' + n : ''].filter(Boolean).join(' · '); },
    future: 'Atvykimą galima žymėti tik rezervacijos dieną arba vėliau.',
    // edit
    edit: 'Keisti',
    editTitle: 'Keisti rezervaciją',
    saveEdit: 'Išsaugoti pakeitimus',
    editBack: 'Grįžti nekeičiant',
    editSaved: 'Pakeitimai išsaugoti.',
    editNone: 'Nieko nepakeista.',
    editCancelled: 'Ši rezervacija atšaukta, jos keisti nebegalima.',
    tooSoon: 'Šis laikas jau praėjo. Pasirinkite kitą.',
    tooFar: 'Tiek į priekį rezervacijų dar nepriimame.',
    // notes and language
    notes: 'Pastabos (nebūtina)',
    notesPh: 'Pvz., alergija riešutams',
    noteChips: [['Alergija', 'Alergija: '], ['Kėdutė vaikui', 'Kėdutė vaikui'], ['Gimtadienis', 'Gimtadienis'], ['Terasa', 'Terasa']],
    lang: 'Priminimo kalba',
    langHelp: 'Parenkama pagal telefono numerį. Galite pakeisti.',
    langNames: { es: 'Ispanų', en: 'Anglų', fr: 'Prancūzų', nl: 'Olandų', de: 'Vokiečių' },
    // closing days and hours
    closeOpen: 'Uždaryti dieną ar valandas',
    closeTitle: 'Nepriimti rezervacijų',
    closeWhole: 'Visą dieną', closeHours: 'Tam tikras valandas',
    closeFrom: 'Nuo', closeTo: 'Iki', closeToEnd: 'dienos pabaigos',
    closeReason: 'Priežastis (nebūtina)', closeReasonPh: 'Pvz., privati šventė',
    closeBtn: 'Uždaryti',
    closeHasQ: function (n) { return 'Tuo metu jau yra ' + n + ' ' + plural(n, 'rezervacija', 'rezervacijos', 'rezervacijų') + '.'; },
    closeHasText: 'Jos liks galioti. Naujų rezervacijų tuo metu nebus priimama.',
    closeYes: 'Vis tiek uždaryti',
    closedOk: 'Uždaryta. Naujų rezervacijų tuo metu nebus priimama.',
    closePast: 'Praėjusios dienos uždaryti negalima.',
    closeBadTo: 'Pabaiga turi būti vėliau nei pradžia.',
    closeLong: 'Priežastis per ilga (daugiausia 80 ženklų).',
    bandWhole: 'Uždaryta visą dieną',
    bandHours: function (f, t) { return 'Uždaryta ' + (t ? f + '–' + t : 'nuo ' + f); },
    bandBy: function (n) { return 'Įvedė ' + n; },
    weekdayClosed: 'Šią savaitės dieną restoranas nedirba.',
    reopen: 'Atšaukti uždarymą',
    reopenQ: 'Atšaukti uždarymą?',
    reopenText: 'Rezervacijos tuo metu vėl bus priimamos.',
    reopened: 'Uždarymas atšauktas. Rezervacijos vėl priimamos.'
  };

  var LANGS = ['es', 'en', 'fr', 'nl', 'de'];
  var MANAGER = 'vadovas';
  var HOLDS = ['patvirtinta', 'atvyko'];

  var WD = ['sekmadienis', 'pirmadienis', 'antradienis', 'trečiadienis', 'ketvirtadienis', 'penktadienis', 'šeštadienis'];
  var WD_SHORT = ['Sk', 'Pr', 'An', 'Tr', 'Kt', 'Pn', 'Št'];

  var ICONS = {
    list: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M8 6h13M8 12h13M8 18h13"/><circle cx="3.5" cy="6" r="1"/><circle cx="3.5" cy="12" r="1"/><circle cx="3.5" cy="18" r="1"/></svg>',
    book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/></svg>',
    remind: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8.5 8.5 0 0 1-12.6 7.4L3 21l1.6-5.2A8.5 8.5 0 1 1 21 12z"/></svg>',
    more: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/></svg>',
    check: '<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    search: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
    cal: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>',
    left: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>',
    right: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>'
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
    edit: null, // booking form for changing an existing reservation (shown in the list tab)
    q: '', // search text in the list tab
    found: null,
    cal: null, // open calendar sheet: { mode: 'list' | 'form', month: 'YYYY-MM' }
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
  function holds(r) { return HOLDS.indexOf(r.status) !== -1; }
  function isManager() { return state.start.me.role === MANAGER; }
  function dayClosed(date) {
    return state.start.closedWeekdays.indexOf(weekday(date)) !== -1 || state.start.closedDays.indexOf(date) !== -1;
  }
  // Same rules as the Google side (logika.js): the reminder language follows the country code.
  function normalizePhone(raw) {
    var s = String(raw || '').trim();
    var digits = s.replace(/\D/g, '');
    if (s.charAt(0) !== '+' && digits.indexOf('00') === 0) digits = digits.slice(2);
    else if (s.charAt(0) !== '+' && digits.length === 9) digits = '34' + digits;
    return digits.length < 10 || digits.length > 15 ? null : '+' + digits;
  }
  function guessLang(phone) {
    var p = normalizePhone(phone);
    if (!p) return '';
    if (/^\+34/.test(p)) return 'es';
    if (/^\+33/.test(p)) return 'fr';
    if (/^\+(31|32)/.test(p)) return 'nl';
    if (/^\+(49|43|41)/.test(p)) return 'de';
    return 'en';
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

  function frame(title, sub, body, tools) {
    var tabs = ['list', 'book', 'remind', 'more'];
    var unsent = state.reminders ? state.reminders.items.filter(function (r) { return !r.reminder; }).length : 0;
    app.innerHTML = '<div class="shell">' +
      '<header class="top"><div class="top-text"><h1>' + esc(title) + '</h1>' + (sub ? '<div class="sub">' + esc(sub) + '</div>' : '') + '</div>' +
      (tools || '') + '</header>' +
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
    if (state.tab === 'list' && state.edit) return renderForm(state.edit);
    if (state.tab === 'list') return renderList();
    if (state.tab === 'book') return renderForm(state.book);
    if (state.tab === 'remind') return renderReminders();
    return renderMore();
  }

  function errorBox(text) {
    return '<div class="error">' + esc(text) + '</div><button class="btn block" data-act="retry">' + esc(T.retry) + '</button>';
  }

  // ---------- date picker and calendar ----------

  // Today, tomorrow and a calendar for any other date. mode 'list': any day can be viewed;
  // mode 'form': only days that take bookings.
  function datePicker(selected, act, mode) {
    var today = state.start.today;
    var near = [today, addDays(today, 1)];
    var allowed = mode === 'form' ? formDates() : null;
    var other = near.indexOf(selected) === -1;
    return '<div class="chips" role="group" aria-label="' + esc(T.date) + '">' + near.map(function (d) {
      var ok = !allowed || allowed.indexOf(d) !== -1;
      return '<button class="chip" type="button" data-act="' + act + '" data-date="' + d + '" aria-pressed="' + (d === selected) + '"' +
        (ok ? '' : ' disabled') + '>' + esc(dateChip(d)) + '</button>';
    }).join('') +
      '<button class="chip cal-chip" type="button" data-act="cal-open" data-mode="' + mode + '" aria-pressed="' + other + '">' +
      ICONS.cal + esc(other ? dateChip(selected) : T.otherDate) + '</button></div>';
  }

  function shiftMonth(month, n) {
    var d = new Date(month + '-15T12:00:00Z');
    d.setUTCMonth(d.getUTCMonth() + n);
    return d.toISOString().slice(0, 7);
  }

  function calBounds(mode) {
    var s = state.start;
    if (mode === 'list') return { min: addDays(s.today, -365), max: addDays(s.today, s.daysAhead) };
    var d = formDates();
    return { min: d[0] || s.today, max: d[d.length - 1] || s.today };
  }

  function openCal(mode) {
    var sel = mode === 'list' ? state.date : cur().date;
    state.cal = { mode: mode, month: sel.slice(0, 7) };
    sheet('<div class="cal">' + calHtml() + '</div>');
  }

  function calHtml() {
    var c = state.cal;
    var b = calBounds(c.mode);
    var today = state.start.today;
    var sel = c.mode === 'list' ? state.date : cur().date;
    var allowed = c.mode === 'form' ? formDates() : null;
    var y = Number(c.month.slice(0, 4));
    var m = Number(c.month.slice(5, 7));
    var lead = (weekday(c.month + '-01') + 6) % 7; // weeks start on Monday
    var days = new Date(Date.UTC(y, m, 0)).getUTCDate();
    var canPrev = shiftMonth(c.month, -1) >= b.min.slice(0, 7);
    var canNext = shiftMonth(c.month, 1) <= b.max.slice(0, 7);
    var html = '<div class="cal-head">' +
      '<button class="icon-btn" data-act="cal-month" data-n="-1" aria-label="' + esc(T.prevMonth) + '"' + (canPrev ? '' : ' disabled') + '>' + ICONS.left + '</button>' +
      '<h2>' + y + ' m. ' + esc(T.months[m - 1]) + '</h2>' +
      '<button class="icon-btn" data-act="cal-month" data-n="1" aria-label="' + esc(T.nextMonth) + '"' + (canNext ? '' : ' disabled') + '>' + ICONS.right + '</button></div>' +
      '<div class="cal-grid">' + ['Pr', 'An', 'Tr', 'Kt', 'Pn', 'Št', 'Sk'].map(function (w) { return '<div class="cal-wd">' + w + '</div>'; }).join('');
    for (var i = 0; i < lead; i++) html += '<div></div>';
    for (var d = 1; d <= days; d++) {
      var date = c.month + '-' + (d < 10 ? '0' : '') + d;
      var ok = allowed ? allowed.indexOf(date) !== -1 : date >= b.min && date <= b.max;
      html += '<button class="cal-day' + (dayClosed(date) ? ' closed' : '') + (date === today ? ' today' : '') + '" data-act="cal-pick" data-date="' + date + '"' +
        ' aria-pressed="' + (date === sel) + '" aria-label="' + esc(dateLong(date)) + '"' + (ok ? '' : ' disabled') + '>' + d + '</button>';
    }
    var todayOk = allowed ? allowed.indexOf(today) !== -1 : true;
    return html + '</div><p class="muted cal-note">' + esc(T.calClosed) + '</p>' +
      '<div class="row"><button class="btn" data-act="close">' + esc(T.back) + '</button>' +
      '<button class="btn" data-act="cal-pick" data-date="' + today + '"' + (todayOk ? '' : ' disabled') + '>' + esc(T.today) + '</button></div>';
  }

  function pickDate(date) {
    var mode = state.cal ? state.cal.mode : 'list';
    closeSheet();
    state.cal = null;
    if (mode === 'list') { state.open = null; loadDay(date); return; }
    keepTyped();
    var f = cur();
    f.date = date;
    f.error = '';
    loadTimes();
  }

  // ---------- day list ----------

  function listIdle() { return !state.edit && !searching(); }
  function searching() { return state.q.trim().length >= 2; }

  function dayTools() {
    return '<div class="top-tools">' +
      '<button class="icon-btn on-dark" data-act="day-step" data-n="-1" aria-label="' + esc(T.prevDay) + '">' + ICONS.left + '</button>' +
      '<button class="icon-btn on-dark" data-act="day-step" data-n="1" aria-label="' + esc(T.nextDay) + '">' + ICONS.right + '</button></div>';
  }

  function renderList() {
    var body = '<label class="search">' + ICONS.search + '<span class="sr">' + esc(T.searchLabel) + '</span>' +
      '<input type="search" data-act="search" enterkeyhint="search" autocomplete="off" spellcheck="false" placeholder="' + esc(T.searchPh) + '" value="' + esc(state.q) + '"></label>' +
      '<div id="list-body">' + (searching() ? foundBody() : dayBody()) + '</div>';
    frame(dateLong(state.date), state.start.restaurantName, body, dayTools());
  }

  // Search results and the day list swap inside #list-body, so typing never loses the keyboard.
  function fillListBody() {
    var el = document.getElementById('list-body');
    if (el) el.innerHTML = searching() ? foundBody() : dayBody();
  }

  function dayBody() {
    var d = state.day && state.day.date === state.date ? state.day : null;
    var body = datePicker(state.date, 'pick-day', 'list');
    if (state.error) return body + errorBox(state.error);
    if (!d) return body + '<div class="empty">' + esc(T.loading) + '</div>';
    body += closureBands(d);
    var live = d.items.filter(function (r) { return r.status !== 'atšaukta'; });
    var gone = d.items.filter(function (r) { return r.status === 'atšaukta'; });
    var seated = live.filter(holds);
    var ppl = seated.reduce(function (s, r) { return s + Number(r.people); }, 0);
    var arrived = live.filter(function (r) { return r.status === 'atvyko'; }).length;
    var noShow = live.filter(function (r) { return r.status === 'neatvyko'; }).length;
    body += '<div class="summary"><b>' + esc(T.summary(seated.length, ppl)) + '</b>' +
      (arrived || noShow ? '<span class="muted">' + esc(T.marks(arrived, noShow)) + '</span>' : '') + '</div>';
    body += live.length ? '<div class="list">' + live.map(function (r) { return resCard(r); }).join('') + '</div>' : '<div class="card empty">' + esc(T.empty) + '</div>';
    if (gone.length) body += '<div class="section-title">' + esc(T.cancelledTitle) + '</div><div class="list">' + gone.map(function (r) { return resCard(r); }).join('') + '</div>';
    if (isManager() && state.date >= state.start.today) {
      body += '<button class="btn block close-open" data-act="close-open">' + esc(T.closeOpen) + '</button>';
    }
    return body;
  }

  function closureBands(d) {
    var out = '';
    var canReopen = isManager() && d.date >= state.start.today;
    if (d.weekdayClosed) out += '<div class="band"><div class="band-text"><b>' + esc(T.weekdayClosed) + '</b></div></div>';
    d.closures.forEach(function (c) {
      out += '<div class="band"><div class="band-text"><b>' + esc(c.from ? T.bandHours(c.from, c.to) : T.bandWhole) + '</b>' +
        (c.reason ? ' · ' + esc(c.reason) : '') + '<div class="muted">' + esc(T.bandBy(c.by)) + '</div></div>' +
        (canReopen ? '<button class="btn small" data-act="reopen" data-id="' + esc(c.id) + '">' + esc(T.reopen) + '</button>' : '') + '</div>';
    });
    return out;
  }

  function resCard(r, found) {
    var cancelled = r.status === 'atšaukta';
    var noShow = r.status === 'neatvyko';
    var mark = r.status === 'atvyko' ? '<span class="tag done">' + esc(T.tagArrived) + '</span> ' :
      noShow ? '<span class="tag off">' + esc(T.tagNoShow) + '</span> ' : '';
    var src = '<span class="tag' + (r.source === 'puslapis' ? ' web' : '') + '">' + esc(T.src[r.source] || r.source) + '</span>';
    var open = !found && state.open === r.id && !cancelled;
    return '<div class="card res' + (cancelled ? ' cancelled' : '') + (noShow ? ' noshow' : '') + '" data-act="' + (found ? 'open-found' : 'toggle') + '"' +
      ' data-id="' + esc(r.id) + '" data-date="' + esc(r.date) + '" role="button" tabindex="0"' + (found ? '' : ' aria-expanded="' + open + '"') + '>' +
      '<div class="time">' + esc(r.time) + (found ? '<small>' + esc(dateChip(r.date)) + '</small>' : '') + '</div>' +
      '<div class="who"><div class="name">' + esc(r.name) + '</div>' +
      '<div class="meta">' + mark + src + ' ' + esc(r.phone) + (r.lang ? ' · ' + esc(r.lang.toUpperCase()) : '') + '</div>' +
      (r.notes ? '<div class="notes' + (open ? ' full' : '') + '">' + esc(r.notes) + '</div>' : '') + '</div>' +
      '<div class="people">' + esc(T.people(r.people)) + '</div>' +
      (open ? resActions(r) : '') + '</div>';
  }

  function resActions(r) {
    var id = esc(r.id);
    var out = '';
    if (r.date <= state.start.today) {
      out += '<div class="actions">' + (r.status === 'patvirtinta' ?
        '<button class="btn small ok" data-act="arrive" data-id="' + id + '" data-v="atvyko">' + esc(T.arrived) + '</button>' +
        '<button class="btn small" data-act="arrive" data-id="' + id + '" data-v="neatvyko">' + esc(T.noShow) + '</button>' :
        '<button class="btn small" data-act="arrive" data-id="' + id + '" data-v="">' + esc(T.unmark) + '</button>') + '</div>';
    }
    out += '<div class="actions"><a class="btn small" href="tel:' + esc(r.phone.replace(/[^\d+]/g, '')) + '">' + esc(T.call) + '</a>' +
      '<button class="btn small" data-act="edit" data-id="' + id + '">' + esc(T.edit) + '</button>' +
      (r.status === 'patvirtinta' ? '<button class="btn small danger" data-act="cancel" data-id="' + id + '">' + esc(T.cancel) + '</button>' : '') + '</div>';
    return out;
  }

  function findItem(id) {
    return (state.day ? state.day.items : []).filter(function (x) { return x.id === id; })[0];
  }

  function loadDay(date) {
    state.date = date;
    state.error = '';
    if (state.tab === 'list' && listIdle()) render();
    return call('day', { date: date }).then(function (res) {
      if (!state.key) return;
      if (res.ok) state.day = res;
      else state.error = res.reason === 'network' ? T.network : T.error;
      if (state.tab === 'list' && state.date === date && listIdle()) render();
    });
  }

  function askCancel(id) {
    var r = findItem(id);
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

  function doArrive(id, value, btn) {
    btn.disabled = true;
    call('arrive', { id: id, value: value }).then(function (res) {
      if (res.ok) {
        var r = findItem(id);
        if (r) r.status = res.item.status;
        state.open = null;
        render();
      } else {
        btn.disabled = false;
        toast(res.reason === 'future' ? T.future : res.reason === 'already' ? T.already : res.reason === 'network' ? T.network : T.error);
      }
      loadDay(state.date);
    });
  }

  // ---------- search ----------

  var searchTimer;
  var searchSeq = 0;
  function onSearch(value) {
    var was = searching();
    state.q = value;
    clearTimeout(searchTimer);
    if (!searching()) {
      state.found = null;
      if (was) fillListBody();
      return;
    }
    if (!was) fillListBody();
    searchTimer = setTimeout(function () {
      var seq = ++searchSeq;
      call('search', { q: state.q }).then(function (res) {
        if (seq !== searchSeq || !searching()) return;
        state.found = res.ok ? res : { items: [], more: false, failed: res.reason === 'network' };
        fillListBody();
      });
    }, 350);
  }

  function foundBody() {
    var f = state.found;
    if (!f) return '<div class="empty">' + esc(T.loading) + '</div>';
    if (f.failed) return '<div class="error">' + esc(T.network) + '</div>';
    if (!f.items.length) return '<div class="card empty">' + esc(T.searchNone) + '</div>';
    return '<div class="list">' + f.items.map(function (r) { return resCard(r, true); }).join('') + '</div>' +
      (f.more ? '<p class="muted">' + esc(T.searchMore) + '</p>' : '');
  }

  function openFound(date, id) {
    state.q = '';
    state.found = null;
    state.open = id;
    state.day = null;
    loadDay(date);
    window.scrollTo(0, 0);
  }

  // ---------- closing days and hours (manager) ----------

  function openClose() {
    state.closing = { whole: true, from: state.start.times[0], to: '', reason: '', error: '' };
    sheet(closeHtml());
  }

  function resheet(html) {
    var el = document.querySelector('.backdrop .sheet');
    if (el) el.innerHTML = html;
  }

  function closeHtml() {
    var c = state.closing;
    var times = state.start.times;
    var html = '<h2>' + esc(T.closeTitle) + '</h2><p class="muted" style="margin-top:0">' + esc(dateLong(state.date)) + '</p>' +
      '<form data-form="close" novalidate><div class="chips" role="group">' +
      '<button type="button" class="chip" data-act="close-mode" data-whole="1" aria-pressed="' + c.whole + '">' + esc(T.closeWhole) + '</button>' +
      '<button type="button" class="chip" data-act="close-mode" data-whole="0" aria-pressed="' + !c.whole + '">' + esc(T.closeHours) + '</button></div>';
    if (!c.whole) {
      html += '<div class="two"><label class="field"><span>' + esc(T.closeFrom) + '</span><select name="from">' + times.map(function (t) {
        return '<option' + (t === c.from ? ' selected' : '') + '>' + t + '</option>';
      }).join('') + '</select></label>' +
        '<label class="field"><span>' + esc(T.closeTo) + '</span><select name="to">' + times.filter(function (t) { return t > c.from; }).map(function (t) {
          return '<option' + (t === c.to ? ' selected' : '') + '>' + t + '</option>';
        }).join('') + '<option value=""' + (c.to ? '' : ' selected') + '>' + esc(T.closeToEnd) + '</option></select></label></div>';
    }
    return html + '<label class="field"><span>' + esc(T.closeReason) + '</span><input type="text" name="reason" maxlength="80" autocomplete="off" placeholder="' +
      esc(T.closeReasonPh) + '" value="' + esc(c.reason) + '"></label>' +
      (c.error ? '<div class="error">' + esc(c.error) + '</div>' : '') +
      '<div class="row"><button type="button" class="btn" data-act="close">' + esc(T.back) + '</button>' +
      '<button type="submit" class="btn primary">' + esc(T.closeBtn) + '</button></div></form>';
  }

  function keepClose() {
    var f = document.querySelector('form[data-form=close]');
    var c = state.closing;
    if (!f || !c) return;
    c.reason = f.reason.value;
    if (f.from) {
      c.from = f.from.value;
      c.to = f.to.value > c.from ? f.to.value : '';
    }
  }

  function submitClose(force, btn) {
    keepClose();
    var c = state.closing;
    if (btn) btn.disabled = true;
    call('close', { date: state.date, from: c.whole ? '' : c.from, to: c.whole ? '' : c.to, reason: c.reason, force: force === true }).then(function (res) {
      if (res.ok) {
        closeSheet();
        toast(T.closedOk);
        refreshStart();
        loadDay(state.date);
        return;
      }
      if (res.reason === 'has_bookings') {
        resheet('<h2>' + esc(T.closeHasQ(res.count)) + '</h2><p class="muted">' + esc(T.closeHasText) + '</p>' +
          '<div class="row"><button class="btn" data-act="close-back">' + esc(T.back) + '</button>' +
          '<button class="btn primary" data-act="close-force">' + esc(T.closeYes) + '</button></div>');
        return;
      }
      c.error = res.field === 'date' ? T.closePast : res.field === 'to' ? T.closeBadTo : res.field === 'reason' ? T.closeLong :
        res.reason === 'manager' ? T.managerOnly : res.reason === 'network' ? T.network : T.error;
      resheet(closeHtml());
    });
  }

  function askReopen(id) {
    sheet('<h2>' + esc(T.reopenQ) + '</h2><p class="muted">' + esc(T.reopenText) + '</p>' +
      '<div class="row"><button class="btn" data-act="close">' + esc(T.no) + '</button>' +
      '<button class="btn primary" data-act="reopen-yes" data-id="' + esc(id) + '">' + esc(T.reopen) + '</button></div>');
  }

  function doReopen(id, btn) {
    btn.disabled = true;
    call('reopen', { id: id }).then(function (res) {
      closeSheet();
      toast(res.ok ? T.reopened : res.reason === 'network' ? T.network : T.error);
      refreshStart();
      loadDay(state.date);
    });
  }

  // Bookable dates and closed days change when a manager closes or reopens.
  function refreshStart() {
    call('start').then(function (res) {
      if (!res.ok || !state.start) return;
      state.start = res;
      if (state.tab === 'list' && listIdle()) render();
    });
  }

  // ---------- booking form (new and edit) ----------

  // The form on screen: the edit form inside the list tab, otherwise the new booking.
  function cur() { return state.tab === 'list' && state.edit ? state.edit : state.book; }

  // Dates the form may use. An edited booking keeps its own date even if it is closed now.
  function formDates() {
    var f = cur();
    var d = state.start.dates.slice();
    if (f && f.id && d.indexOf(f.origDate) === -1) { d.push(f.origDate); d.sort(); }
    return d;
  }

  function newBooking(date) {
    var dates = state.start.dates;
    var first = dates.filter(function (d) { return d >= (date || state.start.today); })[0] || dates[0] || state.start.today;
    state.book = { date: first, people: 0, bigPeople: false, time: '', times: null, loadingTimes: false,
      name: '', phone: '', consent: false, notes: '', lang: '', langManual: false, error: '' };
  }

  function startEdit(id) {
    var r = findItem(id);
    if (!r) return;
    var n = Number(r.people);
    state.edit = { id: r.id, origDate: r.date, title: r.name + ' · ' + dateChip(r.date) + ' ' + r.time,
      date: r.date, people: n, bigPeople: n > 7, time: r.time, times: null, loadingTimes: false,
      name: r.name, phone: r.phone, consent: r.consent === true, notes: r.notes || '', lang: r.lang || '', langManual: true, error: '' };
    loadTimes();
    window.scrollTo(0, 0);
  }

  function renderForm(b) {
    var s = state.start;
    var editing = !!b.id;
    var body = '<div class="section-title" style="margin-top:4px">' + esc(T.date) + '</div>' + datePicker(b.date, 'b-date', 'form');
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
      '<label class="field"><span>' + esc(T.notes) + '</span><textarea name="notes" rows="2" maxlength="300" placeholder="' + esc(T.notesPh) + '">' + esc(b.notes) + '</textarea></label>' +
      '<div class="chips note-chips">' + T.noteChips.map(function (c) {
        return '<button type="button" class="chip small" data-act="note-add" data-text="' + esc(c[1]) + '">+ ' + esc(c[0]) + '</button>';
      }).join('') + '</div>' +
      '<label class="check"><input type="checkbox" name="consent"' + (b.consent ? ' checked' : '') + '><span>' + esc(T.consent) + '</span></label>' +
      '<div class="field"><span class="field-label" id="lang-label">' + esc(T.lang) + '</span><div class="grid five" role="group" aria-labelledby="lang-label">' +
      LANGS.map(function (l) {
        return '<button type="button" class="chip" data-act="b-lang" data-l="' + l + '" aria-pressed="' + (b.lang === l) + '" aria-label="' + esc(T.langNames[l]) + '">' + l.toUpperCase() + '</button>';
      }).join('') + '</div><p class="muted hint">' + esc(T.langHelp) + '</p></div>' +
      (b.error ? '<div class="error">' + esc(b.error) + '</div>' : '') +
      '<button class="btn primary block" type="submit"' + (b.time ? '' : ' disabled') + '>' + esc(editing ? T.saveEdit : T.save) + '</button>' +
      (editing ? '<button class="btn block" type="button" data-act="edit-back" style="margin-top:10px">' + esc(T.editBack) + '</button>' : '') +
      '</form>';
    frame(editing ? T.editTitle : T.bookTitle, editing ? b.title : T.bookSub, body);
  }

  function keepTyped() {
    var f = app.querySelector('form[data-form=book]');
    var b = cur();
    if (!f || !b) return;
    b.name = f.name.value;
    b.phone = f.phone.value;
    b.notes = f.notes.value;
    b.consent = f.consent.checked;
  }

  function showLang(lang) {
    app.querySelectorAll('[data-act=b-lang]').forEach(function (el) { el.setAttribute('aria-pressed', String(el.dataset.l === lang)); });
  }

  function addNote(text) {
    var ta = app.querySelector('textarea[name=notes]');
    if (!ta) return;
    var v = ta.value.replace(/[\s,]+$/, '');
    if (v.toLowerCase().indexOf(text.trim().toLowerCase()) === -1) ta.value = (v ? v + ', ' : '') + text;
    ta.focus();
    ta.setSelectionRange(ta.value.length, ta.value.length);
  }

  function loadTimes() {
    var b = cur();
    var keep = b.time;
    b.time = '';
    b.times = null;
    if (!b.people || b.people > state.start.maxPhoneGroup) return render();
    b.loadingTimes = true;
    render();
    var asked = b.date + '/' + b.people;
    call('slots', { date: b.date, people: b.people, exclude: b.id || '' }).then(function (res) {
      if (cur() !== b || asked !== b.date + '/' + b.people) return;
      b.loadingTimes = false;
      b.times = res.ok ? res.times : [];
      if (b.times.indexOf(keep) !== -1) b.time = keep;
      if (!res.ok) b.error = res.reason === 'network' ? T.network : T.error;
      keepTyped();
      render();
    });
  }

  function failText(res) {
    return res.reason === 'closed' ? T.closed :
      res.reason === 'too_soon' ? T.tooSoon :
      res.reason === 'too_far' ? T.tooFar :
      res.reason === 'already' ? T.editCancelled :
      res.reason === 'network' ? T.network :
      res.field === 'name' ? T.badName :
      res.field === 'phone' ? T.badPhone :
      res.reason === 'invalid' ? T.badField : T.error;
  }

  function saveForm(form) {
    keepTyped();
    var b = cur();
    b.error = '';
    form.querySelector('button[type=submit]').disabled = true;
    var data = { date: b.date, time: b.time, people: b.people, name: b.name.trim(), phone: b.phone.trim(), consent: b.consent,
      notes: b.notes.trim(), lang: b.lang };
    if (b.id) data.id = b.id;
    call(b.id ? 'update' : 'book', data).then(function (res) {
      if (cur() !== b) return;
      if (res.ok && b.id) {
        state.edit = null;
        state.open = res.item.id;
        toast(res.changed === false ? T.editNone : T.editSaved);
        state.day = null;
        loadDay(res.item.date);
        window.scrollTo(0, 0);
        return;
      }
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
      b.error = failText(res);
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
      case 'day-step': {
        var lim = calBounds('list');
        var next = addDays(state.date, Number(el.dataset.n));
        if (next < lim.min || next > lim.max) break;
        state.open = null;
        loadDay(next);
        break;
      }
      case 'cal-open': keepTyped(); openCal(el.dataset.mode); break;
      case 'cal-month': {
        state.cal.month = shiftMonth(state.cal.month, Number(el.dataset.n));
        var box = document.querySelector('.backdrop .cal');
        if (box) box.innerHTML = calHtml();
        break;
      }
      case 'cal-pick': pickDate(el.dataset.date); break;
      case 'open-found': openFound(el.dataset.date, id); break;
      case 'arrive': doArrive(id, el.dataset.v, el); break;
      case 'edit': startEdit(id); break;
      case 'edit-back': state.edit = null; render(); window.scrollTo(0, 0); break;
      case 'note-add': addNote(el.dataset.text); break;
      case 'b-lang': keepTyped(); cur().lang = el.dataset.l; cur().langManual = true; showLang(el.dataset.l); break;
      case 'close-open': openClose(); break;
      case 'close-mode':
        keepClose();
        state.closing.whole = el.dataset.whole === '1';
        state.closing.error = '';
        resheet(closeHtml());
        break;
      case 'close-back': resheet(closeHtml()); break;
      case 'close-force': submitClose(true, el); break;
      case 'reopen': askReopen(id); break;
      case 'reopen-yes': doReopen(id, el); break;
      case 'toggle':
        if (e.target.closest('a, button')) return;
        state.open = state.open === id ? null : id;
        render();
        break;
      case 'cancel': askCancel(id); break;
      case 'cancel-yes': doCancel(id, el); break;
      case 'close': closeSheet(); break;
      case 'b-date': keepTyped(); cur().date = el.dataset.date; cur().error = ''; loadTimes(); break;
      case 'b-people': keepTyped(); cur().bigPeople = false; cur().people = Number(el.dataset.n); cur().error = ''; loadTimes(); break;
      case 'b-big': keepTyped(); cur().bigPeople = true; cur().people = 0; cur().time = ''; render(); focusLater('[data-act=b-people-input]'); break;
      case 'b-time': keepTyped(); cur().time = el.dataset.t; cur().error = ''; render(); break;
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
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[data-act=toggle], [data-act=open-found]')) { e.preventDefault(); e.target.click(); }
  });

  document.addEventListener('change', function (e) {
    var el = e.target;
    if (el.name === 'from' && el.closest('form[data-form=close]')) { keepClose(); resheet(closeHtml()); }
  });

  var peopleTimer;
  document.addEventListener('input', function (e) {
    var el = e.target;
    if (el.dataset.act === 'search') return onSearch(el.value);
    if (el.name === 'phone' && el.closest('form[data-form=book]')) {
      var f = cur();
      if (f && !f.langManual) { f.lang = guessLang(el.value); showLang(f.lang); }
      return;
    }
    if (el.dataset.act !== 'b-people-input') return;
    var n = Number(el.value);
    clearTimeout(peopleTimer);
    peopleTimer = setTimeout(function () {
      keepTyped();
      cur().people = n >= 1 ? Math.floor(n) : 0;
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
      saveForm(f);
    } else if (f.dataset.form === 'close') {
      submitClose(false, f.querySelector('button[type=submit]'));
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
    state.edit = null;
    state.q = '';
    state.found = null;
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
    if (params.date) { state.tab = 'list'; state.edit = null; state.q = ''; state.found = null; state.day = null; loadDay(params.date); }
  }

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(function (err) { console.error('Service worker:', err); });
    navigator.serviceWorker.addEventListener('message', function (e) {
      if (!state.start || !e.data) return;
      if (e.data.type === 'open') openFrom(e.data);
      if (e.data.type === 'changed') { if (state.tab === 'list' && listIdle()) loadDay(state.date); loadReminders(); }
    });
  }
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    state.installPrompt = e;
    if (!state.key) renderJoin();
  });

  // Fresh list when the phone comes back to the app, and every minute while open.
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible' && state.start) { if (state.tab === 'list' && listIdle()) loadDay(state.date); loadReminders(); }
  });
  setInterval(function () {
    if (document.visibilityState === 'visible' && state.start && state.tab === 'list' && listIdle() && !document.querySelector('.backdrop')) loadDay(state.date);
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
