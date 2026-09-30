// Performance deep-dive with Playwright (mobile emulation, CPU 4x, throttled network).
// Records: LCP/CLS/long tasks (real, not simulated), per-request transfer sizes via CDP,
// image delivery (intrinsic vs rendered), fonts, DOM size/depth, script/style inventory,
// third-party hosts, and which ad/recaptcha scripts appear before/after scroll+interaction.
// Usage (from /home/user/Message_Board/site-audit): node agent-work/performance/pw_audit.mjs [mobile|desktop] path1 path2 ...
import { chromium } from 'playwright';
import fs from 'node:fs';

const BASE = 'https://blog.123greetings.com';
const mode = process.argv[2] || 'mobile';
const paths = process.argv.slice(3);
const OUT = 'agent-work/performance';

const ctxOpts = mode === 'mobile'
  ? { viewport: { width: 412, height: 823 }, deviceScaleFactor: 2.625, isMobile: true, hasTouch: true,
      userAgent: 'Mozilla/5.0 (Linux; Android 11; moto g power (2022)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Mobile Safari/537.36' }
  : { viewport: { width: 1350, height: 940 }, deviceScaleFactor: 1 };

const browser = await chromium.launch({ channel: 'chromium' });
const results = [];
// Serve versioned first-party static assets from disk (UX agent's cache, then ours) to avoid
// hammering the origin / tripping the shared-IP 429 limiter. Timing of these is therefore NOT
// representative; this pass is for CPU metrics + inventory only.
import crypto from 'node:crypto';
const STATIC_RE = /^https:\/\/blog\.123greetings\.com\/(wp-content|wp-includes|_jb_static)\//;
const CACHES = ['agent-work/ux/cache', 'agent-work/performance/cache'];
fs.mkdirSync(CACHES[1], { recursive: true });
const BLOCK = process.env.BLOCK ? new RegExp(process.env.BLOCK) : null;
const cstats = { cached: 0, fetched: 0, n429: 0, blocked: 0 };
async function routeStatic(ctx) {
  if (BLOCK) await ctx.route((u) => BLOCK.test(u.toString()), (r) => { cstats.blocked++; return r.abort('blockedbyclient'); });
  await ctx.route(STATIC_RE, async (route) => {
    const url = route.request().url();
    if (BLOCK && BLOCK.test(url)) { cstats.blocked++; return route.abort('blockedbyclient'); }
    const key = crypto.createHash('sha1').update(url).digest('hex');
    for (const c of CACHES) {
      const f = `${c}/${key}`;
      if (fs.existsSync(f + '.json')) { const meta = JSON.parse(fs.readFileSync(f + '.json', 'utf8')); cstats.cached++; return route.fulfill({ status: 200, headers: meta.headers, body: fs.readFileSync(f + '.bin') }); }
    }
    for (const w of [0, 4000, 10000, 20000]) {
      if (w) await new Promise((r) => setTimeout(r, w));
      let resp; try { resp = await route.fetch({ timeout: 45000 }); } catch { return route.abort().catch(() => {}); }
      if (resp.status() === 429) { cstats.n429++; continue; }
      const body = await resp.body(); const headers = resp.headers();
      if (resp.status() === 200) { const keep = {}; for (const h of ['content-type', 'access-control-allow-origin', 'cache-control']) if (headers[h]) keep[h] = headers[h]; const f = `${CACHES[1]}/${key}`; fs.writeFileSync(f + '.bin', body); fs.writeFileSync(f + '.json', JSON.stringify({ url, headers: keep })); }
      cstats.fetched++;
      return route.fulfill({ response: resp, body });
    }
    return route.fulfill({ status: 429, contentType: 'text/html', body: 'Too Many Requests' });
  });
}

for (const path of paths) {
  const ctx = await browser.newContext(ctxOpts);
  await routeStatic(ctx);
  await ctx.addInitScript(() => {
    window.__perf = { lcp: [], cls: 0, shifts: [], longtasks: [] };
    try {
      new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__perf.lcp.push({ t: e.startTime, size: e.size, url: e.url, tag: e.element && e.element.tagName, id: e.element && (e.element.className || '').toString().slice(0, 80) }); }).observe({ type: 'largest-contentful-paint', buffered: true });
      new PerformanceObserver((l) => { for (const e of l.getEntries()) { if (!e.hadRecentInput) { window.__perf.cls += e.value; window.__perf.shifts.push({ v: e.value, t: e.startTime, src: (e.sources || []).map(s => s.node ? (s.node.nodeName + '.' + (s.node.className || '').toString().slice(0, 60)) : '?') }); } } }).observe({ type: 'layout-shift', buffered: true });
      new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__perf.longtasks.push({ t: e.startTime, d: e.duration }); }).observe({ type: 'longtask', buffered: true });
    } catch (e) {}
  });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Network.enable');
  await cdp.send('Performance.enable');
  if (mode === 'mobile') {
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    // ~ Lighthouse "Slow 4G": 150ms RTT, 1.6 Mbps down, 750 Kbps up
    await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1.6 * 1024 * 1024 / 8, uploadThroughput: 750 * 1024 / 8 });
  }
  const reqs = new Map();
  cdp.on('Network.requestWillBeSent', (e) => { if (!reqs.has(e.requestId)) reqs.set(e.requestId, { url: e.request.url, type: e.type, start: e.timestamp, prio: e.request.initialPriority, initiator: e.initiator?.type }); });
  cdp.on('Network.responseReceived', (e) => { const r = reqs.get(e.requestId); if (r) { r.status = e.response.status; r.mime = e.response.mimeType; r.type = e.type; r.enc = e.response.headers['content-encoding'] || e.response.headers['Content-Encoding'] || ''; r.cc = e.response.headers['cache-control'] || e.response.headers['Cache-Control'] || ''; r.fromCache = e.response.fromDiskCache; r.ttfb = e.response.timing ? e.response.timing.receiveHeadersEnd : null; } });
  cdp.on('Network.loadingFinished', (e) => { const r = reqs.get(e.requestId); if (r) { r.bytes = e.encodedDataLength; r.end = e.timestamp; } });
  cdp.on('Network.loadingFailed', (e) => { const r = reqs.get(e.requestId); if (r) { r.failed = e.errorText; } });

  const t0 = Date.now();
  let status = null;
  try {
    const resp = await page.goto(BASE + path, { waitUntil: 'load', timeout: 90000 });
    status = resp && resp.status();
  } catch (e) { console.log('goto error', path, String(e).slice(0, 200)); }
  const loadMs = Date.now() - t0;
  await page.waitForTimeout(6000);
  const nav = await page.evaluate(() => { const n = performance.getEntriesByType('navigation')[0]; const p = performance.getEntriesByType('paint'); return { ttfb: n.responseStart, domContentLoaded: n.domContentLoadedEventEnd, load: n.loadEventEnd, fcp: (p.find(x => x.name === 'first-contentful-paint') || {}).startTime, transfer: n.transferSize, decoded: n.decodedBodySize }; });
  const beforeScroll = await page.evaluate(() => ({ ...window.__perf }));
  const pm = {}; for (const m of (await cdp.send('Performance.getMetrics')).metrics) if (/Duration|JSHeapUsedSize|Nodes|LayoutCount|RecalcStyleCount/.test(m.name)) pm[m.name] = m.name.endsWith('Duration') ? Math.round(m.value * 1000) : m.value;
  const reqsBeforeScroll = reqs.size;

  // static inventory + images + fonts + dom (before scrolling so we know what is above the fold)
  const inv = await page.evaluate(() => {
    const vh = innerHeight;
    const scripts = [...document.scripts].map(s => ({ src: s.src || null, async: s.async, defer: s.defer, type: s.type || '', inlineBytes: s.src ? 0 : s.textContent.length, id: s.id || '', inHead: !!s.closest('head') }));
    const styles = [...document.querySelectorAll('link[rel~="stylesheet"]')].map(l => ({ href: l.href, media: l.media, id: l.id }));
    const inlineStyleBytes = [...document.querySelectorAll('style')].reduce((a, s) => a + s.textContent.length, 0);
    const preloads = [...document.querySelectorAll('link[rel="preload"],link[rel="preconnect"],link[rel="dns-prefetch"],link[rel="modulepreload"]')].map(l => ({ rel: l.rel, href: l.href, as: l.getAttribute('as') }));
    const imgs = [...document.images].map(i => { const r = i.getBoundingClientRect(); return { src: (i.currentSrc || i.src).slice(0, 220), nw: i.naturalWidth, nh: i.naturalHeight, rw: Math.round(r.width), rh: Math.round(r.height), top: Math.round(r.top + scrollY), aboveFold: r.top < vh && r.bottom > 0 && r.width > 0, loading: i.getAttribute('loading'), fp: i.getAttribute('fetchpriority'), wAttr: i.getAttribute('width'), hAttr: i.getAttribute('height'), srcset: !!i.getAttribute('srcset'), sizes: i.getAttribute('sizes'), cls: (i.className || '').toString().slice(0, 60), visible: r.width > 0 && r.height > 0, lazyData: i.getAttribute('data-lazy-src') || i.getAttribute('data-src') || null }; });
    const bgImgs = [];
    let all = document.getElementsByTagName('*');
    let maxDepth = 0, deepest = null;
    for (const el of all) { let d = 0, n = el; while (n.parentElement) { d++; n = n.parentElement; } if (d > maxDepth) { maxDepth = d; deepest = el; } }
    const maxChildren = [...all].reduce((m, el) => Math.max(m, el.children.length), 0);
    const fonts = [...document.fonts].map(f => ({ family: f.family, weight: f.weight, style: f.style, status: f.status, display: f.display }));
    const fontFaceDisplay = [];
    for (const sh of document.styleSheets) { let rules; try { rules = sh.cssRules; } catch (e) { fontFaceDisplay.push({ sheet: sh.href, blocked: true }); continue; } for (const r of rules) { if (r.type === 5) fontFaceDisplay.push({ sheet: (sh.href || 'inline').slice(0, 140), family: r.style.getPropertyValue('font-family'), weight: r.style.getPropertyValue('font-weight'), display: r.style.getPropertyValue('font-display') || '(none)' }); } }
    const html = document.documentElement.outerHTML;
    return {
      domElements: all.length, maxDepth, deepestPath: (() => { const p = []; let n = deepest; while (n && p.length < 40) { p.unshift(n.tagName.toLowerCase() + (n.classList[0] ? '.' + n.classList[0] : '')); n = n.parentElement; } return p.join('>'); })(), maxChildren,
      elementorEls: document.querySelectorAll('.elementor-element').length, econ: document.querySelectorAll('.e-con').length, divs: document.getElementsByTagName('div').length,
      htmlChars: html.length, scripts, styles, inlineStyleBytes, preloads, imgs, fonts, fontFaceDisplay,
      hasRecaptchaTag: [...document.scripts].filter(s => /recaptcha/.test(s.src)).map(s => s.src),
      wpcf7: !!document.querySelector('.wpcf7'), forms: document.forms.length,
    };
  });

  // scroll to bottom slowly then interact, to see lazily-injected scripts (ads etc.)
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { scrollTo(0, y); await new Promise(r => setTimeout(r, 250)); } });
  await page.mouse.move(100, 200).catch(() => {});
  await page.touchscreen?.tap?.(5, 400).catch(() => {});
  await page.waitForTimeout(5000);
  const afterScroll = await page.evaluate(() => ({ ...window.__perf, domElements: document.getElementsByTagName('*').length, scripts: [...document.scripts].map(s => s.src).filter(Boolean),
    ads: { pbjs: typeof window.pbjs !== 'undefined' ? { version: window.pbjs.version || null, adUnits: (window.pbjs.adUnits || []).length } : null,
      gptSlots: (window.googletag && googletag.pubads && googletag.pubads().getSlots) ? googletag.pubads().getSlots().map(s => s.getSlotElementId() + ' ' + s.getAdUnitPath()) : null,
      iframes: [...document.querySelectorAll('iframe')].map(f => { const r = f.getBoundingClientRect(); return (f.src || f.id || f.name || '').slice(0, 90) + ` ${Math.round(r.width)}x${Math.round(r.height)}`; }) } }));

  const list = [...reqs.values()];
  const sum = (arr) => arr.reduce((a, r) => a + (r.bytes || 0), 0);
  const host = (u) => { try { return new URL(u).host; } catch { return u.slice(0, 30); } };
  const byHost = {};
  for (const r of list) { const h = host(r.url); byHost[h] = byHost[h] || { n: 0, bytes: 0 }; byHost[h].n++; byHost[h].bytes += r.bytes || 0; }
  const byType = {};
  for (const r of list) { const t = r.type || '?'; byType[t] = byType[t] || { n: 0, bytes: 0 }; byType[t].n++; byType[t].bytes += r.bytes || 0; }
  const rec = { path, mode, status, loadMs, nav, beforeScroll, pm, afterScroll: { cls: afterScroll.cls, lcpLast: afterScroll.lcp.at(-1), longtasks: afterScroll.longtasks.length, tbtApprox: afterScroll.longtasks.reduce((a, l) => a + Math.max(0, l.d - 50), 0), domElements: afterScroll.domElements, shifts: afterScroll.shifts, ads: afterScroll.ads, scriptsAdded: afterScroll.scripts.filter(s => !inv.scripts.some(x => x.src === s)) },
    requestsBeforeScroll: reqsBeforeScroll, requestsTotal: list.length, bytesTotal: sum(list), byHost, byType, inv,
    requests: list.map(r => ({ url: r.url.slice(0, 250), type: r.type, status: r.status, bytes: r.bytes, enc: r.enc, cc: r.cc, prio: r.prio, failed: r.failed, dur: r.end && r.start ? Math.round((r.end - r.start) * 1000) : null })) };
  results.push(rec);
  const tbt = beforeScroll.longtasks.reduce((a, l) => a + Math.max(0, l.d - 50), 0);
  console.log(`${mode}${process.env.TAG || ''} ${path} pm=${JSON.stringify(pm)} status=${status} load=${loadMs}ms ttfb=${Math.round(nav.ttfb)} fcp=${Math.round(nav.fcp)} lcp=${Math.round((beforeScroll.lcp.at(-1) || {}).t)} cls=${beforeScroll.cls.toFixed(3)} longtasks=${beforeScroll.longtasks.length} tbt~${Math.round(tbt)} reqs=${list.length} bytes=${Math.round(sum(list) / 1024)}KiB dom=${inv.domElements} depth=${inv.maxDepth}`);
  await page.screenshot({ path: `${OUT}/${mode}${process.env.TAG || ''}${path.replace(/\//g, '_') || '_home'}.png` }).catch(() => {});
  await ctx.close();
  await new Promise(r => setTimeout(r, 15000));
}
await browser.close();
const f = `${OUT}/pw_${mode}${process.env.TAG || ''}.json`;
console.log('asset cache stats', JSON.stringify(cstats));
let prev = [];
try { prev = JSON.parse(fs.readFileSync(f, 'utf8')); } catch {}
fs.writeFileSync(f, JSON.stringify(prev.filter(p => !paths.includes(p.path)).concat(results), null, 1));
console.log('wrote', f);
