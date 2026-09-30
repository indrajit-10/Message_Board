import json, re, collections
BASE = 'https://blog.123greetings.com'
p = json.load(open('/home/user/Message_Board/site-audit/data/pages.json'))

def rel(u):
    return u.replace(BASE, '') if u and u.startswith(BASE) else u

def norm(u):
    if not u:
        return None
    u = u.split('#')[0].split('?')[0]
    u = u.replace('http://blog.123greetings.com', BASE)
    if u.startswith(BASE) and not u.endswith('/'):
        u += '/'
    return u

content = {u: r for u, r in p.items() if r['type'] in ('page', 'post') and u.startswith('https://') and r['status'] == 200}

# in-main inbound links from any crawled page (content+tag+category), by source type
inb = collections.defaultdict(set)
inb_nav = collections.defaultdict(set)
for u, r in p.items():
    if r['status'] != 200:
        continue
    src = norm(u)
    for l in r.get('links') or []:
        t = norm(l.get('abs'))
        if not t or not t.startswith(BASE) or t == src:
            continue
        if l.get('in_main'):
            inb[t].add(src)
        else:
            inb_nav[t].add(src)

hubs = ['/', '/what-to-write-in-a-card/', '/birthday-messages/', '/anniversary-messages/', '/wedding-messages/', '/friendship-messages/', '/thankyou-messages/', '/inspiration-messages/']
rows = []
for u, r in sorted(content.items()):
    if r['type'] != 'page':
        continue
    srcs = sorted(rel(s) for s in inb.get(u, set()))
    nav = len(inb_nav.get(u, set()))
    rows.append((rel(u), len(srcs), srcs, nav))
rows.sort(key=lambda x: (x[1], x[0]))
print('== pages by in-content inbound link count (from any crawled URL) ==')
cnt = collections.Counter(min(x[1], 5) for x in rows)
print(cnt)
for x in rows:
    if x[1] <= 1:
        print(x[0], x[1], x[2], 'nav:', x[3])

# which page is the only source
only = collections.Counter(x[2][0] for x in rows if x[1] == 1)
print('sole sources:', only)

# posts: links from posts to own message pages
print('\n== posts: in-main links ==')
for u, r in sorted(content.items()):
    if r['type'] != 'post':
        continue
    ml = [l for l in r['links'] if l['in_main']]
    own = sorted(set(rel(norm(l['abs'])) for l in ml if l['abs'] and norm(l['abs']).startswith(BASE) and '/tag/' not in l['abs'] and '/category/' not in l['abs'] and '/author/' not in l['abs']))
    ec = sorted(set(l['abs'] for l in ml if l['abs'] and 'www.123greetings.com' in l['abs']))
    tags = sorted(set(rel(norm(l['abs'])) for l in r['links'] if l['abs'] and '/tag/' in l['abs']))
    print(rel(u), '| own:', own, '| ecards:', len(ec), ec[:6], '| tags:', tags)
