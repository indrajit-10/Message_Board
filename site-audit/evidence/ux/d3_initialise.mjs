// (a) clean homepage load via asset cache: any JS errors left?  (b) simulate the cookie-consent lib failing (as with the 429 seen earlier)
import { launch, newCtx, open, openClean, cls, save, sleep, SHOTS, assetStats, loadCount } from './lib.mjs';
const browser = await launch();
const R = {};
{
  const ctx = await newCtx(browser, 'desktop');
  const { page, log } = await openClean(ctx, '/', { wait: 10000 });
  R.clean = { status: log.status, http: log.http, pageErrors: log.pageErrors, console: log.console.filter(c => !/WebGL/.test(c.text)), cls: await cls(page), cc: await page.evaluate(() => typeof window.cookieconsent), banner: await page.locator('.cc-window').isVisible().catch(() => false) };
  await page.screenshot({ path: `${SHOTS}/d_home_clean.png` });
  await ctx.close();
}
await sleep(5000);
{
  const ctx = await newCtx(browser, 'desktop', {}, { failRe: /cookieNSCconsent\.min\.js/ });
  const { page, log } = await open(ctx, '/', { wait: 6000 });
  R.simulated = { status: log.status, pageErrors: log.pageErrors, banner: await page.locator('.cc-window').count(), cc: await page.evaluate(() => typeof window.cookieconsent) };
  await ctx.close();
}
R.assetStats = assetStats; R.loads = loadCount();
save('d3_initialise', R);
console.log(JSON.stringify(R, null, 1).slice(0, 12000));
await browser.close();
