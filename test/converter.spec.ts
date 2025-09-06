import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Audio Converter Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should display all converter steps', async ({ page }) => {
    // Check if all 4 steps are displayed
    const step1 = page.locator('text=1').first();
    const step2 = page.locator('text=2').first();
    const step3 = page.locator('text=3').first();
    
    await expect(step1).toBeVisible();
    await expect(step2).toBeVisible();
    await expect(step3).toBeVisible();
  });

  test('should have format selection dropdowns', async ({ page }) => {
    // Check "From Format" dropdown
    const fromFormatTrigger = page.locator('[role="combobox"]').first();
    await expect(fromFormatTrigger).toBeVisible();
    
    await fromFormatTrigger.click();
    await page.waitForTimeout(500);
    
    // Check if format options are available
    const mp3Option = page.locator('[role="option"]', { hasText: 'MP3' });
    const wavOption = page.locator('[role="option"]', { hasText: 'WAV' });
    const flacOption = page.locator('[role="option"]', { hasText: 'FLAC' });
    
    await expect(mp3Option).toBeVisible();
    await expect(wavOption).toBeVisible();
    await expect(flacOption).toBeVisible();

    // Close dropdown by clicking outside
    await page.click('body', { position: { x: 100, y: 100 } });

    // Check "To Format" dropdown
    const toFormatTrigger = page.locator('[role="combobox"]').nth(1);
    await expect(toFormatTrigger).toBeVisible();
    
    await toFormatTrigger.click();
    await page.waitForTimeout(500);
    
    // Verify same format options are available
    await expect(page.locator('[role="option"]', { hasText: 'MP3' })).toBeVisible();
    await expect(page.locator('[role="option"]', { hasText: 'WAV' })).toBeVisible();
  });

  test('should display file upload area', async ({ page }) => {
    // Look for file upload component
    const fileUploadArea = page.locator('[data-testid="file-upload"], .dropzone, [type="file"]').first();
    await expect(fileUploadArea).toBeVisible();
  });

  test('should display audio settings', async ({ page }) => {
    // Check bitrate dropdown
    const bitrateDropdown = page.locator('text=Bitrate').first();
    await expect(bitrateDropdown).toBeVisible();

    // Check sample rate dropdown  
    const sampleRateDropdown = page.locator('text=Sample Rate').first();
    await expect(sampleRateDropdown).toBeVisible();

    // Check channels dropdown
    const channelsDropdown = page.locator('text=Channels').first();
    await expect(channelsDropdown).toBeVisible();
  });

  test('should show privacy indicator', async ({ page }) => {
    // Check for privacy/security indicator
    const privacyIndicator = page.locator('text=/Local Processing|本地处理|🔒/').first();
    await expect(privacyIndicator).toBeVisible();
  });

  test('should have proper step numbering and styling', async ({ page }) => {
    // Check step numbers are styled consistently
    const stepNumbers = page.locator('.w-7.h-7.rounded-full.bg-blue-500');
    await expect(stepNumbers).toHaveCount(3); // Steps 1, 2, 3 (step 4 only shows with files)
    
    // Check step titles
    const stepTitles = page.locator('h2.text-xl');
    await expect(stepTitles).toHaveCountGreaterThan(2);
  });

  test('should be responsive across different screen sizes', async ({ page }) => {
    // Test various viewport sizes
    const viewports = [
      { width: 1920, height: 1080 }, // Desktop
      { width: 1024, height: 768 },  // Tablet landscape
      { width: 768, height: 1024 },  // Tablet portrait
      { width: 375, height: 667 },   // Mobile
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.waitForTimeout(500);
      
      // Check if main converter card is still visible
      const converterCard = page.locator('.card-chatgpt, .bg-white').first();
      await expect(converterCard).toBeVisible();
      
      // Check if steps are still visible
      const step1 = page.locator('text=1').first();
      await expect(step1).toBeVisible();
    }
  });

  test('should handle format selection interaction', async ({ page }) => {
    // Select "From Format"
    const fromFormatTrigger = page.locator('[role="combobox"]').first();
    await fromFormatTrigger.click();
    
    // Select WAV format
    const wavOption = page.locator('[role="option"]', { hasText: 'WAV' });
    await wavOption.click();
    
    // Verify selection
    await expect(fromFormatTrigger).toContainText('WAV');
    
    // Select "To Format"  
    const toFormatTrigger = page.locator('[role="combobox"]').nth(1);
    await toFormatTrigger.click();
    
    // Select MP3 format
    const mp3Option = page.locator('[role="option"]', { hasText: 'MP3' });
    await mp3Option.click();
    
    // Verify selection
    await expect(toFormatTrigger).toContainText('MP3');
  });

  test('should handle audio settings interaction', async ({ page }) => {
    // Test bitrate selection
    const bitrateDropdowns = page.locator('[role="combobox"]');
    const bitrateDropdown = bitrateDropdowns.nth(2); // Assuming it's the 3rd dropdown
    
    await bitrateDropdown.click();
    await page.waitForTimeout(300);
    
    const bitrate320 = page.locator('[role="option"]', { hasText: '320' });
    if (await bitrate320.isVisible()) {
      await bitrate320.click();
      await expect(bitrateDropdown).toContainText('320');
    }

    // Test sample rate selection
    const sampleRateDropdown = bitrateDropdowns.nth(3);
    
    await sampleRateDropdown.click();
    await page.waitForTimeout(300);
    
    const sampleRate44k = page.locator('[role="option"]', { hasText: '44.1' });
    if (await sampleRate44k.isVisible()) {
      await sampleRate44k.click();
      await expect(sampleRateDropdown).toContainText('44.1');
    }
  });
});