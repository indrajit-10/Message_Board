import sys; sys.path.insert(0,'agent-work/seo-verify')
from fetch import get
import re, json
P=json.load(open('data/pages.json'))
posts=[u for u,r in P.items() if r['type']=='post']
d=get('https://blog.123greetings.com/')
h=d['text']
print(d['status'], len(h))
hrefs=set(re.findall(r'href=["\']([^"\']+)',h))
print('unique hrefs',len(hrefs))
slugs=[u.rstrip('/').split('/')[-1] for u in posts]
print('post slug mentions', [s for s in slugs if s in h])
for pat in ['/archive/','/category/','/author/','/tag/','/upcoming-events','/at-work-messages']:
    print(pat, h.count(pat))
