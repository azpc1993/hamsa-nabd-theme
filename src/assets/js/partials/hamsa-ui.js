/**
 * Hamsa Nabd theme — UI behaviours (loaded from app.js on every page, no dependencies)
 *  - Back to top button             - Scroll reveal (.sh-reveal)
 *  - Copy coupon code               - Products tabs
 *  - Rotating announcement bar      - Welcome popup (frequency control)
 *  - Mobile bottom nav (cart count, account)
 *  - Preloader
 */
export default function initHamsa() {
  initBackToTop();
  initReveal();
  initCopy();
  initTabs();
  initAnnouncementRotate();
  initPopup();
  initBottomNav();
  hidePreloader();
}

/* ------------------------------------------------------------ helpers */
const store = {
  get(key) { try { return window.localStorage.getItem(key); } catch (e) { return null; } },
  set(key, val) { try { window.localStorage.setItem(key, val); } catch (e) { /* private mode */ } },
};

const reduceMotion = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function onVisible(elements, callback, options = { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }) {
  if (!elements.length) return;
  if (!('IntersectionObserver' in window)) {
    elements.forEach(callback);
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        callback(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, options);
  elements.forEach((el) => observer.observe(el));
}

/* ------------------------------------------------------------ back to top */
function initBackToTop() {
  const btn = document.querySelector('[data-sh-back-to-top]');
  if (!btn) return;
  let ticking = false;
  const toggle = () => {
    btn.classList.toggle('is-visible', window.scrollY > 600);
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(toggle);
      ticking = true;
    }
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion() ? 'auto' : 'smooth' }));
  toggle();
}

/* ------------------------------------------------------------ reveal */
function initReveal() {
  onVisible(document.querySelectorAll('.sh-reveal'), (el) => el.classList.add('is-visible'));
}

/* ------------------------------------------------------------ copy coupon */
function initCopy() {
  document.addEventListener('click', async (event) => {
    const btn = event.target.closest('[data-sh-copy]');
    if (!btn) return;
    const code = btn.dataset.shCopy;
    try {
      await navigator.clipboard.writeText(code);
    } catch (e) {
      const tmp = document.createElement('textarea');
      tmp.value = code;
      tmp.setAttribute('readonly', '');
      tmp.style.position = 'absolute';
      tmp.style.opacity = '0';
      document.body.appendChild(tmp);
      tmp.select();
      try { document.execCommand('copy'); } catch (err) { /* ignore */ }
      tmp.remove();
    }
    const label = btn.querySelector('span');
    const original = label ? label.textContent : '';
    btn.classList.add('is-copied');
    if (label) label.textContent = btn.dataset.copiedText || '✓';
    if (window.salla && salla.notify) salla.notify.success(btn.dataset.copiedText || code);
    setTimeout(() => {
      btn.classList.remove('is-copied');
      if (label) label.textContent = original;
    }, 2000);
  });
}

/* ------------------------------------------------------------ products tabs */
function initTabs() {
  document.querySelectorAll('.sh-tabs').forEach((block) => {
    const buttons = block.querySelectorAll('[data-sh-tab]');
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const panel = block.querySelector('#' + btn.dataset.shTab);
        if (!panel) return;
        buttons.forEach((b) => {
          const active = b === btn;
          b.classList.toggle('is-active', active);
          b.setAttribute('aria-selected', active ? 'true' : 'false');
        });
        block.querySelectorAll('.sh-tabs__panel').forEach((p) => {
          const active = p === panel;
          p.classList.toggle('is-active', active);
          p.hidden = !active;
        });
        // stamp the products list the first time a tab is opened
        const tpl = panel.querySelector('template[data-sh-tab-template]');
        if (tpl) {
          panel.appendChild(tpl.content.cloneNode(true));
          tpl.remove();
        }
      });
    });
  });
}

/* ------------------------------------------------------------ announcement rotate */
function initAnnouncementRotate() {
  document.querySelectorAll('[data-sh-rotate]').forEach((wrap) => {
    const items = wrap.querySelectorAll('.sh-announcement__text');
    if (items.length < 2) return;
    let index = 0;
    let timer = null;
    const next = () => {
      items[index].classList.remove('is-active');
      index = (index + 1) % items.length;
      items[index].classList.add('is-active');
    };
    const play = () => { timer = setInterval(next, 4500); };
    wrap.addEventListener('mouseenter', () => clearInterval(timer));
    wrap.addEventListener('mouseleave', play);
    play();
  });
}

/* ------------------------------------------------------------ welcome popup */
function initPopup() {
  const popup = document.querySelector('[data-sh-popup]');
  if (!popup) return;

  const key = 'hn_popup_seen_' + (popup.dataset.version || '1');
  const frequency = popup.dataset.frequency || 'day';
  const lastSeen = parseInt(store.get(key) || '0', 10);
  const day = 24 * 60 * 60 * 1000;
  const wait = { always: 0, day: day, week: 7 * day, once: Infinity }[frequency] ?? day;
  if (lastSeen && (Date.now() - lastSeen) < wait) return;

  const close = () => {
    popup.classList.remove('is-open');
    document.documentElement.classList.remove('sh-popup-open');
    setTimeout(() => { popup.hidden = true; }, 300);
    document.removeEventListener('keydown', onKey);
  };
  const onKey = (e) => { if (e.key === 'Escape') close(); };

  const open = () => {
    if (document.body.classList.contains('menu-opened')) return; // don't fight the mobile menu
    popup.hidden = false;
    requestAnimationFrame(() => popup.classList.add('is-open'));
    document.documentElement.classList.add('sh-popup-open');
    store.set(key, String(Date.now()));
    document.addEventListener('keydown', onKey);
    popup.querySelector('.sh-popup__close')?.focus({ preventScroll: true });
  };

  popup.querySelectorAll('[data-sh-popup-close]').forEach((el) => el.addEventListener('click', close));

  const delay = popup.dataset.delay;
  if (delay === 'exit') {
    // desktop: leaving through the top of the window; mobile: after 15 seconds
    const isTouch = window.matchMedia('(hover: none)').matches;
    if (isTouch) {
      setTimeout(open, 15000);
    } else {
      const onLeave = (e) => {
        if (e.clientY <= 0) {
          document.removeEventListener('mouseout', onLeave);
          open();
        }
      };
      document.addEventListener('mouseout', onLeave);
    }
  } else {
    setTimeout(open, (parseInt(delay, 10) || 5) * 1000);
  }
}

/* ------------------------------------------------------------ bottom nav */
function initBottomNav() {
  const nav = document.querySelector('.sh-bottom-nav');
  if (!nav) return;

  // account: open login for guests, profile for customers
  nav.querySelector('[data-sh-account]')?.addEventListener('click', (e) => {
    const isGuest = window.salla && salla.config && typeof salla.config.isGuest === 'function' ? salla.config.isGuest() : true;
    if (isGuest) {
      salla.event.dispatch('login::open');
    } else {
      window.location.href = (salla.url && salla.url.get) ? salla.url.get('profile') : e.currentTarget.dataset.profileUrl;
    }
  });

  // mirror the header cart counter
  const badge = nav.querySelector('[data-sh-cart-count]');
  if (!badge) return;
  const setCount = (count) => {
    const n = parseInt(count, 10) || 0;
    badge.textContent = n;
    badge.hidden = n < 1;
  };
  if (window.salla && salla.cart && salla.cart.event && salla.cart.event.onUpdated) {
    salla.cart.event.onUpdated((data) => setCount(data?.count ?? data?.cart?.count ?? data?.data?.cart?.count));
  }
  const watch = () => {
    const source = document.querySelector('.s-cart-summary-count');
    if (!source) return false;
    setCount(source.textContent.replace(/[^\d٠-٩]/g, '').replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d)));
    new MutationObserver(() => setCount(source.textContent.replace(/[^\d٠-٩]/g, '').replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d))))
      .observe(source, { childList: true, characterData: true, subtree: true });
    return true;
  };
  if (!watch()) {
    let tries = 0;
    const t = setInterval(() => { if (watch() || ++tries > 20) clearInterval(t); }, 500);
  }
}

/* ------------------------------------------------------------ preloader */
function hidePreloader() {
  const loader = document.querySelector('[data-sh-preloader]');
  if (!loader) return;
  const done = () => {
    loader.classList.add('is-done');
    setTimeout(() => loader.remove(), 600);
  };
  if (document.readyState === 'complete') done();
  else window.addEventListener('load', done, { once: true });
  setTimeout(done, 2500); // never block the page for long
}
