from fetch import fetch
urls = [
 'https://www.123greetings.com/blog/what-to-write-in-a-card',
 'https://www.123greetings.com/events/sorry/',
 'https://www.123greetings.com/sorry/',
 'https://www.123greetings.com/events/thank_you/',
 'https://www.123greetings.com/thank_you/',
 'https://www.123greetings.com/events/congratulations/',
 'https://www.123greetings.com/congratulations/',
 'https://www.123greetings.com/events/national_vanilla_pudding_day/https://www.123greetings.com/events/national_vanilla_pudding_day/',
 'https://www.123greetings.com/events/national_vanilla_pudding_day/',
 'https://www.123greetings.com/family/father/',
 'https://www.123greetings.com/family/',
 'https://www.123greetings.com/events/honey-month/',
 'https://www.123greetings.com/events/honey_month/',
 'https://blog.123greetings.com/encouragement-inspiration-messages/',
 'https://blog.123greetings.com/category/123greetings/page/3/',
 'https://www.123greetings.com/this-page-does-not-exist-seo-audit/',
]
for u in urls:
    r = fetch(u)
    import re
    t = re.search(r'<title>(.*?)</title>', r['text'], re.S)
    print(r['status'], u, '->', r['final_url'] if r['final_url'] != u else '', r['history'], '|', (t.group(1).strip()[:80] if t else ''))
