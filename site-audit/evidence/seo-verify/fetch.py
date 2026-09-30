import requests, time, hashlib, os, json, sys
S=requests.Session()
S.headers['User-Agent']='Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36 audit-verify'
CD='/home/user/Message_Board/site-audit/agent-work/seo-verify/cache'
os.makedirs(CD,exist_ok=True)
_last=[0]
def get(url, allow_redirects=True, cache=True, method='GET'):
    k=hashlib.md5((method+url+str(allow_redirects)).encode()).hexdigest()
    f=os.path.join(CD,k+'.json')
    if cache and os.path.exists(f):
        return json.load(open(f))
    dt=time.time()-_last[0]
    if dt<1.5: time.sleep(1.5-dt)
    for i in range(4):
        r=S.request(method,url,allow_redirects=allow_redirects,timeout=30)
        _last[0]=time.time()
        if r.status_code==429:
            time.sleep(10*(i+1)); continue
        break
    d={'url':url,'status':r.status_code,'final':r.url,'hist':[(h.status_code,h.headers.get('location')) for h in r.history],'headers':dict(r.headers),'text':r.text if 'text' in r.headers.get('content-type','') or 'json' in r.headers.get('content-type','') or 'xml' in r.headers.get('content-type','') else '', 'len':len(r.content)}
    json.dump(d,open(f,'w'))
    return d
