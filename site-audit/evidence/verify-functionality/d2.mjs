// Google CSE coverage on /what-to-write-in-a-card/ for queries the WP search fails on.
import { chromium } from 'playwright';
import fs from 'node:fs';
import { newCtx, openClean, sleep, SHOTS, OUT, loadCount } from './lib.mjs';

const res = { queries: {} };
const browser = await chromium.launch({ channel: 'chromium' });
const ctx = await newCtx(browser, 'desktop');
const { page, log } = await openClean(ctx, '/what-to-write-in-a-card/', { wait: 7000 });
res.status = log.status;
await page.evaluate(() => document.querySelector('.cc-window .cc-dismiss')?.click());
res.cseBox = await page.evaluate(() => { const i = document.querySelector('input.gsc-input'); if (!i) return null; const r = i.getBoundingClientRect(); return { placeholder: i.placeholder, docTop: Math.round(r.top + scrollY) }; });
for (const q of ['tap dance', 'sympathy', 'honey month', 'birthday messages for dad']) {
  const inp = page.locator('input.gsc-input').first();
  await inp.scrollIntoViewIfNeeded();
  await inp.fill(q);
  await inp.press('Enter');
  await sleep(4500);
  res.queries[q] = await page.evaluate(() => {
    const results = [...document.querySelectorAll('.gsc-webResult.gsc-result')].filter((r) => r.innerText.trim());
    const none = document.querySelector('.gs-no-results-result');
    return { n: results.length, noResults: !!(none && none.offsetParent), links: results.slice(0, 6).map((r) => { const a = r.querySelector('a.gs-title'); return a ? a.href.replace('https://blog.123greetings.com', '') : null; }) };
  });
  await page.screenshot({ path: `${SHOTS}/d_wtw_cse_${q.replace(/\s+/g, '_')}.png` });
  // close overlay if any
  await page.keyboard.press('Escape');
  await page.evaluate(() => document.querySelector('.gsc-results-close-btn')?.click());
  await sleep(800);
}
res.loads = loadCount();
fs.writeFileSync(`${OUT}/d2.json`, JSON.stringify(res, null, 1));
console.log(JSON.stringify(res, null, 1));
await browser.close();
