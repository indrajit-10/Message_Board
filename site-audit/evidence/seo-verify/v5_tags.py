import sys; sys.path.insert(0,'agent-work/seo-verify')
from fetch import get
import re, json
from bs4 import BeautifulSoup
T=json.load(open('data/tags.json'))
zero=[t['slug'] for t in T if t['count']==0]
for s in ['12-dates-in-1-day', zero[300], zero[600]]:
    d=get('https://blog.123greetings.com/tag/'+s+'/')
    so=BeautifulSoup(d['text'],'lxml')
    rb=so.find('meta',attrs={'name':'robots'}); cn=so.find('link',rel='canonical')
    ec=so.select_one('.penci-wrapper-posts-content, #main, .penci-archive__list_posts')
    print(s,d['status'],rb['content'] if rb else None, cn['href'] if cn else None, so.title.get_text()[:60])
    body=so.select_one('#main') or so.body
    h1=[h.get_text(' ',strip=True) for h in so.find_all('h1')]
    print('  h1',h1, 'no posts text?', 'Sorry' in d['text'] or 'nothing' in d['text'].lower()[:0])
