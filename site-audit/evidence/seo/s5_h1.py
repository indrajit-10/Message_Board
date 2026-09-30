from common import *
import unicodedata
def core(t): return t[:-len(SUFFIX)] if t.endswith(SUFFIX) else t
C = content()
print('content pages', len(C))
no_h1 = [u for u, r in C.items() if not r['h1_all']]
print('no h1:', no_h1)
multi = [(u, r['h1_all']) for u, r in C.items() if len(r['h1_all']) > 1]
print('multiple h1:', multi)
vis_multi = [(u, r['h1_visible']) for u, r in C.items() if len(r.get('h1_visible') or []) != len(r['h1_all'])]
print('h1 hidden differences:', vis_multi[:10])
d = defaultdict(list)
for u, r in C.items():
    for h in set(r['h1_all']): d[h.strip().lower()].append(u)
dups = {h: us for h, us in d.items() if len(us) > 1}
print('\nduplicate h1 groups', len(dups), 'urls', sum(len(v) for v in dups.values()))
for h, us in dups.items(): print('  ', repr(h), len(us), [x.replace('https://blog.123greetings.com', '') for x in us])
# archives
A = {u: r for u, r in P.items() if r['type'] in ('tag', 'category', 'author', 'other')}
print('\narchive no h1', [u for u, r in A.items() if not r['h1_all']])
print('archive multi', [(u, r['h1_all']) for u, r in A.items() if len(r['h1_all']) > 1])
# title vs h1 number mismatch
num = re.compile(r'(\d+)\+')
print('\nnumber mismatch between title / h1 / meta description:')
cnt = 0
for u, r in C.items():
    t = core(r['title']); h = ' '.join(r['h1_all']); m = r.get('meta_description') or ''
    nt, nh, nm = num.findall(t), num.findall(h), num.findall(m)
    if (nt and nh and nt[0] != nh[0]) or (nt and nm and nt[0] != nm[0]) or (nh and nm and nh[0] != nm[0]):
        cnt += 1
        print('  ', u.replace('https://blog.123greetings.com', ''), '| title', nt, '| h1', nh, '| desc', nm)
print('count', cnt)
