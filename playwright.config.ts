import { defineConfig } from '@playwright/test';

const PORT = 4173;

export default defineConfig({
	testMatch: '**/*.e2e.{ts,js}',
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 1 : 0,
	reporter: process.env.CI ? [['html', { open: 'never' }], ['list']] : 'list',
	use: {
		baseURL: `http://localhost:${PORT}`,
		trace: 'on-first-retry'
	},
	webServer: {
		command: 'npm run build && npm run preview',
		port: PORT,
		reuseExistingServer: !process.env.CI,
		timeout: 120_000
	}
});
