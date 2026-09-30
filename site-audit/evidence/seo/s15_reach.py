from common import *
from urllib.parse import urlparse, urldefrag
def norm(a):
    a = urldefrag(a)[0].split('?')[0].replace('http://', 'https://')
    p = urlparse(a)
    if p.netloc != 'blog.123greetings.com': return None
    if p.path and not p.path.endswith('/') and '.' not in p.path.rsplit('/', 1)[-1]: a += '/'
    return a
G = {u: {norm(l['abs']) for l in r['links'] if l['abs'] and norm(l['abs']) in P} for u, r in P.items()}
start = 'https://blog.123greetings.com/'
depth = {start: 0}; q = [start]
while q:
    u = q.pop(0)
    for v in G.get(u, ()):
        if v not in depth: depth[v] = depth[u] + 1; q.append(v)
C = content()
unreach = [u for u in P if u not in depth]
print('reachable from home by following links:', len(depth), 'of', len(P))
print('unreachable by type', Counter(P[u]['type'] for u in unreach))
print('unreachable content pages:', [u for u in unreach if P[u]['type'] in ('page', 'post')])
dc = Counter(depth[u] for u in C if u in depth)
print('click depth of content pages', sorted(dc.items()))
print('posts depth', Counter(depth.get(u) for u, r in C.items() if r['type'] == 'post'))
deep = sorted(((depth[u], u) for u in C if u in depth and depth[u] >= 4), reverse=True)
print('depth>=4:', len(deep), deep[:15])
# path to a post
import itertools
def path(t):
    prev = {start: None}; q = [start]
    while q:
        u = q.pop(0)
        if u == t: break
        for v in G.get(u, ()):
            if v not in prev: prev[v] = u; q.append(v)
    p = [t]
    while prev.get(p[-1]): p.append(prev[p[-1]])
    return p[::-1]
print(path('https://blog.123greetings.com/five-minutes-with-bob-27th-july/'))
print(path('https://blog.123greetings.com/birthday-messages-for-aquarius/'))
