import json, re
from collections import Counter, defaultdict
P_ALL = json.load(open('/home/user/Message_Board/site-audit/data/pages.json'))
# canonical set of live 200 HTML pages (drop http:// keys that merely redirected)
P = {u: r for u, r in P_ALL.items() if r.get('status') == 200 and not r.get('redirects')}
SUFFIX = ' - 123Greetings Blog - Free eCards, Card Message Ideas & What to Write in Any Greeting Card'
def content(types=('page', 'post')):
    return {u: r for u, r in P.items() if r['type'] in types}
