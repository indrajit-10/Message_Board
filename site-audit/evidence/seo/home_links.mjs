// Render the home page (desktop + hover over nav) and list rendered links to blog posts/archives.
import { chromium } from 'playwright';
import fs from 'fs';
const P = JSON.parse(fs.readFileSync('data/pages.json'));
const posts = new Set(Object.entries(P).filter(([u, r]) => r.type === 'post').map(([u]) => u));
const browser = await chromium.launch({ channel: 'chromium' });
const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
await page.goto('https://blog.123greetings.com/', { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {});
await page.waitForTimeout(3000);
for (const a of await page.$$('nav a, .menu a')) { try { await a.hover({ timeout: 1000 }); await page.waitForTimeout(300); } catch {} }
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(3000);
const hrefs = await page.$$eval('a[href]', as => as.map(a => a.href.split('#')[0]));
const uniq = [...new Set(hrefs)];
const toPosts = uniq.filter(h => posts.has(h));
const archives = uniq.filter(h => /\/(archive|category|author|tag)\//.test(h));
console.log(JSON.stringify({ totalLinks: hrefs.length, uniqueLinks: uniq.length, toPosts, archives, internal: uniq.filter(h => h.includes('blog.123greetings.com')).length }));
await browser.close();
