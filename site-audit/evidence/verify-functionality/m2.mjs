// Mobile: which '#' links are visible, hamburger size, header-collapse shift on a post template.
import { chromium } from 'playwright';
import fs from 'node:fs';
import { newCtx, openClean, sleep, cls, SHOTS, OUT, loadCount } from './lib.mjs';

const res = {};
const browser = await chromium.launch({ channel: 'chromium' });
const ctx = await newCtx(browser, 'mobile');
for (const path of ['/birthday-messages-for-mom/', '/mothers-day-messages-for-wife-what-she-actually-wants/']) {
  const { page, log } = await openClean(ctx, path, { wait: 6000 });
  await page.evaluate(() => document.querySelector('.cc-window .cc-dismiss')?.click());
  await sleep(600);
  const r = { status: log.status, n429: log.n429 };
  r.hashLinks = await page.evaluate(() => [...document.querySelectorAll('a[href="#"], a[href^="#"]')].map((a) => {
    const b = a.getBoundingClientRect(); const cs = getComputedStyle(a);
    return { href: a.getAttribute('href'), text: (a.innerText || a.getAttribute('aria-label') || a.title || '').trim().slice(0, 30), target: a.target, rect: [b.x, b.y, b.width, b.height].map(Math.round), visible: b.width > 0 && b.height > 0 && cs.visibility !== 'hidden' && b.right > 0 && b.left < innerWidth, parent: (a.closest('[id]') || {}).id || '', cls: a.className.slice(0, 40) };
  }).filter((x) => x.visible));
  r.burger = await page.evaluate(() => { const b = document.querySelector('.button-menu-mobile'); const x = b.getBoundingClientRect(); return { rect: [x.x, x.y, x.width, x.height].map(Math.round), tabindex: b.getAttribute('tabindex'), role: b.getAttribute('role') }; });
  const before = (await cls(page)).value;
  await page.evaluate(() => window.scrollTo(0, 100));
  await sleep(1000);
  const after = await cls(page);
  r.headerShift = { before: +before.toFixed(4), after: +after.value.toFixed(4), last: after.entries.slice(-1) };
  res[path] = r;
  await page.close();
  await sleep(3000);
}
res.loads = loadCount();
fs.writeFileSync(`${OUT}/m2.json`, JSON.stringify(res, null, 1));
console.log(JSON.stringify(res, null, 1));
await browser.close();
