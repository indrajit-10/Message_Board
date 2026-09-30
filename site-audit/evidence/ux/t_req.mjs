import { launch, newCtx } from './lib.mjs';
const browser = await launch();
const ctx = await newCtx(browser, 'desktop');
try {
  const r = await ctx.request.get('https://blog.123greetings.com/wp-includes/js/jquery/jquery.min.js?ver=3.7.1');
  console.log('ctx.request', r.status(), (await r.body()).length);
} catch (e) { console.log('ERR', String(e).slice(0, 300)); }
await browser.close();
