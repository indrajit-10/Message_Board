import requests, time, hashlib, os, json
S=requests.Session()
S.headers['User-Agent']='Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36'
CD='/home/user/Message_Board/site-audit/agent-work/completeness/cache'
_last=[0]
def get(url, allow_redirects=True, cache=True, method='GET', headers=None, gap=2.0):
    k=hashlib.md5((method+url+str(allow_redirects)+json.dumps(headers or {})).encode()).hexdigest()
    f=os.path.join(CD,k+'.json')
    if cache and os.path.exists(f):
        return json.load(open(f))
    dt=time.time()-_last[0]
    if dt<gap: time.sleep(gap-dt)
    for i in range(3):
        r=S.request(method,url,allow_redirects=allow_redirects,timeout=40,headers=headers or {})
        _last[0]=time.time()
        if r.status_code==429:
            time.sleep(15*(i+1)); continue
        break
    ct=r.headers.get('content-type','')
    d={'url':url,'status':r.status_code,'final':r.url,'hist':[(h.status_code,h.headers.get('location')) for h in r.history],'headers':dict(r.headers),'text':r.text if any(x in ct for x in ('text','json','xml','javascript')) else '', 'len':len(r.content),'ct':ct}
    json.dump(d,open(f,'w'))
    return d
