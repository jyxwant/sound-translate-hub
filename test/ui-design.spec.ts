import { test, expect } from '@playwright/test';

test.describe('UI/UX Tests - Apple/ChatGPT Style', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should have Apple-style design elements', async ({ page }) => {
    // Check for Apple-style fonts
    const body = page.locator('body');
    const fontFamily = await body.evaluate((el) => getComputedStyle(el).fontFamily);
    expect(fontFamily).toMatch(/-apple-system|SF|system-ui|BlinkMacSystemFont/i);

    // Check for proper font smoothing
    const fontSmoothing = await body.evaluate((el) => getComputedStyle(el).webkitFontSmoothing);
    expect(fontSmoothing).toBe('antialiased');
  });

  test('should have ChatGPT-style card design', async ({ page }) => {
    // Check for main converter card
    const converterCard = page.locator('.card-chatgpt, .bg-white\\/80').first();
    await expect(converterCard).toBeVisible();
    
    // Check card has proper border radius
    const borderRadius = await converterCard.evaluate((el) => getComputedStyle(el).borderRadius);
    expect(parseFloat(borderRadius)).toBeGreaterThan(8); // Should have rounded corners
  });

  test('should have proper color scheme', async ({ page }) => {
    // Check for blue primary color (Apple-like)
    const primaryElements = page.locator('.bg-blue-500, .text-blue-500');
    const count = await primaryElements.count();
    expect(count).toBeGreaterThan(0);

    // Check for subtle backgrounds
    const subtleBackgrounds = page.locator('[class*="bg-gray-50"], [class*="bg-blue-50"]');
    const subtleCount = await subtleBackgrounds.count();
    expect(subtleCount).toBeGreaterThan(0);
  });

  test('should have smooth animations and transitions', async ({ page }) => {
    // Check for transition classes
    const transitionElements = page.locator('[class*="transition"]');
    const transitionCount = await transitionElements.count();
    expect(transitionCount).toBeGreaterThan(0);

    // Test hover effects on buttons
    const buttons = page.locator('button').first();
    if (await buttons.isVisible()) {
      await buttons.hover();
      await page.waitForTimeout(300); // Wait for transition
      
      // Button should still be visible after hover
      await expect(buttons).toBeVisible();
    }
  });

  test('should have proper spacing and typography', async ({ page }) => {
    // Check main title typography
    const mainTitle = page.locator('h1').first();
    await expect(mainTitle).toBeVisible();
    
    const fontSize = await mainTitle.evaluate((el) => getComputedStyle(el).fontSize);
    expect(parseFloat(fontSize)).toBeGreaterThan(30); // Should be large

    // Check for proper line height
    const lineHeight = await mainTitle.evaluate((el) => getComputedStyle(el).lineHeight);
    expect(parseFloat(lineHeight)).toBeGreaterThan(30);
  });

  test('should have consistent button styles', async ({ page }) => {
    // Find buttons and check their styling
    const buttons = page.locator('button:visible');
    const buttonCount = await buttons.count();
    
    if (buttonCount > 0) {
      for (let i = 0; i < Math.min(buttonCount, 3); i++) {
        const button = buttons.nth(i);
        
        // Check border radius
        const borderRadius = await button.evaluate((el) => getComputedStyle(el).borderRadius);
        expect(parseFloat(borderRadius)).toBeGreaterThan(4);
        
        // Check padding
        const padding = await button.evaluate((el) => getComputedStyle(el).padding);
        expect(padding).toBeTruthy();
      }
    }
  });

  test('should have proper focus states', async ({ page }) => {
    // Test keyboard navigation
    await page.keyboard.press('Tab');
    await page.waitForTimeout(100);
    
    // Check if focused element is visible and has focus styles
    const focusedElement = page.locator(':focus');
    if (await focusedElement.count() > 0) {
      await expect(focusedElement).toBeVisible();
      
      // Check for focus ring or outline
      const outline = await focusedElement.evaluate((el) => getComputedStyle(el).outline);
      const boxShadow = await focusedElement.evaluate((el) => getComputedStyle(el).boxShadow);
      
      expect(outline !== 'none' || boxShadow !== 'none').toBe(true);
    }
  });

  test('should have Apple-style step indicators', async ({ page }) => {
    // Check step number circles
    const stepCircles = page.locator('.w-7.h-7.rounded-full');
    await expect(stepCircles).toHaveCountGreaterThan(2);
    
    // Check they have proper background color
    const firstStep = stepCircles.first();
    const backgroundColor = await firstStep.evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(backgroundColor).toMatch(/rgb\(59, 130, 246\)|rgb\(37, 99, 235\)|blue/i); // Blue-ish
  });

  test('should have proper form controls styling', async ({ page }) => {
    // Check select/dropdown styling
    const selectTriggers = page.locator('[role="combobox"]');
    const selectCount = await selectTriggers.count();
    
    if (selectCount > 0) {
      const firstSelect = selectTriggers.first();
      
      // Check height
      const height = await firstSelect.evaluate((el) => getComputedStyle(el).height);
      expect(parseFloat(height)).toBeGreaterThan(40); // Should be at least 40px tall
      
      // Check border radius
      const borderRadius = await firstSelect.evaluate((el) => getComputedStyle(el).borderRadius);
      expect(parseFloat(borderRadius)).toBeGreaterThan(8); // Rounded corners
      
      // Check border
      const border = await firstSelect.evaluate((el) => getComputedStyle(el).border);
      expect(border).toBeTruthy();
    }
  });

  test('should have subtle shadows and depth', async ({ page }) => {
    // Check for box shadows on cards
    const cards = page.locator('.card-chatgpt, .bg-white').first();
    if (await cards.count() > 0) {
      const boxShadow = await cards.evaluate((el) => getComputedStyle(el).boxShadow);
      expect(boxShadow).not.toBe('none');
    }
  });

  test('should maintain visual hierarchy', async ({ page }) => {
    // Check heading hierarchy
    const h1Elements = page.locator('h1');
    const h2Elements = page.locator('h2');
    
    const h1Count = await h1Elements.count();
    const h2Count = await h2Elements.count();
    
    expect(h1Count).toBe(1); // Should have only one main heading
    expect(h2Count).toBeGreaterThan(0); // Should have section headings
    
    if (h1Count > 0 && h2Count > 0) {
      const h1Size = await h1Elements.first().evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
      const h2Size = await h2Elements.first().evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
      
      expect(h1Size).toBeGreaterThan(h2Size); // H1 should be larger than H2
    }
  });
});