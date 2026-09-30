from common import *
import html
out = {}
C = {u: r for u, r in P.items()}
# length stats
long_ = [(len(r['title']), r['type'], u, r['title']) for u, r in C.items() if len(r['title']) > 60]
print('titles >60:', len(long_), Counter(x[1] for x in long_))
# exclude suffix: which would still be >60 without suffix
def core(t): return t[:-len(SUFFIX)] if t.endswith(SUFFIX) else t
still = [(len(r['title']), r['type'], u, r['title']) for u, r in C.items() if len(r['title']) > 60 and not r['title'].endswith(SUFFIX)]
print('>60 without the suffix:', len(still))
for x in sorted(still, reverse=True): print('  ', x)
# pages (type page) with suffix
for u, r in C.items():
    if r['type'] in ('page','post','other') and r['title'].endswith(SUFFIX): pass
print('page-type with suffix:', [(u, r['title']) for u, r in C.items() if r['type']=='page' and r['title'].endswith(SUFFIX)])
print('post-type with suffix count', sum(1 for r in C.values() if r['type']=='post' and r['title'].endswith(SUFFIX)))
# duplicates
d = defaultdict(list)
for u, r in C.items(): d[r['title'].strip().lower()].append(u)
dups = {t: us for t, us in d.items() if len(us) > 1}
print('\nduplicate titles:', len(dups), 'groups;', sum(len(v) for v in dups.values()), 'urls')
for t, us in dups.items(): print(' ', repr(t[:100]), len(us)); [print('     ', u) for u in us]
# duplicate core titles (without suffix)
d2 = defaultdict(list)
for u, r in C.items():
    if r['type'] in ('page','post'): d2[core(r['title']).strip().lower()].append(u)
print('\ndup core titles (content):', {t: us for t, us in d2.items() if len(us) > 1 and t not in dups})
# leftovers
bad = re.compile(r'meta title|lorem|untitled|\bcopy\b|draft|TBD|\{|\}|%%|\s{2,}|\s[,.!?:;]|&amp;|&#', re.I)
print('\nleftover/formatting issues:')
for u, r in C.items():
    t = r['title']
    if bad.search(t): print('  ', repr(t), u)
# separators
seps = Counter()
for u, r in C.items():
    if r['type'] not in ('page','post'): continue
    t = core(r['title'])
    for s in [' | ', ' — ', ' – ', ' - ', ': ']:
        if s in t: seps[s] += 1
print('\nseparators in content titles', seps)
brand = Counter()
for u, r in C.items():
    if r['type'] not in ('page','post'): continue
    t = r['title']
    if t.endswith(SUFFIX): brand['long suffix'] += 1
    elif '123greetings' in t.lower(): brand['other brand form: ' + t[t.lower().find('123greetings')-3:]] += 1
    else: brand['no brand'] += 1
print('brand', brand)
# short titles
print('\ntitles <30:', [(len(r['title']), r['title'], u) for u, r in C.items() if len(r['title']) < 30])
# title vs H1 mismatch on content pages
