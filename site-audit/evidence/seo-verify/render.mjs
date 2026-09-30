import { chromium } from 'playwright';
import fs from 'fs';
const posts = new Set(Object.entries(JSON.parse(fs.readFileSync('data/pages.json','utf8'))).filter(([u,r])=>r.type==='post').map(([u])=>u));
const sleep = ms => new Promise(r=>setTimeout(r,ms));
const browser = await chromium.launch({ channel: 'chromium' });
const out = {};
async function collect(page){
  return await page.evaluate(()=>{
    const as=[...document.querySelectorAll('a[href]')];
    return as.map(a=>{const r=a.getBoundingClientRect(); const cs=getComputedStyle(a); return {href:a.href, text:(a.innerText||'').trim().slice(0,60), vis: r.width>0&&r.height>0&&cs.visibility!=='hidden'}});
  });
}
// 1 home desktop
{
  const ctx = await browser.newContext({ viewport:{width:1366,height:900} });
  const page = await ctx.newPage();
  await page.goto('https://blog.123greetings.com/', {waitUntil:'networkidle', timeout:60000});
  const navItems = await page.$$('#navigation .menu > li, nav .menu > li, .penci-menu-hbg li, header .menu-item');
  for (const li of navItems){ try{ await li.hover({timeout:1000}); await sleep(200);}catch(e){} }
  for (let y=0;y<20;y++){ await page.mouse.wheel(0,1200); await sleep(250); }
  await sleep(1500);
  const links = await collect(page);
  const uniq=[...new Set(links.map(l=>l.href.split('#')[0]))];
  const internal=uniq.filter(h=>h.includes('blog.123greetings.com'));
  out.home={unique:uniq.length, internal:internal.length, toPosts: uniq.filter(h=>posts.has(h)), toArch: uniq.filter(h=>/\/(archive|category|author|tag)\//.test(h)),
    nav: await page.evaluate(()=>[...document.querySelectorAll('#navigation .menu > li > a, .main-navigation .menu > li > a, nav#navigation a')].map(a=>a.innerText.trim()+' -> '+a.getAttribute('href')))};
  await page.screenshot({path:'agent-work/seo-verify/shots/home.png'});
  await ctx.close();
}
await sleep(3000);
// 2 archive
{
  const ctx = await browser.newContext({ viewport:{width:1366,height:900} });
  const page = await ctx.newPage();
  await page.goto('https://blog.123greetings.com/archive/', {waitUntil:'networkidle', timeout:60000});
  const before = (await collect(page)).filter(l=>posts.has(l.href));
  const btn = await page.$('.penci-ajax-more-button');
  const btnInfo = btn ? await btn.evaluate(b=>({tag:b.tagName, href:b.getAttribute('href'), text:b.innerText, attrs:[...b.attributes].map(a=>a.name+'='+a.value.slice(0,80))})) : null;
  let after=null;
  if (btn){ try{ await btn.click(); await page.waitForLoadState('networkidle'); await sleep(2000); after=(await collect(page)).filter(l=>posts.has(l.href)); }catch(e){ after='ERR '+e.message; } }
  out.archive={postsBefore:new Set(before.map(l=>l.href)).size, btnInfo, postsAfterClick: Array.isArray(after)? new Set(after.map(l=>l.href)).size : after, pagelinks: (await collect(page)).filter(l=>/\/page\/\d/.test(l.href)).map(l=>l.href)};
  await ctx.close();
}
await sleep(3000);
// 3 message page and upcoming events and a post
for (const u of ['https://blog.123greetings.com/birthday-messages-for-mom/','https://blog.123greetings.com/upcoming-events/','https://blog.123greetings.com/mothers-day-messages-for-mom-what-to-write-when-she-saved-it-all/']){
  const ctx = await browser.newContext({ viewport:{width:1366,height:900} });
  const page = await ctx.newPage();
  await page.goto(u, {waitUntil:'networkidle', timeout:60000});
  for (let y=0;y<15;y++){ await page.mouse.wheel(0,1200); await sleep(250); }
  await sleep(2000);
  const info = await page.evaluate(()=>{
    const main=document.querySelector('.elementor[data-elementor-type=wp-page]')||document.querySelector('.entry-content')||document.querySelector('#main')||document.body;
    const txt=main.innerText||'';
    const q=(txt.match(/“[^”]{15,}”/g)||[]).length;
    const hs=[...document.querySelectorAll('h1,h2,h3')].filter(h=>h.getBoundingClientRect().height>0).map(h=>h.tagName+':'+h.innerText.trim().slice(0,50));
    const ml=[...main.querySelectorAll('a[href]')].map(a=>a.href+' | '+a.innerText.trim().slice(0,40));
    const rel=[...document.querySelectorAll('#jp-relatedposts a, .jp-relatedposts a, .penci-related-posts a, .post-related a')].map(a=>a.href);
    return {words: txt.split(/\s+/).filter(Boolean).length, quotes:q, headings:hs.slice(0,20), mainLinks:ml.slice(0,30), related:[...new Set(rel)].slice(0,20), bodyWords: document.body.innerText.split(/\s+/).length};
  });
  out[u]=info;
  await ctx.close();
  await sleep(3000);
}
await browser.close();
fs.writeFileSync('agent-work/seo-verify/render.json', JSON.stringify(out,null,1));
console.log(JSON.stringify(out,null,1));
