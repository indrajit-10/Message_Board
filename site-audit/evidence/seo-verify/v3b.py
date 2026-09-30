import sys; sys.path.insert(0,'agent-work/seo-verify')
from fetch import get
import re
from bs4 import BeautifulSoup
for s in ['easter-messages','birthday-messages-for-mom','engagement-messages','birthday-messages-for-wife']:
    d=get('https://blog.123greetings.com/'+s+'/')
    so=BeautifulSoup(d['text'],'lxml')
    t=so.title.get_text()
    md=so.find('meta',attrs={'name':'description'})
    main=so.select_one('.elementor[data-elementor-type=wp-page]')
    # drop hidden-everywhere sections
    for el in main.select('.elementor-hidden-desktop.elementor-hidden-tablet.elementor-hidden-mobile'): el.decompose()
    txt=main.get_text(' ',strip=True)
    q=re.findall(r'“([^”]{15,})”',txt)
    print(s,'|',t,'|',md['content'] if md else None,'| msgs',len(q),'words',len(txt.split()))
