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

function swapImage(img, src, alt) {
  if (img.getAttribute('src') === src) return;
  img.classList.add('swapping');
  const next = new Image();
  next.onload = next.onerror = () => {
    img.src = src;
    if (alt) img.alt = alt;
    img.classList.remove('swapping');
  };
  next.src = src;
}

// --- Read it · language chips → that language's scan result
for (const demo of document.querySelectorAll('[data-demo="lang"]')) {
  const img = demo.querySelector('.shot img');
  swapGroup(demo.querySelector('.chips'), (b) => swapImage(img, b.dataset.src));
}

// --- Read it · before/after. Native range input on top = keyboard + touch for free.
for (const ba of document.querySelectorAll('[data-demo="ba"]')) {
  const input = ba.querySelector('input');
  input.addEventListener('input', () => ba.style.setProperty('--pos', input.value + '%'));
}

// --- Eat safely · allergen chips. Only Shrimp/Soybean exist in the capture account,
// so any of those on = the rated capture; none of them = the unrated one.
for (const demo of document.querySelectorAll('[data-demo="allergy"]')) {
  const img = demo.querySelector('.shot img');
  const chips = [...demo.querySelectorAll('.chip')];
  chips.forEach((c) =>
    c.addEventListener('click', () => {
      c.setAttribute('aria-pressed', String(c.getAttribute('aria-pressed') !== 'true'));
      const on = chips.some((x) => x.hasAttribute('data-captured') && x.getAttribute('aria-pressed') === 'true');
      swapImage(img, on ? demo.dataset.on : demo.dataset.off);
    }),
  );
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
    const fit = tiles.filter((li) => +li.dataset.spice <= v).sort((a, b) => b.dataset.spice - a.dataset.spice).slice(0, 4);
    tiles.forEach((li) => (li.hidden = !fit.includes(li)));
    fit.forEach((li, i) => (li.style.order = i));
  };
  input.addEventListener('input', show);
  show();
}

// --- Order · Your order ↔ Staff view
for (const demo of document.querySelectorAll('[data-demo="order"]')) {
  const shot = demo.querySelector('.shot');
  swapGroup(demo.querySelector('.seg'), (b) => {
    shot.style.setProperty('--top', b.dataset.top);
    swapImage(shot.querySelector('img'), b.dataset.src, b.dataset.alt);
  });
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
