import { launch, newCtx, open, sleep } from './lib.mjs';
const browser = await launch();
const ctx = await newCtx(browser, 'desktop');
const { page, log } = await open(ctx, '/', { wait: 6000 });
const html = await page.content();
const resp = await page.evaluate(() => ({
  nsc: [...document.querySelectorAll('script[id^=nsc]')].map(s => ({ id: s.id, src: s.src, len: s.textContent.length })),
  inline: [...document.scripts].filter(s => s.textContent.includes('initialise')).map(s => s.id + ':' + s.textContent.slice(0, 120)),
  cc: typeof window.cookieconsent,
  ccWin: !!document.querySelector('.cc-window'),
  jb: [...document.scripts].filter(s => s.src.includes('_jb_static')).map(s => s.src),
}));
console.log(JSON.stringify({ resp, http: log.http, pageErrors: log.pageErrors.map(e=>e.msg) }, null, 1));
await browser.close();
