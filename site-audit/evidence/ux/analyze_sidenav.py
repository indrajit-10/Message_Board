import json
from bs4 import BeautifulSoup
idx=json.load(open('agent-work/ux/html/index.json'))
def hidden_classes(el):
    hs=set()
    for a in [el]+list(el.parents):
        if not hasattr(a,'get'): continue
        for c in a.get('class') or []:
            if c.startswith('elementor-hidden-'): hs.add(c.replace('elementor-hidden-',''))
    return hs
res={}
for u,fn in idx.items():
    s=BeautifulSoup(open(fn).read(),'lxml')
    main=s.select_one('.elementor[data-elementor-type=wp-page]') or s
    ids={e.get('id') for e in s.find_all(id=True)}
    lists=main.select('.elementor-widget-penci-advanced-list')
    navs=[]
    for w in lists:
        hc=hidden_classes(w)
        items=[]
        for a in w.select('a'):
            h=a.get('href')
            t=a.get_text(' ',strip=True)
            tgt=None
            if h and h.startswith('#') and len(h)>1:
                tgt=h[1:]
                exists=tgt in ids
                th=sorted(hidden_classes(s.find(id=tgt))) if exists else None
            else:
                exists=None; th=None
            items.append((t,h,exists,sorted(th) if th else th))
        navs.append({'hidden':sorted(hc),'items':items})
    h1s=[(h.get_text(' ',strip=True)[:50],sorted(hidden_classes(h))) for h in s.find_all('h1')]
    empties=[]
    for p in main.find_all('p'):
        if p.get_text(strip=True) in ('“”','""'):
            empties.append(sorted(hidden_classes(p)))
    res[u]={'navs':navs,'h1':h1s,'empty':empties}
    short=u.split('.com')[1]
    print('==',short)
    for n in navs:
        vis = 'HIDDEN('+','.join(n['hidden'])+')' if n['hidden'] else 'visible'
        bad=[i for i in n['items'] if i[1] and i[1].startswith('#') and (i[1]=='#' or not i[2])]
        hid_t=[i for i in n['items'] if i[3]]
        print('   nav',vis,'items',len(n['items']),'bad',[(i[0],i[1]) for i in bad],'targets-hidden',[(i[0],i[1],i[3]) for i in hid_t])
        if len(n['items'])<=3: print('     ',n['items'])
    print('   h1',h1s)
    print('   empty “” blocks', empties)
json.dump(res,open('agent-work/ux/sidenav_analysis.json','w'),indent=1)
