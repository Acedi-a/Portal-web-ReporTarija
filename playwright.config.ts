import { defineConfig, devices } from '@playwright/test'
import { loadEnv } from 'vite'

const env = loadEnv('', process.cwd(), '')

Object.entries(env).forEach(([key, value]) => {
  process.env[key] ??= value
})

export default defineConfig({
  testDir: './tests',
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:5173',
    trace: 'on-first-retry',
    ...devices['Desktop Chrome'],
  },
  webServer: {
    command: 'pnpm exec vite --host 127.0.0.1',
    url: 'http://127.0.0.1:5173/login',
    reuseExistingServer: true,
    timeout: 120_000,
  },
})
