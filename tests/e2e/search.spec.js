const { test, expect } = require('@playwright/test');

test.describe('Search Functionality', () => {
  test('search input is visible', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#q')).toBeVisible();
  });

  test('search returns results for valid queries', async ({ page }) => {
    await page.goto('/');
    
    // Wait for search to initialize
    await page.waitForTimeout(2000);
    
    // Type in search box
    await page.fill('#q', 'markdown');
    
    // Wait for search results
    await page.waitForTimeout(1000);
    
    // Check if results appear
    const searchResults = page.locator('#search-results');
    await expect(searchResults).toBeVisible();
    
    // Should find the markdown showcase post
    await expect(searchResults.locator('a:has-text("Markdown Syntax Showcase")')).toBeVisible();
  });

  test('search works with different terms', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);
    
    // Test search for "indieweb"
    await page.fill('#q', 'indieweb');
    await page.waitForTimeout(1000);
    
    const searchResults = page.locator('#search-results');
    await expect(searchResults).toBeVisible();
    await expect(searchResults.locator('a:has-text("Building for the Independent Web")')).toBeVisible();
  });

  test('search shows no results message for invalid queries', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);
    
    await page.fill('#q', 'nonexistentterm12345');
    await page.waitForTimeout(1000);
    
    const searchResults = page.locator('#search-results');
    await expect(searchResults).toBeVisible();
    await expect(searchResults.locator('text=No results found')).toBeVisible();
  });

  test('search results are clickable', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);
    
    await page.fill('#q', 'hello');
    await page.waitForTimeout(1000);
    
    // Click on a search result
    await page.click('#search-results a:has-text("Hello, World")');
    
    // Should navigate to the blog post
    await expect(page).toHaveURL(/\/blog\/hello-world\//);
    await expect(page.locator('h1:has-text("Hello, World")')).toBeVisible();
  });
});
