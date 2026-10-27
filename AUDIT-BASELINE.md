# AUDIT-BASELINE — Hamsa Nabd (Twig restored from 23cd4f6)

Note: `main` had replaced the Twig theme with a React theme (commit bba7f41). On the owner's decision the Twig tree was restored from 23cd4f6 (already labelled 11.0.0 in package.json, not 10.1.1). `scripts/` (build.js, qa.js, watch.js) was missing in that tree and was restored from 71db83b^.

## Before fixes (restored tree, as found)

### qa-json
```
python3: can't open file '/tmp/tmp.Smbn6PB0I5/scripts/qa/qa-json.py': [Errno 2] No such file or directory
```

### qa-fields
```
python3: can't open file '/tmp/tmp.Smbn6PB0I5/scripts/qa/qa-fields.py': [Errno 2] No such file or directory
```

### qa-trans
```
python3: can't open file '/tmp/tmp.Smbn6PB0I5/scripts/qa/qa-trans.py': [Errno 2] No such file or directory
```

### qa-refs
```
python3: can't open file '/tmp/tmp.Smbn6PB0I5/scripts/qa/qa-refs.py': [Errno 2] No such file or directory
```

### node --check src/assets/js/**/*.js
```
ok src/assets/js/app-helpers.js
ok src/assets/js/app.js
ok src/assets/js/base-page.js
ok src/assets/js/blog.js
ok src/assets/js/brands.js
ok src/assets/js/cart.js
ok src/assets/js/components.js
ok src/assets/js/home.js
ok src/assets/js/loyalty.js
ok src/assets/js/order.js
ok src/assets/js/product.js
ok src/assets/js/products.js
ok src/assets/js/testimonials.js
ok src/assets/js/twilight.js
ok src/assets/js/wishlist.js
ok src/assets/js/pages/category.js
ok src/assets/js/pages/home.js
ok src/assets/js/pages/product.js
```

### Counts
```
components 30 settings 34 bytes 169489
```

## After baseline fix commit

### qa-json
```
twilight.json size: 114134 bytes (111.5 KB)
settings: 35, components: 30
WARN  setting announcement_text: pre-existing unverified type/format ('string', 'text') (see BLOCKERS.md)
qa-json: PASS (0 failures, 1 warnings)
```

### qa-fields
```
components checked: 30/30, settings read in twig: 34
qa-fields: PASS (0 failures, 0 warnings)
```

### qa-trans
```
trans() calls: 140, raed keys known: 118, theme keys: 188
qa-trans: PASS (0 failures, 24 warnings)
```

### qa-refs
```
references checked: 27
WARN  src/views/components/home/brands.twig: not registered, not feature-backed and not included (orphan)
WARN  src/views/components/home/custom-testimonials.twig: not registered, not feature-backed and not included (orphan)
WARN  src/views/components/home/enhanced-slider.twig: not registered, not feature-backed and not included (orphan)
WARN  src/views/components/home/enhanced-square-banners.twig: not registered, not feature-backed and not included (orphan)
WARN  src/views/components/home/hn-bundle-tiers.twig: not registered, not feature-backed and not included (orphan)
WARN  src/views/components/home/hn-categories.twig: not registered, not feature-backed and not included (orphan)
WARN  src/views/components/home/hn-category-products.twig: not registered, not feature-backed and not included (orphan)
WARN  src/views/components/home/hn-countdown-offer.twig: not registered, not feature-backed and not included (orphan)
WARN  src/views/components/home/hn-coupon.twig: not registered, not feature-backed and not included (orphan)
WARN  src/views/components/home/hn-join-channel.twig: not registered, not feature-backed and not included (orphan)
WARN  src/views/components/home/hn-marquee.twig: not registered, not feature-backed and not included (orphan)
WARN  src/views/components/home/hn-products-tabs.twig: not registered, not feature-backed and not included (orphan)
WARN  src/views/components/home/hn-promo-banners.twig: not registered, not feature-backed and not included (orphan)
WARN  src/views/components/home/hn-story.twig: not registered, not feature-backed and not included (orphan)
WARN  src/views/components/home/latest-products.twig: not registered, not feature-backed and not included (orphan)
WARN  src/views/components/home/main-links.twig: not registered, not feature-backed and not included (orphan)
WARN  src/views/components/home/slider-products-with-header.twig: not registered, not feature-backed and not included (orphan)
WARN  src/views/components/home/smart-bundle.twig: not registered, not feature-backed and not included (orphan)
WARN  src/views/components/home/v10-presets.twig: not registered, not feature-backed and not included (orphan)
qa-refs: PASS (0 failures, 19 warnings)
```

Fixes: removed top-level version/theme_name/repo_url; dropped 30 jsdelivr preview image URLs (need a Partners-accepted host, see BLOCKERS.md); compact one-line-per-entry manifest (169KB → 111KB); declared is_more_button_enabled (copied from theme-raed, read by brands.twig); wired show_product_offers (offer modal) and hn_enable_promo_popup (promo popup); blocks.hamsa.* → hn.blocks.*, added hn.v93.* keys in ar/en.

24 trans WARNs = common.*/pages.* keys defined in this theme's own locales outside hn.* (not failures). 19 orphan WARNs = twig files under components/home that are neither registered nor feature-backed (kept, not deleted).
