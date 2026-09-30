"""Live sample: validate JSON-LD, social tags, hreflang, pagination links, byline, featured image rendering."""
import json, re, sys
from bs4 import BeautifulSoup
from fetch import fetch
B = 'https://blog.123greetings.com'
SAMPLE = ['/', '/birthday-messages/', '/what-to-write-in-a-card/', '/anniversary-messages/', '/about-us/', '/contact-us/',
          '/birthday-messages-for-mom/', '/national-best-friends-day-messages/', '/anniversary-messages-for-brother/',
          '/archive/', '/upcoming-events/', '/mothers-day-messages-for-mom-what-to-write-when-she-saved-it-all/',
          '/five-minutes-with-bob-27th-july/', '/wake-up-with-bob-17th-july/', '/13th-july-your-weekly-bobcast/',
          '/tag/bob/', '/tag/bob/page/2/', '/tag/alps/', '/category/123greetings/', '/author/iblog123greetingsgmail-com/',
          '/penci-block/footer/', '/penci-block/mega-menu/']
VALID = {'WebPage', 'WebSite', 'Organization', 'Person', 'ImageObject', 'BreadcrumbList', 'ListItem', 'SearchAction', 'EntryPoint',
         'PropertyValueSpecification', 'ReadAction', 'Article', 'BlogPosting', 'CommentAction', 'CollectionPage', 'ProfilePage', 'FAQPage', 'Question', 'Answer'}
report = {}
def walk(o, path, out):
    if isinstance(o, dict):
        t = o.get('@type')
        for tt in (t if isinstance(t, list) else [t] if t else []):
            if tt not in VALID: out['invalid_types'].append(tt)
        i = o.get('@id')
        if isinstance(i, str) and i.startswith('#'): out['relative_ids'].append(i)
        for k, v in o.items():
            if k in ('datemodified', 'datepublished'): out['bad_props'].append(k)
            if isinstance(v, str) and re.search(r'&amp;|&hellip;|&#\d+;', v): out['entities'].append(f'{k}: {v[:70]}')
            walk(v, path + [k], out)
    elif isinstance(o, list):
        for v in o: walk(v, path, out)
for p in SAMPLE:
    r = fetch(B + p)
    s = BeautifulSoup(r['text'], 'lxml')
    out = {'status': r['status'], 'blocks': [], 'invalid_types': [], 'relative_ids': [], 'bad_props': [], 'entities': [], 'authors': [], 'theme_desc': None}
    for sc in s.find_all('script', type='application/ld+json'):
        try: d = json.loads(sc.string or '')
        except Exception as e: out['blocks'].append('INVALID JSON ' + str(e)); continue
        graph = d.get('@graph', [d]) if isinstance(d, dict) else d
        out['blocks'].append(('yoast ' if 'yoast' in ' '.join(sc.get('class') or []) else 'theme ') + ','.join(str(g.get('@type')) for g in graph))
        walk(d, [], out)
        for g in graph:
            a = g.get('author')
            if isinstance(a, dict) and a.get('name'): out['authors'].append((g.get('@type'), a.get('name'), a.get('url')))
            if not ('yoast' in ' '.join(sc.get('class') or [])) and g.get('@type') in ('WebPage', 'BlogPosting'):
                out['theme_desc'] = (g.get('description') or '')[:110]; out['theme_image'] = (g.get('image') or {}).get('url'); out['theme_dates'] = (g.get('datePublished'), g.get('datemodified'))
    meta = lambda **kw: [m.get('content') for m in s.find_all('meta', attrs=kw)]
    out['twitter'] = {m.get('name'): m.get('content')[:60] for m in s.find_all('meta', attrs={'name': re.compile('^twitter:')})}
    out['og_image'] = meta(property='og:image')
    out['hreflang'] = [l.get('hreflang') for l in s.find_all('link', hreflang=True)]
    out['next_prev'] = [(l.get('rel'), l.get('href')) for l in s.find_all('link', rel=re.compile('next|prev'))]
    out['robots'] = meta(name='robots')
    out['canonical'] = [l.get('href') for l in s.find_all('link', rel='canonical')]
    out['h1'] = [h.get_text(' ', strip=True)[:60] for h in s.find_all('h1')]
    out['bg_featured'] = bool(s.select('.penci-single-featured-img[style*=background-image]'))
    out['byline'] = [e.get_text(' ', strip=True)[:40] for e in s.select('.author')][:2]
    out['visible_breadcrumb'] = bool(s.select('.penci-breadcrumb, .yoast-breadcrumb, nav[aria-label*=readcrumb]'))
    out['modified_meta'] = meta(property='article:modified_time')
    report[p] = out
    print('=' * 8, p, r['status'])
    for k, v in out.items():
        if v not in ([], None, {}, False): print('   ', k, ':', v if not isinstance(v, list) else v[:8])
json.dump(report, open('sample_live.json', 'w'), indent=1)
