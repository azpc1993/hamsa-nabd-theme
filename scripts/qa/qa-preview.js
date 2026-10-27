// Playwright check of preview/index.html: no horizontal scroll, no console errors,
// dark mode toggle + persistence, before/after keyboard, popup_id opening.
const { chromium } = require('playwright');
const path = require('path');
const url = 'file://' + path.join(__dirname, 'preview', 'index.html');
(async () => {
  const browser = await chromium.launch();
  let failed = 0;
  const check = (ok, msg) => { console.log((ok ? 'PASS ' : 'FAIL ') + msg); if (!ok) failed++; };
  for (const width of [360, 768, 1280, 1920]) {
    for (const scheme of ['light', 'dark']) {
      const ctx = await browser.newContext({ viewport: { width, height: 900 }, colorScheme: scheme });
      const page = await ctx.newPage();
      const errors = [];
      page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
      page.on('pageerror', e => errors.push(String(e)));
      await page.goto(url, { waitUntil: 'load' });
      const sw = await page.evaluate(() => [document.documentElement.scrollWidth, window.innerWidth]);
      check(sw[0] <= sw[1], `${width}px/${scheme}: no horizontal scroll (scrollWidth ${sw[0]} vs ${sw[1]})`);
      const mode = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
      check(mode === scheme, `${width}px/${scheme}: first visit follows prefers-color-scheme (${mode})`);
      if (width === 1280 && scheme === 'light') {
        await page.click('[data-hn-theme-toggle]');
        const after = await page.evaluate(() => [document.documentElement.getAttribute('data-theme'), localStorage.getItem('hn-theme-mode'), getComputedStyle(document.body).backgroundColor]);
        check(after[0] === 'dark' && after[1] === 'dark', `toggle switches to dark and stores it (${after.join(', ')})`);
        await page.reload({ waitUntil: 'load' });
        check(await page.evaluate(() => document.documentElement.getAttribute('data-theme')) === 'dark', 'stored mode survives reload');
        await page.focus('[data-hn-ba-handle]');
        await page.keyboard.press('End');
        check(await page.getAttribute('[data-hn-ba-handle]', 'aria-valuenow') === '100', 'before/after: End key -> aria-valuenow 100');
        await page.keyboard.press('Home');
        check(await page.getAttribute('[data-hn-ba-handle]', 'aria-valuenow') === '0', 'before/after: Home key -> aria-valuenow 0');
        const box = await page.locator('[data-hn-ba]').boundingBox();
        await page.mouse.click(box.x + box.width * 0.25, box.y + box.height / 2);
        const v = Number(await page.getAttribute('[data-hn-ba-handle]', 'aria-valuenow'));
        check(v > 65 && v < 85, `before/after: pointer at 25% from left in RTL -> ~75 (${v})`);
        await page.click('[data-hn-open-popup="eid"]');
        check(await page.evaluate(() => document.querySelector('[data-popup-id="eid"]').classList.contains('is-open')), 'department card popup_id opens matching promo-popup');
        await page.screenshot({ path: path.join(__dirname, 'preview', 'shot-1280-dark.png'), fullPage: true });
      }
      if (width === 360 && scheme === 'light') await page.screenshot({ path: path.join(__dirname, 'preview', 'shot-360-light.png'), fullPage: true });
      check(errors.length === 0, `${width}px/${scheme}: no console errors ${errors.length ? JSON.stringify(errors) : ''}`);
      await ctx.close();
    }
  }
  await browser.close();
  console.log(failed ? `qa-preview: FAIL (${failed})` : 'qa-preview: PASS');
  process.exit(failed ? 1 : 0);
})();
