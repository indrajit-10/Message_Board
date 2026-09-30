from common import *
from urllib.parse import urlparse
issues = defaultdict(list)
for u, r in P.items():
    for l in r['links']:
        h = l['href']; a = l['abs']
        if not a: 
            if h.startswith('#') and len(h) > 1: issues['fragment-only'].append((u, h, l['text']))
            elif h.startswith('javascript'): issues['javascript'].append((u, h, l['text']))
            elif not h: issues['empty-href'].append((u, h, l['text'], l['in_main']))
            continue
        p = urlparse(a)
        if p.netloc not in ('blog.123greetings.com',): continue
        if p.scheme == 'http': issues['http'].append((u, h, l['text']))
        path = p.path
        last = path.rsplit('/', 1)[-1]
        if path and not path.endswith('/') and '.' not in last: issues['no-trailing-slash'].append((u, h, l['text']))
        if any(c.isupper() for c in path): issues['uppercase'].append((u, h, l['text']))
        if p.query and not path.startswith('/wp-'): issues['query'].append((u, h, l['text']))
        if '//' in path: issues['double-slash'].append((u, h))
        if 'nofollow' in l['rel']: issues['nofollow-internal'].append((u, h, l['text']))
        if not h.startswith(('http', '/')): issues['relative'].append((u, h))
        if h.startswith('/') : issues['root-relative'].append((u,h))
for k, v in issues.items():
    uniq = sorted(set(v))
    print(f'\n== {k}: {len(v)} links, {len(uniq)} unique, pages {len(set(x[0] for x in v))}')
    for x in uniq[:25]: print('   ', x)
