// Follow-ups: desktop copy button (visible), sticky-header content jump (desktop+mobile), share "Copy Link", related block, mega-menu block page.
import { launch, newCtx, openClean, cls, save, sleep, SHOTS, assetStats, loadCount } from './lib.mjs';
const browser = await launch();
const R = {};

// measure document-offset drift of a content element while scrolling in small steps (sticky header jump)
const driftProbe = async (page, sel) => {
  const out = [];
  for (const y of [0, 40, 80, 120, 160, 200, 260, 320, 400, 600]) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await sleep(450);
    out.push(await page.evaluate((s) => {
      const e = document.querySelector(s);
      const r = e.getBoundingClientRect();
      const hdr = document.querySelector('.penci_navbar_mobile') || document.querySelector('.penci_header');
      const hs = [...document.querySelectorAll('.penci_navbar_mobile, .penci_header')].map((h) => { const cs = getComputedStyle(h); const hr = h.getBoundingClientRect(); return `${h.className.split(' ').slice(0, 3).join('.')}:${cs.position}:${Math.round(hr.top)}:${Math.round(hr.height)}`; }).slice(0, 3);
      return { sy: Math.round(scrollY), docTop: Math.round(r.top + scrollY), headers: hs };
    }, sel));
  }
  return out;
};

// Desktop
{
  const ctx = await newCtx(browser, 'desktop', { permissions: ['clipboard-read', 'clipboard-write'] });
  await ctx.addCookies([{ name: 'cookieconsent_status', value: 'dismiss', domain: 'blog.123greetings.com', path: '/' }]);
  // a) message page: visible copy button, drift probe, back-to-top
  {
    const { page, log } = await openClean(ctx, '/birthday-messages-for-mom/', { wait: 6000 });
    const rec = { status: log.status, pageErrors: log.pageErrors.map((e) => e.msg) };
    const btn = page.locator('button.copy-icon-btn').filter({ visible: true }).first();
    rec.visibleCopyButtons = await page.locator('button.copy-icon-btn').filter({ visible: true }).count();
    rec.allCopyButtons = await page.locator('button.copy-icon-btn').count();
    rec.btnA11y = await btn.evaluate((e) => ({ ariaLabel: e.getAttribute('aria-label'), title: e.getAttribute('title'), size: [Math.round(e.getBoundingClientRect().width), Math.round(e.getBoundingClientRect().height)], focusOutline: (e.focus(), getComputedStyle(e).outlineStyle + ' ' + getComputedStyle(e).outlineWidth) }));
    await btn.hover();
    await sleep(300);
    await btn.click();
    await sleep(350);
    try { rec.clipboard = (await page.evaluate(() => navigator.clipboard.readText())).slice(0, 200); } catch (e) { rec.clipboard = 'ERR ' + String(e).slice(0, 80); }
    await page.screenshot({ path: `${SHOTS}/d_mom_copy_clicked.png`, clip: { x: 0, y: 80, width: 1366, height: 260 } });
    rec.drift = await driftProbe(page, 'h1:not([style*="none"])');
    await page.evaluate(() => window.scrollTo(0, 0));
    await sleep(500);
    await page.screenshot({ path: `${SHOTS}/d_mom_full.png`, fullPage: true });
    rec.cls = await cls(page);
    R.desktopMom = rec;
    await page.close();
  }
  await sleep(4000);
  // b) post: share dropdown, copy link, related carousel
  {
    const { page, log } = await openClean(ctx, '/mothers-day-messages-for-wife-what-she-actually-wants/', { wait: 6000 });
    const rec = { status: log.status };
    const toggle = page.locator('.post-meta-share > a, .post-meta-share .penci-pshare-toggle, .post-meta-share .post-share-plike, .post-meta-share a:has(i.fa-share-alt), .post-meta-share a:has(i.penciicon-sharing)').first();
    rec.toggleCount = await toggle.count();
    rec.shareHtml = await page.evaluate(() => document.querySelector('.post-meta-share')?.outerHTML.replace(/\s+/g, ' ').slice(0, 700));
    if (rec.toggleCount) { await toggle.click().catch((e) => (rec.toggleErr = String(e).slice(0, 100))); await sleep(900); }
    const cl = page.locator('a.post-share-link').first();
    rec.copyLinkVisible = await cl.isVisible().catch(() => false);
    if (rec.copyLinkVisible) {
      await page.screenshot({ path: `${SHOTS}/d_post_share_dropdown.png`, clip: { x: 0, y: 80, width: 1366, height: 500 } });
      const before = ctx.pages().length;
      await cl.click().catch(() => {});
      await sleep(3000);
      const after = ctx.pages();
      let clip = null; try { clip = await page.evaluate(() => navigator.clipboard.readText()); } catch (e) { clip = 'ERR'; }
      rec.copyLink = { newTabs: after.length - before, newTabUrl: after.length > before ? after[after.length - 1].url() : null, clipboard: clip?.slice(0, 120) };
      for (const p of after.slice(before)) await p.close();
    }
    const rel = page.locator('.post-related').first();
    if (await rel.count()) { await rel.scrollIntoViewIfNeeded(); await sleep(1200); await rel.screenshot({ path: `${SHOTS}/d_post_related.png` }).catch(() => {}); }
    rec.relatedTitles = await page.evaluate(() => [...document.querySelectorAll('.post-related .item-related h3 a, .post-related .related-content a')].map((a) => a.innerText.trim()).filter(Boolean));
    rec.youMayAlsoLike = await page.evaluate(() => [...document.querySelectorAll('.post-title-box')].map((e) => ({ t: e.innerText.trim(), y: Math.round(e.getBoundingClientRect().top + scrollY), vis: e.getBoundingClientRect().height > 0 })));
    const cta = page.locator('a[href*="www.123greetings.com/blog/what-to-write-in-a-card"]').first();
    if (await cta.count()) { await cta.scrollIntoViewIfNeeded(); await sleep(600); const box = await cta.boundingBox(); await page.screenshot({ path: `${SHOTS}/d_post_404_ctas.png`, clip: { x: 0, y: Math.max(0, box.y - 250), width: 1366, height: 520 } }); }
    const form = page.locator('#respond').first();
    if (await form.count()) { await form.scrollIntoViewIfNeeded(); await sleep(600); await form.screenshot({ path: `${SHOTS}/d_post_comment_form.png` }).catch(() => {}); }
    R.desktopPost = rec;
    await page.close();
  }
  await sleep(4000);
  // c) the stray "Mega Menu" template page
  {
    const { page, log } = await openClean(ctx, '/penci-block/mega-menu/', { wait: 4000 });
    R.megaMenuPage = { status: log.status, title: await page.title(), robots: await page.evaluate(() => document.querySelector('meta[name=robots]')?.content), text: await page.evaluate(() => document.body.innerText.replace(/\s+/g, ' ').slice(0, 300)) };
    await page.screenshot({ path: `${SHOTS}/d_penci_block_mega_menu.png` });
    await page.close();
  }
  await ctx.close();
}
await sleep(4000);
// Mobile: sticky header drift
{
  const ctx = await newCtx(browser, 'mobile');
  await ctx.addCookies([{ name: 'cookieconsent_status', value: 'dismiss', domain: 'blog.123greetings.com', path: '/' }]);
  const { page, log } = await openClean(ctx, '/birthday-messages-for-mom/', { wait: 6000 });
  const rec = { status: log.status };
  rec.drift = await driftProbe(page, '.msgs .elementor-text-editor, .msgs p');
  rec.cls = await cls(page);
  // screenshot pair around the switch
  await page.evaluate(() => window.scrollTo(0, 60)); await sleep(500);
  await page.screenshot({ path: `${SHOTS}/m_mom_scroll60.png` });
  await page.evaluate(() => window.scrollTo(0, 200)); await sleep(500);
  await page.screenshot({ path: `${SHOTS}/m_mom_scroll200.png` });
  R.mobileMom = rec;
  await ctx.close();
}
R.assetStats = assetStats; R.loads = loadCount();
save('d5_followup', R);
console.log(JSON.stringify(R, null, 1).slice(0, 30000));
await browser.close();
