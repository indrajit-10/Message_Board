import json, re, collections, sys
BASE = 'https://blog.123greetings.com'
p = json.load(open('/home/user/Message_Board/site-audit/data/pages.json'))

def rel(u):
    return u.replace(BASE, '') if u.startswith(BASE) else u

def nonempty(t):
    return len(re.sub(r'["“”‘’\'\s]', '', t or '')) > 0

def msgs(r):
    return [m for m in (r.get('message_blocks') or []) if nonempty(m['text'])]

content = {u: r for u, r in p.items() if r['type'] in ('page', 'post') and u.startswith('https://') and r['status'] == 200}
print('content pages', len(content), collections.Counter(r['type'] for r in content.values()))

# 1. title promise
out = []
for u, r in content.items():
    t = r.get('title') or ''
    m = re.search(r'(\d[\d,]*)\s*\+', t)
    if not m:
        continue
    claimed = int(m.group(1).replace(',', ''))
    actual = len(msgs(r))
    out.append((rel(u), claimed, actual, max(0, claimed - actual), t))
out.sort(key=lambda x: (-x[3], x[0]))
json.dump(out, open('/home/user/Message_Board/site-audit/agent-work/content-strategy/promise.json', 'w'), indent=0)
print('promise pages', len(out), 'total shortfall', sum(x[3] for x in out), 'claimed', sum(x[1] for x in out), 'actual', sum(x[2] for x in out))
print('pages meeting claim', [x for x in out if x[3] == 0])
for x in out:
    print('%s | %d | %d | %d' % x[:4])
