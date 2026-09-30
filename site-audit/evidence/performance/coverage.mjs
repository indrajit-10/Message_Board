// CSS + JS coverage for one page (mobile viewport), first-party static assets from the local disk cache.
// Usage (from site-audit/): node agent-work/performance/coverage.mjs /birthday-messages-for-mom/
import { chromium } from 'playwright';
import fs from 'node:fs';
import crypto from 'node:crypto';
const BASE = 'https://blog.123greetings.com';
const STATIC_RE = /^https:\/\/blog\.123greetings\.com\/(wp-content|wp-includes|_jb_static)\//;
const CACHES = ['agent-work/ux/cache', 'agent-work/performance/cache'];
const path = process.argv[2] || '/birthday-messages-for-mom/';
const browser = await chromium.launch({ channel: 'chromium' });
const ctx = await browser.newContext({ viewport: { width: 412, height: 823 }, deviceScaleFactor: 2.625, isMobile: true, hasTouch: true,
  userAgent: 'Mozilla/5.0 (Linux; Android 11; moto g power (2022)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Mobile Safari/537.36' });
await ctx.route(STATIC_RE, async (route) => {
  const url = route.request().url();
  const key = crypto.createHash('sha1').update(url).digest('hex');
  for (const c of CACHES) { const f = `${c}/${key}`; if (fs.existsSync(f + '.json')) { const meta = JSON.parse(fs.readFileSync(f + '.json', 'utf8')); return route.fulfill({ status: 200, headers: meta.headers, body: fs.readFileSync(f + '.bin') }); } }
  const resp = await route.fetch().catch(() => null); if (!resp) return route.abort();
  return route.fulfill({ response: resp });
});
const page = await ctx.newPage();
await page.coverage.startCSSCoverage({ resetOnNavigation: false });
await page.coverage.startJSCoverage({ resetOnNavigation: false });
await page.goto(BASE + path, { waitUntil: 'load', timeout: 60000 });
await page.waitForTimeout(6000);
await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { scrollTo(0, y); await new Promise(r => setTimeout(r, 200)); } });
await page.waitForTimeout(2000);
const css = await page.coverage.stopCSSCoverage();
const js = await page.coverage.stopJSCoverage();
const sum = (entries, isJs) => entries.map(e => {
  const total = isJs ? (e.source || '').length : e.text.length;
  let used = 0;
  if (isJs) { for (const fn of e.functions) for (const r of fn.ranges) if (r.count > 0 && fn.isBlockCoverage === false) used = Math.max(used, 0); // placeholder
    // compute used bytes from block ranges: mark bytes covered by count>0 ranges, then subtract count==0 nested ranges
    const arr = new Uint8Array(total);
    for (const fn of e.functions) for (const r of fn.ranges) arr.fill(r.count > 0 ? 1 : 0, r.startOffset, r.endOffset);
    used = arr.reduce((a, b) => a + b, 0);
  } else { for (const r of e.ranges) used += r.end - r.start; }
  return { url: e.url.slice(0, 150), total, used, pct: total ? Math.round(100 * used / total) : 0 };
}).sort((a, b) => b.total - a.total);
const c = sum(css, false), j = sum(js, true);
const tot = (a, fp) => a.filter(x => fp === undefined || x.url.startsWith(BASE) === fp).reduce((s, x) => ({ total: s.total + x.total, used: s.used + x.used, n: s.n + 1 }), { total: 0, used: 0, n: 0 });
console.log('CSS all', tot(c), 'CSS 1p files', tot(c.filter(x => x.url.startsWith(BASE + '/wp-') || x.url.startsWith(BASE + '/_jb'))), 'CSS inline(page url)', tot(c.filter(x => x.url === BASE + path)));
console.log('JS all', tot(j), 'JS 1p', tot(j, true), 'JS 3p', tot(j, false));
console.log('top CSS'); for (const x of c.slice(0, 15)) console.log(`  ${(x.total / 1024).toFixed(1)}K used ${x.pct}% ${x.url}`);
console.log('top JS'); for (const x of j.slice(0, 15)) console.log(`  ${(x.total / 1024).toFixed(1)}K used ${x.pct}% ${x.url}`);
fs.writeFileSync('agent-work/performance/coverage.json', JSON.stringify({ path, css: c, js: j }, null, 1));
await browser.close();
