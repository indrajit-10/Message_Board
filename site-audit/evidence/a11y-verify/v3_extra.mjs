// Verification pass 3: two-H1 post and a second jump-menu hub. 2 page loads.
// Run: cd /home/user/Message_Board/site-audit && node agent-work/a11y-verify/v3_extra.mjs
import { launch, newCtx, open, axTree, save, sleep, loadCount, assetStats } from './vlib.mjs';

const browser = await launch();
const R = {};
const ctx = await newCtx(browser, 'desktop');
{
  const { page, log } = await open(ctx, '/19th-may-your-week-with-bob/', { wait: 5000 });
  const ax = await axTree(page);
  R.twoH1 = { log,
    axH1: ax.filter((n) => n.role?.value === 'heading' && (n.properties || []).find((p) => p.name === 'level')?.value?.value === 1).map((n) => n.name?.value),
    domH1: await page.evaluate(() => [...document.querySelectorAll('h1')].map((h) => ({ text: h.textContent.trim().slice(0, 50), vis: h.getBoundingClientRect().height > 0, cls: h.className, inEntry: !!h.closest('.inner-post-entry, .post-entry') }))) };
  console.log('H1', JSON.stringify(R.twoH1));
  await page.close(); await sleep(7000);
}
{
  const { page, log } = await open(ctx, '/fathers-day-messages/', { wait: 5000 });
  const ax = await axTree(page);
  R.fathers = { log, arrowLinks: ax.filter((n) => n.role?.value === 'link' && /^arrow /i.test(n.name?.value || '')).map((n) => n.name.value),
    imgs: await page.evaluate(() => { const i = [...document.querySelectorAll('img[alt="arrow"]')]; return { total: i.length, visible: i.filter((x) => x.getBoundingClientRect().width > 0).length }; }) };
  console.log('FD', JSON.stringify(R.fathers));
  await page.close();
}
await ctx.close();
save('v3_extra', R);
await browser.close();
console.log('loads', loadCount(), 'assets', JSON.stringify(assetStats));
