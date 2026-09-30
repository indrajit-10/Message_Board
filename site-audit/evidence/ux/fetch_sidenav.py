import json, time, requests, os, re, random
from bs4 import BeautifulSoup
p=json.load(open('data/pages.json'))
pages={u:r for u,r in p.items() if r.get('type') in ('page','post')}
hubs=[u for u,r in pages.items() if len(r.get('side_nav') or [])>2]
two=[u for u,r in pages.items() if len(r.get('side_nav') or [])==2]
random.seed(7)
sample=sorted(random.sample(two,14))
for must in ['https://blog.123greetings.com/be-an-angel-day-messages/','https://blog.123greetings.com/national-tap-dance-day-messages/','https://blog.123greetings.com/thank-you-messages/','https://blog.123greetings.com/at-work-messages/']:
    if must not in sample: sample.append(must)
targets=hubs+sample
H={'User-Agent':'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36'}
out={}
for u in targets:
    fn='agent-work/ux/html/'+re.sub(r'[^a-z0-9]+','_',u.split('.com')[1]).strip('_')+'.html'
    if not os.path.exists(fn):
        r=requests.get(u,headers=H,timeout=30)
        open(fn,'w').write(r.text)
        print(r.status_code,u,flush=True)
        time.sleep(1.5)
    out[u]=fn
json.dump(out,open('agent-work/ux/html/index.json','w'),indent=1)
