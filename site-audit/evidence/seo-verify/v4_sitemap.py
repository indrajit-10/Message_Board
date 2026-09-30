import sys; sys.path.insert(0,'agent-work/seo-verify')
from fetch import get
import re, json
from collections import Counter
idx=get('https://blog.123greetings.com/sitemap_index.xml')
print(idx['status'], idx['headers'].get('content-type'))
subs=re.findall(r'<loc>(.*?)</loc>',idx['text'])
print(subs)
allu={}
imgs=Counter()
for s in subs:
    d=get(s)
    locs=re.findall(r'<url>\s*<loc>(.*?)</loc>',d['text'])
    il=re.findall(r'<image:loc>(.*?)</image:loc>',d['text'])
    print(s.split('/')[-1], d['status'], len(locs), 'images',len(il))
    for i in il: imgs[(s.split('/')[-1],i.split('/')[-1])]+=1
    for l in locs: allu[l]=s.split('/')[-1]
print('total',len(allu))
print(imgs.most_common(5))
json.dump(allu,open('agent-work/seo-verify/sitemap_urls.json','w'))
P=json.load(open('data/pages.json'))
missing=[u for u in allu if u not in P]
print('in sitemap not in crawl',missing[:10])
idxable=[u for u,r in P.items() if r['status']==200 and not r.get('redirects') and 'noindex' not in (r.get('robots') or '') and r['type'] in ('page','post')]
print('indexable page/post not in sitemap',[u for u in idxable if u not in allu])
print('noindex in sitemap',[u for u in allu if 'noindex' in (P.get(u,{}).get('robots') or '')])
for u in ['https://blog.123greetings.com/penci-block/footer/','https://blog.123greetings.com/penci-block/mega-menu/','https://blog.123greetings.com/upcoming-events/']:
    r=P[u]; print(u,r['robots'],r['canonical'],r['h1_all'],r['word_count'],r['og'].get('og:description'),r['schema_types'])
