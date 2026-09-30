// Desktop: clean homepage load (retry on 429), keyboard order from top, 'initialise' root cause repro.
import { launch, newCtx, open, openClean, cls, save, sleep, SHOTS, loadCount } from './lib.mjs';

const browser = await launch();
const R = {};

// 1. clean homepage load in a fresh context
{
  const ctx = await newCtx(browser, 'desktop');
  const { page, log } = await openClean(ctx, '/', { wait: 10000 });
  R.home = { log };
  R.home.cls = await cls(page);
  await page.screenshot({ path: `${SHOTS}/d_home_clean.png` });
  // keyboard: focus from very top (no click)
  await page.evaluate(() => { window.scrollTo(0, 0); document.activeElement && document.activeElement.blur(); });
  R.home.tabs = [];
  for (let i = 0; i < 14; i++) {
    await page.keyboard.press('Tab');
    await sleep(200);
    R.home.tabs.push(await page.evaluate(() => {
      const e = document.activeElement;
      if (!e || e === document.body) return { tag: 'body' };
      const r = e.getBoundingClientRect();
      const cs = getComputedStyle(e);
      return {
        tag: e.tagName.toLowerCase(), text: (e.innerText || e.getAttribute('aria-label') || e.getAttribute('placeholder') || '').trim().slice(0, 40), href: e.getAttribute('href'),
        onScreen: r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth,
        rect: [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)],
        outline: cs.outlineStyle + ' ' + cs.outlineWidth, shadow: cs.boxShadow !== 'none',
        ctx: (e.closest('#penci_off_canvas, #sidebar-nav, .penci_header, .elementor, footer')?.id || e.closest('#penci_off_canvas, #sidebar-nav, .penci_header, .elementor, footer')?.className || '').toString().slice(0, 50),
      };
    }));
    if (i === 2) await page.screenshot({ path: `${SHOTS}/d_home_focus_tab3.png`, clip: { x: 0, y: 0, width: 1366, height: 200 } });
  }
  await page.close();
  await ctx.close();
}

await sleep(4000);
// 2. root cause of "Cannot read properties of undefined (reading 'initialise')":
//    block the cookie-consent library (simulating the 429 seen earlier) and observe.
{
  const ctx = await newCtx(browser, 'desktop');
  await ctx.route(/cookieNSCconsent\.min\.js/, (route) => route.fulfill({ status: 429, body: 'Too Many Requests' }));
  const { page, log } = await open(ctx, '/', { wait: 6000 });
  R.initialiseRepro = { pageErrors: log.pageErrors, banner: await page.locator('.cc-window').count(), http: log.http.filter((h) => h.includes('cookie')) };
  await page.close();
  await ctx.close();
}

R.loads = loadCount();
save('d2_home_clean', R);
console.log(JSON.stringify({ ...R, home: { ...R.home, log: { ...R.home.log, console: R.home.log.console.filter((c) => !/WebGL/.test(c.text)) } } }, null, 1).slice(0, 15000));
await browser.close();
