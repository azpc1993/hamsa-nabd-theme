/**
 * Hamsa Nabd — behaviours of the Hamsa home components (ported from v10, no dependencies).
 *  countdown · promo popup · season switcher · gift finder · lookbook hotspots · compare products
 */
export default function initHamsaComponents() {
  initCountdowns();
  initPromoPopup();
  initSeasonSwitcher();
  initGiftFinder();
  initHotspots();
  initCompare();
}

const pad = (n) => String(n).padStart(2, '0');

/* [data-hn-countdown="2026-12-31 23:59"] with [data-unit=days|hours|minutes|seconds] inside */
function initCountdowns() {
  document.querySelectorAll('[data-hn-countdown]').forEach((box) => {
    const raw = (box.dataset.hnCountdown || '').trim().replace(' ', 'T');
    const target = new Date(raw).getTime();
    if (!Number.isFinite(target)) return;
    const units = ['days', 'hours', 'minutes', 'seconds'].map((u) => box.querySelector(`[data-unit="${u}"]`));
    let timer;
    const tick = () => {
      let diff = target - Date.now();
      if (diff <= 0) { diff = 0; clearInterval(timer); }
      const values = [
        Math.floor(diff / 86400000),
        Math.floor((diff % 86400000) / 3600000),
        Math.floor((diff % 3600000) / 60000),
        Math.floor((diff % 60000) / 1000),
      ];
      units.forEach((el, i) => { if (el) el.textContent = pad(values[i]); });
    };
    tick();
    timer = setInterval(tick, 1000);
  });
}

/* home.promo-popup — shown once per browser session after `data-delay` seconds */
function initPromoPopup() {
  document.querySelectorAll('[data-hn-promo-popup]').forEach((popup) => {
    const key = 'hn-promo-seen';
    const close = () => { popup.classList.remove('is-open'); popup.setAttribute('aria-hidden', 'true'); };
    popup.querySelectorAll('[data-hn-promo-close]').forEach((btn) => btn.addEventListener('click', close));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
    let seen = null;
    try { seen = sessionStorage.getItem(key); } catch (e) { /* storage blocked */ }
    if (seen) return;
    const delay = Math.max(0, parseInt(popup.dataset.delay || '4', 10)) * 1000;
    setTimeout(() => {
      popup.classList.add('is-open');
      popup.setAttribute('aria-hidden', 'false');
      try { sessionStorage.setItem(key, '1'); } catch (e) { /* storage blocked */ }
    }, delay);
  });
}

/* home.season-switcher */
function initSeasonSwitcher() {
  document.querySelectorAll('[data-hn-season-switcher]').forEach((block) => {
    const tabs = block.querySelectorAll('[data-hn-season-tab]');
    tabs.forEach((tab) => tab.addEventListener('click', () => {
      const index = tab.dataset.hnSeasonTab;
      tabs.forEach((t) => t.classList.toggle('is-active', t === tab));
      block.querySelectorAll('[data-hn-season-panel]').forEach((p) => p.classList.toggle('is-active', p.dataset.hnSeasonPanel === index));
    }));
  });
}

/* home.gift-finder — recipient → occasion → suggested result */
function initGiftFinder() {
  document.querySelectorAll('[data-hn-gift-finder]').forEach((widget) => {
    let results = [];
    try { results = JSON.parse(widget.dataset.results || '[]'); } catch (e) { results = []; }
    const state = { recipient: null, occasion: null };
    const steps = widget.querySelectorAll('[data-hn-gf-step]');
    const resultBox = widget.querySelector('[data-hn-gf-result]');
    const show = (step) => {
      steps.forEach((s) => s.classList.toggle('is-active', s.dataset.hnGfStep === step));
      if (resultBox) resultBox.hidden = step !== 'result';
    };
    widget.querySelectorAll('[data-hn-gf-recipient]').forEach((btn) => btn.addEventListener('click', () => {
      state.recipient = btn.dataset.hnGfRecipient;
      show('1');
    }));
    widget.querySelectorAll('[data-hn-gf-occasion]').forEach((btn) => btn.addEventListener('click', () => {
      state.occasion = btn.dataset.hnGfOccasion;
      const match = results.find((r) => r.recipient === state.recipient && r.occasion === state.occasion)
        || results.find((r) => r.recipient === state.recipient);
      if (match) {
        const img = widget.querySelector('[data-hn-gf-result-img]');
        const title = widget.querySelector('[data-hn-gf-result-title]');
        const link = widget.querySelector('[data-hn-gf-result-link]');
        if (img) img.src = match.image || '';
        if (title) title.textContent = match.title || '';
        if (link) link.href = match.url || '#';
      }
      show('result');
    }));
    widget.querySelector('[data-hn-gf-back]')?.addEventListener('click', () => show('0'));
    widget.querySelector('[data-hn-gf-restart]')?.addEventListener('click', () => {
      state.recipient = null; state.occasion = null;
      show('0');
    });
  });
}

/* home.lookbook — hotspots open on tap (mobile) */
function initHotspots() {
  const spots = document.querySelectorAll('[data-hn-hotspot]');
  if (!spots.length) return;
  const closeAll = () => document.querySelectorAll('[data-hn-hotspot].is-open').forEach((s) => s.classList.remove('is-open'));
  spots.forEach((spot) => spot.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = spot.classList.contains('is-open');
    closeAll();
    if (!open) spot.classList.add('is-open');
  }));
  document.addEventListener('click', closeAll);
}

/* home.compare-products — pick 2–4 items then compare */
function initCompare() {
  document.querySelectorAll('[data-hn-compare]').forEach((root) => {
    const boxes = [...root.querySelectorAll('[data-hn-compare-item]')];
    const btn = root.querySelector('[data-hn-compare-open]');
    const out = root.querySelector('[data-hn-compare-result]');
    if (!btn || !out) return;
    const checked = () => boxes.filter((x) => x.checked);
    const clear = () => { while (out.firstChild) out.removeChild(out.firstChild); };
    boxes.forEach((x) => x.addEventListener('change', () => {
      const n = checked().length;
      btn.disabled = n < 2 || n > 4;
      clear();
      out.hidden = n === 0;
      if (n) {
        const count = document.createElement('div');
        count.className = 'hn-compare__count';
        count.textContent = String(n);
        out.appendChild(count);
      }
    }));
    btn.addEventListener('click', () => {
      const list = checked();
      if (list.length < 2 || list.length > 4) return;
      clear();
      out.hidden = false;
      const wrap = document.createElement('div');
      wrap.className = 'hn-compare__selected';
      list.forEach((x) => {
        const card = x.closest('.hn-compare-card');
        const row = document.createElement('div');
        ['strong', 'span'].forEach((sel) => {
          const el = card?.querySelector(sel);
          if (el) { const s = document.createElement(sel === 'strong' ? 'b' : 'span'); s.textContent = el.textContent; row.appendChild(s); }
        });
        wrap.appendChild(row);
      });
      out.appendChild(wrap);
    });
  });
}
