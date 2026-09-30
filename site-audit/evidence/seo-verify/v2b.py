import sys; sys.path.insert(0,'agent-work/seo-verify')
from fetch import get
import re, json
from bs4 import BeautifulSoup
from collections import Counter
dead=['https://www.123greetings.com/blog/what-to-write-in-a-card','https://www.123greetings.com/events/sorry/','https://www.123greetings.com/events/thank_you/','https://www.123greetings.com/events/congratulations/','https://www.123greetings.com/events/national_vanilla_pudding_day/https://www.123greetings.com/events/national_vanilla_pudding_day/','https://www.123greetings.com/family/father/','https://www.123greetings.com/events/honey-month/']
pages=["https://blog.123greetings.com/mothers-day-messages-for-wife-what-she-actually-wants/","https://blog.123greetings.com/mothers-day-messages-for-someone-who-lost-their-mom/","https://blog.123greetings.com/mothers-day-messages-for-mother-in-law-what-to-write/","https://blog.123greetings.com/happy-mothers-day-2026-messages-what-to-write-in-the-card/","https://blog.123greetings.com/mothers-day-card-messages-for-grandma-funny-heartfelt/","https://blog.123greetings.com/mothers-day-wishes-for-stepmom-50-heartfelt-card-messages/","https://blog.123greetings.com/sorry-messages-for-coworkers-when-my-coworker-struggled-with-saying-sorry/","https://blog.123greetings.com/love-messages-for-wife-the-thank-you-i-owed-my-wife-for-two-years/","https://blog.123greetings.com/thank-you-card-messages-when-my-father-in-law-said-the-quiet-thing-out-loud/","https://blog.123greetings.com/congratulations-card-messages-when-i-realized-id-quietly-let-an-old-friendship-drift/","https://blog.123greetings.com/19th-may-your-week-with-bob/","https://blog.123greetings.com/honey-month-messages/"]
tot=0; anchors=Counter()
for p in pages:
    d=get(p)
    s=BeautifulSoup(d['text'],'lxml')
    n=0
    for a in s.find_all('a',href=True):
        h=a['href'].strip()
        if h in dead or h.rstrip('/') in [x.rstrip('/') for x in dead]:
            n+=1; anchors[(h[-40:],a.get_text(' ',strip=True))]+=1
    tot+=n
    print(d['status'],n,p)
print('total',tot)
for k,v in anchors.most_common(): print(v,k)
