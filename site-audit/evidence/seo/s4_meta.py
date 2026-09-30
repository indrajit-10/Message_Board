from common import *
C = P
missing = [(r['type'], u) for u, r in C.items() if not r.get('meta_description')]
print('missing meta desc:', len(missing), Counter(t for t, _ in missing))
for t, u in missing:
    if t not in ('tag',): print('  ', t, u)
print('  tag examples', [u for t, u in missing if t == 'tag'][:10])
has = {u: r['meta_description'] for u, r in C.items() if r.get('meta_description')}
short = sorted((len(m), u, m) for u, m in has.items() if len(m) < 70)
long_ = sorted(((len(m), u, m) for u, m in has.items() if len(m) > 160), reverse=True)
print('\n<70:', len(short)); [print('  ', x) for x in short]
print('\n>160:', len(long_)); [print('  ', x[0], x[1], '|', x[2][:200]) for x in long_]
d = defaultdict(list)
for u, m in has.items(): d[m.strip().lower()].append(u)
print('\nduplicates:', [(m[:90], us) for m, us in d.items() if len(us) > 1])
print('\nspace-before-punct / double space / typos:')
pat = re.compile(r'\s[,.!?:;]|\s{2,}|\.\.(?!\.)|[a-z][.!?][A-Z]|&amp;|&#|\b(\w+) \1\b', re.I)
for u, m in has.items():
    for mm in pat.finditer(m):
        s = max(0, mm.start()-40); print('  ', u, '|', repr(m[s:mm.end()+30]))
# desc starting lowercase / not ending in punctuation / truncated with ellipsis
print('\nends with ellipsis or mid-word:', [(u, m[-40:]) for u, m in has.items() if m.endswith(('…', '...'))])
# meta description equals title?
print('\ndesc == title core:', [u for u, r in C.items() if r.get('meta_description') and r['meta_description'].strip().lower() in r['title'].lower()])
# og:description vs meta description mismatch
mm = [u for u, r in C.items() if r.get('meta_description') and r['og'].get('og:description') and r['og']['og:description'] != r['meta_description']]
print('\nog:description != meta description', len(mm), mm[:10])
