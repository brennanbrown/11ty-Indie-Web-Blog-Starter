const { test, expect } = require('@playwright/test');

test.describe('Accessibility', () => {
  test('has proper heading hierarchy', async ({ page }) => {
    await page.goto('/');
    
    // Check for h1
    await expect(page.locator('h1')).toHaveCount(1);
    
    // Check heading structure
    const h1 = await page.locator('h1').textContent();
    expect(h1).toContain('JAMstack Blog Template');
  });

  test('images have alt text', async ({ page }) => {
    await page.goto('/blog/markdown-showcase/');
    
    // Check that images have alt attributes
    const images = page.locator('img');
    const count = await images.count();
    
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy();
    }
  });

  test('links have accessible text', async ({ page }) => {
    await page.goto('/');
    
    // Check navigation links
    const navLinks = page.locator('nav a');
    const count = await navLinks.count();
    
    for (let i = 0; i < count; i++) {
      const link = navLinks.nth(i);
      const text = await link.textContent();
      expect(text.trim()).toBeTruthy();
    }
  });

  test('form elements have labels', async ({ page }) => {
    await page.goto('/');
    
    // Check search input has label or aria-label
    const searchInput = page.locator('#q');
    const ariaLabel = await searchInput.getAttribute('aria-label');
    const placeholder = await searchInput.getAttribute('placeholder');
    
    expect(ariaLabel || placeholder).toBeTruthy();
  });

  test('dark mode toggle works', async ({ page }) => {
    await page.goto('/');
    
    // Find dark mode toggle
    const darkModeToggle = page.locator('button:has-text("🌙")');
    await expect(darkModeToggle).toBeVisible();
    
    // Click to toggle dark mode
    await darkModeToggle.click();
    
    // Check if dark class is applied
    const html = page.locator('html');
    await expect(html).toHaveClass(/dark/);
  });

  test('skip to content link works', async ({ page }) => {
    await page.goto('/');
    
    // Tab to skip link (should be first focusable element)
    await page.keyboard.press('Tab');
    
    // Check if skip link is focused
    const skipLink = page.locator('a:has-text("Skip to content")');
    await expect(skipLink).toBeFocused();
    
    // Press enter to use skip link
    await page.keyboard.press('Enter');
    
    // Main content should be focused
    const main = page.locator('main');
    await expect(main).toBeFocused();
  });

  test('keyboard navigation works', async ({ page }) => {
    await page.goto('/');
    
    // Tab through navigation
    await page.keyboard.press('Tab'); // Skip link
    await page.keyboard.press('Tab'); // First nav item
    
    const firstNavLink = page.locator('nav a').first();
    await expect(firstNavLink).toBeFocused();
    
    // Continue tabbing
    await page.keyboard.press('Tab');
    const secondNavLink = page.locator('nav a').nth(1);
    await expect(secondNavLink).toBeFocused();
  });
});
