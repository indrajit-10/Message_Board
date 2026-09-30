import json,sys
for f in sys.argv[1:]:
    r=json.load(open(f))
    a=r['audits']
    print('=====',f, r.get('finalDisplayedUrl'), 'runtimeError' , r.get('runtimeError'), 'warnings', r.get('runWarnings'))
    print('perf score', r['categories']['performance']['score'], 'formFactor', r['configSettings']['formFactor'], 'throttling', r['configSettings']['throttlingMethod'])
    for k in ['first-contentful-paint','largest-contentful-paint','total-blocking-time','cumulative-layout-shift','speed-index','interactive','server-response-time','dom-size','total-byte-weight','network-requests','mainthread-work-breakdown','bootup-time','render-blocking-resources','unused-javascript','unused-css-rules','uses-responsive-images','offscreen-images','modern-image-formats','uses-optimized-images','font-display','third-party-summary','largest-contentful-paint-element','lcp-lazy-loaded','prioritize-lcp-image','uses-long-cache-ttl','unsized-images','legacy-javascript','duplicated-javascript','uses-text-compression','unminified-css','unminified-javascript','layout-shifts','long-tasks','redirects','efficient-animated-content','uses-rel-preconnect','critical-request-chains','viewport','non-composited-animations']:
        x=a.get(k)
        if not x: continue
        print(f"{k:35s} score={x.get('score')} {x.get('displayValue','')} nv={x.get('numericValue')}")
