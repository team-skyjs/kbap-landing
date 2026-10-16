/**
 * Home page demos (D-24). Every demo is server-rendered in its final state, so
 * without JS (or with reduced motion) the page already reads correctly; this
 * file only adds the interactions. Nothing here navigates.
 */
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Single-select chip/segment group: swap one image, keep aria-pressed honest. */
function swapGroup(root, onPick) {
  root.querySelectorAll('button').forEach((b) =>
    b.addEventListener('click', () => {
      root.querySelectorAll('button').forEach((o) => o.setAttribute('aria-pressed', String(o === b)));
      onPick(b);
    }),
  );
}

// Fast repeated taps must not let an older image request replace the last choice.
const imageRequests = new WeakMap();
function swapImage(img, src, alt) {
  const request = {};
  imageRequests.set(img, request);
  if (img.getAttribute('src') === src) {
    img.classList.remove('swapping');
    return;
  }
  img.classList.add('swapping');
  const next = new Image();
  next.onload = () => {
    if (imageRequests.get(img) !== request) return;
    img.src = src;
    if (alt) img.alt = alt;
    img.classList.remove('swapping');
  };
  next.onerror = () => {
    if (imageRequests.get(img) === request) img.classList.remove('swapping');
  };
  next.src = src;
}

// --- Read it · language chips → that language's scan result
for (const demo of document.querySelectorAll('[data-demo="lang"]')) {
  const img = demo.querySelector('.shot img');
  swapGroup(demo.querySelector('.chips'), (b) => swapImage(img, b.dataset.src));
}

// --- Read it · before/after. Native range input on top = keyboard + touch for free.
// Until the visitor touches it, the divider sweeps on its own (only while on screen).
for (const ba of document.querySelectorAll('[data-demo="ba"]')) {
  const input = ba.querySelector('input');
  const set = (v) => { input.value = v; ba.style.setProperty('--pos', v + '%'); };
  input.addEventListener('input', () => set(input.value));
  if (reduced) continue;
  let raf = 0, t0 = 0, touched = false;
  const tick = (t) => {
    t0 ||= t;
    set((50 + 30 * Math.sin((t - t0) / 1100)).toFixed(1));   // 20% ↔ 80%, ~7 s round trip
    raf = requestAnimationFrame(tick);
  };
  const stop = () => { touched = true; cancelAnimationFrame(raf); };
  ['pointerdown', 'keydown', 'focus'].forEach((e) => input.addEventListener(e, stop, { once: true }));
  new IntersectionObserver(([e]) => {
    if (touched) return;
    if (e.isIntersecting) raf = requestAnimationFrame(tick);
    else { cancelAnimationFrame(raf); t0 = 0; }
  }).observe(ba);
}

// --- Eat safely · the example avoid list (Shrimp + Soybean) on/off → rated / unrated capture
for (const demo of document.querySelectorAll('[data-demo="allergy"]')) {
  const img = demo.querySelector('.shot img');
  const sw = demo.querySelector('.avoid');
  sw.addEventListener('click', () => {
    const on = sw.getAttribute('aria-checked') !== 'true';
    sw.setAttribute('aria-checked', String(on));
    swapImage(img, on ? demo.dataset.on : demo.dataset.off);
  });
}

// --- Trust it · flag chips → "<CC> only" and that country's reviews
for (const demo of document.querySelectorAll('[data-demo="reviews"]')) {
  const label = demo.querySelector('[data-cc-label]');
  const lists = [...demo.querySelectorAll('.rv-list')];
  swapGroup(demo.querySelector('.chips'), (b) => {
    label.textContent = b.dataset.cc.toUpperCase() + ' only';
    lists.forEach((l) => (l.hidden = l.dataset.cc !== b.dataset.cc));
  });
}

// --- Eat safely · spice gauge: show the dishes you can handle (≤ level), hottest first.
for (const demo of document.querySelectorAll('[data-demo="spice"]')) {
  const input = demo.querySelector('input');
  const bands = JSON.parse(input.dataset.bands);
  const label = demo.querySelector('[data-band]');
  const tiles = [...demo.querySelectorAll('.tiles li')];
  const show = () => {
    const v = +input.value;
    demo.querySelector('.gauge').style.setProperty('--v', v);
    label.textContent = bands[v];
    input.setAttribute('aria-valuetext', bands[v]);
    const fit = tiles.filter((li) => +li.dataset.spice <= v).sort((a, b) => b.dataset.spice - a.dataset.spice).slice(0, 4);
    tiles.forEach((li) => (li.hidden = !fit.includes(li)));
    fit.forEach((li, i) => (li.style.order = i));
  };
  input.addEventListener('input', show);
  show();
}

// --- Order · Your order ↔ Staff view
for (const demo of document.querySelectorAll('[data-demo="order"]')) {
  const img = demo.querySelector('.shot img');
  swapGroup(demo.querySelector('.seg'), (b) => swapImage(img, b.dataset.src, b.dataset.alt));
}

// --- Hero · Korean menu → scan beam → translated + rated → languages cycle.
// Server HTML is the end state; reduced motion keeps it.
const board = document.querySelector('.hero .board');
if (board && !reduced) {
  const names = JSON.parse(board.dataset.names);
  const langs = Object.keys(names);
  const nameEls = [...board.querySelectorAll('.name')];
  const rail = [...document.querySelectorAll('.hero .rail .chip')];
  const toast = document.querySelector('.hero .morph-toast b');
  let i = 0;

  const setLang = (l) => {
    nameEls.forEach((el, k) => { el.textContent = names[l][k]; el.lang = l; });
    rail.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.lang === l)));
    toast.textContent = rail.find((c) => c.dataset.lang === l)?.textContent ?? l;
    toast.lang = l;
  };

  board.classList.add('is-ko');
  setTimeout(() => {
    board.classList.add('is-scanning');   // CSS: beam 1.6s, lines flip with 80ms stagger
    setTimeout(() => {
      board.classList.remove('is-ko', 'is-scanning');
      setInterval(() => {
        if (document.hidden) return;
        i = (i + 1) % langs.length;
        board.classList.add('is-cycling');
        setTimeout(() => { setLang(langs[i]); board.classList.remove('is-cycling'); }, 160);
      }, 2400);
    }, 1600);
  }, 600);
}
