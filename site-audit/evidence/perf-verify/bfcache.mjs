// Is the page eligible for the back/forward cache? Load A, navigate to B, go back, read CDP bfcache events.
import { chromium } from 'playwright';
import fs from 'node:fs'; import crypto from 'node:crypto';
const BASE = 'https://blog.123greetings.com';
const CACHES = ['agent-work/accessibility/cache', 'agent-work/performance/cache', 'agent-work/perf-verify/cache'];
const [A, B] = process.argv.slice(2);
const browser = await chromium.launch({ channel: 'chromium' });
const ctx = await browser.newContext({ viewport: { width: 412, height: 823 }, deviceScaleFactor: 2.625, isMobile: true, hasTouch: true, userAgent: 'Mozilla/5.0 (Linux; Android 11; moto g power (2022)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Mobile Safari/537.36' });
await ctx.route(/^https:\/\/blog\.123greetings\.com\/(wp-content|wp-includes|_jb_static)\//, async (route) => {
  const url = route.request().url(); const key = crypto.createHash('sha1').update(url).digest('hex');
  for (const c of CACHES) { const f = `${c}/${key}`; if (fs.existsSync(f + '.json')) { const m = JSON.parse(fs.readFileSync(f + '.json', 'utf8')); return route.fulfill({ status: 200, headers: m.headers, body: fs.readFileSync(f + '.bin') }); } }
  const resp = await route.fetch().catch(() => null); if (!resp) return route.abort(); return route.fulfill({ response: resp });
});
await ctx.addInitScript(() => { addEventListener('pageshow', (e) => { sessionStorage.setItem('__ps', String(e.persisted)); }); });
const page = await ctx.newPage();
const cdp = await ctx.newCDPSession(page);
await cdp.send('Page.enable');
const events = [];
cdp.on('Page.backForwardCacheNotUsed', (e) => events.push(e));
await page.goto(BASE + A, { waitUntil: 'load', timeout: 60000 });
await page.waitForTimeout(4000);
await page.evaluate(() => { window.__marker = 'still-here'; });
const link = page.locator('a[href$="' + B + '"]').first(); console.log('link count', await page.locator('a[href$="' + B + '"]').count()); await Promise.all([page.waitForNavigation({ waitUntil: 'load', timeout: 60000 }), page.evaluate((b) => { const a = [...document.querySelectorAll('a')].find(x => x.href.endsWith(b)); a.removeAttribute('target'); a.click(); }, B)]);
await page.waitForTimeout(3000);
await page.goBack({ waitUntil: 'load', timeout: 60000 });
await page.waitForTimeout(2000);
const r = await page.evaluate(() => ({ marker: window.__marker || null, navType: performance.getEntriesByType('navigation')[0].type, persisted: sessionStorage.getItem('__ps') }));
console.log(JSON.stringify({ A, B, restoredFromBfcache: r.marker === 'still-here', r, notUsed: events.map(e => ({ reasons: (e.notRestoredExplanations || []).map(x => `${x.type}:${x.reason}${x.context ? ' (' + x.context + ')' : ''}`), tree: e.notRestoredExplanationsTree ? JSON.stringify(e.notRestoredExplanationsTree).slice(0, 800) : null })) }, null, 1));
await browser.close();
