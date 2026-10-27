#!/usr/bin/env python3
"""Cross-check twig <-> twilight.json:
- every component.xxx read in a registered component's twig is a declared field;
- every theme.settings.get('id') anywhere in src/views is a declared setting;
- every declared setting is used in twig, CSS or JS (no setting without effect)."""
import os, re
from _common import ROOT, VIEWS, load_manifest, twig_files, read, strip_comments, component_twig, fail, warn, finish, rel

d = load_manifest()
# component.* names provided by Salla itself, not by fields.
BUILTIN = {'title', 'id'}
RE_COMP = re.compile(r'\bcomponent\.([a-zA-Z_][a-zA-Z0-9_]*)')
RE_ATTR = re.compile(r"attribute\(\s*component\s*,\s*'([a-zA-Z0-9_]+)'")
RE_LOOP = re.compile(r"\{%\s*for\s+\w+\s+in\s+\[([^\]]*)\]\s*%\}\s*\{%\s*set\s+\w+\s*=\s*attribute\(\s*component\s*,\s*\w+\s*\)")
RE_SET = re.compile(r"theme\.settings\.get\(\s*'([^']+)'")

checked = 0
for c in d['components']:
    path = component_twig(c['path'])
    if not os.path.exists(path):
        continue  # reported by qa-json
    src = strip_comments(read(path))
    fields = {f['id'] for f in c.get('fields', [])}
    used = set(RE_COMP.findall(src)) | set(RE_ATTR.findall(src))
    for m in RE_LOOP.findall(src):
        used |= set(re.findall(r"'([a-zA-Z0-9_]+)'", m))
    for name in sorted(used - fields - BUILTIN):
        fail(f'{c["path"]}: component.{name} used in twig but not declared in fields')
    for name in sorted(fields - used):
        f = next(x for x in c['fields'] if x['id'] == name)
        if f.get('type') != 'static':
            warn(f'{c["path"]}: field {name} declared but never read in twig')
    checked += 1

setting_ids = {s['id'] for s in d['settings']}
read_ids = set()
for p in twig_files():
    for sid in RE_SET.findall(strip_comments(read(p))):
        read_ids.add(sid)
        if sid not in setting_ids:
            fail(f'{rel(p)}: theme.settings.get(\'{sid}\') not declared in settings')

assets = ''
for base in ('src/assets/styles', 'src/assets/js'):
    for dp, _, ns in os.walk(os.path.join(ROOT, base)):
        for n in ns:
            if n.endswith(('.css', '.js')):
                assets += read(os.path.join(dp, n))
for s in d['settings']:
    if s['type'] == 'static':
        continue
    if s['id'] not in read_ids and s['id'] not in assets:
        fail(f'setting {s["id"]} is declared but has no effect (not read in twig/css/js)')

print(f'components checked: {checked}/{len(d["components"])}, settings read in twig: {len(read_ids)}')
finish('qa-fields')
