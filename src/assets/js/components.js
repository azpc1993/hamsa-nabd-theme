/* همسة نبض — سلوكيات المكونات المتقدمة */
document.addEventListener('DOMContentLoaded', function () {

    function openOverlay(el) { if (el) { el.classList.add('is-open'); el.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; } }
    function closeOverlay(el) { if (el) { el.classList.remove('is-open'); el.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; } }

    /* ---------- Mega menu ---------- */
    var megaMenu = document.getElementById('hn-mega-menu');
    document.querySelectorAll('[data-hn-menu-open]').forEach(function (btn) {
        btn.addEventListener('click', function () { openOverlay(megaMenu); });
    });
    document.querySelectorAll('[data-hn-menu-close]').forEach(function (btn) {
        btn.addEventListener('click', function () { closeOverlay(megaMenu); });
    });
    if (megaMenu) {
        megaMenu.addEventListener('click', function (e) {
            if (e.target === megaMenu) closeOverlay(megaMenu);
        });
    }

    /* ---------- Cart drawer ---------- */
    var cartDrawer = document.getElementById('hn-cart-drawer');
    document.querySelectorAll('[data-hn-cart-open]').forEach(function (btn) {
        btn.addEventListener('click', function () { openOverlay(cartDrawer); });
    });
    document.querySelectorAll('[data-hn-cart-close]').forEach(function (btn) {
        btn.addEventListener('click', function () { closeOverlay(cartDrawer); });
    });
    if (cartDrawer) {
        cartDrawer.addEventListener('click', function (e) {
            if (e.target === cartDrawer) closeOverlay(cartDrawer);
        });
    }

    /* ---------- Quick view ---------- */
    var quickView = document.getElementById('hn-quick-view');
    document.querySelectorAll('[data-hn-quick-view]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            openOverlay(quickView);
            /*
             * ملاحظة للمطور: هنا يتم جلب بيانات المنتج الفعلية عبر Salla Storefront API
             * باستخدام معرّف المنتج btn.dataset.hnQuickView، ثم تعبئة
             * [data-hn-quick-view-content] بمحتوى حقيقي (صورة، سعر، خيارات، زر إضافة للسلة)
             */
        });
    });
    document.querySelectorAll('[data-hn-quick-view-close]').forEach(function (btn) {
        btn.addEventListener('click', function () { closeOverlay(quickView); });
    });
    if (quickView) {
        quickView.addEventListener('click', function (e) {
            if (e.target === quickView) closeOverlay(quickView);
        });
    }

    /* ---------- Wishlist toggle ---------- */
    document.querySelectorAll('[data-hn-wishlist-toggle]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            btn.classList.toggle('is-active');
            var pressed = btn.classList.contains('is-active');
            btn.setAttribute('aria-pressed', pressed ? 'true' : 'false');
            var countEl = document.querySelector('[data-hn-wishlist-count]');
            if (countEl) {
                var current = parseInt(countEl.textContent || '0', 10);
                countEl.textContent = pressed ? current + 1 : Math.max(0, current - 1);
            }
            /* ملاحظة: يستدعي هذا الحدث Salla API الخاص بالمفضلة لحفظ الحالة فعلياً */
        });
    });

    /* ---------- Filters sidebar (mobile open/close) ---------- */
    var filters = document.querySelector('[data-hn-filters]');
    document.querySelectorAll('[data-hn-filters-open]').forEach(function (btn) {
        btn.addEventListener('click', function () { filters && filters.classList.add('is-open'); });
    });
    document.querySelectorAll('[data-hn-filters-clear]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            if (!filters) return;
            filters.querySelectorAll('input[type="checkbox"]').forEach(function (cb) { cb.checked = false; });
        });
    });

    /* ---------- Price range dual slider ---------- */
    document.querySelectorAll('[data-hn-price-range="min"]').forEach(function (minInput) {
        var wrap = minInput.closest('.hn-filter-group');
        var maxInput = wrap ? wrap.querySelector('[data-hn-price-range="max"]') : null;
        var minLabel = wrap ? wrap.querySelector('[data-hn-price-label="min"]') : null;
        var maxLabel = wrap ? wrap.querySelector('[data-hn-price-label="max"]') : null;

        function update() {
            if (parseInt(minInput.value, 10) > parseInt(maxInput.value, 10)) {
                minInput.value = maxInput.value;
            }
            if (minLabel) minLabel.textContent = minInput.value;
            if (maxLabel) maxLabel.textContent = maxInput.value;
        }
        minInput.addEventListener('input', update);
        if (maxInput) maxInput.addEventListener('input', update);
    });

    /* ---------- Category view toggle (grid/list) ---------- */
    document.querySelectorAll('[data-hn-view]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var grid = document.querySelector('[data-hn-product-grid]');
            document.querySelectorAll('[data-hn-view]').forEach(function (b) { b.classList.remove('is-active'); });
            btn.classList.add('is-active');
            if (grid) grid.classList.toggle('hn-product-grid--list', btn.dataset.hnView === 'list');
        });
    });

    /* ---------- Product gallery ---------- */
    document.querySelectorAll('[data-hn-gallery]').forEach(function (gallery) {
        var mainImg = gallery.querySelector('[data-hn-gallery-active-img]');
        var thumbs = gallery.querySelectorAll('[data-hn-gallery-thumb]');
        thumbs.forEach(function (thumb) {
            thumb.addEventListener('click', function () {
                thumbs.forEach(function (t) { t.classList.remove('is-active'); });
                thumb.classList.add('is-active');
                if (mainImg) mainImg.src = thumb.dataset.src;
            });
        });
        var prev = gallery.querySelector('[data-hn-gallery-prev]');
        var next = gallery.querySelector('[data-hn-gallery-next]');
        function go(dir) {
            var arr = Array.prototype.slice.call(thumbs);
            var activeIndex = arr.findIndex(function (t) { return t.classList.contains('is-active'); });
            var nextIndex = (activeIndex + dir + arr.length) % arr.length;
            arr[nextIndex] && arr[nextIndex].click();
        }
        if (prev) prev.addEventListener('click', function () { go(-1); });
        if (next) next.addEventListener('click', function () { go(1); });

        /* Zoom on hover (desktop) */
        var zoomWrap = gallery.querySelector('[data-hn-zoom]');
        if (zoomWrap && mainImg) {
            zoomWrap.addEventListener('mousemove', function (e) {
                var rect = zoomWrap.getBoundingClientRect();
                var x = ((e.clientX - rect.left) / rect.width) * 100;
                var y = ((e.clientY - rect.top) / rect.height) * 100;
                mainImg.style.transformOrigin = x + '% ' + y + '%';
                mainImg.style.transform = 'scale(1.6)';
            });
            zoomWrap.addEventListener('mouseleave', function () {
                mainImg.style.transform = 'scale(1)';
            });
        }
    });

    /* ---------- Product tabs ---------- */
    document.querySelectorAll('[data-hn-tabs]').forEach(function (tabsWrap) {
        var buttons = tabsWrap.querySelectorAll('[data-hn-tab]');
        var panels = tabsWrap.querySelectorAll('[data-hn-tab-panel]');
        buttons.forEach(function (btn) {
            btn.addEventListener('click', function () {
                buttons.forEach(function (b) { b.classList.remove('is-active'); });
                panels.forEach(function (p) { p.classList.remove('is-active'); });
                btn.classList.add('is-active');
                var panel = tabsWrap.querySelector('[data-hn-tab-panel="' + btn.dataset.hnTab + '"]');
                if (panel) panel.classList.add('is-active');
            });
        });
    });

    /* ---------- Sticky add to cart (mobile) ---------- */
    var stickyCart = document.querySelector('[data-hn-sticky-cart]');
    var mainCta = document.querySelector('[data-hn-main-cta]');
    if (stickyCart && mainCta && 'IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                stickyCart.classList.toggle('is-visible', !entry.isIntersecting && window.innerWidth <= 900);
            });
        }, { threshold: 0 });
        observer.observe(mainCta);
    }

    /* ---------- Recently viewed (session-based, no personal data stored) ---------- */
    try {
        var STORAGE_KEY = 'hn_recently_viewed';
        var currentProduct = document.body.dataset.hnCurrentProduct;
        var list = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '[]');

        if (currentProduct) {
            list = list.filter(function (id) { return id !== currentProduct; });
            list.unshift(currentProduct);
            list = list.slice(0, 8);
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(list));
        }

        var rvSection = document.querySelector('[data-hn-recently-viewed]');
        var rvTrack = document.querySelector('[data-hn-recently-viewed-track]');
        if (rvSection && rvTrack && list.length) {
            rvSection.hidden = false;
            /* ملاحظة: يجب جلب بيانات هذه المنتجات (list) من Salla API وعرضها كبطاقات product-card */
        }
    } catch (e) { /* sessionStorage غير متاح */ }

    /* ---------- Live search (placeholder wiring) ---------- */
    var searchInput = document.querySelector('[data-hn-live-search]');
    var searchResults = document.querySelector('[data-hn-search-results]');
    if (searchInput && searchResults) {
        var debounceTimer;
        searchInput.addEventListener('input', function () {
            clearTimeout(debounceTimer);
            var query = searchInput.value.trim();
            if (!query) { searchResults.hidden = true; return; }
            debounceTimer = setTimeout(function () {
                /* ملاحظة: استدعاء فعلي لـ Salla Search API هنا بدل المحاكاة */
                searchResults.hidden = false;
            }, 300);
        });
        document.addEventListener('click', function (e) {
            if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
                searchResults.hidden = true;
            }
        });
    }
});
