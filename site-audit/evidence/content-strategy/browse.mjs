import { chromium } from 'playwright';
import fs from 'fs';
const OUT = 'agent-work/content-strategy';
const urls = [
  ['upcoming', 'https://blog.123greetings.com/upcoming-events/'],
  ['home', 'https://blog.123greetings.com/'],
  ['wtw', 'https://blog.123greetings.com/what-to-write-in-a-card/'],
];
const browser = await chromium.launch({ channel: 'chromium' });
const ctx = await browser.newContext({ viewport: { width: 1366, height: 900 }, userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36 audit' });
const res = {};
for (const [k, u] of urls) {
  const page = await ctx.newPage();
  const resp = await page.goto(u, { waitUntil: 'networkidle', timeout: 60000 }).catch(e => null);
  await page.waitForTimeout(2500);
  const info = await page.evaluate(() => {
    const main = document.querySelector('#main, main, .elementor[data-elementor-type=wp-page], .penci-wrapper-data, article') || document.body;
    const content = document.querySelector('.elementor[data-elementor-type=wp-page]') || document.querySelector('.entry-content') || main;
    const txt = (content.innerText || '').trim();
    const heads = [...document.querySelectorAll('h1,h2,h3')].filter(h => h.offsetParent).map(h => h.tagName + ':' + h.innerText.trim()).slice(0, 60);
    const upcoming = [...document.querySelectorAll('h2,h3')].map(h => h.innerText.trim());
    const iframes = [...document.querySelectorAll('iframe')].map(f => f.src).slice(0, 10);
    const emptyWidgets = [...document.querySelectorAll('.elementor-widget')].filter(w => !w.innerText.trim()).map(w => w.getAttribute('data-widget_type')).slice(0, 30);
    return { title: document.title, contentChars: txt.length, contentText: txt.slice(0, 1500), heads, iframes, emptyWidgets, bodyChars: document.body.innerText.length };
  });
  info.status = resp ? resp.status() : null;
  await page.screenshot({ path: `${OUT}/${k}.png`, fullPage: k === 'upcoming' });
  res[k] = info;
  await page.close();
  await new Promise(r => setTimeout(r, 3000));
}
fs.writeFileSync(`${OUT}/browse.json`, JSON.stringify(res, null, 1));
console.log(JSON.stringify(res, null, 1).slice(0, 9000));
await browser.close();
