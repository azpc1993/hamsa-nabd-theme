/* Hamsa Nabd 9.1 product page. Native Twilight components own cart/options/quick-buy behavior. */
(function(){'use strict';
  document.addEventListener('DOMContentLoaded',function(){
    var form=document.querySelector('[data-hn-product-form]');
    if(!form)return;
    form.addEventListener('keydown',function(e){if(e.key==='Enter' && e.target && e.target.tagName==='INPUT' && e.target.type!=='submit'){e.preventDefault();}});
  });
})();
