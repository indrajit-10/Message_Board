// FAQ accordion (Elementor nested accordion) behaviour on a message page: mouse + keyboard.
import { chromium } from 'playwright';
import fs from 'node:fs';
import { newCtx, openClean, sleep, SHOTS, OUT, loadCount } from './lib.mjs';

const res = {};
const browser = await chromium.launch({ channel: 'chromium' });
const ctx = await newCtx(browser, 'mobile');
const { page, log } = await openClean(ctx, '/fathers-day-messages/', { wait: 6000 });
await page.evaluate(() => document.querySelector('.cc-window .cc-dismiss')?.click());
await sleep(600);
res.status = log.status;
const state = () => page.evaluate(() => [...document.querySelectorAll('.e-n-accordion-item')].map((d) => {
  const c = d.querySelector('[role=region], .e-con');
  const r = c ? c.getBoundingClientRect() : null;
  return { open: d.open, title: d.querySelector('.e-n-accordion-item-title-text')?.innerText.trim().slice(0, 40), contentH: r ? Math.round(r.height) : null };
}));
res.initial = await state();
const titles = page.locator('.e-n-accordion-item-title');
await titles.nth(0).scrollIntoViewIfNeeded();
await titles.nth(0).tap();
await sleep(900);
res.afterTap1 = await state();
await titles.nth(1).tap();
await sleep(900);
res.afterTap2 = await state();
// keyboard on 3rd
await titles.nth(2).focus();
await page.keyboard.press('Enter');
await sleep(900);
res.afterEnter3 = await state();
res.focusStyle = await titles.nth(2).evaluate((e) => { const cs = getComputedStyle(e); return cs.outlineStyle + ' ' + cs.outlineWidth + ' / ' + cs.boxShadow; });
res.aria = await titles.nth(2).evaluate((e) => ({ tag: e.tagName, expanded: e.getAttribute('aria-expanded'), controls: e.getAttribute('aria-controls') }));
await page.screenshot({ path: `${SHOTS}/m_fathers_faq.png` });
res.loads = loadCount();
fs.writeFileSync(`${OUT}/d3.json`, JSON.stringify(res, null, 1));
console.log(JSON.stringify(res, null, 1));
await browser.close();
