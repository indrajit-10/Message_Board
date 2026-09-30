// Independent verification pass (mobile emulation). First-party static assets are served from the
// other agents' disk caches (byte-identical, versioned URLs) so we don't hammer the origin; HTML and all
// third-party requests go to the network. Timing of first-party assets is therefore NOT representative;
// this pass is for CPU metrics, layout shifts, LCP element identity, fonts, ads inventory.
// Usage (from site-audit/): TAG=base BLOCK='regex' node agent-work/perf-verify/verify.mjs /path1/ /path2/
import { chromium } from 'playwright';
import fs from 'node:fs';
import crypto from 'node:crypto';

const BASE = 'https://blog.123greetings.com';
const OUT = 'agent-work/perf-verify';
const TAG = process.env.TAG || 'base';
const BLOCK = process.env.BLOCK ? new RegExp(process.env.BLOCK) : null;
const STATIC_RE = /^https:\/\/blog\.123greetings\.com\/(wp-content|wp-includes|_jb_static)\//;
const CACHES = ['agent-work/accessibility/cache', 'agent-work/performance/cache', `${OUT}/cache`];
fs.mkdirSync(`${OUT}/cache`, { recursive: true });
const stats = { cached: 0, fetched: 0, n429: 0, blocked: 0 };

const browser = await chromium.launch({ channel: 'chromium' });
for (const path of process.argv.slice(2)) {
  const ctx = await browser.newContext({ viewport: { width: 412, height: 823 }, deviceScaleFactor: 2.625, isMobile: true, hasTouch: true,
    userAgent: 'Mozilla/5.0 (Linux; Android 11; moto g power (2022)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Mobile Safari/537.36' });
  if (BLOCK) await ctx.route((u) => BLOCK.test(u.toString()), (r) => { stats.blocked++; return r.abort('blockedbyclient'); });
  await ctx.route(STATIC_RE, async (route) => {
    const url = route.request().url();
    if (BLOCK && BLOCK.test(url)) { stats.blocked++; return route.abort('blockedbyclient'); }
    const key = crypto.createHash('sha1').update(url).digest('hex');
    for (const c of CACHES) { const f = `${c}/${key}`; if (fs.existsSync(f + '.json')) { const meta = JSON.parse(fs.readFileSync(f + '.json', 'utf8')); stats.cached++; return route.fulfill({ status: 200, headers: meta.headers, body: fs.readFileSync(f + '.bin') }); } }
    let resp; try { resp = await route.fetch({ timeout: 45000 }); } catch { return route.abort(); }
    if (resp.status() === 429) stats.n429++;
    const body = await resp.body();
    if (resp.status() === 200) { const h = resp.headers(); const keep = {}; for (const k of ['content-type', 'access-control-allow-origin', 'cache-control']) if (h[k]) keep[k] = h[k]; fs.writeFileSync(`${OUT}/cache/${key}.bin`, body); fs.writeFileSync(`${OUT}/cache/${key}.json`, JSON.stringify({ url, headers: keep })); }
    stats.fetched++;
    return route.fulfill({ response: resp, body });
  });
  await ctx.addInitScript(() => {
    window.__p = { lcp: [], shifts: [], lt: [] };
    const desc = (n) => n ? (n.nodeName + '.' + String(n.className || '').split(' ').filter(Boolean).slice(0, 3).join('.')) : '?';
    new PerformanceObserver((l) => { for (const e of l.getEntries()) { const el = e.element; window.__p.lcp.push({ t: Math.round(e.startTime), size: e.size, url: (e.url || '').slice(0, 160), el: desc(el), bg: el ? getComputedStyle(el).backgroundImage.slice(0, 120) : null }); } }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__p.shifts.push({ v: +e.value.toFixed(4), t: Math.round(e.startTime), input: e.hadRecentInput, y: Math.round(scrollY), src: (e.sources || []).slice(0, 4).map(s => ({ n: desc(s.node), prev: [Math.round(s.previousRect.y), Math.round(s.previousRect.height)], cur: [Math.round(s.currentRect.y), Math.round(s.currentRect.height)] })) }); }).observe({ type: 'layout-shift', buffered: true });
    new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__p.lt.push({ t: Math.round(e.startTime), d: Math.round(e.duration) }); }).observe({ type: 'longtask', buffered: true });
  });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Performance.enable');
  await cdp.send('Network.enable');
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  const reqs = new Map();
  cdp.on('Network.requestWillBeSent', (e) => { if (!reqs.has(e.requestId)) reqs.set(e.requestId, { url: e.request.url }); });
  cdp.on('Network.responseReceived', (e) => { const r = reqs.get(e.requestId); if (r) r.status = e.response.status; });
  cdp.on('Network.loadingFinished', (e) => { const r = reqs.get(e.requestId); if (r) r.bytes = e.encodedDataLength; });
  let status = null, docHeaders = {};
  try { const resp = await page.goto(BASE + path, { waitUntil: 'load', timeout: 90000 }); status = resp.status(); docHeaders = await resp.allHeaders(); } catch (e) { console.log('goto error', path, String(e).slice(0, 150)); }
  await page.waitForTimeout(6000);
  const pm = {}; for (const m of (await cdp.send('Performance.getMetrics')).metrics) if (/^(ScriptDuration|TaskDuration|LayoutDuration|RecalcStyleDuration)$/.test(m.name)) pm[m.name] = Math.round(m.value * 1000);
  const pre = await page.evaluate(() => {
    const n = performance.getEntriesByType('navigation')[0]; const fcp = (performance.getEntriesByType('paint').find(p => p.name === 'first-contentful-paint') || {}).startTime;
    const fonts = [...document.fonts]; const loaded = fonts.filter(f => f.status === 'loaded').map(f => `${f.family} ${f.weight} ${f.style}`);
    const logos = [...document.querySelectorAll('img.penci-mainlogo')].map(i => { const r = i.getBoundingClientRect(); return { w: Math.round(r.width), h: Math.round(r.height), top: Math.round(r.top), nw: i.naturalWidth, src: (i.currentSrc || i.src).split('/').pop() }; }).filter(x => x.w > 0);
    const slots = (window.googletag && googletag.pubads && googletag.pubads().getSlots) ? googletag.pubads().getSlots().map(s => s.getSlotElementId() + ' ' + s.getAdUnitPath() + ' ' + JSON.stringify((s.getSizes() || []).map(z => z.getWidth ? [z.getWidth(), z.getHeight()] : z)).slice(0, 80) + ' oop=' + (s.getOutOfPage ? s.getOutOfPage() : '?')) : null;
    const preloads = [...document.querySelectorAll('link[rel=preload]')].map(l => `${l.getAttribute('as')} ${l.href.slice(0, 120)}`);
    return { ttfb: Math.round(n.responseStart), fcp: Math.round(fcp || 0), fontsDeclared: fonts.length, fontsLoaded: loaded, logos, slots, pbjs: window.pbjs ? { v: window.pbjs.version, units: (window.pbjs.adUnits || []).length } : null, preloads, p: JSON.parse(JSON.stringify(window.__p)), dom: document.getElementsByTagName('*').length };
  });
  // scroll in 100px steps and watch for scroll-time layout shifts
  const nPre = pre.p.shifts.length;
  for (let y = 50; y <= 1500; y += 50) { await page.evaluate((yy) => scrollTo(0, yy), y); await page.waitForTimeout(250); }
  await page.waitForTimeout(1500);
  const post = await page.evaluate(() => JSON.parse(JSON.stringify(window.__p.shifts)));
  const list = [...reqs.values()];
  const cat = (u) => /recaptcha|contact-form-7/.test(u) ? 'recaptcha+cf7' : /cdn77|doubleclick|googlesyndication|fundingchoices|id5-sync|criteo|crwdcntrl|yahoo|im-apps|creativecdn|rtbhouse|jsdelivr|adtrafficquality/.test(u) ? 'ads' : u.startsWith(BASE) ? '1p' : 'other3p';
  const byCat = {}; for (const r of list) { const c = cat(r.url); byCat[c] = byCat[c] || { n: 0, kib: 0 }; byCat[c].n++; byCat[c].kib += (r.bytes || 0) / 1024; }
  for (const c in byCat) byCat[c].kib = Math.round(byCat[c].kib);
  const lt = pre.p.lt; const tbt = lt.filter(l => l.t >= pre.fcp).reduce((a, l) => a + Math.max(0, l.d - 50), 0);
  const rec = { tag: TAG, path, status, xac: docHeaders['x-ac'], st: docHeaders['server-timing'], pm, ttfb: pre.ttfb, fcp: pre.fcp, lcp: pre.p.lcp.at(-1), longtasks: lt.length, tbtApprox: tbt, maxTask: Math.max(0, ...lt.map(l => l.d)), clsLoad: +pre.p.shifts.filter(s => !s.input).reduce((a, s) => a + s.v, 0).toFixed(4), loadShifts: pre.p.shifts, scrollShifts: post.slice(nPre), reqs: list.length, n429: list.filter(r => r.status === 429).length, byCat, fontsDeclared: pre.fontsDeclared, fontsLoaded: pre.fontsLoaded, logos: pre.logos, slots: pre.slots, pbjs: pre.pbjs, preloads: pre.preloads, dom: pre.dom };
  fs.appendFileSync(`${OUT}/runs.jsonl`, JSON.stringify(rec) + '\n');
  console.log(`${TAG} ${path} ${status} xac=${rec.xac} Script=${pm.ScriptDuration} Task=${pm.TaskDuration} Style=${pm.RecalcStyleDuration} Layout=${pm.LayoutDuration} lt=${lt.length} tbt~${tbt} maxTask=${rec.maxTask} fcp=${pre.fcp} lcp=${rec.lcp && rec.lcp.t} lcpEl=${rec.lcp && rec.lcp.el} clsLoad=${rec.clsLoad} scrollShifts=${JSON.stringify(rec.scrollShifts.map(s => [s.v, s.y, s.input]))} reqs=${list.length} n429=${rec.n429} byCat=${JSON.stringify(byCat)} fonts=${pre.fontsDeclared}/${pre.fontsLoaded.length}`);
  await ctx.close();
  await new Promise((r) => setTimeout(r, 12000));
}
await browser.close();
console.log('asset stats', JSON.stringify(stats));
