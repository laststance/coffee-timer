import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { open: 'never' }], ['list']],

  // Visual Regression Test Configuration
  expect: {
    toHaveScreenshot: {
      maxDiffPixels: 100,
      threshold: 0.2,
      animations: 'disabled',
    },
  },

  use: {
    baseURL: 'http://localhost:3009',
    trace: 'on-first-retry',
  },

  projects: [
    // ===== DESKTOP PROJECTS =====
    {
      name: 'Desktop-Light',
      use: {
        ...devices['Desktop Chrome'],
        colorScheme: 'light',
      },
    },
    {
      name: 'Desktop-Dark',
      use: {
        ...devices['Desktop Chrome'],
        colorScheme: 'dark',
      },
    },
    {
      name: 'Desktop-Coffee',
      use: {
        ...devices['Desktop Chrome'],
      },
    },

    // ===== TABLET PROJECTS =====
    {
      name: 'Tablet-Light',
      use: {
        ...devices['iPad Pro landscape'],
        colorScheme: 'light',
      },
    },
    {
      name: 'Tablet-Dark',
      use: {
        ...devices['iPad Pro landscape'],
        colorScheme: 'dark',
      },
    },
    {
      name: 'Tablet-Coffee',
      use: {
        ...devices['iPad Pro landscape'],
      },
    },

    // ===== MOBILE PROJECTS =====
    {
      name: 'Mobile-Light',
      use: {
        ...devices['iPhone 12'],
        colorScheme: 'light',
      },
    },
    {
      name: 'Mobile-Dark',
      use: {
        ...devices['iPhone 12'],
        colorScheme: 'dark',
      },
    },
    {
      name: 'Mobile-Coffee',
      use: {
        ...devices['iPhone 12'],
      },
    },

    // ===== LEGACY PROJECTS (for backward compatibility) =====
    {
      name: 'Desktop Chrome',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5 landscape'] },
    },
    {
      name: 'Tablet Safari',
      use: { ...devices['iPad Pro landscape'] },
    },
  ],

  webServer: {
    command: 'pnpm start',
    url: 'http://localhost:3009',
    reuseExistingServer: !process.env.CI,
  },
})
