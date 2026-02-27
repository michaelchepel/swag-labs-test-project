import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * Playwright configuration for Swag Labs test automation framework
 */
export default defineConfig({
  // Test directory
  testDir: './tests',

  // Fully parallelize tests across all workers
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Limit the number of workers on CI to avoid resource contention
  workers: process.env.CI ? 2 : undefined,

  // Reporter configuration
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
  ],

  // Shared settings for all tests
  use: {
    // Base URL for all tests
    baseURL: process.env.BASE_URL || 'https://www.saucedemo.com',

    // Collect trace when retrying the failed test
    trace: 'on-first-retry',

    // Screenshot configuration
    screenshot: process.env.SCREENSHOT_ON_FAILURE_ONLY === 'true' ? 'only-on-failure' : 'on',

    // Video recording configuration
    video: process.env.VIDEO === 'retain-on-failure' ? 'retain-on-failure' : 'on',

    // Action timeout
    actionTimeout: parseInt(process.env.TIMEOUT || '30000', 10),

    // Navigation timeout
    navigationTimeout: parseInt(process.env.TIMEOUT || '30000', 10),

    // Headless mode
    headless: process.env.HEADLESS !== 'false',

    // Viewport size
    viewport: { width: 1280, height: 720 },
  },

  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    // Test against mobile viewports
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  // Run your local dev server before starting the tests
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },

  // Global setup and teardown
  globalSetup: require.resolve('./tests/global-setup.ts'),
  globalTeardown: require.resolve('./tests/global-teardown.ts'),

  // Test timeout
  timeout: 60000,
});
