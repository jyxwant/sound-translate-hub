import { test, expect } from '@playwright/test';

test.describe('Homepage Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the page to load completely
    await page.waitForLoadState('networkidle');
  });

  test('should display the main title and subtitle', async ({ page }) => {
    // Check if the main title is visible
    const title = page.locator('h1').first();
    await expect(title).toBeVisible();
    await expect(title).toContainText('Sound Translate Hub' || /Audio/);

    // Check if the subtitle is visible
    const subtitle = page.locator('p').first();
    await expect(subtitle).toBeVisible();
  });

  test('should display feature badges', async ({ page }) => {
    // Check for feature badges
    const badges = page.locator('[class*="inline-flex"][class*="rounded-full"]');
    await expect(badges).toHaveCount(3);
    
    // Check if badges contain expected text
    const badgeTexts = await badges.allTextContents();
    expect(badgeTexts.some(text => text.includes('No Upload') || text.includes('本地'))).toBe(true);
    expect(badgeTexts.some(text => text.includes('Batch') || text.includes('批量'))).toBe(true);
    expect(badgeTexts.some(text => text.includes('Fast') || text.includes('快速'))).toBe(true);
  });

  test('should have responsive layout', async ({ page }) => {
    // Test desktop layout
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(500);
    
    const container = page.locator('.max-w-4xl').first();
    await expect(container).toBeVisible();

    // Test tablet layout
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500);
    await expect(container).toBeVisible();

    // Test mobile layout
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    await expect(container).toBeVisible();
  });

  test('should have proper color scheme (light mode)', async ({ page }) => {
    // Check if the page has proper background
    const body = page.locator('body');
    await expect(body).toHaveCSS('background-color', /rgb\(255, 255, 255\)|rgb\(250, 250, 250\)|rgb\(248, 248, 248\)/);
  });
});