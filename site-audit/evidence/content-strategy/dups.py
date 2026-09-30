import json, re, collections, itertools
BASE = 'https://blog.123greetings.com'
p = json.load(open('/home/user/Message_Board/site-audit/data/pages.json'))

def rel(u): return u.replace(BASE, '')
def nonempty(t): return len(re.sub(r'["“”‘’\'\s]', '', t or '')) > 0
def norm(t):
    t = t.lower().replace('’', "'").replace('‘', "'")
    t = re.sub(r'[“”"]', '', t)
    t = re.sub(r'[^a-z0-9\' ]+', ' ', t)
    return re.sub(r'\s+', ' ', t).strip()

content = {u: r for u, r in p.items() if r['type'] in ('page', 'post') and u.startswith('https://') and r['status'] == 200}
pm = {}
for u, r in content.items():
    ms = [m['text'] for m in (r.get('message_blocks') or []) if nonempty(m['text'])]
    if ms:
        pm[rel(u)] = ms

# exact (normalized) duplicates
idx = collections.defaultdict(set)
orig = {}
for u, ms in pm.items():
    for m in ms:
        k = norm(m)
        idx[k].add(u)
        orig.setdefault(k, m)
ex = [(len(v), k, sorted(v)) for k, v in idx.items() if len(v) > 1]
ex.sort(reverse=True)
print('total messages', sum(len(v) for v in pm.values()), 'unique normalized', len(idx))
print('exact normalized dup messages across pages:', len(ex))
for n, k, v in ex:
    print(n, '|', orig[k][:160], '|', v)

# within-page duplicates
print('\n== within-page duplicates ==')
for u, ms in pm.items():
    c = collections.Counter(norm(m) for m in ms)
    d = [(k, n) for k, n in c.items() if n > 1]
    if d:
        print(u, [(orig[k][:80], n) for k, n in d])

# sentence-level reuse across pages
print('\n== sentences (>=6 words) reused on 3+ pages ==')
sidx = collections.defaultdict(set)
sorig = {}
for u, ms in pm.items():
    for m in ms:
        for s in re.split(r'(?<=[.!?])\s+', re.sub(r'[“”]', '', m)):
            k = norm(s)
            if len(k.split()) >= 6:
                sidx[k].add(u)
                sorig.setdefault(k, s)
rs = [(len(v), k, sorted(v)) for k, v in sidx.items() if len(v) >= 2]
rs.sort(reverse=True)
print('sentences on 2+ pages:', len(rs), ' on 3+:', sum(1 for x in rs if x[0] >= 3))
for n, k, v in rs[:80]:
    print(n, '|', sorig[k][:150], '|', v[:12])

# near-duplicates: shingle jaccard on messages across different pages
print('\n== near-duplicate messages (jaccard>=0.6 on 3-word shingles, different pages, not exact) ==')
def sh(t):
    w = norm(t).split()
    return set(tuple(w[i:i+3]) for i in range(len(w) - 2))
items = [(u, m, sh(m)) for u, ms in pm.items() for m in ms if len(norm(m).split()) >= 8]
inv = collections.defaultdict(list)
for i, (u, m, s) in enumerate(items):
    for g in s:
        inv[g].append(i)
pairs = set()
for g, lst in inv.items():
    if len(lst) > 60:
        continue
    for a, b in itertools.combinations(lst, 2):
        if items[a][0] != items[b][0]:
            pairs.add((min(a, b), max(a, b)))
near = []
for a, b in pairs:
    sa, sb = items[a][2], items[b][2]
    j = len(sa & sb) / len(sa | sb)
    if j >= 0.6 and norm(items[a][1]) != norm(items[b][1]):
        near.append((round(j, 2), items[a][0], items[b][0], items[a][1][:110], items[b][1][:110]))
near.sort(reverse=True)
print(len(near))
for x in near[:60]:
    print(x)
