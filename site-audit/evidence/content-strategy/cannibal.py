import json, re, collections, itertools
BASE = 'https://blog.123greetings.com'
p = json.load(open('/home/user/Message_Board/site-audit/data/pages.json'))
def nonempty(t): return len(re.sub(r'["“”‘’\'\s]', '', t or '')) > 0
def words(t): return set(re.findall(r'[a-z]+', (t or '').lower().replace('’', "'")))
STOP = set('the a an of and to for you your my in on with is it that this be are all as at by from i me we our us so just have has was were will can more than not but or if its it\'s day messages message wishes happy'.split())

groups = {
 'thank-you': ['/thank-you-messages/', '/thankyou-messages/', '/national-thank-you-day-messages/', '/thank-you-day-messages/', '/dailies-thankyou-messages/'],
 'dance': ['/dance-day-messages/', '/national-tap-dance-day-messages/'],
 'work-anniv': ['/work-anniversary-messages/', '/anniversary-messages-for-co-worker/', '/anniversary-messages-for-employee/', '/anniversary-messages-for-boss/', '/at-work-messages/'],
 'wedding-anniv': ['/anniversary-messages/', '/wedding-anniversary-messages/', '/relationship-anniversary-messages/', '/dating-anniversary-messages/'],
 'friendship': ['/friendship-messages/', '/friendship-day-messages/', '/friendship-week/', '/national-best-friends-day-messages/', '/friendship-messages-for-best-friends/', '/womens-friendship-day-messages/', '/friendship-anniversary-messages/', '/anniversary-messages-for-friends/'],
 'inspiration': ['/inspiration-messages/', '/inspiration-messages-motivation/', '/inspiration-messages-you-can-do-it/', '/more-inspiration-messages/', '/national-day-of-encouragement-messages/', '/positive-thinking-day-messages/'],
 'business-anniv': ['/business-anniversary-messages/', '/company-anniversary-messages/', '/anniversary-messages-for-customers/'],
 'love': ['/love-messages/', '/cute-messages/', '/national-i-love-you-day-messages/', '/romance-day-messages/', '/romance-awareness-month-messages/', '/true-love-forever-day-messages/'],
 'kiss': ['/international-kissing-day-messages/', '/sneak-a-kiss-day-messages/', '/longest-kiss-day-messages/', '/kiss-and-make-up-day-messages/'],
 'angel': ['/angel-week-messages/', '/be-an-angel-day-messages/', '/guardian-angel-day-messages/'],
 'cat': ['/international-cat-day-messages/', '/national-cat-day-messages/'],
 'hug': ['/hug-week-messages/', '/hug-your-sweetheart-day-messages/'],
 'smile': ['/smile-month-messages/', '/send-a-smile-day-messages/'],
 'fiance': ['/anniversary-messages-for-fiance/', '/anniversary-messages-for-fiancee/'],
 'parents': ['/parents-day-messages/', '/working-parents-day/', '/anniversary-messages-for-parents/'],
 'halloween': ['/halloween-messages/', '/samhain-messages/', '/day-of-the-dead-messages/', '/all-saints-day-messages/'],
 'belated-bday': ['/belated-birthday-messages-for-sorry-i-missed/', '/heartfelt-belated-birthday-messages/', '/funny-belated-birthday-messages/', '/belated-birthday-messages-for-her/', '/belated-birthday-messages-for-him/'],
 'siblings-anniv': ['/anniversary-messages-for-siblings/', '/anniversary-messages-for-brother/', '/anniversary-messages-for-sister/'],
 'grandparents-anniv': ['/anniversary-messages-for-grandparents/', '/anniversary-messages-for-grandma/', '/anniversary-messages-for-grandpa/'],
 'thanksgiving': ['/thanksgiving-day-messages/', '/canadian-thanksgiving-messages/', '/fall-messages/'],
 'boss': ['/bosss-day-messages/', '/birthday-messages-for-boss/', '/anniversary-messages-for-boss/'],
 'teacher': ['/teachers-day-messages/', '/birthday-messages-for-teacher/'],
 'chocolate': ['/chocolate-day-messages/', '/chocolate-milk-day-messages/'],
 'girlfriend': ['/girlfriends-day-messages/', '/womens-friendship-day-messages/'],
}
out = {}
for g, urls in groups.items():
    print('\n######', g)
    recs = []
    for s in urls:
        r = p.get(BASE + s)
        if not r:
            print('  (not crawled)', s); continue
        ms = [m['text'] for m in r['message_blocks'] if nonempty(m['text'])]
        vis_h1 = r.get('h1_visible') or r.get('h1_all')
        recs.append((s, r, ms))
        print('  %-48s msgs=%2d words=%4d faq=%d inl=%d pub=%s | T: %s | H1: %s | MD: %s' % (s, len(ms), r['word_count'], len(r['faqs']), len(r['inlinks'] or []), (r['datePublished'] or '')[:10], r['title'][:75], vis_h1, (r['meta_description'] or '')[:110]))
    for (a, ra, ma), (b, rb, mb) in itertools.combinations(recs, 2):
        wa = words(' '.join(ma)) - STOP; wb = words(' '.join(mb)) - STOP
        ta = words(ra['title']) - STOP - {'123greetings', 'blog'}; tb = words(rb['title']) - STOP - {'123greetings', 'blog'}
        j = len(wa & wb) / max(1, len(wa | wb))
        tj = len(ta & tb) / max(1, len(ta | tb))
        print('     %s ~ %s : title-overlap=%.2f msg-vocab-jaccard=%.2f' % (a, b, tj, j))

# H1 duplicates sitewide (visible)
print('\n###### duplicate visible H1s among pages')
h = collections.defaultdict(list)
for u, r in p.items():
    if r['type'] in ('page', 'post') and u.startswith('https') and r['status'] == 200:
        for x in (r.get('h1_visible') or []):
            h[x.strip().lower()].append(u.replace(BASE, ''))
for k, v in sorted(h.items(), key=lambda x: -len(x[1])):
    if len(v) > 1:
        print(len(v), k, v[:15])
# duplicate titles
print('\n###### duplicate titles')
t = collections.defaultdict(list)
for u, r in p.items():
    if r['type'] in ('page', 'post') and u.startswith('https') and r['status'] == 200:
        t[r['title']].append(u.replace(BASE, ''))
for k, v in sorted(t.items(), key=lambda x: -len(x[1])):
    if len(v) > 1:
        print(len(v), k[:80], v[:15])
