from bs4 import BeautifulSoup
import re, json, collections
for k in ['home','mom','post','contact','404','tag','archive','birthday','angel','sympathy']:
    h=open(f'html/{k}.html').read()
    s=BeautifulSoup(h,'lxml')
    print('=====',k)
    print(' html lang:', s.html.get('lang'), '| viewport:', [m.get('content') for m in s.find_all('meta',attrs={'name':'viewport'})])
    print(' title:', s.title.string if s.title else None)
    # skip links
    sk=[(a.get('href'),a.get_text(' ',strip=True)[:40],a.get('class')) for a in s.find_all('a') if (a.get('href') or '').startswith('#') and re.search(r'skip|content|main',(a.get_text()+' '+' '.join(a.get('class') or [])),re.I)]
    print(' skip-ish links:', sk[:5])
    # landmarks
    lm=collections.Counter()
    for t in ['main','nav','header','footer','aside']:
        lm[t]=len(s.find_all(t))
    for role in ['main','navigation','banner','contentinfo','complementary','search','region']:
        lm['role='+role]=len(s.find_all(attrs={'role':role}))
    print(' landmarks:', dict(lm))
    for n in s.find_all('nav'): print('   nav:', n.get('id'), n.get('class'), n.get('aria-label'), n.get('role'))
    for n in s.find_all(['main']) + s.find_all(attrs={'role':'main'}): print('   main:', n.name, n.get('id'), n.get('class'))
    # id dups
    ids=collections.Counter(t.get('id') for t in s.find_all(attrs={'id':True}))
    d={i:c for i,c in ids.items() if c>1}
    print(' dup ids:', len(d), sorted(d.items(), key=lambda x:-x[1])[:15])
    # headings
    hs=[(t.name, t.get_text(' ',strip=True)[:60]) for t in s.find_all(re.compile('^h[1-6]$'))]
    print(' headings count', len(hs), 'h1s:', [x for x in hs if x[0]=='h1'])
    print(' heading seq:', ' '.join(x[0][1] for x in hs)[:300])
    empty_h=[x for x in hs if not x[1]]
    print(' empty headings:', len(empty_h))
    # images
    imgs=s.find_all('img')
    alts=collections.Counter(i.get('alt') for i in imgs)
    print(' imgs', len(imgs), 'no-alt-attr', sum(1 for i in imgs if i.get('alt') is None), 'top alts', alts.most_common(6))
    # links with no text
    empty=[]
    for a in s.find_all('a', href=True):
        txt=a.get_text(' ',strip=True)
        lab=a.get('aria-label') or a.get('title')
        imgalt=' '.join((i.get('alt') or '') for i in a.find_all('img'))
        svgt=' '.join(t.get_text() for t in a.find_all('title'))
        if not (txt or lab or imgalt.strip() or svgt.strip()):
            empty.append((a.get('href')[:70], ' '.join(a.get('class') or [])[:50]))
    print(' links without accessible name:', len(empty), collections.Counter(empty).most_common(12))
    rm=collections.Counter(a.get_text(' ',strip=True) for a in s.find_all('a') if re.fullmatch(r'(read more|more|click here|here|continue reading|view all|see all|learn more)',a.get_text(' ',strip=True),re.I))
    print(' generic link text:', rm)
    # buttons without name
    eb=[]
    for b in s.find_all(['button']):
        if not (b.get_text(strip=True) or b.get('aria-label') or b.get('title')):
            eb.append(' '.join(b.get('class') or [])[:60] or b.get('id'))
    print(' buttons without name:', len(eb), collections.Counter(eb).most_common(6))
    ifr=[(i.get('src','')[:60], i.get('title')) for i in s.find_all('iframe')]
    print(' iframes:', ifr)
