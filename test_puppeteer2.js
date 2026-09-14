import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure()?.errorText || 'Unknown'));

  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
  
  // Wait 3 seconds for React to mount and potentially crash
  await new Promise(r => setTimeout(r, 3000));
  
  const rootHtml = await page.evaluate(() => document.getElementById('root')?.innerHTML || 'No Root');
  console.log("ROOT HTML LENGTH:", rootHtml.length);
  
  await browser.close();
})();
