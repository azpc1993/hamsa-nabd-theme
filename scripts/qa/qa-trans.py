#!/usr/bin/env python3
"""Every trans('key') in src/views must either be a key theme-raed uses
(its locales or its own trans() calls) or an hn.* key in both locales."""
import json, os, re
from _common import ROOT, RAED, twig_files, read, strip_comments, flatten, fail, warn, finish, rel

RE_T = re.compile(r"""trans\(\s*['"]([^'"]+)['"]""")


def locale(path):
    with open(path, encoding='utf-8') as fh:
        return flatten(json.load(fh))


ar = locale(os.path.join(ROOT, 'src/locales/ar.json'))
en = locale(os.path.join(ROOT, 'src/locales/en.json'))
raed = set()
if os.path.isdir(RAED):
    for lf in ('ar.json', 'en.json'):
        p = os.path.join(RAED, 'src', 'locales', lf)
        if os.path.exists(p):
            raed |= locale(p)
    for p in twig_files(os.path.join(RAED, 'src', 'views')):
        raed |= set(RE_T.findall(read(p)))
else:
    fail(f'theme-raed not found at {RAED} (git clone --depth 1 https://github.com/SallaApp/theme-raed.git {RAED})')

for k in sorted(ar ^ en):
    fail(f'locale key only in {"ar" if k in ar else "en"}.json: {k}')

total = 0
for p in twig_files():
    for key in RE_T.findall(strip_comments(read(p))):
        total += 1
        if key.startswith('hn.'):
            if key not in ar or key not in en:
                fail(f'{rel(p)}: {key} missing from ar.json/en.json')
        elif key in raed:
            continue
        elif key in ar and key in en:
            warn(f'{rel(p)}: {key} is a theme key outside the hn.* namespace')
        else:
            fail(f'{rel(p)}: {key} is neither a theme-raed key nor a defined hn.* key')
print(f'trans() calls: {total}, raed keys known: {len(raed)}, theme keys: {len(ar)}')
finish('qa-trans')
