import { defineConfig, devices } from '@playwright/test'
import {
  METICULOUS_RECORDING_RETRIES,
  METICULOUS_RECORDING_WORKERS,
  METICULOUS_WEB_SERVER_TIMEOUT_MS,
} from './e2e/meticulous/constants'

export default defineConfig({
  testDir: './e2e/meticulous',
  fullyParallel: false,
  forbidOnly: true,
  retries: METICULOUS_RECORDING_RETRIES,
  workers: METICULOUS_RECORDING_WORKERS,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:3009',
    // Headed Chromium exposes real notification permission state for the settings journey.
    headless: false,
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'Meticulous Recording',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3009/en',
    reuseExistingServer: true,
    timeout: METICULOUS_WEB_SERVER_TIMEOUT_MS,
  },
})
