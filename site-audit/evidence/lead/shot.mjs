import { chromium } from 'playwright';
const b = await chromium.launch({ channel: 'chromium' });
const errs = [];
for (const [name, opts] of [['desk-light', { viewport: { width: 1280, height: 1600 }, colorScheme: 'light' }], ['phone-dark', { viewport: { width: 390, height: 1400 }, colorScheme: 'dark', isMobile: true }]]) {
  const ctx = await b.newContext(opts); const p = await ctx.newPage();
  p.on('pageerror', (e) => errs.push(String(e))); p.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
  await p.goto('file:///home/user/Message_Board/site-audit/report/index.html'); await p.waitForTimeout(1500);
  const ov = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  await p.screenshot({ path: `/tmp/claude-0/-home-user-Message-Board/470086b4-ae07-5959-9255-b4430b1fdafc/scratchpad/${name}.png` });
  console.log(name, 'overflow', ov);
  await ctx.close();
}
console.log('errors', errs.slice(0, 5));
await b.close();
