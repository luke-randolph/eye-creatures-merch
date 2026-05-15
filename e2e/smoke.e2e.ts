import { expect, test } from '@playwright/test';

// Limited to routes that don't hit the Sanity catalog, so it runs in CI
// without live credentials.
test.describe('storefront smoke test', () => {
	test('cart page renders the empty state with header and footer', async ({ page }) => {
		await page.goto('/cart');

		await expect(page.getByRole('heading', { level: 1, name: 'Cart' })).toBeVisible();
		await expect(page.getByText('Your cart is empty.')).toBeVisible();

		// Layout chrome
		await expect(page.getByRole('link', { name: 'Eye Creatures home' })).toBeVisible();
		await expect(page.getByText('Tune in:')).toBeVisible();
	});

	test('skip-to-content link is the first focusable element', async ({ page }) => {
		await page.goto('/cart');

		await page.keyboard.press('Tab');
		await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
	});

	test('sign-in page offers both auth options', async ({ page }) => {
		await page.goto('/sign-in');

		await expect(
			page.getByRole('heading', { level: 1, name: 'Sign in or create an account' })
		).toBeVisible();
		await expect(page.getByRole('button', { name: 'Continue with Google' })).toBeVisible();
		await expect(page.getByLabel('Email')).toBeVisible();
	});

	test('checkout cancel page renders', async ({ page }) => {
		await page.goto('/checkout/cancel');

		await expect(page.getByRole('heading', { level: 1, name: 'Checkout cancelled' })).toBeVisible();
	});
});
