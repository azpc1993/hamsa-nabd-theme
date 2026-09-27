/* Hamsa Nabd 9.1 — progressive enhancement layer around native Salla/Twilight components. */
(function () {
  'use strict';
  function ready(fn){ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn,{once:true}); else fn(); }
  function safe(fn){ try{fn();}catch(e){} }
  ready(function(){
    /* Mobile menu */
    function menu(open){var el=document.querySelector('#hn-mega-menu'); if(!el)return; el.classList.toggle('is-open',!!open); el.setAttribute('aria-hidden',open?'false':'true'); document.body.classList.toggle('hn-no-scroll',!!open);}
    document.querySelectorAll('[data-hn-menu-open]').forEach(function(b){b.addEventListener('click',function(){menu(true);});});
    document.querySelectorAll('[data-hn-menu-close]').forEach(function(b){b.addEventListener('click',function(){menu(false);});});
    document.addEventListener('keydown',function(e){if(e.key==='Escape')menu(false);});

    /* Product tabs */
    document.querySelectorAll('[data-hn-tabs]').forEach(function(root){
      root.querySelectorAll('[data-hn-tab]').forEach(function(tab){tab.addEventListener('click',function(){var id=tab.getAttribute('data-hn-tab'); root.querySelectorAll('[data-hn-tab]').forEach(function(t){t.classList.toggle('is-active',t===tab);t.setAttribute('aria-selected',t===tab?'true':'false');}); root.querySelectorAll('[data-hn-tab-panel]').forEach(function(p){p.classList.toggle('is-active',p.getAttribute('data-hn-tab-panel')===id);});});});
    });

    /* Wishlist */
    document.querySelectorAll('[data-hn-wishlist]').forEach(function(btn){btn.addEventListener('click',function(){var id=String(btn.getAttribute('data-hn-wishlist')); safe(function(){if(window.salla&&salla.wishlist&&typeof salla.wishlist.toggle==='function')salla.wishlist.toggle(id);});});});

    /* Product note toggles */
    document.querySelectorAll('[data-show]').forEach(function(btn){btn.addEventListener('click',function(){var id=btn.getAttribute('data-show');var field=document.getElementById(id);if(field){field.hidden=!field.hidden;if(!field.hidden)field.focus();}});});

    /* Cart actions. Quantity inputs emit the native change flow; these handlers only bridge our custom buttons/forms. */
    document.querySelectorAll('[data-hn-cart-form]').forEach(function(form){form.addEventListener('change',function(event){safe(function(){if(window.salla&&salla.form&&typeof salla.form.onChange==='function')salla.form.onChange('cart.updateItem',event);});});});
    document.querySelectorAll('[data-hn-cart-delete]').forEach(function(btn){btn.addEventListener('click',function(){var id=String(btn.getAttribute('data-hn-cart-delete'));safe(function(){if(window.salla&&salla.cart&&typeof salla.cart.deleteItem==='function'){var p=salla.cart.deleteItem(id);if(p&&typeof p.then==='function')p.then(function(){var row=document.getElementById('item-'+id);if(row)row.remove();});}});});});
    document.querySelectorAll('[data-hn-cart-submit]').forEach(function(btn){btn.addEventListener('click',function(){safe(function(){if(window.salla&&salla.cart&&typeof salla.cart.submit==='function')salla.cart.submit();});});});

    /* Customer profile */
    document.querySelectorAll('[data-hn-profile-form]').forEach(function(form){form.addEventListener('submit',function(event){safe(function(){if(window.salla&&salla.form&&typeof salla.form.onSubmit==='function'){event.preventDefault();salla.form.onSubmit('profile.update',event);}});});});

    /* Commerce event bridge — does not replace Salla analytics. */
    document.addEventListener('click',function(e){var el=e.target.closest&&e.target.closest('[data-hn-main-cta],[data-hn-cart-submit],[data-hn-wishlist]');if(el)window.dispatchEvent(new CustomEvent('hn:commerce:interaction',{detail:{productId:el.getAttribute('product-id')||el.getAttribute('data-hn-wishlist')||null,type:el.hasAttribute('data-hn-wishlist')?'wishlist':'cta'}}));});

    /* Recently viewed IDs only; native Salla recommendations remain the source of product data. */
    safe(function(){var root=document.querySelector('[data-hn-current-product]');if(!root)return;var key='hn_recently_viewed';var id=String(root.getAttribute('data-hn-current-product'));var ids=JSON.parse(sessionStorage.getItem(key)||'[]').filter(function(x){return String(x)!==id;});ids.unshift(id);sessionStorage.setItem(key,JSON.stringify(ids.slice(0,8)));});
  });
})();
/* همسة نبض — سلوكيات المكونات الجديدة (متعددة الأقسام) */
document.addEventListener('DOMContentLoaded', function () {

    /* ---------- Season / Occasion Switcher ---------- */
    document.querySelectorAll('[data-hn-season-switcher]').forEach(function (block) {
        var tabs = block.querySelectorAll('[data-hn-season-tab]');
        var panels = block.querySelectorAll('[data-hn-season-panel]');
        tabs.forEach(function (tab) {
            tab.addEventListener('click', function () {
                var index = tab.dataset.hnSeasonTab;
                tabs.forEach(function (t) { t.classList.remove('is-active'); });
                panels.forEach(function (p) { p.classList.remove('is-active'); });
                tab.classList.add('is-active');
                var panel = block.querySelector('[data-hn-season-panel="' + index + '"]');
                if (panel) panel.classList.add('is-active');
            });
        });
    });

    /* ---------- Gift Finder Wizard ---------- */
    document.querySelectorAll('[data-hn-gift-finder]').forEach(function (widget) {
        var results = [];
        try { results = JSON.parse(widget.dataset.results || '[]'); } catch (e) { results = []; }

        var state = { recipient: null, occasion: null };
        var step0 = widget.querySelector('[data-hn-gf-step="0"]');
        var step1 = widget.querySelector('[data-hn-gf-step="1"]');
        var resultBox = widget.querySelector('[data-hn-gf-result]');

        function showStep(el) {
            widget.querySelectorAll('[data-hn-gf-step]').forEach(function (s) { s.classList.remove('is-active'); });
            resultBox.hidden = true;
            if (el) el.classList.add('is-active');
        }

        widget.querySelectorAll('[data-hn-gf-recipient]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                state.recipient = btn.dataset.hnGfRecipient;
                showStep(step1);
            });
        });

        widget.querySelectorAll('[data-hn-gf-occasion]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                state.occasion = btn.dataset.hnGfOccasion;
                var match = results.find(function (r) {
                    return r.recipient === state.recipient && r.occasion === state.occasion;
                }) || results.find(function (r) { return r.recipient === state.recipient; });

                widget.querySelectorAll('[data-hn-gf-step]').forEach(function (s) { s.classList.remove('is-active'); });
                if (match) {
                    widget.querySelector('[data-hn-gf-result-img]').src = match.image || '';
                    widget.querySelector('[data-hn-gf-result-title]').textContent = match.title || '';
                    widget.querySelector('[data-hn-gf-result-link]').href = match.url || '#';
                }
                resultBox.hidden = false;
            });
        });

        var backBtn = widget.querySelector('[data-hn-gf-back]');
        if (backBtn) backBtn.addEventListener('click', function () { showStep(step0); });

        var restartBtn = widget.querySelector('[data-hn-gf-restart]');
        if (restartBtn) restartBtn.addEventListener('click', function () {
            state = { recipient: null, occasion: null };
            showStep(step0);
        });
    });

    /* ---------- Lookbook hotspots (toggle on tap for mobile) ---------- */
    document.querySelectorAll('[data-hn-hotspot]').forEach(function (spot) {
        spot.addEventListener('click', function (e) {
            e.stopPropagation();
            var isOpen = spot.classList.contains('is-open');
            document.querySelectorAll('[data-hn-hotspot].is-open').forEach(function (s) { s.classList.remove('is-open'); });
            if (!isOpen) spot.classList.add('is-open');
        });
    });
    document.addEventListener('click', function () {
        document.querySelectorAll('[data-hn-hotspot].is-open').forEach(function (s) { s.classList.remove('is-open'); });
    });
});

(function(){document.querySelectorAll('[data-hn-compare]').forEach(function(root){var boxes=root.querySelectorAll('[data-hn-compare-item]'),btn=root.querySelector('[data-hn-compare-open]'),out=root.querySelector('[data-hn-compare-result]');function clear(){while(out.firstChild)out.removeChild(out.firstChild);}function sync(){var checked=[].filter.call(boxes,function(x){return x.checked});btn.disabled=checked.length<2||checked.length>4;if(checked.length===0){out.hidden=true;clear();}else{out.hidden=false;clear();var count=document.createElement('div');count.className='hn-compare__count';count.textContent=checked.length+' '+(checked.length===1?'item':'items');out.appendChild(count);}}boxes.forEach(function(x){x.addEventListener('change',sync)});btn.addEventListener('click',function(){var checked=[].filter.call(boxes,function(x){return x.checked});if(checked.length<2||checked.length>4)return;clear();out.hidden=false;var wrap=document.createElement('div');wrap.className='hn-compare__selected';checked.forEach(function(x){var card=x.closest('.hn-compare-card'),span=document.createElement('span');span.textContent=card.querySelector('strong').textContent;wrap.appendChild(span);});out.appendChild(wrap);});});})();

/* V9.3 — Smart Commerce interactions (presentation/configuration only; no undocumented Salla APIs). */
(function(){
  'use strict';
  function each(sel,fn){document.querySelectorAll(sel).forEach(fn);}
  each('[data-hn-gift-finder-v2]',function(widget){
    var results=[]; try{results=JSON.parse(widget.getAttribute('data-results')||'[]');}catch(e){results=[];}
    var state={recipient:null,occasion:null,budget:null};
    function step(n){widget.querySelectorAll('[data-hn-gf2-step]').forEach(function(x){x.classList.toggle('is-active',x.getAttribute('data-hn-gf2-step')===String(n));});var r=widget.querySelector('[data-hn-gf2-result]');if(r)r.hidden=true;}
    widget.querySelectorAll('[data-hn-gf2-recipient]').forEach(function(b){b.addEventListener('click',function(){state.recipient=b.getAttribute('data-hn-gf2-recipient');step(1);});});
    widget.querySelectorAll('[data-hn-gf2-occasion]').forEach(function(b){b.addEventListener('click',function(){state.occasion=b.getAttribute('data-hn-gf2-occasion');step(2);});});
    widget.querySelectorAll('[data-hn-gf2-budget]').forEach(function(b){b.addEventListener('click',function(){state.budget=b.getAttribute('data-hn-gf2-budget');var scored=results.map(function(r){var s=0;if(r.recipient===state.recipient)s+=4;if(r.occasion===state.occasion)s+=3;if(r.budget&&r.budget===state.budget)s+=3;return {r:r,s:s};}).sort(function(a,b){return b.s-a.s;});var m=scored.length?scored[0].r:null;var box=widget.querySelector('[data-hn-gf2-result]');if(m){widget.querySelector('[data-hn-gf2-img]').src=m.image||'';widget.querySelector('[data-hn-gf2-title]').textContent=m.title||'';widget.querySelector('[data-hn-gf2-reason]').textContent=m.reason||'';widget.querySelector('[data-hn-gf2-link]').href=m.url||'#';}if(box)box.hidden=false;widget.querySelectorAll('[data-hn-gf2-step]').forEach(function(x){x.classList.remove('is-active');});});});
    widget.querySelectorAll('[data-hn-gf2-back]').forEach(function(b){b.addEventListener('click',function(){var current=Array.prototype.findIndex.call(widget.querySelectorAll('[data-hn-gf2-step]'),function(x){return x.classList.contains('is-active');});step(Math.max(0,current-1));});});
    var restart=widget.querySelector('[data-hn-gf2-restart]');if(restart)restart.addEventListener('click',function(){state={recipient:null,occasion:null,budget:null};step(0);});
  });
  each('[data-hn-smart-box]',function(root){var count=root.querySelector('[data-hn-smart-box-count]'),inputs=root.querySelectorAll('input[type="checkbox"]');function sync(){var selected=root.querySelectorAll('input[type="checkbox"]:checked').length+(root.querySelector('input[type="radio"]:checked')?1:0);if(count)count.textContent=String(selected); }root.querySelectorAll('input').forEach(function(x){x.addEventListener('change',sync);});sync();});
  each('[data-hn-recommendations]',function(root){var tabs=root.querySelectorAll('[data-hn-rec-tab]'),items=root.querySelectorAll('[data-hn-rec-item]');tabs.forEach(function(t){t.addEventListener('click',function(){var v=t.getAttribute('data-hn-rec-tab');tabs.forEach(function(x){x.classList.toggle('is-active',x===t);});items.forEach(function(i){i.hidden=v!=='all'&&i.getAttribute('data-hn-rec-item')!==v;});});});});
})();
