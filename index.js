const { chromium } = require('playwright-extra');
const stealth = require('puppeteer-extra-plugin-stealth')();

chromium.use(stealth);

(async () => {
  console.log('Launching stealth browser...');
  
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'] 
  });
  
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  
  const page = await context.newPage();
  const targetUrl = 'https://nowsecure.nl'; 

  try {
    console.log(`Navigating to ${targetUrl}...`);
    
    // Changed from 'networkidle' to 'domcontentloaded' to avoid infinite waiting
    await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    // Give the page an extra 5 seconds to process any Cloudflare JS challenges
    await page.waitForTimeout(5000); 
    
    const title = await page.title();
    console.log(`Success! Page title: ${title}`);

  } catch (error) {
    console.error('Failed during navigation:', error.message);
  } finally {
    // Moved the screenshot here so it ALWAYS runs, even if the script crashes above
    console.log('Taking screenshot of final state...');
    await page.screenshot({ path: 'result.png' });
    console.log('Saved screenshot to result.png');

    await browser.close();
    console.log('Browser closed.');
  }
})();
