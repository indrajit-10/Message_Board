from common import *
def core(t): return t[:-len(SUFFIX)] if t.endswith(SUFFIX) else t
C = content()
STOP = set('a an the and or for of to in on with your my i you & — – - | : messages message wishes wish greetings card cards quotes ideas heartfelt warm funny sweet 123greetings blog what write day'.split())
def toks(s): 
    s = s.lower().replace('’', "'").replace("'s", '').replace('thankyou', 'thank you').replace('coworker', 'co worker')
    return {w.rstrip('s') for w in re.findall(r"[a-z]+", s) if w not in STOP and len(w) > 1}
items = [(u, core(r['title']), toks(core(r['title'])) | toks(' '.join(r['h1_visible'][:1]))) for u, r in C.items()]
pairs = []
for i in range(len(items)):
    for j in range(i + 1, len(items)):
        a, b = items[i][2], items[j][2]
        if not a or not b: continue
        jac = len(a & b) / len(a | b)
        if jac >= 0.6: pairs.append((round(jac, 2), items[i][0], items[i][1], items[j][0], items[j][1]))
pairs.sort(reverse=True)
print(len(pairs))
for p in pairs:
    if 'bob' in p[2].lower(): continue
    print(p[0], '|', p[1].replace('https://blog.123greetings.com', ''), repr(p[2]), '<>', p[3].replace('https://blog.123greetings.com', ''), repr(p[4]))
groups = {
 'thank you': ['/thank-you-messages/', '/thankyou-messages/', '/thank-you-day-messages/', '/national-thank-you-day-messages/'],
 'inspiration': ['/inspiration-messages/', '/more-inspiration-messages/', '/inspiration-messages-motivation/', '/inspiration-messages-you-can-do-it/', '/national-day-of-encouragement-messages/'],
 'wedding': ['/wedding-messages/', '/more-wedding-messages/', '/wedding-messages-to-congratulate-the-couple/', '/wedding-messages-when-just-married/'],
 'anniversary': ['/anniversary-messages/', '/wedding-anniversary-messages/', '/relationship-anniversary-messages/', '/dating-anniversary-messages/'],
 'work anniv': ['/work-anniversary-messages/', '/anniversary-messages-for-co-worker/', '/anniversary-messages-for-employee/', '/business-anniversary-messages/', '/company-anniversary-messages/'],
 'fiance': ['/anniversary-messages-for-fiance/', '/anniversary-messages-for-fiancee/'],
 'cat': ['/national-cat-day-messages/', '/international-cat-day-messages/'],
 'best friend': ['/friendship-messages-for-best-friends/', '/national-best-friends-day-messages/', '/friendship-day-messages/', '/womens-friendship-day-messages/', '/friendship-week/', '/friendship-messages/'],
 'mothers day': ['/mothers-day-messages/', '/happy-mothers-day-2026-messages-what-to-write-in-the-card/', '/heartfelt-mothers-day-messages-that-prove-you-were-paying-attention/', '/what-to-write-in-a-mothers-day-card-shell-actually-keep/', '/mothers-day-messages-for-mom-what-to-write-when-she-saved-it-all/'],
 'love/cute': ['/love-messages/', '/cute-messages/'],
 'work': ['/at-work-messages/', '/colleagues-thankyou-messages/'],
}
B = 'https://blog.123greetings.com'
for g, us in groups.items():
    print('\n##', g)
    for u in us:
        r = P.get(B + u)
        if not r: print('   MISSING', u); continue
        print('   ', u, '| T:', core(r['title'])[:75], '| H1:', (r['h1_visible'] or [''])[0][:45], '| words', r['word_count'], '| inlinks', len(r['inlinks']))
