import { expect, test } from '@playwright/test';

test('index page has header', async ({ page }) => {
	await page.goto('/');
	expect(await page.getByText('blz.ai'));
});
