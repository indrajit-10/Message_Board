import sys, time, requests, os, re, json
OUT='/home/user/Message_Board/site-audit/agent-work/verify-content-strategy/html'
s=requests.Session()
s.headers['User-Agent']='Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36 audit-verify'
res={}
for u in sys.argv[1:]:
    if not u.startswith('http'): u='https://blog.123greetings.com'+u
    try:
        r=s.get(u,timeout=30,allow_redirects=True)
        name=re.sub(r'[^a-z0-9]+','_',u.split('//',1)[1].lower()).strip('_')[:120]+'.html'
        open(os.path.join(OUT,name),'w').write(r.text)
        print(r.status_code, u, '->', r.url, [h.status_code for h in r.history], len(r.content), name, flush=True)
    except Exception as e:
        print('ERR',u,e, flush=True)
    time.sleep(1.2)
