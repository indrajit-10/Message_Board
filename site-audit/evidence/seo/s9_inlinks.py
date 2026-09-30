from common import *
from urllib.parse import urlparse, urldefrag
def norm(a):
    a = urldefrag(a)[0].split('?')[0].replace('http://', 'https://')
    p = urlparse(a)
    if p.netloc != 'blog.123greetings.com': return None
    if p.path and not p.path.endswith('/') and '.' not in p.path.rsplit('/', 1)[-1]: a += '/'
    return a
C = content()
inl_all = defaultdict(set); inl_content = defaultdict(set); inl_main = defaultdict(set); inl_main_content = defaultdict(set)
for u, r in P.items():
    for l in r['links']:
        if not l['abs']: continue
        t = norm(l['abs'])
        if not t or t == u: continue
        inl_all[t].add(u)
        if r['type'] in ('page', 'post'): inl_content[t].add(u)
        if l['in_main']:
            inl_main[t].add(u)
            if r['type'] in ('page', 'post'): inl_main_content[t].add(u)
rows = []
for u, r in C.items():
    rows.append((u, r['type'], len(inl_all[u]), len(inl_content[u]), len(inl_main_content[u]), r.get('lastmod', '')[:10]))
orph = [x for x in rows if x[2] == 0]
print('orphans (0 inlinks from any crawled page):', len(orph))
for x in orph: print('  ', x)
orph_c = [x for x in rows if x[3] == 0 and x[2] > 0]
print('\nreachable only via tag/author/category archives (0 inlinks from pages/posts):', len(orph_c))
for x in orph_c: print('  ', x)
few = [x for x in rows if 0 < x[3] <= 1]
print('\nexactly 1 inlink from content pages:', len(few))
print('  ', Counter(x[1] for x in few))
for x in few[:15]: print('  ', x)
print('\nno in-content (main area) link from any page/post:', len([x for x in rows if x[4] == 0]), Counter(x[1] for x in rows if x[4] == 0))
json.dump({'rows': rows}, open('inlinks.json', 'w'))
# distribution
import statistics
print('\nmedian inlinks all', statistics.median(x[2] for x in rows), 'content', statistics.median(x[3] for x in rows))
# which pages link to everything (nav)
