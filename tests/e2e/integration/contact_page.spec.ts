import { test, expect } from '@playwright/test';
import fileFixtures from '../fixtures/files';
import componentConfig from '../../../src/components/pages/ContactPage/config';
import { formatFileSize } from '../../../src/common';

const generateString = (size: number, character: string = ' ') => ''.padStart(size, character);

const pageUrl = '/contact';
const submitButtonText = 'Send';
const shortEmail = 'abc';
const longEmail = `${generateString(65, 't')}@${generateString(320, 't')}.com`;
const invalidEmail = 'abc123xyz';
const validEmail = 'test@example.com';
const shortMessage = 'a';
const longMessage = generateString(2000);
const validMessage = 'test message';

test.describe('Contact Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(pageUrl);
    });

    test('Should successfully load', async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'Contact Us' })).toBeVisible();
        await expect(page.locator('.page-contact')).toBeTruthy();
    });

    test('Should render the page in default state', async ({ page }) => {
        const restrictionsElement = page.locator('.file-restrictions');

        await expect(restrictionsElement).toContainText(formatFileSize(componentConfig.files.rules!.maxFileSize.value));
        await expect(restrictionsElement).toContainText(componentConfig.files.rules!.maxArrayLength.value.toString());
        await expect(restrictionsElement).toContainText(formatFileSize(componentConfig.files.rules!.maxTotalFileSize.value));

        await expect(page.locator('.files')).not.toBeAttached();
        await expect(page.locator('.form-files')).toContainText('No files selected');
        await expect(page.getByRole('button', { name: submitButtonText })).toBeDisabled();
    });

    test('Should fail validation because email is too short', async ({ page }) => {
        const submitButton = page.getByRole('button', { name: submitButtonText });

        await expect(submitButton).toBeDisabled();
        await page.getByLabel(componentConfig.email.label).fill(shortEmail);
        await page.getByLabel(componentConfig.message.label).fill(validMessage);

        await expect(submitButton).toBeDisabled();
    });

    test('Should fail validation because email is too long', async ({ page }) => {
        const submitButton = page.getByRole('button', { name: submitButtonText });

        await expect(submitButton).toBeDisabled();
        await page.evaluateHandle(selector => {
            document.querySelector(selector)?.removeAttribute('maxlength');
        }, `#${componentConfig.email.id}`);
        await page.getByLabel(componentConfig.email.label).fill(longEmail);
        await page.getByLabel(componentConfig.message.label).fill(validMessage);

        await expect(submitButton).toBeDisabled();
    });

    test('Should fail validation because email is in an invalid format', async ({ page }) => {
        const submitButton = page.getByRole('button', { name: submitButtonText });

        await expect(submitButton).toBeDisabled();
        await page.getByLabel(componentConfig.email.label).fill(invalidEmail);
        await page.getByLabel(componentConfig.message.label).fill(validMessage);

        await expect(submitButton).toBeDisabled();
    });

    test('Should fail validation because message is too short', async ({ page }) => {
        const submitButton = page.getByRole('button', { name: submitButtonText });

        await expect(submitButton).toBeDisabled();
        await page.getByLabel(componentConfig.email.label).fill(validEmail);
        await page.getByLabel(componentConfig.message.label).fill(shortMessage);

        await expect(submitButton).toBeDisabled();
    });

    test('Should fail validation because message is too long', async ({ page }) => {
        const submitButton = page.getByRole('button', { name: submitButtonText });

        await expect(submitButton).toBeDisabled();
        await page.evaluateHandle(selector => {
            document.querySelector(selector)?.removeAttribute('maxlength');
        }, `#${componentConfig.message.id}`);
        await page.getByLabel(componentConfig.email.label).fill(validEmail);
        await page.getByLabel(componentConfig.message.label).fill(longMessage);

        await expect(submitButton).toBeDisabled();
    });

    test('Should fail validation because the file is too large', async ({ page }) => {
        const fileChooserPromise = page.waitForEvent('filechooser');
        const submitButton = page.getByRole('button', { name: submitButtonText });

        await expect(submitButton).toBeDisabled();
        await page.getByText('Choose Files').click();

        const fileChooser = await fileChooserPromise;

        await page.setInputFiles("input[type='file']", fileFixtures.fileTooLarge);

        await page.waitForSelector('#files-alerts-0');
        await expect(page.locator('#files-alerts-0')).toContainText('is too large');
        await expect(submitButton).toBeDisabled();
    });

    test('Should fail validation because the total size of files is too large', async ({ page }) => {
        const fileChooserPromise = page.waitForEvent('filechooser');
        const submitButton = page.getByRole('button', { name: submitButtonText });

        await expect(submitButton).toBeDisabled();
        await page.getByText('Choose Files').click();

        const fileChooser = await fileChooserPromise;

        await page.setInputFiles("input[type='file']", fileFixtures.filesTooLarge);

        await page.waitForSelector('#files-alerts-5');
        await expect(page.locator('#files-alerts-5')).toContainText('Total file size exceeds limit of');
        await expect(submitButton).toBeDisabled();
    });

    test('Should fail validation because there are too many files', async ({ page }) => {
        const fileChooserPromise = page.waitForEvent('filechooser');
        const submitButton = page.getByRole('button', { name: submitButtonText });

        await expect(submitButton).toBeDisabled();
        await page.getByText('Choose Files').click();

        const fileChooser = await fileChooserPromise;

        await page.setInputFiles("input[type='file']", fileFixtures.tooManyFiles);

        await page.waitForSelector('#files-alerts-0');
        await expect(page.locator('#files-alerts-0')).toContainText('has too many items');
        await expect(submitButton).toBeDisabled();
    });

    test('Should pass validation', async ({ page }) => {
        const fileChooserPromise = page.waitForEvent('filechooser');
        const responsePromise = page.waitForResponse(response => true);
        const submitButton = page.getByRole('button', { name: submitButtonText });

        await page.getByText('Choose Files').click();

        const fileChooser = await fileChooserPromise;

        await page.getByLabel(componentConfig.email.label).fill(validEmail);
        await page.getByLabel(componentConfig.message.label).fill(validMessage);
        await page.setInputFiles("input[type='file']", fileFixtures.pass);
        await submitButton.click();

        const response = await responsePromise;

        await expect(page.locator('#app')).toContainText('Message sent');
    });
});
