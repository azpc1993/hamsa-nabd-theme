"""Write twilight.json compactly: one setting / component per line, keeps the file under 150KB."""
import json, os
from _common import ROOT

def dump(d, path=os.path.join(ROOT, 'twilight.json')):
    j = lambda v: json.dumps(v, ensure_ascii=False, separators=(',', ':'))
    parts = []
    for k, v in d.items():
        if k in ('settings', 'components'):
            body = ',\n  '.join(j(x) for x in v)
            parts.append(f' {j(k)}:[\n  {body}\n ]')
        else:
            parts.append(f' {j(k)}:{j(v)}')
    with open(path, 'w', encoding='utf-8') as fh:
        fh.write('{\n' + ',\n'.join(parts) + '\n}\n')
