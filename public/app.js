/* همسة نبض — سلوكيات الثيم العامة */
document.addEventListener('DOMContentLoaded', function () {

    /* ---------- Hero Slider ---------- */
    document.querySelectorAll('[data-hn-slider]').forEach(function (track) {
        var slides = track.querySelectorAll('.hn-hero__slide');
        var dotsWrap = track.parentElement.querySelector('.hn-hero__dots');
        var dots = dotsWrap ? dotsWrap.querySelectorAll('.hn-hero__dot') : [];
        var current = 0;
        var autoplay = parseInt(track.dataset.autoplay || '0', 10);
        var timer = null;

        function goTo(index) {
            slides.forEach(function (s, i) {
                s.classList.toggle('is-active', i === index);
            });
            dots.forEach(function (d, i) {
                d.classList.toggle('is-active', i === index);
            });
            current = index;
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                goTo(parseInt(dot.dataset.goto, 10));
                resetAutoplay();
            });
        });

        function resetAutoplay() {
            if (!autoplay) return;
            clearInterval(timer);
            timer = setInterval(function () {
                goTo((current + 1) % slides.length);
            }, autoplay);
        }
        resetAutoplay();
    });

    /* ---------- Popup windows (بديل ملاك) ---------- */
    document.querySelectorAll('[data-hn-popup-trigger]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var id = btn.dataset.hnPopupTrigger;
            var overlay = document.getElementById('hn-popup-' + id);
            if (overlay) overlay.classList.add('is-open');
        });
    });
    document.querySelectorAll('.hn-popup-overlay').forEach(function (overlay) {
        overlay.addEventListener('click', function (e) {
            if (e.target === overlay || e.target.closest('.hn-popup__close')) {
                overlay.classList.remove('is-open');
            }
        });
    });

    /* ---------- WhatsApp: نسخ رابط المنتج الحالي تلقائياً ---------- */
    document.querySelectorAll('[data-hn-copy-link="true"]').forEach(function (link) {
        link.addEventListener('click', function () {
            var url = window.location.href;
            if (navigator.clipboard) {
                navigator.clipboard.writeText(url).catch(function () {});
            }
        });
    });

    /* ---------- Countdown timers ---------- */
    document.querySelectorAll('[data-hn-countdown]').forEach(function (box) {
        var target = new Date(box.dataset.hnCountdown || '').getTime();
        if (!Number.isFinite(target)) return;
        var daysEl = box.querySelector('[data-unit="days"]');
        var hoursEl = box.querySelector('[data-unit="hours"]');
        var minsEl = box.querySelector('[data-unit="minutes"]');
        var secsEl = box.querySelector('[data-unit="seconds"]');

        function pad(n) { return String(n).padStart(2, '0'); }

        function tick() {
            var diff = target - Date.now();
            if (diff <= 0) { clearInterval(interval); diff = 0; }
            var d = Math.floor(diff / 86400000);
            var h = Math.floor((diff % 86400000) / 3600000);
            var m = Math.floor((diff % 3600000) / 60000);
            var s = Math.floor((diff % 60000) / 1000);
            if (daysEl) daysEl.textContent = pad(d);
            if (hoursEl) hoursEl.textContent = pad(h);
            if (minsEl) minsEl.textContent = pad(m);
            if (secsEl) secsEl.textContent = pad(s);
        }
        tick();
        var interval = setInterval(tick, 1000);
    });

    /* ---------- Slider / Grid toggle (كما في ملاك) ---------- */
    document.querySelectorAll('[data-hn-view-toggle]').forEach(function (toggle) {
        toggle.addEventListener('click', function () {
            var targetId = toggle.dataset.hnViewToggle;
            var target = document.getElementById(targetId);
            if (!target) return;
            target.classList.toggle('is-grid');
            target.classList.toggle('is-slider');
        });
    });
});

/* ---------- V9.1 promotion popup ---------- */
(function(){
    var popups=document.querySelectorAll('[data-hn-promo-popup]');
    popups.forEach(function(popup){
        var delay=Math.max(0,parseInt(popup.dataset.delay||'4',10))*1000;
        var key='hn-promo-seen';
        if(popup.dataset.popupId) return; /* v11: opened on demand by [data-hn-open-popup] */
        if(!sessionStorage.getItem(key)){
            setTimeout(function(){ popup.classList.add('is-open'); popup.setAttribute('aria-hidden','false'); sessionStorage.setItem(key,'1'); },delay);
        }
    });
    popups.forEach(function(popup){
        popup.querySelectorAll('[data-hn-promo-close]').forEach(function(btn){btn.addEventListener('click',function(){popup.classList.remove('is-open');popup.setAttribute('aria-hidden','true');});});
    });
    /* v11: department-grid cards with popup_id open the matching promo popup */
    document.addEventListener('click',function(e){
        var t=e.target.closest&&e.target.closest('[data-hn-open-popup]'); if(!t)return;
        var id=t.getAttribute('data-hn-open-popup'), target=null;
        popups.forEach(function(p){ if(p.dataset.popupId===id) target=p; });
        if(!target) return;
        e.preventDefault(); target.classList.add('is-open'); target.setAttribute('aria-hidden','false');
        var c=target.querySelector('[data-hn-promo-close].hn-promo-popup__close'); if(c) c.focus();
    });
    document.addEventListener('keydown',function(e){ if(e.key==='Escape') popups.forEach(function(p){ p.classList.remove('is-open'); p.setAttribute('aria-hidden','true'); }); });
})();
