from common import *
def core(t): return t[:-len(SUFFIX)] if t.endswith(SUFFIX) else t
C = content()
multi = {u: r for u, r in C.items() if len(r['h1_all']) > 1}
vis2 = {u: r['h1_visible'] for u, r in multi.items() if len(r['h1_visible']) > 1}
print('source multi-H1:', len(multi), '| of which extra H1 hidden on all breakpoints:', len(multi) - len(vis2), '| visible multi:', vis2)
comma = [u for u, r in C.items() if any(', for ' in h for h in r['h1_all'])]
print('H1 containing ", for":', len(comma))
# visible h1 only for comparisons
STOP = set('a an the and or for of to in on with your my i you & messages message wishes day'.split())
def toks(s): return {w for w in re.findall(r"[a-z0-9]+", s.lower().replace('’', "'")) if w not in STOP}
mis = []
for u, r in C.items():
    h = (r['h1_visible'] or r['h1_all'] or [''])[0]
    t = core(r['title'])
    th, tt = toks(h), toks(t)
    if th and len(th & tt) / len(th) < 0.5:
        mis.append((u, h, t))
print('\nH1 vs title low-overlap:', len(mis))
for x in mis: print('  ', x[0].replace('https://blog.123greetings.com', ''), '| H1:', repr(x[1]), '| T:', repr(x[2]))
# H1 casing style
lower_m = [u for u, r in C.items() if r['type'] == 'page' and any(re.search(r'\b(messages|birthday|anniversary)\b', h) and h[0].isupper() and re.search(r'^\S+ messages', h) for h in r['h1_visible'][:1])]
print('\nvisible H1 with lowercase "messages" (sentence case) :', len(lower_m))
titlecase = [u for u, r in C.items() if r['type']=='page' and r['h1_visible'] and ' Messages' in r['h1_visible'][0]]
print('visible H1 with " Messages":', len(titlecase))
odd = [(u, r['h1_visible'][0]) for u, r in C.items() if r['h1_visible'] and re.search(r'for (Sorry|Across)|than yesterday Day|Because day|Ice-cream', r['h1_visible'][0])]
print('odd H1s', odd)
# heading hierarchy: first heading in main after H1; skipped levels
print('\nheading hierarchy:')
skip = []
noh2 = []
for u, r in C.items():
    hs = [h for h in r['headings'] if not h[2]]
    levels = [int(h[0][1]) for h in hs]
    if not any(l == 2 for l in levels): noh2.append(u)
    prev = 1
    for l, h in zip(levels, hs):
        if l > prev + 1:
            skip.append((u, f'h{prev}->h{l}', h[1][:60])); break
        prev = l
print('pages with heading level skips:', len(skip))
for x in skip[:40]: print('  ', x)
print('content pages without any visible H2 in main:', len(noh2), noh2[:20])
