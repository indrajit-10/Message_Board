import { launch, newCtx, openClean, cls, save, sleep, SHOTS, loadCount } from './lib.mjs';
const browser = await launch();
const R = {};
{
  const ctx = await newCtx(browser, 'mobile');
  await ctx.addCookies([{ name: 'cookieconsent_status', value: 'dismiss', domain: 'blog.123greetings.com', path: '/' }]);
  const { page, log } = await openClean(ctx, '/birthday-messages-for-mom/', { wait: 6000 });
  R.drift = [];
  for (const y of [0, 20, 40, 50, 60, 70, 80, 100, 150]) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await sleep(500);
    R.drift.push(await page.evaluate(() => {
      const h = [...document.querySelectorAll('h1')].find((e) => e.getBoundingClientRect().height > 0);
      const r = h.getBoundingClientRect();
      const nb = document.querySelector('.penci_navbar_mobile'); const cs = getComputedStyle(nb);
      const wrap = nb.parentElement; const wr = wrap.getBoundingClientRect();
      return { sy: Math.round(scrollY), h1ViewportTop: Math.round(r.top), h1DocTop: Math.round(r.top + scrollY), navbar: cs.position + ' ' + nb.className.split(' ').slice(1).join('.'), navbarParentH: Math.round(wr.height) };
    }));
  }
  await page.evaluate(() => window.scrollTo(0, 40)); await sleep(600);
  await page.screenshot({ path: `${SHOTS}/m_mom_scroll40_before_switch.png`, clip: { x: 0, y: 0, width: 390, height: 420 } });
  await page.evaluate(() => window.scrollTo(0, 80)); await sleep(600);
  await page.screenshot({ path: `${SHOTS}/m_mom_scroll80_after_switch.png`, clip: { x: 0, y: 0, width: 390, height: 420 } });
  R.cls = await cls(page);
  await ctx.close();
}
await sleep(4000);
{
  const ctx = await newCtx(browser, 'desktop', { permissions: ['clipboard-read', 'clipboard-write'] });
  await ctx.addCookies([{ name: 'cookieconsent_status', value: 'dismiss', domain: 'blog.123greetings.com', path: '/' }]);
  const { page } = await openClean(ctx, '/mothers-day-messages-for-wife-what-she-actually-wants/', { wait: 6000 });
  const share = page.locator('.post-meta-share').first();
  await share.scrollIntoViewIfNeeded();
  await share.hover(); await sleep(800);
  const cl = page.locator('a.post-share-link').first();
  R.copyLinkVisibleOnHover = await cl.isVisible();
  if (R.copyLinkVisibleOnHover) {
    await page.screenshot({ path: `${SHOTS}/d_post_share_hover.png`, clip: { x: 0, y: 0, width: 1366, height: 600 } });
    const before = ctx.pages().length;
    await cl.click(); await sleep(3000);
    const after = ctx.pages();
    let clip = null; try { clip = await page.evaluate(() => navigator.clipboard.readText()); } catch (e) { clip = 'ERR ' + String(e).slice(0, 60); }
    R.copyLink = { newTabs: after.length - before, newTabUrl: after.length > before ? after[after.length - 1].url() : null, clipboard: clip, feedback: await page.evaluate(() => [...document.querySelectorAll('[class*=copied], [class*=copy-link-mess], .penci-copied-link')].map((e) => e.className + ':' + e.innerText.slice(0, 40))) };
  }
  await ctx.close();
}
R.loads = loadCount();
save('d6_followup', R);
console.log(JSON.stringify(R, null, 1));
await browser.close();
