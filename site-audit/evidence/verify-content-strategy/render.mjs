import { chromium } from 'playwright';
import fs from 'fs';
const OUT='/home/user/Message_Board/site-audit/agent-work/verify-content-strategy/';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const browser = await chromium.launch({ channel: 'chromium' });
const ctx = await browser.newContext({ viewport:{width:1366,height:900}, userAgent:'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36 audit-verify' });
const page = await ctx.newPage();
const res={};
async function go(path){ const r=await page.goto('https://blog.123greetings.com'+path,{waitUntil:'domcontentloaded',timeout:60000}); await sleep(4000); return r.status(); }
async function scrollAll(){ for(let i=0;i<30;i++){ await page.mouse.wheel(0,1500); await sleep(250);} await sleep(2500); }
// 1 wife page
res.wife={status:await go('/birthday-messages-for-wife/')};
res.wife.before=await page.evaluate(()=>[...document.querySelectorAll('.msgs')].filter(e=>e.offsetParent&&e.innerText.replace(/[“”"'\s]/g,'').length).length);
await scrollAll();
res.wife.after=await page.evaluate(()=>[...document.querySelectorAll('.msgs')].filter(e=>e.offsetParent&&e.innerText.replace(/[“”"'\s]/g,'').length).length);
res.wife.quoted=await page.evaluate(()=>{const t=document.body.innerText;return (t.match(/“[^”]{15,}”/g)||[]).length});
res.wife.bylineCandidates=await page.evaluate(()=>{const t=document.body.innerText;return {andrea:/Andrea/i.test(t),updated:/updated|published/i.test(t),year:(t.match(/20\d\d/g)||[]).slice(0,5)}});
res.wife.loadMore=await page.evaluate(()=>[...document.querySelectorAll('a,button')].filter(e=>/load more|show more|more messages/i.test(e.innerText)&&e.offsetParent).map(e=>e.innerText.trim()).slice(0,5));
await page.screenshot({path:OUT+'wife_full.png',fullPage:true});
// 2 homepage trending strip
await sleep(1500);
res.home={status:await go('/')};
res.home.trending=await page.evaluate(()=>{const out=[];document.querySelectorAll('*').forEach(e=>{if(e.children.length<3&&/trending/i.test(e.textContent)&&e.textContent.length<40)out.push(e.tagName+':'+e.textContent.trim())});return out.slice(0,6)});
res.home.trendBlock=await page.evaluate(()=>{const el=[...document.querySelectorAll('*')].find(e=>e.children.length<3&&/trending/i.test(e.textContent)&&e.textContent.length<40); if(!el) return null; let p=el; for(let i=0;i<6&&p;i++){ if(p.querySelectorAll('a').length>=3) break; p=p.parentElement;} return p? {text:p.innerText.slice(0,600), links:[...p.querySelectorAll('a')].map(a=>a.innerText.trim()+' -> '+a.getAttribute('href'))}:null});
await page.screenshot({path:OUT+'home.png',fullPage:false});
// 3 upcoming events
await sleep(1500);
res.upcoming={status:await go('/upcoming-events/')};
await scrollAll();
res.upcoming.mainText=await page.evaluate(()=>{const m=document.querySelector('.elementor[data-elementor-type=wp-page]')||document.querySelector('article')||document.querySelector('#main'); return m? m.innerText.trim().slice(0,500):'(no main el)';});
res.upcoming.bodyLen=await page.evaluate(()=>document.body.innerText.trim().length);
res.upcoming.iframes=await page.evaluate(()=>[...document.querySelectorAll('iframe')].map(f=>f.src).slice(0,10));
await page.screenshot({path:OUT+'upcoming.png',fullPage:true});
// 4 inspiration hub META text visibility
await sleep(1500);
res.insp={status:await go('/inspiration-messages/')};
res.insp.meta=await page.evaluate(()=>{const els=[...document.querySelectorAll('p,div,span,h1,h2,h3,li')].filter(e=>/META TITLE|KEY PHRASE/.test(e.innerText||'')&&e.children.length<4);return els.map(e=>({tag:e.tagName,visible:!!(e.offsetWidth||e.offsetHeight||e.getClientRects().length),text:e.innerText.slice(0,200)})).slice(0,4)});
await page.screenshot({path:OUT+'inspiration.png',fullPage:false});
// 5 what-to-write: which tab open by default
await sleep(1500);
res.wtw={status:await go('/what-to-write-in-a-card/')};
res.wtw.activeTab=await page.evaluate(()=>[...document.querySelectorAll('[role=tab]')].filter(t=>t.getAttribute('aria-selected')==='true').map(t=>t.innerText.trim()));
// 6 archive
await sleep(1500);
res.archive={status:await go('/archive/')};
res.archive.posts=await page.evaluate(()=>[...document.querySelectorAll('h2 a, h3 a, .penci-entry-title a, .entry-title a')].map(a=>a.innerText.trim()).slice(0,40));
res.archive.loadMore=await page.evaluate(()=>[...document.querySelectorAll('a,button')].filter(e=>/load more|older|next/i.test(e.innerText)&&e.offsetParent).map(e=>e.innerText.trim()+' '+(e.getAttribute('href')||'')).slice(0,5));
fs.writeFileSync(OUT+'render.json',JSON.stringify(res,null,1));
console.log(JSON.stringify(res,null,1));
await browser.close();
