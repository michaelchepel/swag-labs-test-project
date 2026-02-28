import fs from 'fs';
import path from 'path';

/**
 * Global setup for Playwright tests
 * Runs once before all tests
 */
async function globalSetup() {
  console.log('Starting global setup...');

  // Create necessary directories if they don't exist
  const directories = [
    'test-results',
    'screenshots',
    'videos',
    'playwright-report',
    'allure-results',
  ];

  directories.forEach(dir => {
    const dirPath = path.join(process.cwd(), dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  });

  // Log test environment information
  console.log('Test Environment Information:');
  console.log(`   Base URL: ${process.env.BASE_URL || 'https://www.saucedemo.com'}`);
  console.log(`   Headless: ${process.env.HEADLESS !== 'false'}`);
  console.log(`   Browser: ${process.env.BROWSER || 'chromium'}`);
  console.log(`   Timeout: ${process.env.TIMEOUT || '30000'}ms`);
  console.log(`   CI: ${process.env.CI ? 'true' : 'false'}`);

  // Clear previous test results if needed
  if (process.env.CLEAR_TEST_RESULTS === 'true') {
    const testResultsDir = path.join(process.cwd(), 'test-results');
    if (fs.existsSync(testResultsDir)) {
      fs.readdirSync(testResultsDir).forEach(file => {
        const filePath = path.join(testResultsDir, file);
        if (fs.statSync(filePath).isDirectory()) {
          fs.rmSync(filePath, { recursive: true, force: true });
        } else {
          fs.unlinkSync(filePath);
        }
      });
      console.log('Cleared previous test results');
    }
  }

  console.log('Global setup completed successfully');
}

export default globalSetup;
