import requests, time, json, os
BASE='https://blog.123greetings.com'
PAGES={'home':'/','birthday':'/birthday-messages/','mom':'/birthday-messages-for-mom/','angel':'/be-an-angel-day-messages/',
'sympathy':'/sympathy-condolences-messages/','post':'/mothers-day-messages-for-wife-what-she-actually-wants/','archive':'/archive/',
'tag':'/tag/alps/','contact':'/contact-us/','404':'/this-page-does-not-exist-a11y-check/'}
s=requests.Session(); s.headers['User-Agent']='Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36 a11y-audit'
out={}
for k,p in PAGES.items():
    for attempt in range(4):
        r=s.get(BASE+p,timeout=60)
        if r.status_code!=429: break
        time.sleep(20)
    open(f'html/{k}.html','w').write(r.text)
    out[k]={'path':p,'status':r.status_code,'bytes':len(r.text)}
    print(k,r.status_code,len(r.text))
    time.sleep(2.5)
json.dump(out,open('html/index.json','w'),indent=1)
