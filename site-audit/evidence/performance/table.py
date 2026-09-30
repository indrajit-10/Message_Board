import json,sys,os
from urllib.parse import urlparse
rows=[]
for f in sys.argv[1:]:
    if not os.path.exists(f): continue
    r=json.load(open(f)); a=r['audits']
    if r.get('runtimeError'): print(f,'ERROR',r['runtimeError']['code']); continue
    items=a['network-requests']['details']['items']
    rc=sum(i.get('transferSize',0) for i in items if 'recaptcha' in i['url'] or ('fonts.gstatic.com/s/roboto' in i['url']))
    tp=sum(i.get('transferSize',0) for i in items if urlparse(i['url']).netloc not in ('blog.123greetings.com','i0.wp.com','i1.wp.com','i2.wp.com'))
    rb=a['render-blocking-resources']['details']['items']
    print(f"{f:34s} score={round(r['categories']['performance']['score']*100):3d} FCP={a['first-contentful-paint']['numericValue']/1000:4.1f}s LCP={a['largest-contentful-paint']['numericValue']/1000:4.1f}s TBT={a['total-blocking-time']['numericValue']:5.0f}ms CLS={a['cumulative-layout-shift']['numericValue']:.3f} SI={a['speed-index']['numericValue']/1000:4.1f}s TTI={a['interactive']['numericValue']/1000:4.1f}s srvResp={a['server-response-time']['numericValue']:5.0f}ms reqs={len(items):3d} KiB={a['total-byte-weight']['numericValue']/1024:5.0f} 3p={tp/1024:5.0f} recaptcha={rc/1024:4.0f} DOM={a['dom-size']['numericValue']:4.0f} renderBlocking={len(rb)} ({a['render-blocking-resources']['metricSavings']['FCP'] if 'metricSavings' in a['render-blocking-resources'] else a['render-blocking-resources'].get('numericValue')}ms) mainThread={a['mainthread-work-breakdown']['numericValue']/1000:.1f}s")
