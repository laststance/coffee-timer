import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Accessibility Tests', () => {
  test('should not have automatically detectable accessibility issues on home page (English)', async ({
    page,
  }) => {
    await page.goto('/en')
    await page.waitForLoadState('networkidle')

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('should not have automatically detectable accessibility issues on home page (Japanese)', async ({
    page,
  }) => {
    await page.goto('/ja')
    await page.waitForLoadState('networkidle')

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('timer controls are keyboard accessible', async ({ page }) => {
    await page.goto('/en')

    // Test tab navigation
    await page.keyboard.press('Tab')
    const firstFocused = await page.evaluate(
      () => document.activeElement?.tagName,
    )
    expect(firstFocused).toBeTruthy()

    // Test Enter/Space on buttons
    const startButton = page.getByRole('button', { name: /start/i })
    await startButton.focus()
    await page.keyboard.press('Enter')

    // Verify timer started (look for pause button)
    await expect(page.getByRole('button', { name: /pause/i })).toBeVisible()
  })

  test('settings dialog is accessible', async ({ page }) => {
    await page.goto('/en')

    // Open settings
    const settingsButton = page.getByRole('button', { name: /settings/i })
    await settingsButton.click()

    // Check dialog accessibility
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()

    // Check focus trap (Escape should close)
    await page.keyboard.press('Escape')
    await expect(dialog).not.toBeVisible()
  })

  test('time inputs have proper labels', async ({ page }) => {
    await page.goto('/en')

    // Check for minute and second inputs with labels
    // GlassNumberStepper uses type="text" with inputMode="numeric" instead of type="number"
    // so we use data-testid selectors instead of spinbutton role
    const minuteInput = page.getByTestId('time-input-minutes')
    const secondInput = page.getByTestId('time-input-seconds')

    await expect(minuteInput).toBeVisible()
    await expect(secondInput).toBeVisible()

    // Verify aria-label is set for accessibility
    await expect(minuteInput).toHaveAttribute('aria-label', 'Minutes')
    await expect(secondInput).toHaveAttribute('aria-label', 'Seconds')
  })

  test('color contrast meets WCAG AA standards', async ({ page }) => {
    await page.goto('/en')

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .include('body')
      .analyze()

    // Filter for color contrast violations
    const contrastViolations = accessibilityScanResults.violations.filter(
      (violation) => violation.id === 'color-contrast',
    )

    expect(contrastViolations).toEqual([])
  })

  test('all images have alt text', async ({ page }) => {
    await page.goto('/en')

    const images = await page.locator('img').all()
    for (const img of images) {
      const alt = await img.getAttribute('alt')
      expect(alt).toBeTruthy()
    }
  })

  test('notifications toggle is accessible', async ({ page }) => {
    await page.goto('/en')

    // Open settings
    await page.getByRole('button', { name: /settings/i }).click()

    // Find notification toggle (should be a switch or checkbox)
    const notificationToggle = page.getByRole('switch', {
      name: /notification/i,
    })
    await expect(notificationToggle).toBeVisible()

    // Should be keyboard operable
    await notificationToggle.focus()
    await page.keyboard.press('Space')
  })

  test('language toggle is accessible', async ({ page }) => {
    await page.goto('/en')

    // Wait for language toggle to be visible
    await page.waitForSelector('[aria-label="Language"]')

    // Find language toggle by its aria-label
    const langToggle = page.locator('[aria-label="Language"]').first()
    await expect(langToggle).toBeVisible()

    // Should have proper ARIA attributes
    const hasAriaLabel = await langToggle.getAttribute('aria-label')
    expect(hasAriaLabel).toBeTruthy()

    // Should be keyboard accessible
    await langToggle.focus()
    await expect(langToggle).toBeFocused()
  })

  test('timer display has ARIA live region', async ({ page }) => {
    await page.goto('/en')

    // Check for live region on timer
    const liveRegions = await page.locator('[aria-live]').all()
    expect(liveRegions.length).toBeGreaterThan(0)
  })

  test('touch targets are large enough (min 44x44px)', async ({ page }) => {
    await page.goto('/en')

    // Get all interactive elements, excluding Next.js dev tools
    const buttons = await page.locator('button').all()

    for (const button of buttons) {
      // Skip Next.js dev tools buttons (development only, not part of our app)
      const ariaLabel = await button.getAttribute('aria-label')
      if (
        ariaLabel?.includes('Next.js') ||
        ariaLabel?.includes('issues overlay') ||
        ariaLabel?.includes('issues badge')
      ) {
        continue
      }

      const box = await button.boundingBox()
      if (box) {
        // Get button info for debugging
        const text = await button.textContent()
        const label = ariaLabel || text || 'unknown'

        // WCAG 2.1 AA requires 44x44px minimum for touch targets
        expect(
          box.width,
          `Button "${label}" width should be >= 44px`,
        ).toBeGreaterThanOrEqual(44)
        expect(
          box.height,
          `Button "${label}" height should be >= 44px`,
        ).toBeGreaterThanOrEqual(44)
      }
    }
  })
})
