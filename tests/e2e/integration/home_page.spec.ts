import { test, expect } from '@playwright/test';

const pageUrl = '/';

test.describe('Home page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(pageUrl);
    });

    test('Should successfully load', async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'Video Uploader' })).toBeVisible();
        await expect(page).toHaveTitle('Video Uploader');
        await expect(page.locator('.page-home')).toBeTruthy();

        const navbarItems = await page.locator('.navbar ul li').all();
        const home = navbarItems[0].locator('a');
        const upload = navbarItems[1].locator('a');
        const contact = navbarItems[2].locator('a');

        await expect(home).toHaveText('Home');
        await expect(upload).toHaveText('Upload');
        await expect(contact).toHaveText('Contact');

        await expect(home).toHaveClass('active');
        await expect(upload).not.toHaveClass('active');
        await expect(contact).not.toHaveClass('active');
    });
});
