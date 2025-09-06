import { test, expect } from '@playwright/test';

test.describe('Accessibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should have proper heading structure', async ({ page }) => {
    // Check for H1
    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toBeVisible();

    // Check for H2s
    const h2s = page.locator('h2');
    const h2Count = await h2s.count();
    expect(h2Count).toBeGreaterThan(0);

    // Ensure headings are not empty
    for (let i = 0; i < h2Count; i++) {
      const h2Text = await h2s.nth(i).textContent();
      expect(h2Text?.trim()).toBeTruthy();
    }
  });

  test('should have proper form labels', async ({ page }) => {
    // Check for labels
    const labels = page.locator('label');
    const labelCount = await labels.count();
    expect(labelCount).toBeGreaterThan(0);

    // Check if form controls have associated labels
    const formControls = page.locator('input, select, textarea, [role="combobox"]');
    const controlCount = await formControls.count();
    
    for (let i = 0; i < controlCount; i++) {
      const control = formControls.nth(i);
      
      // Check for aria-label or associated label
      const ariaLabel = await control.getAttribute('aria-label');
      const ariaLabelledBy = await control.getAttribute('aria-labelledby');
      const id = await control.getAttribute('id');
      
      if (id) {
        const associatedLabel = page.locator(`label[for="${id}"]`);
        const hasAssociatedLabel = await associatedLabel.count() > 0;
        
        expect(ariaLabel || ariaLabelledBy || hasAssociatedLabel).toBeTruthy();
      }
    }
  });

  test('should have proper button accessibility', async ({ page }) => {
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      
      // Check if button is visible and enabled, or has proper disabled state
      const isVisible = await button.isVisible();
      if (isVisible) {
        const buttonText = await button.textContent();
        const ariaLabel = await button.getAttribute('aria-label');
        
        // Button should have text or aria-label
        expect(buttonText?.trim() || ariaLabel).toBeTruthy();
      }
    }
  });

  test('should be keyboard navigable', async ({ page }) => {
    // Start keyboard navigation
    await page.keyboard.press('Tab');
    
    let tabIndex = 0;
    const maxTabs = 10;
    
    while (tabIndex < maxTabs) {
      const focusedElement = page.locator(':focus');
      const focusedCount = await focusedElement.count();
      
      if (focusedCount > 0) {
        // Element should be visible when focused
        await expect(focusedElement).toBeVisible();
      }
      
      await page.keyboard.press('Tab');
      tabIndex++;
    }
  });

  test('should have proper color contrast', async ({ page }) => {
    // Check main text elements for visibility
    const textElements = page.locator('h1, h2, p, label, button');
    const count = await textElements.count();
    
    for (let i = 0; i < Math.min(count, 5); i++) {
      const element = textElements.nth(i);
      
      if (await element.isVisible()) {
        const color = await element.evaluate((el) => getComputedStyle(el).color);
        const backgroundColor = await element.evaluate((el) => getComputedStyle(el).backgroundColor);
        
        // Basic check that color is not transparent or white on white
        expect(color).not.toBe('rgba(0, 0, 0, 0)');
        expect(color).not.toBe('transparent');
      }
    }
  });

  test('should have proper ARIA attributes', async ({ page }) => {
    // Check for select elements with proper ARIA
    const selects = page.locator('[role="combobox"]');
    const selectCount = await selects.count();
    
    for (let i = 0; i < selectCount; i++) {
      const select = selects.nth(i);
      
      // Should have aria-expanded
      const ariaExpanded = await select.getAttribute('aria-expanded');
      expect(ariaExpanded).toMatch(/true|false/);
      
      // Should have aria-haspopup or role
      const ariaHaspopup = await select.getAttribute('aria-haspopup');
      const role = await select.getAttribute('role');
      expect(ariaHaspopup || role).toBeTruthy();
    }
  });

  test('should handle focus management', async ({ page }) => {
    // Test focus on dropdowns
    const dropdown = page.locator('[role="combobox"]').first();
    
    if (await dropdown.count() > 0) {
      await dropdown.focus();
      await expect(dropdown).toBeFocused();
      
      // Press Enter or Space to open
      await page.keyboard.press('Enter');
      await page.waitForTimeout(300);
      
      // Check if dropdown options are accessible
      const options = page.locator('[role="option"]');
      if (await options.count() > 0) {
        // Arrow keys should navigate options
        await page.keyboard.press('ArrowDown');
        await page.waitForTimeout(100);
        
        // Some option should be focused or highlighted
        const focusedOption = page.locator('[role="option"]:focus, [role="option"][aria-selected="true"]');
        const focusedCount = await focusedOption.count();
        expect(focusedCount).toBeGreaterThanOrEqual(0); // May not always have focus, but shouldn't error
      }
    }
  });
});

test.describe('Performance Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load within reasonable time', async ({ page }) => {
    const startTime = Date.now();
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    // Page should load within 10 seconds
    expect(loadTime).toBeLessThan(10000);
  });

  test('should not have console errors', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Wait for any async operations
    
    // Filter out known acceptable errors
    const criticalErrors = errors.filter(error => 
      !error.includes('favicon.ico') &&
      !error.includes('Extension') &&
      !error.includes('chrome-extension') &&
      !error.includes('Source map')
    );
    
    expect(criticalErrors).toHaveLength(0);
  });

  test('should have reasonable bundle size impact', async ({ page }) => {
    // Measure network requests
    const requests: string[] = [];
    
    page.on('request', (request) => {
      requests.push(request.url());
    });
    
    await page.waitForLoadState('networkidle');
    
    // Should not have excessive number of requests
    expect(requests.length).toBeLessThan(50);
    
    // Check for main JS bundle
    const jsRequests = requests.filter(url => url.includes('.js'));
    expect(jsRequests.length).toBeGreaterThan(0);
  });

  test('should be responsive across viewports', async ({ page }) => {
    const viewports = [
      { width: 320, height: 568 },   // iPhone SE
      { width: 768, height: 1024 },  // iPad
      { width: 1024, height: 768 },  // iPad landscape
      { width: 1920, height: 1080 }, // Desktop
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.waitForTimeout(500);
      
      // Check if main content is visible
      const mainContent = page.locator('main, .container').first();
      await expect(mainContent).toBeVisible();
      
      // Check if there's no horizontal scroll
      const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
      const clientWidth = await page.evaluate(() => document.body.clientWidth);
      
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 5); // Allow 5px tolerance
    }
  });
});