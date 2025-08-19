const { test, expect } = require('@playwright/test');

test.describe('Collections: Notes, Poetry, Journal', () => {
  test('Notes listing and item pages', async ({ page }) => {
    await page.goto('/notes/');
    await expect(page.locator('h1:has-text("Notes")')).toBeVisible();

    const entries = page.locator('article.h-entry, article');
    {
      const count = await entries.count();
      expect(count).toBeGreaterThan(0);
    }

    // Click first item
    const firstLink = page.locator('a').filter({ hasText: /First Note|Second Note|Third Note/ }).first();
    await expect(firstLink).toBeVisible();
    await firstLink.click();
    await expect(page.locator('article.h-entry')).toBeVisible();
    await expect(page.locator('h1')).toBeVisible();
  });

  test('Poetry listing and item pages', async ({ page }) => {
    await page.goto('/poetry/');
    await expect(page.locator('h1:has-text("Poetry")')).toBeVisible();

    const entries = page.locator('article');
    {
      const count = await entries.count();
      expect(count).toBeGreaterThan(0);
    }

    const firstLink = page.locator('a').filter({ hasText: /Static Garden|Build Logs|Night Shift/ }).first();
    await expect(firstLink).toBeVisible();
    await firstLink.click();
    await expect(page.locator('article.h-entry')).toBeVisible();
    await expect(page.locator('h1')).toBeVisible();
  });

  test('Journal listing and item pages', async ({ page }) => {
    await page.goto('/journal/');
    await expect(page.locator('h1:has-text("Journal")')).toBeVisible();

    const entries = page.locator('article.h-entry, article');
    {
      const count = await entries.count();
      expect(count).toBeGreaterThan(0);
    }

    const firstLink = page.locator('a').filter({ hasText: /Day One|Week Two/ }).first();
    await expect(firstLink).toBeVisible();
    await firstLink.click();
    await expect(page.locator('article.h-entry')).toBeVisible();
    await expect(page.locator('h1')).toBeVisible();
  });
});
