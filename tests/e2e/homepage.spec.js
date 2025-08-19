const { test, expect } = require('@playwright/test');

test.describe('Homepage', () => {
  test('loads successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/JAMstack Blog Template/);
  });

  test('displays recent posts', async ({ page }) => {
    await page.goto('/');
    
    // Check for recent posts section
    await expect(page.locator('h2:has-text("Recent Posts")')).toBeVisible();
    
    // Check for at least one blog post
    const postCount = await page.locator('.h-entry').count();
    expect(postCount).toBeGreaterThanOrEqual(1);
    
    // Check for specific posts
    await expect(page.locator('a:has-text("Hello, World")')).toBeVisible();
    await expect(page.locator('a:has-text("Markdown Syntax Showcase")')).toBeVisible();
  });

  test('has working navigation', async ({ page }) => {
    await page.goto('/');
    
    // Check navigation links
    await expect(page.locator('nav a:has-text("🏠 Home")')).toBeVisible();
    await expect(page.locator('nav a:has-text("✍️ Blog")')).toBeVisible();
    await expect(page.locator('nav a:has-text("👋 About")')).toBeVisible();
    
    // Test navigation
    await page.click('nav a:has-text("✍️ Blog")');
    await expect(page).toHaveURL(/\/blog\//);
  });

  test('displays hero section with call-to-action buttons', async ({ page }) => {
    await page.goto('/');
    
    // Check hero elements
    await expect(page.locator('h1')).toContainText('JAMstack Blog Template');
    await expect(page.locator('a:has-text("👋 Learn more about me")')).toBeVisible();
    await expect(page.locator('a:has-text("📡 Subscribe via RSS")')).toBeVisible();
  });

  test('has quick links section', async ({ page }) => {
    await page.goto('/');
    
    // Check quick links
    await expect(page.locator('a[href="/now/"]:has-text("What I\'m up to now")')).toBeVisible();
    await expect(page.locator('a[href="/uses/"]:has-text("Tools I use")')).toBeVisible();
    await expect(page.locator('a[href="/sitemap/"]:has-text("Explore this site")')).toBeVisible();
  });
});
