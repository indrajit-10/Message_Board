import sys; sys.path.insert(0,'agent-work/seo-verify')
from fetch import get
import re, json
from bs4 import BeautifulSoup
from collections import Counter
P=json.load(open('data/pages.json'))
dead=['https://www.123greetings.com/blog/what-to-write-in-a-card','https://www.123greetings.com/events/sorry/','https://www.123greetings.com/events/thank_you/','https://www.123greetings.com/events/congratulations/','https://www.123greetings.com/events/national_vanilla_pudding_day/https://www.123greetings.com/events/national_vanilla_pudding_day/','https://www.123greetings.com/family/father/','https://www.123greetings.com/events/honey-month/']
repl=['https://www.123greetings.com/sorry/','https://www.123greetings.com/thank_you/','https://www.123greetings.com/congratulations/','https://www.123greetings.com/events/national_vanilla_pudding_day/','https://www.123greetings.com/events/national_honey_month/','https://www.123greetings.com/family/','https://www.123greetings.com/events/fathers_day/','https://www.123greetings.com/events/sorry.html','https://www.123greetings.com/blog/']
for u in dead+repl:
    d=get(u)
    t=re.search(r'<title[^>]*>(.*?)</title>',d['text'],re.S)
    print(d['status'],d['hist'],u,'|',(t.group(1).strip()[:70] if t else None))
for s in ['/mothers-day-messages-for-wife-what-she-actually-wants/','/mothers-day-card-messages-for-grandma-funny-heartfelt/','/mothers-day-wishes-for-stepmom-50-heartfelt-card-messages/','/what-to-write-in-a-mothers-day-card-shell-actually-keep/','/heartfelt-mothers-day-messages-that-prove-you-were-paying-attention/','/mothers-day-messages/','/sympathy-condolences-messages/','/what-to-write-in-a-card/','/thinking-of-you-messages/','/sympathy-messages/']:
    u='https://blog.123greetings.com'+s
    print(s, P.get(u,{}).get('status'), P.get(u,{}).get('title'))
