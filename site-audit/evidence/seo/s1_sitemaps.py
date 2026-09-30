import json, re, sys
from collections import Counter, defaultdict
sys.path.insert(0, '.')
from fetch import fetch
P = json.load(open('../../data/pages.json'))
tags = json.load(open('../../data/tags.json'))
sm = {}
for k in ['post','page','penci-block','category','post_tag','author']:
    r = fetch(f'https://blog.123greetings.com/{k}-sitemap.xml')
    for loc, lm in re.findall(r'<url>\s*<loc>([^<]+)</loc>(?:\s*<lastmod>([^<]+)</lastmod>)?', r['text']):
        sm[loc] = (k, lm)
    imgs = re.findall(r'<image:loc>', r['text'])
    print(k, 'urls', sum(1 for v in sm.values() if v[0]==k), 'image:loc', len(imgs), 'CT', r['headers'].get('Content-Type'))
print('total sitemap urls', len(sm))
# sitemap urls not crawled / non-200 / noindex / canonical mismatch
for u,(k,lm) in sm.items():
    r = P.get(u)
    if not r: print('NOT CRAWLED', u); continue
    if r['status']!=200 or 'noindex' in (r.get('robots') or '') or (r.get('canonical') and r['canonical']!=u):
        print('SITEMAP PROBLEM', u, r['status'], r.get('robots'), r.get('canonical'))
# indexable crawled pages missing from sitemap
print('\n-- crawled 200 indexable pages not in sitemap --')
for u,r in P.items():
    if r['status']==200 and u not in sm and 'noindex' not in (r.get('robots') or ''):
        print(r['type'], u, 'redirects' if r.get('redirects') else '', 'canon=',r.get('canonical'))
# tags: sitemap tag entries vs tag counts
slug2 = {t['slug']:t for t in tags}
tag_sm = [u for u,(k,_) in sm.items() if k=='post_tag']
cnt = Counter()
for u in tag_sm:
    s = u.rstrip('/').rsplit('/',1)[-1]
    t = slug2.get(s)
    cnt[t['count'] if t else 'unknown'] += 1
print('\ntag sitemap entries by post count', sorted(cnt.items(), key=lambda x: str(x[0])))
print('tags with count>0', sum(1 for t in tags if t['count']>0))
nonzero = {t['slug'] for t in tags if t['count']>0}
insm = {u.rstrip('/').rsplit('/',1)[-1] for u in tag_sm}
print('nonzero tags missing from sitemap', sorted(nonzero-insm)[:20], 'sitemap tags with zero count', sorted(insm-nonzero)[:20])
json.dump(sm, open('sitemap_urls.json','w'))
