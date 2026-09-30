// Tablet (820x1180) sanity check: overflow, header mode, jump menu, banner.
import { chromium } from 'playwright';
import fs from 'node:fs';
import { newCtx, openClean, sleep, cls, SHOTS, OUT, loadCount } from './lib.mjs';

const res = {};
const browser = await chromium.launch({ channel: 'chromium' });
const ctx = await newCtx(browser, 'mobile', { viewport: { width: 820, height: 1180 }, userAgent: 'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' });
for (const path of ['/fathers-day-messages/']) {
  const { page, log } = await openClean(ctx, path, { wait: 6000 });
  const r = { status: log.status, n429: log.n429 };
  r.banner = await page.evaluate(() => { const w = document.querySelector('.cc-window'); if (!w) return null; const b = w.getBoundingClientRect(); return [b.x, b.y, b.width, b.height].map(Math.round); });
  await page.evaluate(() => document.querySelector('.cc-window .cc-dismiss')?.click());
  await sleep(600);
  r.layout = await page.evaluate(() => {
    const nb = document.querySelector('.penci_navbar_mobile');
    const desk = document.querySelector('.penci-header-builder.main-builder-header');
    const links = [...document.querySelectorAll('a[href^="#"]')].filter((a) => a.getAttribute('href').length > 1 && a.getBoundingClientRect().height > 0);
    const h1 = [...document.querySelectorAll('h1')].find((h) => h.getBoundingClientRect().height > 0);
    return { overflowX: document.documentElement.scrollWidth - innerWidth, mobileNavVisible: nb ? nb.getBoundingClientRect().height : 0, desktopHeaderVisible: desk ? desk.getBoundingClientRect().height : 0, jumpLinks: links.length, jumpFirstTop: links[0] ? Math.round(links[0].getBoundingClientRect().top) : null, jumpLeft: links[0] ? Math.round(links[0].getBoundingClientRect().left) : null, h1Top: h1 ? Math.round(h1.getBoundingClientRect().top) : null, h1Left: h1 ? Math.round(h1.getBoundingClientRect().left) : null };
  });
  const link = page.locator('a[href^="#"]:visible', { hasText: 'Funny' }).first();
  const href = await link.getAttribute('href');
  await link.tap();
  await sleep(1800);
  r.afterJump = await page.evaluate((href) => { const t = document.getElementById(href.slice(1)); const hd = t.querySelector('h2,h3,.elementor-heading-title'); const nb = document.querySelector('.penci_navbar_mobile'); const sticky = document.querySelector('.penci_builder_sticky_header_desktop'); return { headingTop: Math.round((hd || t).getBoundingClientRect().top), mobileNav: nb ? [getComputedStyle(nb).position, Math.round(nb.getBoundingClientRect().bottom)] : null, desktopSticky: sticky ? Math.round(sticky.getBoundingClientRect().bottom) : null }; }, href);
  r.cls = (await cls(page)).value;
  await page.screenshot({ path: `${SHOTS}/t_fathers_after_jump.png` });
  res[path] = r;
  await page.close();
}
res.loads = loadCount();
fs.writeFileSync(`${OUT}/t1.json`, JSON.stringify(res, null, 1));
console.log(JSON.stringify(res, null, 1));
await browser.close();
