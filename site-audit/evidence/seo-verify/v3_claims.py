import json, re, statistics
P=json.load(open('data/pages.json'))
num=re.compile(r'(\d+)\+')
rows=[]
for u,r in P.items():
    if r['status']!=200 or r.get('redirects') or r['type'] not in('page','post'): continue
    m=num.search(r['title'] or '')
    if not m: continue
    claim=int(m.group(1))
    # messages: visible message blocks with quoted text >=15
    txt=r.get('main_text') or ''
    q=[x for x in re.findall(r'“([^”]{15,})”',txt)]
    mb=[b for b in r.get('message_blocks',[]) if not b.get('hidden') and len((b.get('text') or '').strip('“” '))>=15]
    rows.append((u,claim,len(q),len(mb),r['word_count'],r['type']))
print('pages with N+ in title',len(rows), 'types',{t for *_,t in rows})
print('median claim',statistics.median(x[1] for x in rows),'median quoted',statistics.median(x[2] for x in rows),'median blocks',statistics.median(x[3] for x in rows))
meet=[x for x in rows if max(x[2],x[3])>=x[1]]
half=[x for x in rows if max(x[2],x[3])<x[1]/2]
print('meet',len(meet),'<half',len(half))
print('>=half',[ (x[0][30:],x[1],x[2],x[3]) for x in rows if max(x[2],x[3])>=x[1]/2])
for s in ['birthday-messages','anniversary-messages','engagement-messages','messages-for-5th-anniversary','easter-messages','birthday-messages-for-wife','anniversary-messages-for-brother','birthday-messages-for-mom','april-fools-day-messages','international-yoga-day-messages']:
    u='https://blog.123greetings.com/'+s+'/'
    x=[y for y in rows if y[0]==u]
    print(s,x)
lt10=[x for x in rows if max(x[2],x[3])<10]
print('pages <10 msgs',len(lt10))
json.dump(rows,open('agent-work/seo-verify/claims.json','w'))
