import requests, time, sys, os, re, json
S=requests.Session()
S.headers['User-Agent']='Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36'
paths=sys.argv[1:]
out={}
for p in paths:
    url=p if p.startswith('http') else 'https://blog.123greetings.com'+p
    for attempt in range(3):
        r=S.get(url,allow_redirects=True,timeout=40)
        if r.status_code!=429: break
        time.sleep(20)
    fn='html/'+re.sub(r'[^A-Za-z0-9._-]+','_',url.replace('https://',''))[:150]+'.html'
    open(fn,'w').write(r.text)
    out[url]={'status':r.status_code,'final':r.url,'hist':[(h.status_code,h.headers.get('location')) for h in r.history],'file':fn,'xrobots':r.headers.get('x-robots-tag'),'len':len(r.text)}
    print(url, out[url]['status'], out[url]['final'], out[url]['hist'], out[url]['xrobots'], len(r.text), flush=True)
    time.sleep(2)
