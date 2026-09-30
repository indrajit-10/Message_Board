// Archive "Load More Posts" keyboard test (1 load). Run from /home/user/Message_Board/site-audit
import { launch, newCtx, open, save, loadCount } from './lib.mjs';
const browser = await launch();
const ctx = await newCtx(browser, 'desktop');
const { page, log } = await open(ctx, '/archive/', { wait: 6000 });
const rec = { log };
rec.before = await page.evaluate(() => { const a = document.querySelector('a.penci-ajax-more-button'); return { name: a.getAttribute('aria-label'), text: a.innerText.trim(), href: a.getAttribute('href'), posts: document.querySelectorAll('article').length }; });
await page.focus('a.penci-ajax-more-button');
await page.keyboard.press('Enter');
await page.waitForTimeout(6000);
rec.after = await page.evaluate(() => { const ae = document.activeElement; return { posts: document.querySelectorAll('article').length, focusTag: ae.tagName, focusClass: ae.className, focusText: (ae.innerText || '').trim().slice(0, 40), url: location.href, live: [...document.querySelectorAll('[aria-live],[role=status],[role=alert]')].map((x) => x.className).slice(0, 5) }; });
save('a4_loadmore', rec);
console.log(JSON.stringify(rec), 'loads', loadCount());
await browser.close();
