from fetch import get
import json,re
B='https://blog.123greetings.com'
urls=[('https://123greetings.com/ads.txt',True),('http://blog.123greetings.com/',False),('https://blog123greetings.wordpress.com/',False),
 (B+'/wp-json/oembed/1.0/embed?url=https%3A%2F%2Fblog.123greetings.com%2Fbirthday-messages-for-mom%2F',True),
 (B+'/manifest.json',True),(B+'/site.webmanifest',True),(B+'/favicon.ico',False),(B+'/apple-touch-icon.png',False),
 (B+'/?s=%3Cb%3Eaudittest%3C%2Fb%3E%22%27',True),(B+'/2026/08/',True),(B+'/2026/',True),
 (B+'/birthday-messages-for-mom/2/',False),(B+'/birthday-messages-for-mom/?replytocom=1',True),
 (B+'/wp-content/uploads/',True),(B+'/wp-content/debug.log',True),(B+'/privacy-policy/',True),(B+'/wp-sitemap.xml',False)]
for u,ar in urls:
    d=get(u, allow_redirects=ar)
    h={k.lower():v for k,v in d['headers'].items()}
    t=d['text'] or ''
    title=re.search(r'<title>(.*?)</title>',t,re.S)
    rob=re.search(r'<meta name=.robots. content=.([^"\']*)',t)
    can=re.search(r'<link rel=.canonical. href=.([^"\']*)',t)
    print('==',u,d['status'],d['hist'],'final=',d['final'],d['ct'],d['len'],'loc=',h.get('location'),'xrobots=',h.get('x-robots-tag'))
    print('    title=',title.group(1)[:100] if title else None,'| robots=',rob.group(1) if rob else None,'| canon=',can.group(1) if can else None)
    if 'json' in d['ct'] or 'text/plain' in d['ct']: print('   ',t[:400])
