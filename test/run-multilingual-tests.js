import { chromium } from 'playwright';

async function testMultilingualUI() {
  // Resolve base URL from CLI arg or environment
  const cliBase = process.argv[2];
  const envPort = process.env.PORT || process.env.APP_PORT || process.env.VITE_PORT || '8083';
  const envHost = process.env.HOST || 'localhost';
  const baseUrl = process.env.BASE_URL || cliBase || `http://${envHost}:${envPort}`;

  console.log('🌍 Starting multilingual and RTL tests...');
  console.log(`🔗 Base URL: ${baseUrl}`);
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    console.log(`📍 Navigating to ${baseUrl}`);
    await page.goto(baseUrl);
    await page.waitForLoadState('networkidle');
    
    // Test 1: English (default) layout
    console.log('✅ Test 1: Testing English (LTR) layout...');
    
    const englishTitle = await page.locator('h1').first().textContent();
    console.log(`   English title: ${englishTitle}`);
    
    // Check layout direction
    const direction = await page.evaluate(() => document.documentElement.dir);
    console.log(`   Direction: ${direction || 'ltr'}`);
    
    // Check if batch processing is highlighted
    const batchFeature = page.locator('text=/Batch processing|批量/');
    const batchVisible = await batchFeature.isVisible();
    console.log(`   Batch feature visible: ${batchVisible}`);
    
    // Test 2: Switch to Arabic (RTL) 
    console.log('✅ Test 2: Testing Arabic (RTL) layout...');
    
    // Look for language switcher
    const languageSwitcher = page.locator('[data-testid="language-switcher"], select, [role="combobox"]').last();
    if (await languageSwitcher.count() > 0) {
      await languageSwitcher.click();
      await page.waitForTimeout(500);
      
      // Try to find Arabic option
      const arabicOption = page.locator('text=/العربية|Arabic|ar/');
      if (await arabicOption.count() > 0) {
        await arabicOption.click();
        await page.waitForTimeout(1000);
        
        // Check if direction changed to RTL
        const rtlDirection = await page.evaluate(() => document.documentElement.dir);
        console.log(`   RTL Direction: ${rtlDirection}`);

        // Check Arabic title
        const arabicTitle = await page.locator('h1').first().textContent();
        console.log(`   Arabic title: ${arabicTitle}`);
        
        // Check if text is right-aligned
        const textAlign = await page.locator('h1').first().evaluate(el => getComputedStyle(el).textAlign);
        console.log(`   Text alignment: ${textAlign}`);

        // Inspect a Select trigger for RTL specifics
        const selectTrigger = page.locator('[role="combobox"]').first();
        if (await selectTrigger.count() > 0) {
          const triggerDir = await selectTrigger.evaluate(el => getComputedStyle(el).direction);
          const triggerTextAlign = await selectTrigger.evaluate(el => getComputedStyle(el).textAlign);
          console.log(`   Select trigger: dir=${triggerDir}, text-align=${triggerTextAlign}`);
          await selectTrigger.click();
          await page.waitForTimeout(300);
          // Inspect first option indicator position
          const option = page.locator('[role="option"]').first();
          if (await option.count() > 0) {
            const indicator = option.locator('span.absolute');
            if (await indicator.count() > 0) {
              const pos = await indicator.evaluate(el => ({ left: getComputedStyle(el).left, right: getComputedStyle(el).right }));
              console.log(`   Option indicator position: left=${pos.left}, right=${pos.right}`);
            }
          }
          await page.keyboard.press('Escape');
        }
      } else {
        console.log('   Arabic option not found, skipping RTL test');
      }
    } else {
      console.log('   Language switcher not found, skipping language test');
    }
    
    // Test 3: Professional design elements
    console.log('✅ Test 3: Testing professional design elements...');
    
    // Check new color scheme (green primary)
    const primaryElements = page.locator('.bg-primary, .text-primary');
    const primaryCount = await primaryElements.count();
    console.log(`   Primary color elements: ${primaryCount}`);
    
    // Check card design
    const modernCards = page.locator('.card-modern');
    const cardCount = await modernCards.count();
    console.log(`   Modern cards: ${cardCount}`);
    
    // Check if batch processing is prominently featured
    const batchCard = page.locator('text=/Upload and convert multiple|معالجة دفعية/');
    const batchCardVisible = await batchCard.isVisible();
    console.log(`   Batch processing prominently featured: ${batchCardVisible}`);
    
    // Test 4: ChatGPT-style typography
    console.log('✅ Test 4: Testing ChatGPT-style typography...');
    
    const headings = page.locator('h1, h2, h3');
    const headingCount = await headings.count();
    
    for (let i = 0; i < Math.min(headingCount, 3); i++) {
      const heading = headings.nth(i);
      const fontSize = await heading.evaluate(el => getComputedStyle(el).fontSize);
      const fontWeight = await heading.evaluate(el => getComputedStyle(el).fontWeight);
      const letterSpacing = await heading.evaluate(el => getComputedStyle(el).letterSpacing);
      console.log(`   Heading ${i + 1}: size=${fontSize}, weight=${fontWeight}, spacing=${letterSpacing}`);
    }
    
    // Test 5: Form controls and accessibility
    console.log('✅ Test 5: Testing form controls...');
    
    const selectTriggers = page.locator('[role="combobox"]');
    const selectCount = await selectTriggers.count();
    console.log(`   Select controls found: ${selectCount}`);
    
    if (selectCount > 0) {
      const firstSelect = selectTriggers.first();
      
      // Check modern input styling
      const borderRadius = await firstSelect.evaluate(el => getComputedStyle(el).borderRadius);
      const padding = await firstSelect.evaluate(el => getComputedStyle(el).padding);
      console.log(`   Select styling: borderRadius=${borderRadius}, padding=${padding}`);
      
      // Test interaction
      await firstSelect.click();
      await page.waitForTimeout(300);
      
      const options = page.locator('[role="option"]');
      const optionCount = await options.count();
      console.log(`   Options available: ${optionCount}`);
      
      if (optionCount > 0) {
        await page.keyboard.press('Escape'); // Close dropdown
      }
    }
    
    // Test 6: Responsive design
    console.log('✅ Test 6: Testing responsive design...');
    
    // Test mobile layout
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    
    const mobileLayout = await page.locator('.max-w-4xl').first().isVisible();
    console.log(`   Mobile layout: ${mobileLayout}`);
    
    // Test desktop layout
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(500);
    
    const desktopLayout = await page.locator('.lg\\:grid-cols-2').first().isVisible();
    console.log(`   Desktop grid layout: ${desktopLayout}`);
    
    console.log('🎉 All multilingual and design tests completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

testMultilingualUI();
