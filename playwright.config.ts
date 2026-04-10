import { defineConfig, devices } from '@playwright/test';

/**
 * PetPals Automation Test Configuration
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only (1 retry balances flake recovery vs speed) */
  retries: process.env.CI ? 1 : 0,
  /* Use 2 parallel workers on CI for faster execution */
  workers: process.env.CI ? 2 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html'],
    ['json', { outputFile: 'playwright-report/results.json' }],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.E2E_BASE_URL || process.env.BASE_URL || 'https://staging.petpals-demo.shop',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',

    /* Navigation timeout */
    navigationTimeout: process.env.CI ? 30_000 : 30_000,
  },

  /* Global timeout for each test (2 minutes on CI, default locally) */
  timeout: process.env.CI ? 120_000 : 30_000,

  expect: {
    timeout: process.env.CI ? 30_000 : 25_000,
  },

  /* Configure projects for major browsers */
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
  ],
});
