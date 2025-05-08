import { test, expect } from '@playwright/test';


test('CloudBees website verification and documentation navigation', async ({ page }) => {


  await test.step('Navigate to CloudBees homepage', async () => {
    await page.goto('https://www.cloudbees.com/');
  });

  await test.step('Click Products > CloudBees CD', async () => {
    await page.getByText('Products', { exact: true }).click();
    await page.locator('[data-test="navbar\\.menuLink\\.products\\.otherProducts\\.cloudbeesCD"]').click();
  });

  await test.step('Verify audit report section visibility', async () => {
    await expect(page.getByText('$2m')).toBeVisible();
    await page.getByRole('button', { name: 'Auditors / Security' }).click();

    const tabContent = page.locator('[data-test="container\\.tabSaaS"]');
    await expect(tabContent).toContainText('Generate single-click audit reports');
    await expect(tabContent).toContainText('Automate evidence collection across all executed tasks to prove processes performed as expected.');
  });

  await test.step('Open documentation via Resources > Documentation', async () => {
    await page.locator('button').filter({ hasText: 'Resources' }).click();
    const page1 = await Promise.all([
      page.waitForEvent('popup'),
      page.locator('[data-test="navbar\\.menuLink\\.resources\\.supportDocumentation\\.documentation"]').click()
    ]).then(([popup]) => popup);

    await page1.getByRole('textbox', { name: 'Search all CloudBees Resources' }).click();
    await page1.getByRole('textbox', { name: 'Search', exact: true }).fill('installation');
    await page1.waitForTimeout(10000)

    const links = await page1.locator('.page-link').all();
    expect(links.length).toBe(3);
  });
});
