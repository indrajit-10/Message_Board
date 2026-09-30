// Can a third-party page frame the blog's contact form? (clickjacking check; nothing is submitted)
import fs from 'node:fs';
import { OUT, SHOTS, launch, newCtx, sleep } from './lib.mjs';
const browser = await launch();
const ctx = await newCtx(browser, 'desktop');
const page = await ctx.newPage();
await page.route('https://attacker.example/**', (r) => r.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><title>frame test</title><h3>Third-party page framing blog.123greetings.com/contact-us/</h3><iframe id="f" src="https://blog.123greetings.com/contact-us/" style="width:1200px;height:700px;border:3px solid red"></iframe>' }));
await page.goto('https://attacker.example/', { waitUntil: 'load', timeout: 90000 });
await sleep(8000);
const frame = page.frames().find((f) => f.url().includes('blog.123greetings.com/contact-us'));
let res = { frameFound: !!frame };
if (frame) {
  res.frameUrl = frame.url();
  res.title = await frame.title().catch(() => null);
  res.form = await frame.evaluate(() => { const f = document.querySelector('form.wpcf7-form'); return f ? { inputs: Array.from(f.querySelectorAll('input,textarea')).filter((i) => i.type !== 'hidden').map((i) => i.name) } : null; }).catch((e) => String(e));
}
await page.screenshot({ path: `${SHOTS}/p5_frame_contact.png` });
fs.writeFileSync(`${OUT}/p5_frame.json`, JSON.stringify(res, null, 1));
console.log(JSON.stringify(res));
await browser.close();
