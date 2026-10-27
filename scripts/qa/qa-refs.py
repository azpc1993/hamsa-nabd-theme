#!/usr/bin/env python3
"""Every {% component/include/extends/embed %} target exists, and every
twig under components/home is reachable (registered, feature-backed or included)."""
import os, re
from _common import ROOT, VIEWS, load_manifest, twig_files, read, strip_comments, component_twig, fail, warn, finish, rel

RE_REF = re.compile(r"\{%-?\s*(component|include|extends|embed)\s+'([^']+)'")
# Built-in home components Salla renders through `features`.
FEATURE_FILES = {
    'component-featured-products': ['featured-products-style1', 'featured-products-style2', 'featured-products-style3'],
    'component-fixed-banner': ['fixed-banner'], 'component-fixed-products': ['fixed-products'],
    'component-products-slider': ['products-slider'], 'component-photos-slider': ['photos-slider'],
    'component-parallax-background': ['parallax-background'], 'component-testimonials': ['testimonials'],
    'component-square-photos': ['square-photos'], 'component-store-features': ['store-features'],
    'component-youtube': ['youtube'],
}


def target(kind, name):
    if kind == 'component':
        return component_twig(name)
    return os.path.join(VIEWS, *name.split('.')) + '.twig'


referenced = set()
n = 0
for p in twig_files():
    for kind, name in RE_REF.findall(strip_comments(read(p))):
        n += 1
        t = target(kind, name)
        referenced.add(os.path.normpath(t))
        if not os.path.exists(t):
            fail(f'{rel(p)}: {kind} \'{name}\' -> missing {rel(t)}')

RE_ASSET = re.compile(r"'([^']+)'\|asset")
for p in twig_files():
    for a in RE_ASSET.findall(read(p)):
        if not os.path.exists(os.path.join(ROOT, 'public', a)):
            fail(f'{rel(p)}: asset {a} missing from public/ (run npm run build)')

REQUIRED_HOOKS = {
    'pages/product/single.twig': ['product.single.before_product_info', 'product.single.before_customer_reviews',
                                  'product.single.before_product_recommendations', 'product.single.after_product_recommendations'],
    'pages/product/index.twig': ['product.index.before_products_group_with_filter', 'product.index.after_products_group_with_filter',
                                 'product.index.after_testimonials'],
    'pages/page-single.twig': ['information_page.information_page'],
}
for f, hooks in REQUIRED_HOOKS.items():
    src = read(os.path.join(VIEWS, f))
    for h in hooks:
        if f"hook '{h}'" not in src:
            fail(f'required hook {h} missing from {f}')
cart = read(os.path.join(VIEWS, 'pages/cart.twig'))
if 'salla-cart-summary-card' not in cart and 'cart:summary-card' not in cart:
    fail('cart.twig must keep salla-cart-summary-card')

d = load_manifest()
reachable = {os.path.normpath(component_twig(c['path'])) for c in d['components']} | referenced
for feat in d.get('features', []):
    for f in FEATURE_FILES.get(feat, []):
        reachable.add(os.path.normpath(component_twig('home.' + f)))
for p in twig_files(os.path.join(VIEWS, 'components', 'home')):
    if os.path.normpath(p) not in reachable:
        warn(f'{rel(p)}: not registered, not feature-backed and not included (orphan)')
print(f'references checked: {n}')
finish('qa-refs')
