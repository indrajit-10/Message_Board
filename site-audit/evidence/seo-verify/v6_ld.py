import sys; sys.path.insert(0,'agent-work/seo-verify')
from fetch import get
import re, json
from bs4 import BeautifulSoup
urls=['https://blog.123greetings.com/','https://blog.123greetings.com/birthday-messages-for-mom/','https://blog.123greetings.com/13th-july-your-weekly-bobcast/','https://blog.123greetings.com/birthday-messages/']
for u in urls:
    d=get(u)
    so=BeautifulSoup(d['text'],'lxml')
    bl=so.find_all('script',type='application/ld+json')
    print('=====',u,len(bl))
    for b in bl:
        print('  class=',b.get('class'), 'len',len(b.string or ''))
        try:
            j=json.loads(b.string)
        except Exception as e:
            print('  PARSE ERR',e); print(b.string[:300]); continue
        s=json.dumps(j,ensure_ascii=False)
        print('  ',s[:1500])
