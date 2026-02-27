import fs from 'fs';
import path from 'path';

/**
 * Global teardown for Playwright tests
 * Runs once after all tests
 */
async function globalTeardown() {
  console.log('🧹 Starting global teardown...');

  // Log test completion summary
  console.log('✅ All tests completed');
  console.log(`📊 Test results available in: ${path.join(process.cwd(), 'test-results')}`);
  console.log(`📸 Screenshots available in: ${path.join(process.cwd(), 'screenshots')}`);
  console.log(`🎬 Videos available in: ${path.join(process.cwd(), 'videos')}`);
  console.log(`📝 HTML report available in: ${path.join(process.cwd(), 'playwright-report')}`);

  // Optional: Generate test summary file
  const summary = {
    timestamp: new Date().toISOString(),
    environment: {
      baseUrl: process.env.BASE_URL || 'https://www.saucedemo.com',
      headless: process.env.HEADLESS !== 'false',
      browser: process.env.BROWSER || 'chromium',
      timeout: process.env.TIMEOUT || '30000',
      ci: process.env.CI ? 'true' : 'false',
    },
  };

  const summaryPath = path.join(process.cwd(), 'test-results', 'test-summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
  console.log(`📄 Test summary saved to: ${summaryPath}`);

  console.log('✅ Global teardown completed successfully');
}

export default globalTeardown;
