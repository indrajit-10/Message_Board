// Does GA4 record a click on an in-content eCard link? (navigation to www is aborted)
import fs from 'node:fs';
import { BASE, OUT, launch, newCtx, sleep, stats } from './lib.mjs';
const PATH = process.argv[2] || '/summer-messages/';
const browser = await launch();
const ctx = await newCtx(browser, 'desktop');
const hits = [];
const t0 = Date.now();
const onReq = (r) => { if (/google-analytics\.com\/g\/collect|analytics\.google\.com\/g\/collect/.test(r.url())) hits.push({ t: Date.now() - t0, url: r.url(), post: r.postData() || '' }); };
ctx.on('page', (p) => p.on('request', onReq));
await ctx.route(/^https:\/\/(www\.|search\.)?123greetings\.com\//, (route) => route.request().resourceType() === 'document' ? route.abort() : route.continue());
const page = await ctx.newPage();
await page.goto(BASE + PATH, { waitUntil: 'load', timeout: 90000 });
await sleep(10000);
// close the cookie banner so it can't intercept the click
await page.evaluate(() => { const b = document.querySelector('.cc-window'); if (b) b.style.display = 'none'; });
const cta = await page.evaluate(() => {
  const a = Array.from(document.querySelectorAll('a[href*="123greetings.com"]')).find((x) => !x.href.includes('blog.123greetings.com') && !x.closest('footer, [class*="footer"], [data-elementor-type="footer"]') && x.offsetParent);
  if (!a) return null; a.setAttribute('data-audit-cta', '1'); a.scrollIntoView({ block: 'center' });
  window.__clicked = 0; document.addEventListener('click', (e) => { if (e.target.closest('a[data-audit-cta]')) window.__clicked++; }, true);
  return { href: a.href, text: a.innerText.trim(), target: a.target };
});
await sleep(1500);
const nBefore = hits.length;
let popup = null;
ctx.once('page', (p) => { popup = p.url(); });
await page.locator('a[data-audit-cta="1"]').click({ timeout: 8000, noWaitAfter: true });
await sleep(12000);
const clicked = await page.evaluate(() => window.__clicked);
for (const p of ctx.pages()) if (p !== page) await p.close().catch(() => {});
await page.bringToFront();
await sleep(3000);
const parse = (h) => { const u = new URL(h.url); const q = Object.fromEntries(u.searchParams.entries()); const evs = [q.en].concat(h.post.split('\n').filter(Boolean).map((l) => new URLSearchParams(l).get('en'))); return { t: h.t, en: evs.filter(Boolean), ep: Object.entries(q).filter(([k]) => /^ep\./.test(k)), post: h.post.slice(0, 600) }; };
const out = { PATH, cta, clicked, popup, before: hits.slice(0, nBefore).map(parse), after: hits.slice(nBefore).map(parse), stats };
fs.writeFileSync(`${OUT}/p3_click.json`, JSON.stringify(out, null, 1));
console.log(JSON.stringify(out, null, 1).slice(0, 4000));
await browser.close();
