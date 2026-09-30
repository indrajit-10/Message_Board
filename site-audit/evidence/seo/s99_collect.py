"""Collect the lists used in the SEO findings into results.json (reproducible from pages.json + live cache)."""
from common import *
B = 'https://blog.123greetings.com'
C = content()
out = {}
out['hidden_h1_pages'] = sorted(u for u, r in C.items() if len(r['h1_all']) > len(r['h1_visible']))
out['comma_h1_pages'] = sorted(u for u, r in C.items() if any(', for ' in h for h in r['h1_all']))
out['arrow_og_pages'] = sorted(u for u, r in C.items() if 'arrow' in (r['og'].get('og:image') or ''))
out['no_og_pages'] = sorted(u for u, r in C.items() if not r['og'].get('og:image'))
out['faq_pages'] = sorted(u for u, r in C.items() if r['faqs'])
out['suffix_posts'] = sorted(u for u, r in C.items() if r['type'] == 'post' and r['title'].endswith(SUFFIX))
out['suffix_all'] = sorted(u for u, r in P.items() if r['title'].endswith(SUFFIX))
out['no_meta_desc'] = sorted(u for u, r in P.items() if not r.get('meta_description'))
out['alt_arrow_pages'] = sorted({u for u, r in C.items() for im in r['images'] if im['alt'] == 'arrow'})
for k, v in out.items(): print(k, len(v), [x.replace(B, '') for x in v[:10]])
json.dump(out, open('results.json', 'w'), indent=1)
