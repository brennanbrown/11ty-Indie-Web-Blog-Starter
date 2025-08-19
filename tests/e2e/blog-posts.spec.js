const { test, expect } = require('@playwright/test');

test.describe('Blog Posts', () => {
  test('blog page lists all posts', async ({ page }) => {
    await page.goto('/blog/');
    
    await expect(page.locator('h1:has-text("Blog")')).toBeVisible();
    
    // Check for blog posts
    {
      const count = await page.locator('.h-entry').count();
      expect(count).toBeGreaterThanOrEqual(4);
    }
    
    // Check for specific posts
    await expect(page.locator('a:has-text("Hello, World")')).toBeVisible();
    await expect(page.locator('a:has-text("Markdown Syntax Showcase")')).toBeVisible();
    await expect(page.locator('a:has-text("Building for the Independent Web")')).toBeVisible();
    await expect(page.locator('a:has-text("Weekend Project")')).toBeVisible();
  });

  test('individual blog posts load correctly', async ({ page }) => {
    await page.goto('/blog/hello-world/');
    
    // Check post structure
    await expect(page.locator('h1:has-text("Hello, World")')).toBeVisible();
    await expect(page.locator('.h-entry')).toBeVisible();
    await expect(page.locator('h1.p-name')).toBeVisible();
    await expect(page.locator('.dt-published')).toBeVisible();
    
    // Check content
    await expect(page.locator('text=Welcome to your new JAMstack blog')).toBeVisible();
  });

  test('markdown showcase renders properly', async ({ page }) => {
    await page.goto('/blog/markdown-showcase/');
    
    // Check various markdown elements
    await expect(page.locator('h1.p-name:has-text("Markdown Syntax Showcase")')).toBeVisible();
    await expect(page.locator('h2:has-text("Headers")')).toBeVisible();
    await expect(page.locator('h3:has-text("Unordered Lists")')).toBeVisible();
    
    // Check code blocks
    {
      const codeBlocks = await page.locator('pre code').count();
      expect(codeBlocks).toBeGreaterThanOrEqual(3);
    }
    
    // Check tables
    await expect(page.locator('table')).toBeVisible();
    await expect(page.locator('th:has-text("Feature")')).toBeVisible();
    
    // Check blockquotes
    await expect(page.locator('blockquote').first()).toBeVisible();
    
    // Check images
    await expect(page.locator('img[alt="Sample Image"]')).toBeVisible();
  });

  test('blog posts have proper metadata', async ({ page }) => {
    await page.goto('/blog/building-indie-web/');
    
    // Check microformats
    await expect(page.locator('.h-entry')).toBeVisible();
    await expect(page.locator('h1.p-name')).toBeVisible();
    await expect(page.locator('.dt-published')).toBeVisible();
    await expect(page.locator('.p-author')).toBeVisible();
    
    // Check tags
    {
      const tagCount = await page.locator('.p-category').count();
      expect(tagCount).toBeGreaterThanOrEqual(1);
    }
    
    // Check featured image (featured image uses class u-photo in layout)
    await expect(page.locator('img.u-photo')).toBeVisible();
  });

  test('blog post navigation works', async ({ page }) => {
    await page.goto('/blog/hello-world/');
    
    // Check back to blog link
    await expect(page.locator('a[href="/blog/"]:has-text("← Back to Blog")')).toBeVisible();
    
    // Test navigation
    await page.click('a[href="/blog/"]:has-text("← Back to Blog")');
    await expect(page).toHaveURL(/\/blog\//);
  });

  test('tags are clickable and work', async ({ page }) => {
    await page.goto('/blog/markdown-showcase/');
    
    // Find and click a tag
    const tagLink = page.locator('.p-category').first();
    await expect(tagLink).toBeVisible();
    
    await tagLink.click();
    
    // Should navigate to tag page
    await expect(page).toHaveURL(/\/tags\//);
    await expect(page.locator('h1')).toContainText('Posts tagged');
  });
});
