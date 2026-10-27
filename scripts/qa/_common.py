"""Shared helpers for the Hamsa Nabd QA scripts (stdlib only)."""
import json, os, re, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
VIEWS = os.path.join(ROOT, 'src', 'views')
RAED = os.environ.get('THEME_RAED', '/tmp/theme-raed')

failures = []
warnings = []


def fail(msg):
    failures.append(msg)


def warn(msg):
    warnings.append(msg)


def load_manifest():
    with open(os.path.join(ROOT, 'twilight.json'), encoding='utf-8') as fh:
        return json.load(fh)


def twig_files(base=VIEWS):
    for dirpath, _, names in os.walk(base):
        for n in sorted(names):
            if n.endswith('.twig'):
                yield os.path.join(dirpath, n)


def read(path):
    with open(path, encoding='utf-8') as fh:
        return fh.read()


def strip_comments(src):
    return re.sub(r'\{#.*?#\}', '', src, flags=re.S)


def rel(path):
    return os.path.relpath(path, ROOT)


def component_twig(path):
    """'home.hero-banner' -> src/views/components/home/hero-banner.twig"""
    return os.path.join(VIEWS, 'components', *path.split('.')) + '.twig'


def flatten(d, prefix=''):
    out = set()
    for k, v in d.items():
        key = f'{prefix}{k}'
        if isinstance(v, dict):
            out |= flatten(v, key + '.')
        else:
            out.add(key)
    return out


def finish(name):
    for w in warnings:
        print('WARN ', w)
    for f in failures:
        print('FAIL ', f)
    status = 'PASS' if not failures else 'FAIL'
    print(f'{name}: {status} ({len(failures)} failures, {len(warnings)} warnings)')
    sys.exit(0 if not failures else 1)
