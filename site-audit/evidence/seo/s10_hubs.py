from common import *
from s9_inlinks import inl_all, inl_content, norm, C
src = Counter()
for u, r in C.items():
    if len(inl_content[u]) == 1: src[next(iter(inl_content[u]))] += 1
print('sole content inlink source for 1-inlink pages:', src.most_common(10))
def outlinks(u):
    return {norm(l['abs']) for l in P[u]['links'] if l['abs'] and norm(l['abs'])}
def outmain(u):
    return {norm(l['abs']) for l in P[u]['links'] if l['abs'] and norm(l['abs']) and l['in_main']}
hubs = ['https://blog.123greetings.com/birthday-messages/', 'https://blog.123greetings.com/anniversary-messages/', 'https://blog.123greetings.com/what-to-write-in-a-card/', 'https://blog.123greetings.com/', 'https://blog.123greetings.com/thankyou-messages/', 'https://blog.123greetings.com/friendship-messages/', 'https://blog.123greetings.com/inspiration-messages/', 'https://blog.123greetings.com/wedding-messages/', 'https://blog.123greetings.com/archive/', 'https://blog.123greetings.com/upcoming-events/']
pages = {u for u, r in C.items() if r['type'] == 'page'}
for h in hubs:
    o = outlinks(h) & set(P)
    print(f'\n{h}: links to {len(o & pages)} of {len(pages)} pages, {len(o & set(u for u,r in C.items() if r["type"]=="post"))} posts')
for h, pat in [('https://blog.123greetings.com/birthday-messages/', r'birthday'), ('https://blog.123greetings.com/anniversary-messages/', r'anniversary')]:
    kids = {u for u in pages if re.search(pat, u) and u != h}
    o = outlinks(h)
    miss = sorted(kids - o)
    print(f'\n{h}: {len(kids)} child pages with "{pat}" in URL; linked {len(kids & o)}; missing {len(miss)}')
    for m in miss: print('   ', m.replace('https://blog.123greetings.com', ''), len(inl_content[m]))
w = 'https://blog.123greetings.com/what-to-write-in-a-card/'
o = outlinks(w)
miss = sorted(pages - o - {w})
print(f'\n{w}: missing {len(miss)} pages')
for m in miss: print('   ', m.replace('https://blog.123greetings.com', ''), 'inlinks-content', len(inl_content[m]))
