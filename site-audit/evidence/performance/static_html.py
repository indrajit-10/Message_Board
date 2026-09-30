# Static analysis of saved raw HTML (from the UX agent's fetch) - no network.
import re,sys,glob,json,os
from bs4 import BeautifulSoup
files=[f for f in glob.glob('/home/user/Message_Board/site-audit/agent-work/ux/html/*.html')]+['/home/user/Message_Board/site-audit/agent-work/ux/home.html','/home/user/Message_Board/site-audit/agent-work/ux/mom.html']
rows=[]
for f in files:
    h=open(f,encoding='utf-8',errors='replace').read()
    s=BeautifulSoup(h,'lxml')
    scripts=s.find_all('script')
    ext=[x for x in scripts if x.get('src')]
    inline=[x for x in scripts if not x.get('src')]
    head=s.head
    head_sync=[x['src'] for x in head.find_all('script',src=True) if not x.has_attr('async') and not x.has_attr('defer') and x.get('type','text/javascript') in ('text/javascript','','application/javascript')] if head else []
    css=s.find_all('link',rel=lambda v: v and 'stylesheet' in v)
    styles=s.find_all('style')
    inline_css=sum(len(x.get_text()) for x in styles)
    inline_js=sum(len(x.get_text()) for x in inline)
    json_ld=sum(len(x.get_text()) for x in inline if x.get('type')=='application/ld+json')
    svg=sum(len(str(x)) for x in s.find_all('svg'))
    rc=[x['src'] for x in ext if 'recaptcha' in x['src']]
    cf7=[x['src'] for x in ext if 'contact-form-7' in x['src']]+[x.get('href') for x in css if 'contact-form-7' in x.get('href','')]
    gpt=[x['src'] for x in ext if 'gpt' in x['src'] or 'doubleclick' in x['src']]
    tr=[x['src'] for x in ext if 'truereach' in x['src'] or 'cdn77' in x['src']]
    gtm=[x['src'] for x in ext if 'googletagmanager' in x['src']]
    pre=[(l.get('rel'),l.get('href','')[:100],l.get('as')) for l in s.find_all('link') if l.get('rel') and set(l.get('rel'))&{'preload','preconnect','dns-prefetch'}]
    imgs=s.find_all('img')
    rows.append(dict(f=os.path.basename(f),bytes=len(h.encode()),scripts_ext=len(ext),scripts_inline=len(inline),inline_js=inline_js,json_ld=json_ld,css_links=len(css),style_tags=len(styles),inline_css=inline_css,svg=svg,head_sync=head_sync,recaptcha=rc,cf7=cf7,gpt=gpt,truereach=tr,gtm=gtm,preloads=pre,imgs=len(imgs),
        imgs_lazy=sum(1 for i in imgs if i.get('loading')=='lazy'), imgs_nowh=sum(1 for i in imgs if not i.get('width') or not i.get('height')), comments=len(re.findall(r'<!--',h)), wpcf7_form=bool(s.select('.wpcf7'))))
json.dump(rows,open('static_html.json','w'),indent=1)
import statistics as st
print('files',len(rows))
for k in ['bytes','scripts_ext','scripts_inline','inline_js','json_ld','css_links','style_tags','inline_css','svg','imgs','imgs_nowh']:
    v=[r[k] for r in rows]; print(f'{k:15s} min {min(v)} med {st.median(v)} max {max(v)}')
print('with recaptcha', sum(1 for r in rows if r['recaptcha']), 'with cf7 assets', sum(1 for r in rows if r['cf7']), 'with cf7 form', sum(1 for r in rows if r['wpcf7_form']), 'gpt', sum(1 for r in rows if r['gpt']), 'truereach', sum(1 for r in rows if r['truereach']),'gtm',sum(1 for r in rows if r['gtm']))
r=[x for x in rows if x['f']=='home.html'][0]
print(json.dumps({k:r[k] for k in ['head_sync','recaptcha','cf7','gpt','truereach','gtm','preloads']},indent=0)[:3000])
r=[x for x in rows if x['f']=='mothers_day_messages.html'][0]
print(json.dumps({k:r[k] for k in ['head_sync','recaptcha','cf7','gpt','truereach','gtm','preloads']},indent=0)[:3000])
