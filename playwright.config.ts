import { defineConfig, devices } from '@playwright/test';
import { config, AUTH_STATE } from './src/config';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // Retries only in CI: a test that passes on retry is reported as "flaky", not hidden
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI
    ? [['github'], ['html', { open: 'never' }], ['json', { outputFile: 'test-results/results.json' }]]
    : [['list'], ['html', { open: 'never' }], ['json', { outputFile: 'test-results/results.json' }]],
  use: {
    baseURL: config.dashboardUrl,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    // 1. Prepare test data (carrier + rate sheet) and a logged-in browser state
    { name: 'setup', testMatch: /.*\.setup\.ts/ },

    // 2. Fast API layer: business rules (rates, limits, statuses)
    { name: 'api', testDir: './tests/api', dependencies: ['setup'] },

    // 3. UI layer: only what must be checked through the UI
    {
      name: 'ui-desktop',
      testDir: './tests/ui',
      dependencies: ['setup'],
      use: { ...devices['Desktop Chrome'], storageState: AUTH_STATE },
    },
    {
      name: 'ui-mobile',
      testDir: './tests/ui',
      grep: /@mobile/,
      dependencies: ['setup'],
      use: { ...devices['Pixel 7'], storageState: AUTH_STATE },
    },
  ],
});
