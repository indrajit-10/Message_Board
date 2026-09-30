from common import *
bad = []
for u, r in P_ALL.items():
    c = r.get('canonical')
    if r['status'] != 200: continue
    if r.get('redirects'):
        continue
    if not c: bad.append(('missing', u)); continue
    if c.startswith('http://'): bad.append(('http', u, c))
    elif c != u: bad.append(('not self', u, c))
print('canonical issues:', bad)
print('og:url != canonical:', [(u, r['og'].get('og:url'), r.get('canonical')) for u, r in P.items() if r['og'].get('og:url') != r.get('canonical')])
# pagination: rel next/prev not captured; paginated canonical self
pag = [u for u in P if '/page/' in u]
print('paginated archives crawled:', len(pag), pag)
print('robots values', Counter(r.get('robots') for r in P.values()))
# lang / viewport
print('lang', Counter(r.get('lang') for r in P.values()), 'viewport', Counter(r.get('viewport') for r in P.values()))
# og
keys = Counter()
for r in P.values(): keys.update(r['og'].keys())
print('og keys', keys)
noimg = [u for u, r in P.items() if not r['og'].get('og:image')]
print('no og:image', len(noimg), Counter(P[u]['type'] for u in noimg))
print('  content without og:image:', [u for u in noimg if P[u]['type'] in ('page', 'post', 'other')])
imgs = Counter(r['og'].get('og:image') for r in P.values() if r['og'].get('og:image'))
print('\nmost common og:image:')
for i, c in imgs.most_common(12): print('  ', c, i)
arrow = [u for u, r in P.items() if 'arrow' in (r['og'].get('og:image') or '').lower()]
print('arrow og:image pages', len(arrow))
json.dump(arrow, open('arrow_og.json', 'w'))
# og:image of type webp/png/sizes
print('og:type', Counter((r['type'], r['og'].get('og:type')) for r in P.values()))
