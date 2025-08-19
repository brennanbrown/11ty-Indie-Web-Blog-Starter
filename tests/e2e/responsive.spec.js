const { test, expect } = require('@playwright/test');

test.describe('Responsive Design', () => {
  test('mobile navigation works', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await page.goto('/');
    
    // Navigation should be visible on mobile
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('nav a:has-text("🏠 Home")')).toBeVisible();
  });

  test('content is readable on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/blog/markdown-showcase/');
    
    // Check that content doesn't overflow
    const main = page.locator('main');
    const boundingBox = await main.boundingBox();
    expect(boundingBox.width).toBeLessThanOrEqual(375);
    
    // Check that text is readable size
    const paragraph = page.locator('p').first();
    const fontSize = await paragraph.evaluate(el => 
      window.getComputedStyle(el).fontSize
    );
    expect(parseInt(fontSize)).toBeGreaterThanOrEqual(14);
  });

  test('images are responsive', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/blog/building-indie-web/');
    
    // Check that images don't overflow container
    const images = page.locator('img');
    const count = await images.count();
    
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const boundingBox = await img.boundingBox();
      if (boundingBox) {
        expect(boundingBox.width).toBeLessThanOrEqual(375);
      }
    }
  });

  test('tablet layout works', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 }); // iPad
    await page.goto('/');
    
    // Check grid layouts work on tablet
    const quickLinks = page.locator('.grid').first();
    await expect(quickLinks).toBeVisible();
    
    // Navigation should still be horizontal
    const nav = page.locator('nav ul');
    const display = await nav.evaluate(el => 
      window.getComputedStyle(el).display
    );
    expect(display).toBe('flex');
  });

  test('desktop layout is optimal', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    
    // Content should be centered and not too wide
    const container = page.locator('.container').first();
    const boundingBox = await container.boundingBox();
    expect(boundingBox.width).toBeLessThanOrEqual(1200); // max-w-4xl equivalent
  });
});
