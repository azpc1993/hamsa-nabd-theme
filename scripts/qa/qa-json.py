#!/usr/bin/env python3
"""twilight.json schema checks: top-level keys, features, settings combos,
collections, unique keys/paths/ids, file size and image hosts."""
import json, os, re, uuid
from _common import ROOT, load_manifest, component_twig, fail, warn, finish, rel

PATH = os.path.join(ROOT, 'twilight.json')
ALLOWED_TOP = {'name', 'repository', 'author_email', 'support_url', 'description',
               'features', 'settings', 'components'}
FEATURES = {'color', 'fonts', 'breadcrumb', 'mega-menu', 'filters', 'unite-cards-height',
            'menu-images', 'component-featured-products', 'component-fixed-banner',
            'component-fixed-products', 'component-products-slider', 'component-photos-slider',
            'component-parallax-background', 'component-testimonials', 'component-square-photos',
            'component-store-features', 'component-youtube'}
# Combinations confirmed for the theme-level `settings` array (theme-raed uses exactly these).
SETTING_COMBOS = {('boolean', 'switch'), ('items', 'dropdown-list'), ('static', 'line'), ('static', 'title')}
# Field combinations theme-raed uses inside `components[].fields`.
FIELD_COMBOS = {('static', 'description'), ('collection', 'collection'), ('string', 'image'),
                ('string', 'text'), ('string', 'textarea'), ('boolean', 'switch'),
                ('items', 'dropdown-list'), ('string', 'icon'), ('items', 'variable-list'),
                ('number', 'integer')}
# Pre-existing settings whose combo is not in theme-raed's settings. Kept (no deletions),
# reported as WARN and listed in BLOCKERS.md until verified in a real Salla preview.
LEGACY_UNVERIFIED = {'announcement_text'}
BAD_HOSTS = ('cdn.jsdelivr.net', 'raw.githubusercontent.com', 'githubusercontent', 'github.io')
MAX_BYTES = 150 * 1024

size = os.path.getsize(PATH)
print(f'twilight.json size: {size} bytes ({size / 1024:.1f} KB)')
if size >= MAX_BYTES:
    fail(f'twilight.json is {size} bytes (limit {MAX_BYTES})')

try:
    d = load_manifest()
except ValueError as e:
    fail(f'invalid JSON: {e}')
    finish('qa-json')

for k in d:
    if k not in ALLOWED_TOP:
        fail(f'top-level key not allowed: {k}')
for k in ('name', 'description', 'features', 'settings', 'components'):
    if k not in d:
        fail(f'missing top-level key: {k}')
for k in ('name', 'description'):
    v = d.get(k)
    if not (isinstance(v, dict) and v.get('ar') and v.get('en')):
        fail(f'{k} must be an object with ar and en')

for f in d.get('features', []):
    if f not in FEATURES:
        fail(f'feature not in approved list: {f}')

ids = set()
for s in d.get('settings', []):
    sid = s.get('id')
    if not sid:
        fail(f'setting without id: {s}')
    if sid in ids:
        fail(f'duplicate setting id: {sid}')
    ids.add(sid)
    combo = (s.get('type'), s.get('format'))
    if combo not in SETTING_COMBOS and sid in LEGACY_UNVERIFIED:
        warn(f'setting {sid}: pre-existing unverified type/format {combo} (see BLOCKERS.md)')
    elif combo not in SETTING_COMBOS:
        fail(f'setting {sid}: unverified type/format {combo}')
    if s.get('type') == 'collection' or 'fields' in s:
        fail(f'setting {sid}: settings must be flat')
    if combo == ('items', 'dropdown-list'):
        vals = [o.get('value') for o in s.get('options', [])]
        if not vals:
            fail(f'setting {sid}: dropdown without options')
        for sel in s.get('selected', []):
            if sel.get('value') not in vals:
                fail(f'setting {sid}: selected value {sel.get("value")} not in options')
        okeys = [o.get('key') for o in s.get('options', [])]
        if len(okeys) != len(set(okeys)):
            fail(f'setting {sid}: duplicate option keys')

keys, paths = set(), set()
for c in d.get('components', []):
    p, key = c.get('path'), c.get('key')
    if p in paths:
        fail(f'duplicate component path: {p}')
    paths.add(p)
    if key in keys:
        fail(f'duplicate component key: {key}')
    keys.add(key)
    try:
        if uuid.UUID(key).version != 4:
            fail(f'{p}: key is not uuid4')
    except (TypeError, ValueError):
        fail(f'{p}: key is not a uuid: {key}')
    t = c.get('title')
    if not (isinstance(t, dict) and t.get('ar') and t.get('en')):
        fail(f'{p}: title must be {{ar,en}}')
    if not str(c.get('icon', '')).startswith('sicon-'):
        fail(f'{p}: icon must be sicon-*')
    if not os.path.exists(component_twig(p or '')):
        fail(f'{p}: twig file missing ({rel(component_twig(p or ""))})')
    fids = set()
    for f in c.get('fields', []):
        fid = f.get('id')
        if fid in fids:
            fail(f'{p}: duplicate field id {fid}')
        fids.add(fid)
        combo = (f.get('type'), f.get('format'))
        if combo not in FIELD_COMBOS:
            fail(f'{p}.{fid}: unverified field type/format {combo}')
        if f.get('type') == 'collection':
            for sub in f.get('fields', []):
                if sub.get('type') == 'collection':
                    fail(f'{p}.{fid}: nested collection {sub.get("id")}')
                if not str(sub.get('id', '')).startswith(fid + '.'):
                    fail(f'{p}.{fid}: sub-field id must start with "{fid}.": {sub.get("id")}')
                if (sub.get('type'), sub.get('format')) not in FIELD_COMBOS:
                    fail(f'{p}.{sub.get("id")}: unverified field type/format')

raw = open(PATH, encoding='utf-8').read()
for host in BAD_HOSTS:
    n = raw.count(host)
    if n:
        fail(f'{n} reference(s) to forbidden host {host}')
if 'data:image' in raw:
    fail('base64 image embedded in twilight.json')

print(f'settings: {len(d.get("settings", []))}, components: {len(d.get("components", []))}')
finish('qa-json')
