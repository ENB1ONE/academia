const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('response', response => {
    if (!response.ok()) {
      console.log('RESPONSE FAIL:', response.url(), response.status());
    }
  });

  await page.goto('https://enb1one.github.io/academia/', { waitUntil: 'networkidle0' });
  await browser.close();
})();
