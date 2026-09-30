// Targeted probe: (1) which element causes the ~0.08 layout shift that appears when the user scrolls
// (sticky header?), (2) the post's LCP element (CSS background-image) and (3) hero/logo sizing CSS.
// Static first-party assets are served from the local disk cache (no timing claims from this script).
// Usage (from site-audit/): node agent-work/performance/probe_cls.mjs /tag/alps/ /mothers-day-messages-for-wife-what-she-actually-wants/ /
import { chromium } from 'playwright';
import fs from 'node:fs';
import crypto from 'node:crypto';
const BASE = 'https://blog.123greetings.com';
const STATIC_RE = /^https:\/\/blog\.123greetings\.com\/(wp-content|wp-includes|_jb_static)\//;
const CACHES = ['agent-work/ux/cache', 'agent-work/performance/cache'];
const browser = await chromium.launch({ channel: 'chromium' });
const out = [];
for (const path of process.argv.slice(2)) {
  const ctx = await browser.newContext({ viewport: { width: 412, height: 823 }, deviceScaleFactor: 2.625, isMobile: true, hasTouch: true,
    userAgent: 'Mozilla/5.0 (Linux; Android 11; moto g power (2022)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Mobile Safari/537.36' });
  await ctx.route(STATIC_RE, async (route) => {
    const url = route.request().url();
    const key = crypto.createHash('sha1').update(url).digest('hex');
    for (const c of CACHES) { const f = `${c}/${key}`; if (fs.existsSync(f + '.json')) { const meta = JSON.parse(fs.readFileSync(f + '.json', 'utf8')); return route.fulfill({ status: 200, headers: meta.headers, body: fs.readFileSync(f + '.bin') }); } }
    const resp = await route.fetch().catch(() => null); if (!resp) return route.abort();
    return route.fulfill({ response: resp });
  });
  await ctx.addInitScript(() => {
    window.__shifts = [];
    new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__shifts.push({ v: +e.value.toFixed(4), t: Math.round(e.startTime), input: e.hadRecentInput, y: Math.round(scrollY),
      src: (e.sources || []).map(s => ({ n: s.node ? (s.node.nodeName + '.' + String(s.node.className || '').split(' ').slice(0, 3).join('.')) : '?', prev: s.previousRect && [Math.round(s.previousRect.y), Math.round(s.previousRect.height)], cur: s.currentRect && [Math.round(s.currentRect.y), Math.round(s.currentRect.height)] })) }); }).observe({ type: 'layout-shift', buffered: true });
  });
  const page = await ctx.newPage();
  await page.goto(BASE + path, { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(5000);
  const pre = await page.evaluate(() => window.__shifts.length);
  const headerStates = [];
  for (let y = 100; y <= 1200; y += 100) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(400);
    headerStates.push(await page.evaluate((yy) => {
      const cand = [...document.querySelectorAll('.penci_header, .penci_stickybar, .penci-header-mobile, #penci-header-mobile, header, .elementor-location-header, .penci_mobile_midbar, .sticky-wrapper, .penci-mobile-header')].slice(0, 6);
      return { y: yy, shifts: window.__shifts.length, els: cand.map(e => { const cs = getComputedStyle(e); const r = e.getBoundingClientRect(); return `${e.tagName}.${String(e.className).split(' ').slice(0, 4).join('.')} pos=${cs.position} top=${Math.round(r.top)} h=${Math.round(r.height)}`; }) };
    }, y));
  }
  const info = await page.evaluate(() => {
    const bg = document.querySelector('.penci-single-featured-img, span.attachment-penci-full-thumb');
    const hero = document.querySelector('img[data-jp-lcp-optimized]');
    const logo = document.querySelector('img.penci-mainlogo');
    const cssOf = (el) => { if (!el) return null; const cs = getComputedStyle(el); const r = el.getBoundingClientRect(); return { tag: el.tagName, cls: String(el.className).slice(0, 100), w: cs.width, h: cs.height, ar: cs.aspectRatio, maxW: cs.maxWidth, attrW: el.getAttribute('width'), attrH: el.getAttribute('height'), bg: cs.backgroundImage.slice(0, 200), rect: [Math.round(r.width), Math.round(r.height)], style: (el.getAttribute('style') || '').slice(0, 200), loading: el.getAttribute('loading'), fp: el.getAttribute('fetchpriority') }; };
    const preloads = [...document.querySelectorAll('link[rel=preload]')].map(l => `${l.getAttribute('as')} ${l.href.slice(0, 140)} fp=${l.getAttribute('fetchpriority')}`);
    return { bg: cssOf(bg), hero: cssOf(hero), logo: cssOf(logo), preloads };
  });
  const shifts = await page.evaluate(() => window.__shifts);
  out.push({ path, preScrollShifts: pre, shifts, headerStates, info });
  console.log(JSON.stringify({ path, shifts: shifts.filter(s => s.v > 0.002), info }, null, 1).slice(0, 4000));
  console.log('header states', JSON.stringify(headerStates.filter((h, i, a) => i === 0 || h.shifts !== a[i - 1].shifts || JSON.stringify(h.els) !== JSON.stringify(a[i - 1].els)), null, 1).slice(0, 2500));
  await ctx.close();
  await new Promise(r => setTimeout(r, 12000));
}
fs.writeFileSync('agent-work/performance/probe_cls.json', JSON.stringify(out, null, 1));
await browser.close();
