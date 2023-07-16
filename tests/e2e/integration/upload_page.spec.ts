import { test, expect } from '@playwright/test';
import fileFixtures from '../fixtures/files';
import componentConfig from '../../../src/components/pages/UploadPage/config';
import { formatFileSize } from '../../../src/common';

const pageUrl = '/upload';

test.describe('Upload Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(pageUrl);
    });

    test('Should successfully load', async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'Upload Videos' })).toBeVisible();
        await expect(page.locator('.page-upload')).toBeTruthy();
    });

    test('Should render the page in default state', async ({ page }) => {
        const restrictionsElement = page.locator('.file-restrictions');

        await expect(restrictionsElement).toContainText(componentConfig.videos.rules!.allowedFileExtensions.value.join(', '));
        await expect(restrictionsElement).toContainText(formatFileSize(componentConfig.videos.rules!.maxFileSize.value));
        await expect(restrictionsElement).toContainText(componentConfig.videos.rules!.maxArrayLength.value.toString());
        await expect(restrictionsElement).toContainText(formatFileSize(componentConfig.videos.rules!.maxTotalFileSize.value));

        await expect(page.locator('.files')).not.toBeAttached();
        await expect(page.locator('.form-files')).toContainText('No files selected');
        await expect(page.getByRole('button', { name: 'Upload' })).toBeDisabled();
    });

    test('Should fail validation because the file is too large', async ({ page }) => {
        const fileChooserPromise = page.waitForEvent('filechooser');

        await page.getByText('Choose Files').click();

        const fileChooser = await fileChooserPromise;

        await page.setInputFiles("input[type='file']", fileFixtures.fileTooLarge);

        await page.waitForSelector('#videos-alerts-0');
        await expect(page.locator('#videos-alerts-0')).toContainText('is too large');
        await expect(page.getByRole('button', { name: 'Upload' })).toBeDisabled();
    });

    test('Should fail validation because the file has the wrong file extension', async ({ page }) => {
        const fileChooserPromise = page.waitForEvent('filechooser');

        await page.getByText('Choose Files').click();

        const fileChooser = await fileChooserPromise;

        await page.setInputFiles("input[type='file']", fileFixtures.fileWrongFileExtension);

        await page.waitForSelector('#videos-alerts-0');
        await expect(page.locator('#videos-alerts-0')).toContainText('has an unsupported file extension');
        await expect(page.getByRole('button', { name: 'Upload' })).toBeDisabled();
    });

    test('Should fail validation because the file has the wrong file header', async ({ page }) => {
        const fileChooserPromise = page.waitForEvent('filechooser');
        const submitButton = page.getByRole('button', { name: 'Upload' });
        const responsePromise = page.waitForResponse(response => true);

        await page.getByText('Choose Files').click();

        const fileChooser = await fileChooserPromise;

        await page.setInputFiles("input[type='file']", fileFixtures.fileBadHeader);
        await submitButton.click();

        const response = await responsePromise;

        await page.waitForSelector('#videos-alerts-0');
        await expect(page.locator('#videos-alerts-0')).toContainText('is an invalid file');
        await expect(submitButton).toBeDisabled();
    });

    test('Should fail validation because the total size of files is too large', async ({ page }) => {
        const fileChooserPromise = page.waitForEvent('filechooser');

        await page.getByText('Choose Files').click();

        const fileChooser = await fileChooserPromise;

        await page.setInputFiles("input[type='file']", fileFixtures.filesTooLarge);

        await page.waitForSelector('#videos-alerts-5');
        await expect(page.locator('#videos-alerts-5')).toContainText('Total file size exceeds limit of');
        await expect(page.getByRole('button', { name: 'Upload' })).toBeDisabled();
    });

    test('Should fail validation because there are too many files', async ({ page }) => {
        const fileChooserPromise = page.waitForEvent('filechooser');

        await page.getByText('Choose Files').click();

        const fileChooser = await fileChooserPromise;

        await page.setInputFiles("input[type='file']", fileFixtures.tooManyFiles);

        await page.waitForSelector('#videos-alerts-0');
        await expect(page.locator('#videos-alerts-0')).toContainText('has too many items');
        await expect(page.getByRole('button', { name: 'Upload' })).toBeDisabled();
    });

    test('Should pass validation', async ({ page }) => {
        const fileChooserPromise = page.waitForEvent('filechooser');
        const responsePromise = page.waitForResponse(response => true);// response.url() === 'https://example.com' && response.status() === 200);

        await page.getByText('Choose Files').click();

        const fileChooser = await fileChooserPromise;
        const submitButton = page.getByRole('button', { name: 'Upload' });

        await page.setInputFiles("input[type='file']", fileFixtures.pass);
        await submitButton.click();

        const response = await responsePromise;

        await expect(page.locator('.file-status')).toContainText('Converting video');
    });
});
