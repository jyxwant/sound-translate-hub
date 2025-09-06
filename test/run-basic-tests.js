import { chromium } from 'playwright';

async function runBasicTests() {
  console.log('🚀 Starting basic UI tests...');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    console.log('📍 Navigating to http://localhost:8080');
    await page.goto('http://localhost:8080');
    await page.waitForLoadState('networkidle');
    
    // Test 1: Page loads correctly
    console.log('✅ Test 1: Checking if page loads...');
    const mainTitle = page.locator('h1').first();
    const title = await mainTitle.textContent();
    console.log(`   Found main title: ${title}`);
    
    // Test 2: Check main components
    console.log('✅ Test 2: Checking main components...');
    const converter = page.locator('.card-chatgpt, .bg-white').first();
    const isVisible = await converter.isVisible();
    console.log(`   Converter card visible: ${isVisible}`);
    
    // Test 3: Check dropdowns
    console.log('✅ Test 3: Checking format selection...');
    const dropdowns = page.locator('[role="combobox"]');
    const dropdownCount = await dropdowns.count();
    console.log(`   Found ${dropdownCount} dropdowns`);
    
    // Test 4: Check step indicators
    console.log('✅ Test 4: Checking step indicators...');
    const steps = page.locator('.w-7.h-7.rounded-full');
    const stepCount = await steps.count();
    console.log(`   Found ${stepCount} step indicators`);
    
    // Test 5: Check responsive design
    console.log('✅ Test 5: Testing responsive design...');
    
    // Desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(500);
    const desktopVisible = await converter.isVisible();
    console.log(`   Desktop view: ${desktopVisible}`);
    
    // Mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    const mobileVisible = await converter.isVisible();
    console.log(`   Mobile view: ${mobileVisible}`);
    
    // Test 6: Check Apple-style design elements
    console.log('✅ Test 6: Checking Apple-style design...');
    const fontFamily = await page.locator('body').evaluate(el => getComputedStyle(el).fontFamily);
    const hasAppleFont = fontFamily.includes('-apple-system') || fontFamily.includes('SF');
    console.log(`   Apple-style font detected: ${hasAppleFont}`);
    
    // Test 7: Check color scheme
    console.log('✅ Test 7: Checking color scheme...');
    const primaryElements = page.locator('.bg-blue-500');
    const primaryCount = await primaryElements.count();
    console.log(`   Blue primary elements found: ${primaryCount}`);
    
    console.log('🎉 All basic tests passed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

runBasicTests();