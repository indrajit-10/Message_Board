// Does the logo (<img width="" height="">) cause a layout shift when it arrives late? Delay it 3 s and watch shifts.
import { chromium } from 'playwright';
import fs from 'node:fs'; import crypto from 'node:crypto';
const BASE = 'https://blog.123greetings.com';
const CACHES = ['agent-work/accessibility/cache', 'agent-work/performance/cache', 'agent-work/perf-verify/cache'];
const browser = await chromium.launch({ channel: 'chromium' });
for (const [path, mobile] of [['/birthday-messages/', true], ['/birthday-messages/', false]]) {
  const ctx = await browser.newContext(mobile ? { viewport: { width: 412, height: 823 }, deviceScaleFactor: 2.625, isMobile: true, hasTouch: true, userAgent: 'Mozilla/5.0 (Linux; Android 11; moto g power (2022)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Mobile Safari/537.36' } : { viewport: { width: 1350, height: 940 } });
  await ctx.route(/^https:\/\/blog\.123greetings\.com\/(wp-content|wp-includes|_jb_static)\//, async (route) => {
    const url = route.request().url();
    if (/123greetings(-1)?\.webp|lettucelebrate/.test(url)) await new Promise(r => setTimeout(r, 3000));
    const key = crypto.createHash('sha1').update(url).digest('hex');
    for (const c of CACHES) { const f = `${c}/${key}`; if (fs.existsSync(f + '.json')) { const m = JSON.parse(fs.readFileSync(f + '.json', 'utf8')); return route.fulfill({ status: 200, headers: m.headers, body: fs.readFileSync(f + '.bin') }); } }
    const resp = await route.fetch().catch(() => null); if (!resp) return route.abort(); return route.fulfill({ response: resp });
  });
  await ctx.addInitScript(() => { window.__s = []; new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__s.push({ v: +e.value.toFixed(4), t: Math.round(e.startTime), src: (e.sources || []).map(s => s.node ? s.node.nodeName + '.' + String(s.node.className).split(' ')[0] : '?') }); }).observe({ type: 'layout-shift', buffered: true }); });
  const page = await ctx.newPage();
  await page.goto(BASE + path, { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(5000);
  const r = await page.evaluate(() => ({ shifts: window.__s, logo: [...document.querySelectorAll('img.penci-mainlogo')].map(i => { const r = i.getBoundingClientRect(); const cs = getComputedStyle(i); const p = i.closest('.penci_nav_col, .pc-builder-element'); return { w: Math.round(r.width), h: Math.round(r.height), cssH: cs.height, maxH: cs.maxHeight, parentH: p ? Math.round(p.getBoundingClientRect().height) : null }; }).filter(x => x.w > 0) }));
  console.log(mobile ? 'mobile' : 'desktop', path, JSON.stringify(r));
  await ctx.close(); await new Promise(r => setTimeout(r, 8000));
}
await browser.close();
