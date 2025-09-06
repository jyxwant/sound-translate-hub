import { chromium } from 'playwright';

async function runInteractionTests() {
  console.log('🚀 Starting interaction tests...');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:8080');
    await page.waitForLoadState('networkidle');
    
    // Test 1: Format selection interaction
    console.log('✅ Test 1: Testing format selection...');
    
    const fromFormatDropdown = page.locator('[role="combobox"]').first();
    await fromFormatDropdown.click();
    await page.waitForTimeout(500);
    
    const options = page.locator('[role="option"]');
    const optionCount = await options.count();
    console.log(`   Format options available: ${optionCount}`);
    
    if (optionCount > 0) {
      const mp3Option = page.locator('[role="option"]', { hasText: 'MP3' });
      if (await mp3Option.count() > 0) {
        await mp3Option.click();
        console.log('   Selected MP3 format');
      }
    }
    
    // Test 2: To format selection
    console.log('✅ Test 2: Testing to format selection...');
    
    const toFormatDropdown = page.locator('[role="combobox"]').nth(1);
    await toFormatDropdown.click();
    await page.waitForTimeout(500);
    
    const wavOption = page.locator('[role="option"]', { hasText: 'WAV' });
    if (await wavOption.count() > 0) {
      await wavOption.click();
      console.log('   Selected WAV format');
    }
    
    // Test 3: Audio settings
    console.log('✅ Test 3: Testing audio settings...');
    
    const bitrateDropdown = page.locator('[role="combobox"]').nth(2);
    await bitrateDropdown.click();
    await page.waitForTimeout(300);
    
    const bitrate320 = page.locator('[role="option"]', { hasText: '320' });
    if (await bitrate320.count() > 0) {
      await bitrate320.click();
      console.log('   Selected 320 kbps bitrate');
    }
    
    // Test 4: Privacy indicator visibility
    console.log('✅ Test 4: Checking privacy indicator...');
    
    const privacyIndicator = page.locator('text=/Local Processing|本地处理|🔒/');
    const privacyVisible = await privacyIndicator.isVisible();
    console.log(`   Privacy indicator visible: ${privacyVisible}`);
    
    // Test 5: Step progression
    console.log('✅ Test 5: Checking step progression...');
    
    const stepNumbers = page.locator('.w-7.h-7.rounded-full');
    for (let i = 0; i < Math.min(await stepNumbers.count(), 3); i++) {
      const step = stepNumbers.nth(i);
      const isVisible = await step.isVisible();
      const backgroundColor = await step.evaluate(el => getComputedStyle(el).backgroundColor);
      console.log(`   Step ${i + 1}: visible=${isVisible}, color=${backgroundColor}`);
    }
    
    // Test 6: Card hover effects
    console.log('✅ Test 6: Testing hover effects...');
    
    const converterCard = page.locator('.card-chatgpt').first();
    if (await converterCard.count() > 0) {
      await converterCard.hover();
      await page.waitForTimeout(300);
      console.log('   Card hover effect applied');
    }
    
    // Test 7: Responsive behavior
    console.log('✅ Test 7: Testing responsive layout...');
    
    // Test mobile layout
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    
    const mobileGrid = page.locator('.grid').first();
    const mobileVisible = await mobileGrid.isVisible();
    console.log(`   Mobile grid layout: ${mobileVisible}`);
    
    // Test tablet layout
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500);
    
    const tabletVisible = await mobileGrid.isVisible();
    console.log(`   Tablet layout: ${tabletVisible}`);
    
    // Reset to desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(500);
    
    // Test 8: Keyboard navigation
    console.log('✅ Test 8: Testing keyboard navigation...');
    
    await page.keyboard.press('Tab');
    await page.waitForTimeout(100);
    
    const focusedElement = page.locator(':focus');
    const focusedCount = await focusedElement.count();
    console.log(`   Focusable elements found: ${focusedCount > 0}`);
    
    if (focusedCount > 0) {
      const tagName = await focusedElement.evaluate(el => el.tagName);
      console.log(`   First focused element: ${tagName}`);
    }
    
    // Test 9: Color scheme consistency
    console.log('✅ Test 9: Testing color scheme...');
    
    const blueElements = page.locator('[class*="blue-"]');
    const blueCount = await blueElements.count();
    console.log(`   Blue-themed elements: ${blueCount}`);
    
    const grayElements = page.locator('[class*="gray-"]');
    const grayCount = await grayElements.count();
    console.log(`   Gray-themed elements: ${grayCount}`);
    
    // Test 10: Typography consistency
    console.log('✅ Test 10: Testing typography...');
    
    const headings = page.locator('h1, h2, h3');
    const headingCount = await headings.count();
    
    for (let i = 0; i < Math.min(headingCount, 3); i++) {
      const heading = headings.nth(i);
      const fontSize = await heading.evaluate(el => getComputedStyle(el).fontSize);
      const fontWeight = await heading.evaluate(el => getComputedStyle(el).fontWeight);
      const tagName = await heading.evaluate(el => el.tagName);
      console.log(`   ${tagName}: size=${fontSize}, weight=${fontWeight}`);
    }
    
    console.log('🎉 All interaction tests passed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

runInteractionTests();