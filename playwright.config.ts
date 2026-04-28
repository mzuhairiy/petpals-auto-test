import { defineConfig, devices } from '@playwright/test';
import config from './config/env.config';

/**
 * PetPals Automation Test Configuration
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 1 : 0,
    workers: process.env.CI ? 2 : undefined,
    reporter: [
        ['html'],
        ['json', { outputFile: 'playwright-report/results.json' }],
        ...(process.env.TESTRAIL_REPORT === 'true'
            ? [['./utils/testrail-reporter.ts'] as const]
            : []),
    ],
    use: {
        baseURL: config.baseUrl,
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        navigationTimeout: 30_000,
    },
    timeout: process.env.CI ? 120_000 : 30_000,
    expect: {
        timeout: process.env.CI ? 30_000 : 25_000,
    },
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
