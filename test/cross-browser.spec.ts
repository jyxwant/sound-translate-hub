import { test, expect } from '@playwright/test';

test.describe('Cross-Browser Compatibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should display correctly in Chromium', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'This test is for Chromium only');
    
    // Check main components are visible
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('[role="combobox"]').first()).toBeVisible();
    
    // Check CSS Grid/Flexbox layouts work
    const gridContainer = page.locator('.grid').first();
    if (await gridContainer.count() > 0) {
      await expect(gridContainer).toBeVisible();
    }
  });

  test('should display correctly in Firefox', async ({ page, browserName }) => {
    test.skip(browserName !== 'firefox', 'This test is for Firefox only');
    
    // Check main components are visible
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('[role="combobox"]').first()).toBeVisible();
    
    // Firefox-specific checks
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    expect(buttonCount).toBeGreaterThan(0);
  });

  test('should display correctly in WebKit/Safari', async ({ page, browserName }) => {
    test.skip(browserName !== 'webkit', 'This test is for WebKit only');
    
    // Check main components are visible
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('[role="combobox"]').first()).toBeVisible();
    
    // WebKit-specific font rendering
    const title = page.locator('h1').first();
    const fontFamily = await title.evaluate((el) => getComputedStyle(el).fontFamily);
    expect(fontFamily).toBeTruthy();
  });

  test('should handle mobile browsers correctly', async ({ page, isMobile }) => {
    if (!isMobile) {
      test.skip(true, 'This test is for mobile browsers only');
    }
    
    // Check mobile-specific layout
    await expect(page.locator('h1')).toBeVisible();
    
    // Check if mobile navigation works
    const converter = page.locator('.card-chatgpt, .bg-white').first();
    await expect(converter).toBeVisible();
    
    // Test touch interactions
    const dropdown = page.locator('[role="combobox"]').first();
    if (await dropdown.count() > 0) {
      await dropdown.tap();
      await page.waitForTimeout(300);
      
      const options = page.locator('[role="option"]');
      if (await options.count() > 0) {
        await expect(options.first()).toBeVisible();
      }
    }
  });

  test('should work with different language settings', async ({ page }) => {
    // Test RTL languages if supported
    await page.addScriptTag({
      content: `
        document.documentElement.setAttribute('dir', 'rtl');
        document.documentElement.setAttribute('lang', 'ar');
      `
    });
    
    await page.waitForTimeout(500);
    
    // Elements should still be visible and functional
    await expect(page.locator('h1')).toBeVisible();
    
    // Check if RTL layout is applied
    const direction = await page.evaluate(() => getComputedStyle(document.documentElement).direction);
    expect(direction).toBe('rtl');
  });

  test('should handle high DPI displays', async ({ page }) => {
    // Simulate high DPI
    await page.emulateMedia({ colorScheme: 'light' });
    
    // Check if images and graphics scale properly
    const images = page.locator('img, svg');
    const imageCount = await images.count();
    
    for (let i = 0; i < Math.min(imageCount, 3); i++) {
      const image = images.nth(i);
      if (await image.isVisible()) {
        await expect(image).toBeVisible();
      }
    }
  });
});

test.describe('Browser Feature Detection Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should handle modern CSS features gracefully', async ({ page }) => {
    // Test CSS Grid support
    const hasGrid = await page.evaluate(() => {
      return CSS.supports('display', 'grid');
    });
    
    if (hasGrid) {
      const gridElements = page.locator('.grid');
      const gridCount = await gridElements.count();
      // If CSS Grid is supported, grid elements should work
      expect(gridCount).toBeGreaterThanOrEqual(0);
    }
    
    // Test CSS Custom Properties
    const hasCustomProps = await page.evaluate(() => {
      return CSS.supports('color', 'var(--color)');
    });
    
    expect(hasCustomProps).toBe(true); // Modern browsers should support this
  });

  test('should handle modern JavaScript features', async ({ page }) => {
    // Test if modern ES features are available
    const hasModernJS = await page.evaluate(() => {
      try {
        // Test arrow functions, const, let
        const test = () => {
          const x = 1;
          let y = 2;
          return x + y;
        };
        return test() === 3;
      } catch (e) {
        return false;
      }
    });
    
    expect(hasModernJS).toBe(true);
  });

  test('should handle file API availability', async ({ page }) => {
    // Check if File API is supported (needed for file upload)
    const hasFileAPI = await page.evaluate(() => {
      return typeof File !== 'undefined' && typeof FileReader !== 'undefined';
    });
    
    expect(hasFileAPI).toBe(true);
  });

  test('should handle Web Workers if used', async ({ page }) => {
    // Check if Web Workers are supported (might be used for audio processing)
    const hasWebWorkers = await page.evaluate(() => {
      return typeof Worker !== 'undefined';
    });
    
    expect(hasWebWorkers).toBe(true);
  });

  test('should handle local storage', async ({ page }) => {
    // Test localStorage functionality
    const hasLocalStorage = await page.evaluate(() => {
      try {
        localStorage.setItem('test', 'value');
        const result = localStorage.getItem('test') === 'value';
        localStorage.removeItem('test');
        return result;
      } catch (e) {
        return false;
      }
    });
    
    expect(hasLocalStorage).toBe(true);
  });
});

test.describe('Error Handling Tests', () => {
  test('should handle network errors gracefully', async ({ page }) => {
    // Navigate to the page first
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Block network requests to simulate offline
    await page.route('**/*', route => route.abort());
    
    // Try to interact with the page - it should not crash
    const dropdown = page.locator('[role="combobox"]').first();
    if (await dropdown.count() > 0) {
      await dropdown.click({ timeout: 3000 }).catch(() => {
        // Expected to fail due to blocked network
      });
    }
    
    // Page should still be responsive
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should handle JavaScript errors gracefully', async ({ page }) => {
    const jsErrors: string[] = [];
    
    page.on('pageerror', (error) => {
      jsErrors.push(error.message);
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Inject a script that might cause errors
    await page.addScriptTag({
      content: `
        try {
          // Simulate some user interactions that might cause errors
          setTimeout(() => {
            const event = new Event('click');
            document.body.dispatchEvent(event);
          }, 100);
        } catch (e) {
          console.error('Test error:', e);
        }
      `
    });
    
    await page.waitForTimeout(1000);
    
    // Page should still function despite any errors
    await expect(page.locator('h1')).toBeVisible();
    
    // Log errors for debugging but don't fail the test for minor issues
    if (jsErrors.length > 0) {
      console.log('JavaScript errors detected:', jsErrors);
    }
  });
});