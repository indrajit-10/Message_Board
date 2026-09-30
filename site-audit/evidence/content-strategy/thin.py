import json, re, collections, statistics
BASE = 'https://blog.123greetings.com'
p = json.load(open('/home/user/Message_Board/site-audit/data/pages.json'))
def rel(u): return u.replace(BASE, '')
def nonempty(t): return len(re.sub(r'["“”‘’\'\s]', '', t or '')) > 0
def wc(t): return len(re.findall(r"[A-Za-z0-9’']+", t or ''))

content = {u: r for u, r in p.items() if r['type'] in ('page', 'post') and u.startswith('https://') and r['status'] == 200}
SKIP = {'/', '/about-us/', '/contact-us/', '/archive/', '/what-to-write-in-a-card/', '/upcoming-events/'}
ZOD = 'aries taurus gemini cancer leo virgo libra scorpio sagittarius capricorn aquarius pisces'.split()

def family(s):
    if content.get(BASE + s, {}).get('type') == 'post':
        return 'post-bob' if 'bob' in s else 'post-story'
    if re.match(r'^/birthday-messages-for-(%s)/$' % '|'.join(ZOD), s): return 'zodiac-birthday'
    if re.match(r'^/messages-for-\d+(st|nd|rd|th)-birthday/$', s) or s == '/birthday-messages-for-sweet-16/': return 'milestone-birthday'
    if re.match(r'^/messages-for-\d+(st|nd|rd|th)-anniversary/$', s): return 'milestone-anniversary'
    if re.match(r'^/(belated|funny-belated|heartfelt-belated)-birthday', s): return 'belated-birthday'
    if re.match(r'^/belated-anniversary', s): return 'belated-anniversary'
    if re.match(r'^/birthday-messages?-for-', s): return 'birthday-by-relationship'
    if re.match(r'^/anniversary-messages-for-', s): return 'anniversary-by-relationship'
    if re.match(r'^/(relationship|wedding|dating|work|company|business|friendship)-anniversary-messages/$', s): return 'anniversary-type'
    if s in ('/birthday-messages/', '/anniversary-messages/', '/wedding-messages/', '/friendship-messages/', '/thankyou-messages/', '/inspiration-messages/'): return 'hub'
    if s.endswith('-thankyou-messages/'): return 'thankyou-sub'
    if 'friendship-messages' in s or s in ('/funny-friendship-messages/', '/caring-friendship-messages/'): return 'friendship-sub'
    if s.startswith('/wedding-messages-') or s == '/more-wedding-messages/': return 'wedding-sub'
    if s.startswith('/inspiration-messages-') or s == '/more-inspiration-messages/': return 'inspiration-sub'
    if s in ('/mothers-day-messages/', '/fathers-day-messages/', '/4th-of-july-messages/', '/canada-day-messages/', '/easter-messages/', '/halloween-messages/', '/thanksgiving-day-messages/', '/canadian-thanksgiving-messages/', '/veterans-day-messages/', '/labor-day-messages/', '/rosh-hashanah-messages/', '/sukkot-messages/', '/raksha-bandhan-messages/', '/day-of-the-dead-messages/', '/all-saints-day-messages/', '/columbus-day-messages/', '/guy-fawkes-day-messages/', '/samhain-messages/', '/earth-day-messages/', '/april-fools-day-messages/', '/teachers-day-messages/', '/grandparents-day-messages/', '/parents-day-messages/', '/bosss-day-messages/', '/sweetest-day-messages/'):
        return 'holiday/major-observance'
    if s in ('/spring-messages/', '/summer-messages/', '/fall-messages/'): return 'season'
    if re.search(r'(day|week|month)(-messages)?/$', s) or 'day-messages' in s or 'week' in s or 'month-messages' in s or 'pumpkinfest' in s: return 'national/awareness-day'
    if content.get(BASE + s, {}).get('type') == 'post':
        if 'bob' in s: return 'post-bob'
        return 'post-story'
    return 'evergreen-occasion'

rows = []
for u, r in content.items():
    s = rel(u)
    if s in SKIP: continue
    ms = [m['text'] for m in (r.get('message_blocks') or []) if nonempty(m['text'])]
    msgset = set(re.sub(r'\s+', ' ', m).strip() for m in ms)
    faqs = r.get('faqs') or []
    faqtxt = set()
    for f in faqs:
        faqtxt.add(re.sub(r'\s+', ' ', f.get('q') or '').strip()); faqtxt.add(re.sub(r'\s+', ' ', f.get('a') or '').strip())
    intro_words = 0
    for para in r.get('paragraphs') or []:
        pp = re.sub(r'\s+', ' ', para).strip()
        if pp in msgset or pp in faqtxt or not nonempty(pp): continue
        if re.match(r'^(Emotions\b|for\b)', pp) or pp.startswith('“'): continue
        if pp.startswith('META ') or pp.startswith('KEY PHRASE'): continue
        intro_words += wc(pp)
    msg_words = sum(wc(m) for m in ms)
    ecard = any(l['in_main'] and l.get('abs') and 'www.123greetings.com' in l['abs'] and l['abs'].rstrip('/') != 'https://www.123greetings.com' for l in r['links'])
    internal_out = len(set(l['abs'].split('#')[0] for l in r['links'] if l['in_main'] and l.get('abs') and l['abs'].startswith(BASE) and l['abs'].split('#')[0] != u))
    t = r.get('title') or ''
    m = re.search(r'(\d[\d,]*)\s*\+', t)
    claimed = int(m.group(1).replace(',', '')) if m else None
    score = len(ms) * 10 + min(intro_words, 400) * 0.1 + len(faqs) * 5 + (5 if ecard else 0) + (5 if internal_out else 0)
    rows.append(dict(url=s, type=r['type'], family=family(s), msgs=len(ms), msg_words=msg_words, words=r['word_count'], intro_words=intro_words,
                     faqs=len(faqs), ecard=ecard, internal_out=internal_out, claimed=claimed, score=round(score, 1),
                     published=(r.get('datePublished') or '')[:10], modified=(r.get('lastmod') or '')[:10]))

json.dump(rows, open('/home/user/Message_Board/site-audit/agent-work/content-strategy/usefulness.json', 'w'), indent=0)
pages = [x for x in rows if x['type'] == 'page' and x['family'] != 'hub']
pages.sort(key=lambda x: (x['score'], x['words']))
print('message pages ranked:', len(pages))
print('thinnest 40:')
for i, x in enumerate(pages[:40], 1):
    miss = []
    if x['msgs'] < 10: miss.append('only %d msgs' % x['msgs'])
    if x['claimed'] and x['msgs'] < x['claimed']: miss.append('title claims %d+' % x['claimed'])
    if x['intro_words'] < 30: miss.append('no intro')
    if x['faqs'] == 0: miss.append('no FAQ')
    if not x['ecard']: miss.append('no eCard link')
    if x['internal_out'] == 0: miss.append('no internal links')
    print('%2d %-55s fam=%-26s msgs=%2d words=%4d intro=%3d faq=%d ecard=%s out=%d score=%s | %s' % (i, x['url'], x['family'], x['msgs'], x['words'], x['intro_words'], x['faqs'], 'Y' if x['ecard'] else 'N', x['internal_out'], x['score'], '; '.join(miss)))

print('\n== families ==')
fam = collections.defaultdict(list)
for x in rows: fam[x['family']].append(x)
for f, xs in sorted(fam.items()):
    n = len(xs)
    print('%-28s n=%3d  msgs med=%s (min %d max %d)  words med=%s  intro>=30: %d/%d  FAQ: %d/%d  eCard: %d/%d  internal-out: %d/%d  title-count: %d/%d  avg-shortfall=%s' % (
        f, n, statistics.median([x['msgs'] for x in xs]), min(x['msgs'] for x in xs), max(x['msgs'] for x in xs), statistics.median([x['words'] for x in xs]),
        sum(1 for x in xs if x['intro_words'] >= 30), n, sum(1 for x in xs if x['faqs']), n, sum(1 for x in xs if x['ecard']), n, sum(1 for x in xs if x['internal_out']), n,
        sum(1 for x in xs if x['claimed']), n, round(statistics.mean([x['claimed'] - x['msgs'] for x in xs if x['claimed']]), 1) if any(x['claimed'] for x in xs) else '-'))
    print('    ', ' '.join(x['url'] for x in sorted(xs, key=lambda y: y['url'])))

print('\nmsg count distribution (message pages):', sorted(collections.Counter(min(x['msgs'], 30) for x in pages).items()))
print('pages with <=5 msgs:', sum(1 for x in pages if x['msgs'] <= 5), 'of', len(pages))
print('pages with <10 msgs:', sum(1 for x in pages if x['msgs'] < 10))
print('pages with words<200:', sum(1 for x in pages if x['words'] < 200))
print('pages no intro:', sum(1 for x in pages if x['intro_words'] < 30))
print('pages no faq:', sum(1 for x in pages if x['faqs'] == 0))
print('pages no ecard:', sum(1 for x in pages if not x['ecard']))
print('pages no internal out:', sum(1 for x in pages if x['internal_out'] == 0))
