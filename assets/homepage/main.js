/* Progressive enhancement: the full profile and every paper are available without JS. */
(() => {
  'use strict';
  const root = document.documentElement;
  root.classList.add('js');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const motionButton = document.querySelector('.motion-toggle');
  const themeButton = document.querySelector('.theme-toggle');
  let motionEnabled = !reducedMotion.matches;
  let manuallyDisabledMotion = false;

  function setMotion(enabled) {
    motionEnabled = enabled;
    root.dataset.motion = enabled ? 'on' : 'off';
    motionButton.setAttribute('aria-pressed', String(enabled));
    motionButton.textContent = enabled ? 'Motion on' : 'Motion off';
  }
  setMotion(motionEnabled);
  motionButton.addEventListener('click', () => {
    manuallyDisabledMotion = motionEnabled;
    setMotion(!motionEnabled && !reducedMotion.matches);
  });
  reducedMotion.addEventListener('change', (event) => setMotion(!event.matches && !manuallyDisabledMotion));

  themeButton.addEventListener('click', () => {
    const theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = theme;
    themeButton.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
    document.querySelector('meta[name="theme-color"]').content = theme === 'dark' ? '#101114' : '#f8f9fb';
  });

  const avatar = document.querySelector('.avatar');
  const showAvatar = () => { if (avatar.naturalWidth) avatar.classList.add('loaded'); };
  avatar.addEventListener('load', showAvatar);
  showAvatar();

  const badge = document.querySelector('.portrait-badge');
  const back = badge.querySelector('.badge-back');
  let dragStart = null;
  let dragged = false;
  badge.addEventListener('click', (event) => {
    if (dragged) { event.preventDefault(); dragged = false; return; }
    const flipped = badge.classList.toggle('is-flipped');
    badge.setAttribute('aria-pressed', String(flipped));
    // The button's accessible name covers both faces; the visual back is decorative.
    back.setAttribute('aria-hidden', 'true');
  });
  badge.addEventListener('pointerdown', (event) => {
    if (!motionEnabled || event.pointerType === 'touch' || event.button !== 0) return;
    dragStart = {x: event.clientX, y: event.clientY};
    dragged = false;
    badge.setPointerCapture(event.pointerId);
    badge.classList.add('is-dragging');
  });
  badge.addEventListener('pointermove', (event) => {
    if (!dragStart) return;
    const x = Math.max(-75, Math.min(75, event.clientX - dragStart.x));
    const y = Math.max(-45, Math.min(65, event.clientY - dragStart.y));
    if (Math.abs(x) + Math.abs(y) > 7) dragged = true;
    badge.style.setProperty('--drag-x', `${x}px`);
    badge.style.setProperty('--drag-y', `${y}px`);
    badge.style.setProperty('--badge-angle', `${-8 + x / 8}deg`);
  });
  function releaseBadge() {
    if (!dragStart) return;
    dragStart = null;
    badge.classList.remove('is-dragging');
    badge.style.removeProperty('--drag-x');
    badge.style.removeProperty('--drag-y');
    badge.style.removeProperty('--badge-angle');
  }
  badge.addEventListener('pointerup', releaseBadge);
  badge.addEventListener('pointerup', () => { setTimeout(() => { dragged = false; }, 0); });
  badge.addEventListener('pointercancel', () => { releaseBadge(); dragged = false; });
  badge.addEventListener('lostpointercapture', releaseBadge);

  const deck = document.querySelector('.publication-deck');
  const previous = document.querySelector('[data-deck="previous"]');
  const next = document.querySelector('[data-deck="next"]');
  function updateDeck() {
    previous.disabled = deck.scrollLeft < 5;
    next.disabled = deck.scrollLeft >= deck.scrollWidth - deck.clientWidth - 5;
  }
  function moveDeck(direction) {
    const first = deck.querySelector('.paper-card');
    const gap = Number.parseFloat(getComputedStyle(deck).gap) || 28;
    deck.scrollBy({left: direction * (first.getBoundingClientRect().width + gap), behavior: motionEnabled ? 'smooth' : 'auto'});
  }
  previous.addEventListener('click', () => moveDeck(-1));
  next.addEventListener('click', () => moveDeck(1));
  deck.addEventListener('scroll', updateDeck, {passive: true});
  window.addEventListener('resize', updateDeck, {passive: true});
  deck.addEventListener('keydown', (event) => {
    if (event.target !== deck) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      moveDeck(event.key === 'ArrowRight' ? 1 : -1);
    }
  });
  updateDeck();

  const dialog = document.querySelector('.paper-dialog');
  const dialogContent = dialog.querySelector('.dialog-content');
  let lastExpanded = null;
  let oldOverflow = '';
  function closeDialog() { dialog.close(); }
  document.querySelectorAll('.paper-card [data-expand]').forEach((button) => {
    if (typeof dialog.showModal !== 'function') {
      button.addEventListener('click', () => window.open(button.closest('.paper-card').querySelector('h3 a').href, '_blank', 'noopener'));
      return;
    }
    button.addEventListener('click', () => {
      const clone = button.closest('.paper-card').cloneNode(true);
      clone.querySelector('h3').id = 'dialog-title';
      const imageButton = clone.querySelector('[data-expand]');
      const image = document.createElement('div');
      image.className = imageButton.className;
      image.append(...imageButton.childNodes);
      image.querySelector('img').loading = 'eager';
      imageButton.replaceWith(image);
      clone.removeAttribute('data-paper');
      dialogContent.replaceChildren(clone);
      lastExpanded = button;
      oldOverflow = document.body.style.overflow;
      dialog.showModal();
      document.body.style.overflow = 'hidden';
    });
  });
  dialog.querySelector('.dialog-close').addEventListener('click', closeDialog);
  let backdropStart = false;
  dialog.addEventListener('pointerdown', (event) => { backdropStart = event.target === dialog; });
  dialog.addEventListener('click', (event) => {
    if (backdropStart && event.target === dialog) {
      const box = dialog.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) closeDialog();
    }
    backdropStart = false;
  });
  dialog.addEventListener('close', () => {
    document.body.style.overflow = oldOverflow;
    if (lastExpanded) lastExpanded.focus({preventScroll: true});
  });

  deck.querySelectorAll('.paper-card').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      if (!motionEnabled || event.pointerType === 'touch') return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--pointer-x', `${(event.clientX - rect.left) / rect.width * 100}%`);
      card.style.setProperty('--pointer-y', `${(event.clientY - rect.top) / rect.height * 100}%`);
    });
  });

  const rows = [...document.querySelectorAll('.publication-row')];
  const filters = [...document.querySelectorAll('[data-filter]')];
  const search = document.querySelector('.publication-search input');
  const status = document.querySelector('.search-status');
  const noResults = document.querySelector('.no-results');
  let category = 'all';
  function filterPapers() {
    const query = search.value.trim().toLocaleLowerCase();
    let count = 0;
    for (const row of rows) {
      const match = (category === 'all' || row.dataset.category === category) && row.textContent.toLocaleLowerCase().includes(query);
      row.hidden = !match;
      if (match) count += 1;
    }
    status.textContent = `${count} ${count === 1 ? 'publication' : 'publications'}${query ? ' found' : ''}`;
    noResults.hidden = count !== 0;
  }
  filters.forEach((button) => button.addEventListener('click', () => {
    category = button.dataset.filter;
    filters.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    filterPapers();
  }));
  search.addEventListener('input', filterPapers);

  const navigation = [...document.querySelectorAll('.main-nav a')];
  const sections = navigation.map((link) => document.querySelector(link.hash)).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (!visible.length) return;
      navigation.forEach((link) => {
        if (link.hash === `#${visible[0].target.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }, {rootMargin: '-8% 0px -55% 0px', threshold: 0});
    sections.forEach((section) => observer.observe(section));
  }
})();
