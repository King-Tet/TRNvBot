// index.js
const { chromium } = require('playwright-extra');
const stealth = require('puppeteer-extra-plugin-stealth')();

// Add the stealth plugin to Playwright
chromium.use(stealth);

(async () => {
  console.log('Launching stealth browser...');
  
  // Launch the browser
  const browser = await chromium.launch({ 
    headless: true,
    // Optional: add basic arguments to help blend in
    args: ['--no-sandbox', '--disable-setuid-sandbox'] 
  });
  
  const context = await browser.newContext({
    // Optional: Set a realistic user agent if the default headless one leaks
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  
  const page = await context.newPage();

  const targetUrl = 'https://nowsecure.nl'; // A common bot-testing site

  try {
    console.log(`Navigating to ${targetUrl}...`);
    
    // Wait until network is mostly idle to ensure Cloudflare checks finish
    await page.goto(targetUrl, { waitUntil: 'networkidle' });
    
    // Grab the page title to verify we made it through
    const title = await page.title();
    console.log(`Success! Page title: ${title}`);

    // Optional: Take a screenshot to debug what the browser actually saw
    await page.screenshot({ path: 'result.png' });
    console.log('Saved screenshot to result.png');

  } catch (error) {
    console.error('Failed to load the page:', error);
  } finally {
    await browser.close();
    console.log('Browser closed.');
  }
})();
