from common import *
C = content(('page', 'post'))
missing = []; empty = []; generic = []; nodim = []; allimgs = Counter(); bg = 0
GEN = re.compile(r'^(arrow|image|img|photo|picture|icon|logo|banner|untitled.*|screenshot.*|dsc\d*|\d+|.*\.(png|jpe?g|webp|gif))$', re.I)
for u, r in C.items():
    for im in r['images']:
        if im['alt'] == '(background)': bg += 1; continue
        if not im['in_main']: continue
        src = im['src']; allimgs[src] += 1
        a = im['alt']
        if a is None: missing.append((u, src))
        elif not a.strip(): empty.append((u, src))
        elif GEN.match(a.strip()): generic.append((u, src, a))
        if not im['width'] or not im['height']: nodim.append((u, src))
print('in-main images on content pages:', sum(allimgs.values()), 'unique', len(allimgs))
print('missing alt attr:', len(missing), missing[:10])
print('empty alt:', len(empty), Counter(s for _, s in empty).most_common(8), 'pages', len(set(u for u, _ in empty)))
print('generic alt:', len(generic), Counter(a for *_, a in generic), 'pages', len(set(x[0] for x in generic)))
print('  generic srcs', Counter(s for _, s, _ in generic).most_common(5))
print('no width/height:', len(nodim), Counter(s for _, s in nodim).most_common(8), 'pages', len(set(u for u, _ in nodim)))
print('\nmost repeated in-main images:', allimgs.most_common(8))
# non-main images (header/footer) with missing alt
nm = Counter()
for u, r in P.items():
    for im in r['images']:
        if not im['in_main'] and (im['alt'] is None or not im['alt'].strip()) and im['alt'] != '(background)':
            nm[(im['src'][:120], im['alt'])] += 1
print('\nnon-main images with missing/empty alt (by src):', nm.most_common(10))
# featured image / post images: posts image count
print('\nposts: in-main image counts', Counter(sum(1 for im in r['images'] if im['in_main']) for r in C.values() if r['type'] == 'post'))
pages_noimg = [u for u, r in C.items() if r['type'] == 'page' and not any(im['in_main'] and 'arrow' not in im['src'] for im in r['images'])]
print('pages with no in-content image other than arrow icons:', len(pages_noimg))
