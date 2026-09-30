import json, re, sys
from bs4 import BeautifulSoup
from fetch import fetch
URLS = sys.argv[1:] or [
 'https://blog.123greetings.com/',
 'https://blog.123greetings.com/birthday-messages-for-mom/',
 'https://blog.123greetings.com/mothers-day-messages-for-mom-what-to-write-when-she-saved-it-all/',
 'https://blog.123greetings.com/tag/bob/',
]
for u in URLS:
    r = fetch(u)
    soup = BeautifulSoup(r['text'], 'lxml')
    print('=' * 20, u, r['status'])
    for i, s in enumerate(soup.find_all('script', type='application/ld+json')):
        raw = s.string or ''
        try:
            d = json.loads(raw)
            print(f'--- block {i} class={s.get("class")} len={len(raw)}')
            print(json.dumps(d, indent=1, ensure_ascii=False)[:6000])
        except Exception as e:
            print('INVALID JSON', e, raw[:300])
