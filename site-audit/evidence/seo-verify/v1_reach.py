import json, re
from collections import Counter, deque
from urllib.parse import urlsplit, urlunsplit
P=json.load(open('data/pages.json'))
def norm(u):
    if not u: return None
    s=urlsplit(u)
    if 'blog.123greetings.com' not in s.netloc: return None
    path=s.path or '/'
    if not path.endswith('/') and '.' not in path.split('/')[-1]: path+='/'
    return 'https://blog.123greetings.com'+path
keys={}
for u,r in P.items():
    keys[norm(u)]=u
    if r.get('final_url'): keys.setdefault(norm(r['final_url']),u)
home='https://blog.123greetings.com/'
seen={home}; dq=deque([home])
while dq:
    u=dq.popleft()
    r=P.get(keys.get(u,u))
    if not r: continue
    for l in r.get('links',[]):
        n=norm(l.get('abs'))
        if n and n in keys and n not in seen:
            seen.add(n); dq.append(n)
canon={norm(r.get('final_url') or u) for u,r in P.items() if r['status']==200}
print('canonical pages',len(canon),'reached',len(seen&canon))
unr=canon-seen
t=Counter()
for u in unr:
    r=P[keys[u]]; t[r['type']]+=1
print(t)
print(sorted(u for u in unr if P[keys[u]]['type'] in('page','other')))
# home links
hr=P[home]
hl=[l for l in hr['links']]
print('home links',len(hl), len({l['abs'] for l in hl}))
posts={u for u,r in P.items() if r['type']=='post'}
print('home->posts',[l['abs'] for l in hl if norm(l['abs']) in posts])
print([ (l['abs'],l['text']) for l in hl if norm(l['abs']) and ('/category/' in l['abs'] or '/tag/' in l['abs'] or '/author/' in l['abs'] or 'archive' in l['abs'])])
# who links to posts
inl=Counter()
for u,r in P.items():
    for l in r.get('links',[]):
        n=norm(l.get('abs'))
        if n in posts and P[u]['type']!='post':
            inl[(P[u]['type'])]+=1
print('non-post->post links by source type',inl)
# pages linking to posts
src=set()
for u,r in P.items():
    if r['type'] in ('page',):
        for l in r.get('links',[]):
            n=norm(l.get('abs'))
            if n in posts: src.add(u)
print('pages linking to posts',src)
# archive inlinks
for t in ['https://blog.123greetings.com/archive/','https://blog.123greetings.com/category/123greetings/','https://blog.123greetings.com/upcoming-events/','https://blog.123greetings.com/at-work-messages/']:
    print(t, P.get(t,{}).get('inlinks'))
