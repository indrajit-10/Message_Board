// Compare rendered DOM text with raw HTML for pages whose raw HTML looks thin.
import { chromium } from 'playwright';
const urls = process.argv.slice(2);
const browser = await chromium.launch({ channel: 'chromium' });
const ctx = await browser.newContext({ userAgent: 'Mozilla/5.0 (compatible; 123GreetingsSiteAudit/1.0; SEO)' });
for (const u of urls) {
  const page = await ctx.newPage();
  const resp = await page.goto(u, { waitUntil: 'networkidle', timeout: 60000 }).catch(e => null);
  await page.waitForTimeout(2500);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(2500);
  const res = await page.evaluate(() => {
    const main = document.querySelector('.elementor[data-elementor-type=wp-page]') || document.querySelector('.inner-post-entry') || document.body;
    const txt = main.innerText;
    const quotes = (txt.match(/“[^”]{15,}”/g) || []).length;
    const visibleH = [...document.querySelectorAll('h1,h2,h3')].filter(h => h.offsetParent !== null).map(h => h.tagName + ':' + h.innerText.trim().slice(0, 50));
    return { words: txt.split(/\s+/).filter(Boolean).length, quotes, visibleH: visibleH.slice(0, 15) };
  });
  console.log(JSON.stringify({ url: u, status: resp && resp.status(), ...res }));
  await page.close();
  await new Promise(r => setTimeout(r, 3000));
}
await browser.close();
