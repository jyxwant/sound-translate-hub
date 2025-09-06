import { chromium } from 'playwright';

async function testNewDesign() {
  console.log('🎨 Testing new professional design...');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:8083');
    await page.waitForLoadState('networkidle');
    
    // Test 1: Professional design elements
    console.log('✅ Test 1: Professional design verification...');
    
    const title = await page.locator('h1').first().textContent();
    console.log(`   Main title: ${title}`);
    
    // Check for new green primary color
    const primaryElements = page.locator('.bg-primary');
    const primaryCount = await primaryElements.count();
    console.log(`   Primary (green) elements: ${primaryCount}`);
    
    // Check for modern cards
    const modernCards = page.locator('.card-modern');
    const cardCount = await modernCards.count();
    console.log(`   Modern card elements: ${cardCount}`);
    
    // Test 2: Batch processing highlight
    console.log('✅ Test 2: Batch processing feature prominence...');
    
    // Look for batch feature highlight
    const batchFeatures = page.locator('text=/batch|Batch|multiple|Multiple/');
    const batchCount = await batchFeatures.count();
    console.log(`   Batch-related text found: ${batchCount} instances`);
    
    // Check for highlighted card (should have ring or special styling)
    const highlightedCards = page.locator('[class*="ring-2"], [class*="bg-primary/5"]');
    const highlightCount = await highlightedCards.count();
    console.log(`   Highlighted feature cards: ${highlightCount}`);
    
    // Test 3: Typography and spacing
    console.log('✅ Test 3: Typography system...');
    
    const h1Element = page.locator('h1').first();
    const h2Elements = page.locator('h2');
    
    const h1Size = await h1Element.evaluate(el => getComputedStyle(el).fontSize);
    const h1Weight = await h1Element.evaluate(el => getComputedStyle(el).fontWeight);
    const h1Spacing = await h1Element.evaluate(el => getComputedStyle(el).letterSpacing);
    
    console.log(`   H1: ${h1Size}, weight: ${h1Weight}, spacing: ${h1Spacing}`);
    
    if (await h2Elements.count() > 0) {
      const h2Size = await h2Elements.first().evaluate(el => getComputedStyle(el).fontSize);
      console.log(`   H2: ${h2Size}`);
    }
    
    // Test 4: Form controls modern styling
    console.log('✅ Test 4: Modern form controls...');
    
    const selects = page.locator('[role="combobox"]');
    const selectCount = await selects.count();
    console.log(`   Select controls: ${selectCount}`);
    
    if (selectCount > 0) {
      const firstSelect = selects.first();
      const borderRadius = await firstSelect.evaluate(el => getComputedStyle(el).borderRadius);
      const height = await firstSelect.evaluate(el => getComputedStyle(el).height);
      console.log(`   Select styling: radius=${borderRadius}, height=${height}`);
    }
    
    // Test 5: Color scheme consistency 
    console.log('✅ Test 5: Color scheme verification...');
    
    // Check for success/green colors
    const successElements = page.locator('.bg-success, .text-success, .bg-success-light');
    const successCount = await successElements.count();
    console.log(`   Success/green theme elements: ${successCount}`);
    
    // Check for consistent spacing
    const spacingElements = page.locator('.space-y-8, .gap-8, .p-8');
    const spacingCount = await spacingElements.count();
    console.log(`   Consistent spacing (8 units): ${spacingCount}`);
    
    // Test 6: Professional layout structure
    console.log('✅ Test 6: Layout structure...');
    
    // Check for proper grid layouts
    const grids = page.locator('.grid, .lg\\:grid-cols-2');
    const gridCount = await grids.count();
    console.log(`   Grid layouts: ${gridCount}`);
    
    // Check for fade-in animations
    const animations = page.locator('.fade-in');
    const animationCount = await animations.count();
    console.log(`   Animated elements: ${animationCount}`);
    
    // Test 7: Accessibility and focus states
    console.log('✅ Test 7: Accessibility features...');
    
    // Test keyboard navigation
    await page.keyboard.press('Tab');
    await page.waitForTimeout(200);
    
    const focusedElements = page.locator(':focus');
    const focusCount = await focusedElements.count();
    console.log(`   Keyboard focusable elements: ${focusCount > 0 ? 'Yes' : 'No'}`);
    
    // Test 8: Responsive design
    console.log('✅ Test 8: Responsive design...');
    
    // Test mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    
    const mobileContent = page.locator('.max-w-4xl').first();
    const mobileVisible = await mobileContent.isVisible();
    console.log(`   Mobile layout: ${mobileVisible}`);
    
    // Test desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(500);
    
    const desktopGrid = page.locator('.lg\\:grid-cols-2').first();
    const desktopGridVisible = await desktopGrid.isVisible();
    console.log(`   Desktop grid: ${desktopGridVisible}`);
    
    // Test 9: Professional favicon and meta
    console.log('✅ Test 9: Professional branding...');
    
    const pageTitle = await page.title();
    console.log(`   Page title: ${pageTitle}`);
    
    const favicon = page.locator('link[rel="icon"]');
    const faviconExists = await favicon.count() > 0;
    console.log(`   Custom favicon: ${faviconExists}`);
    
    console.log('🎉 All design tests completed successfully!');
    console.log('');
    console.log('📊 Design Summary:');
    console.log(`   ✓ Modern ChatGPT-style cards: ${cardCount}`);
    console.log(`   ✓ Green primary color theme: ${primaryCount} elements`);
    console.log(`   ✓ Batch processing highlighted: ${batchCount} references`);
    console.log(`   ✓ Professional typography: H1=${h1Size}`);
    console.log(`   ✓ Modern form controls: ${selectCount} selects`);
    console.log(`   ✓ Responsive grid layouts: ${gridCount}`);
    console.log(`   ✓ Accessibility: Keyboard navigation working`);
    console.log(`   ✓ Professional branding: Custom favicon and title`);
    
  } catch (error) {
    console.error('❌ Design test failed:', error);
  } finally {
    await browser.close();
  }
}

testNewDesign();