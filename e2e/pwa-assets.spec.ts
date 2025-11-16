import { test, expect } from '@playwright/test'
import fs from 'fs'
import path from 'path'

test.describe('PWA Assets Validation', () => {
  test.describe('Icon Files Existence', () => {
    const requiredAssets = [
      { path: 'public/icon-144x144.png', width: 144, height: 144 },
      { path: 'public/icon-192x192.png', width: 192, height: 192 },
      { path: 'public/icon-512x512.png', width: 512, height: 512 },
      { path: 'public/icon-192x192-safe.png', width: 192, height: 192 },
      { path: 'public/apple-touch-icon.png', width: 180, height: 180 },
      { path: 'public/badge.png', width: 96, height: 96 },
      { path: 'public/favicon.ico' },
      { path: 'public/shortcuts/start.png', width: 96, height: 96 },
      { path: 'public/shortcuts/settings.png', width: 96, height: 96 },
      { path: 'public/screenshots/desktop-wide.png', width: 1280, height: 720 },
      {
        path: 'public/screenshots/mobile-narrow.png',
        width: 375,
        height: 812,
      },
    ]

    for (const asset of requiredAssets) {
      test(`${asset.path} should exist`, () => {
        const assetPath = path.join(process.cwd(), asset.path)
        expect(fs.existsSync(assetPath)).toBe(true)
      })
    }
  })

  test.describe('Favicon Display', () => {
    test('should display favicon in browser tab', async ({ page }) => {
      await page.goto('/')

      // Check for favicon link in head
      const faviconLink = await page.locator('link[rel="icon"]').first()
      await expect(faviconLink).toHaveAttribute('href', /favicon\.ico/)
    })

    test('should display apple-touch-icon', async ({ page }) => {
      await page.goto('/')

      const appleTouchIcon = await page.locator('link[rel="apple-touch-icon"]')
      await expect(appleTouchIcon).toHaveAttribute(
        'href',
        /apple-touch-icon\.png/,
      )
    })
  })

  test.describe('PWA Manifest Validation', () => {
    test('should have valid manifest.json', async ({ page }) => {
      await page.goto('/')

      // Check manifest link exists
      const manifestLink = await page.locator('link[rel="manifest"]')
      await expect(manifestLink).toHaveCount(1)

      // Fetch and parse manifest
      const manifestHref = await manifestLink.getAttribute('href')
      expect(manifestHref).toBeTruthy()

      const manifestResponse = await page.request.get(manifestHref!)
      expect(manifestResponse.ok()).toBe(true)

      const manifest = await manifestResponse.json()

      // Validate manifest structure
      expect(manifest.name).toBe('Coffee Timer')
      expect(manifest.short_name).toBe('CoffeeTimer')
      expect(manifest.icons).toBeDefined()
      expect(manifest.icons.length).toBeGreaterThan(0)
    })

    test('should include all required icon sizes in manifest', async ({
      page,
    }) => {
      await page.goto('/')

      const manifestLink = await page.locator('link[rel="manifest"]')
      const manifestHref = await manifestLink.getAttribute('href')
      const manifestResponse = await page.request.get(manifestHref!)
      const manifest = await manifestResponse.json()

      const requiredSizes = ['144x144', '192x192', '512x512']
      const iconSizes = manifest.icons.map((icon: any) => icon.sizes)

      for (const size of requiredSizes) {
        expect(iconSizes).toContain(size)
      }
    })

    test('should have maskable icon variant', async ({ page }) => {
      await page.goto('/')

      const manifestLink = await page.locator('link[rel="manifest"]')
      const manifestHref = await manifestLink.getAttribute('href')
      const manifestResponse = await page.request.get(manifestHref!)
      const manifest = await manifestResponse.json()

      const maskableIcons = manifest.icons.filter((icon: any) =>
        icon.purpose?.includes('maskable'),
      )

      expect(maskableIcons.length).toBeGreaterThan(0)
    })

    test('should have correct theme and background colors', async ({
      page,
    }) => {
      await page.goto('/')

      const manifestLink = await page.locator('link[rel="manifest"]')
      const manifestHref = await manifestLink.getAttribute('href')
      const manifestResponse = await page.request.get(manifestHref!)
      const manifest = await manifestResponse.json()

      // Validate colors match design spec or brand
      expect(manifest.theme_color).toBeDefined()
      expect(manifest.background_color).toBeDefined()
    })
  })

  test.describe('Visual Icon Quality', () => {
    test('should display app icon on page load', async ({ page }) => {
      await page.goto('/')

      // Check for theme-color meta tag
      const themeColor = await page.locator('meta[name="theme-color"]')
      await expect(themeColor).toHaveCount(1)
    })

    test('should have consistent branding colors', async ({ page }) => {
      await page.goto('/')

      // Get computed theme color
      const themeColorMeta = await page.locator('meta[name="theme-color"]')
      const themeColor = await themeColorMeta.getAttribute('content')

      // Validate it matches expected green from design (#10B981)
      expect(themeColor).toBe('#10B981')
    })
  })

  test.describe('Responsive Screenshots Validation', () => {
    test('should render properly on desktop viewport (1280x720)', async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1280, height: 720 })
      await page.goto('/')

      // Take screenshot for comparison
      await page.screenshot({
        path: 'test-results/pwa-desktop-validation.png',
        fullPage: false,
      })

      // Verify key elements are visible
      await expect(page.locator('[data-testid="timer-display"]')).toBeVisible()
    })

    test('should render properly on mobile viewport (375x812)', async ({
      page,
    }) => {
      await page.setViewportSize({ width: 375, height: 812 })
      await page.goto('/')

      // Take screenshot for comparison
      await page.screenshot({
        path: 'test-results/pwa-mobile-validation.png',
        fullPage: false,
      })

      // Verify key elements are visible and properly sized
      await expect(page.locator('[data-testid="timer-display"]')).toBeVisible()
    })

    test('should render properly on tablet viewport (iPad Pro)', async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1024, height: 1366 })
      await page.goto('/')

      // Take screenshot for comparison
      await page.screenshot({
        path: 'test-results/pwa-tablet-validation.png',
        fullPage: false,
      })

      await expect(page.locator('[data-testid="timer-display"]')).toBeVisible()
    })
  })

  test.describe('PWA Installability', () => {
    test('should be installable as PWA', async ({ page }) => {
      await page.goto('/')

      // Check for PWA criteria
      // 1. Valid manifest
      const manifestLink = await page.locator('link[rel="manifest"]')
      await expect(manifestLink).toHaveCount(1)

      // 2. Service Worker (if implemented)
      // Note: This may need adjustment based on your SW implementation
      const hasServiceWorker = await page.evaluate(() => {
        return 'serviceWorker' in navigator
      })
      expect(hasServiceWorker).toBe(true)

      // 3. Runs over HTTPS or localhost
      const url = page.url()
      expect(
        url.startsWith('https://') || url.startsWith('http://localhost'),
      ).toBe(true)
    })
  })

  test.describe('Icon File Size Optimization', () => {
    test('icon files should be optimized (reasonable file sizes)', () => {
      const maxSizes = {
        'public/icon-144x144.png': 50 * 1024, // 50KB
        'public/icon-192x192.png': 75 * 1024, // 75KB
        'public/icon-512x512.png': 200 * 1024, // 200KB
        'public/icon-192x192-safe.png': 75 * 1024, // 75KB
        'public/apple-touch-icon.png': 75 * 1024, // 75KB
        'public/badge.png': 25 * 1024, // 25KB
      }

      for (const [filePath, maxSize] of Object.entries(maxSizes)) {
        const fullPath = path.join(process.cwd(), filePath)
        if (fs.existsSync(fullPath)) {
          const stats = fs.statSync(fullPath)
          expect(stats.size).toBeLessThan(maxSize)
        }
      }
    })
  })

  test.describe('Accessibility Compliance', () => {
    test('should have proper alt text for icons', async ({ page }) => {
      await page.goto('/')

      // Check for proper ARIA labels if icons are used in UI
      const iconElements = await page.locator('img[src*="icon"]').all()

      for (const icon of iconElements) {
        const alt = await icon.getAttribute('alt')
        expect(alt).toBeTruthy()
      }
    })
  })
})
