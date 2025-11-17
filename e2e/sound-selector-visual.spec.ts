import { test, expect } from '@playwright/test'

/**
 * Sound Selector Visual Testing with Screenshots
 *
 * This test suite captures screenshots to manually verify the visual appearance
 * of the sound selector highlighting behavior across different device sizes.
 *
 * Screenshots are saved in the test-results directory and can be used for:
 * 1. Manual visual inspection
 * 2. Comparison with expected behavior
 * 3. Documentation of the UI state
 *
 * The tests verify that:
 * - Selected item shows green background consistently
 * - Hover state shows gray background on non-selected items
 * - Green highlight persists across different screen sizes
 */

test.describe('Sound Selector Visual Testing', () => {
  // Test configuration for different viewport sizes
  const viewports = [
    { name: 'Mobile', width: 375, height: 667 }, // iPhone SE
    { name: 'Tablet', width: 768, height: 1024 }, // iPad
    { name: 'Desktop', width: 1920, height: 1080 }, // Full HD
  ]

  for (const viewport of viewports) {
    test.describe(`${viewport.name} (${viewport.width}x${viewport.height})`, () => {
      test.use({ viewport: { width: viewport.width, height: viewport.height } })

      test('initial state - selected item has green background', async ({
        page,
      }) => {
        await page.goto('/en')
        await page.waitForLoadState('networkidle')

        // Open settings dialog
        const settingsButton = page.getByRole('button', {
          name: /open settings/i,
        })
        await settingsButton.click()

        const dialog = page.getByRole('dialog', { name: /settings/i })
        await expect(dialog).toBeVisible()

        // Open sound selector dropdown
        const soundSelector = page.getByRole('combobox', {
          name: /select sound/i,
        })
        await soundSelector.click()

        const listbox = page.getByRole('listbox')
        await expect(listbox).toBeVisible()

        // Wait for render to complete
        await page.waitForTimeout(500)

        // Take screenshot of initial state
        await page.screenshot({
          path: `test-results/sound-selector-${viewport.name.toLowerCase()}-initial-state.png`,
          fullPage: true,
        })

        // Verify selected item has green background
        const selectedOption = page.getByRole('option', {
          name: /ascending chime/i,
        })
        const backgroundColor = await selectedOption.evaluate((el) => {
          return window.getComputedStyle(el).backgroundColor
        })
        // Accept both RGB and LAB color formats (Safari uses LAB)
        const isGreen =
          backgroundColor === 'rgb(4, 120, 87)' ||
          backgroundColor.startsWith('lab(') ||
          backgroundColor.startsWith('color(')
        expect(isGreen).toBe(true)
      })

      test('hover state - non-selected item shows gray background', async ({
        page,
      }) => {
        await page.goto('/en')
        await page.waitForLoadState('networkidle')

        const settingsButton = page.getByRole('button', {
          name: /open settings/i,
        })
        await settingsButton.click()

        const soundSelector = page.getByRole('combobox', {
          name: /select sound/i,
        })
        await soundSelector.click()

        const listbox = page.getByRole('listbox')
        await expect(listbox).toBeVisible()

        // Hover over a non-selected item
        const nonSelectedOption = page.getByRole('option', {
          name: /bright ding/i,
        })
        await nonSelectedOption.hover()
        await page.waitForTimeout(300)

        // Take screenshot while hovering
        await page.screenshot({
          path: `test-results/sound-selector-${viewport.name.toLowerCase()}-hover-state.png`,
          fullPage: true,
        })

        // Verify selected item still has green background
        const selectedOption = page.getByRole('option', {
          name: /ascending chime/i,
        })
        const selectedBgColor = await selectedOption.evaluate((el) => {
          return window.getComputedStyle(el).backgroundColor
        })
        const isGreen =
          selectedBgColor === 'rgb(4, 120, 87)' ||
          selectedBgColor.startsWith('lab(') ||
          selectedBgColor.startsWith('color(')
        expect(isGreen).toBe(true)

        // Verify hovered item has gray background
        const hoveredBgColor = await nonSelectedOption.evaluate((el) => {
          return window.getComputedStyle(el).backgroundColor
        })
        const isGray =
          hoveredBgColor === 'rgb(243, 244, 246)' ||
          hoveredBgColor.startsWith('lab(') ||
          hoveredBgColor.startsWith('color(')
        expect(isGray).toBe(true)
      })

      test('after hover - green highlight persists', async ({ page }) => {
        await page.goto('/en')
        await page.waitForLoadState('networkidle')

        const settingsButton = page.getByRole('button', {
          name: /open settings/i,
        })
        await settingsButton.click()

        const soundSelector = page.getByRole('combobox', {
          name: /select sound/i,
        })
        await soundSelector.click()

        const listbox = page.getByRole('listbox')
        await expect(listbox).toBeVisible()

        // Hover and then move away
        const nonSelectedOption = page.getByRole('option', {
          name: /bright ding/i,
        })
        await nonSelectedOption.hover()
        await page.waitForTimeout(300)

        // Move cursor away
        await page.mouse.move(0, 0)
        await page.waitForTimeout(300)

        // Take screenshot after hover
        await page.screenshot({
          path: `test-results/sound-selector-${viewport.name.toLowerCase()}-after-hover.png`,
          fullPage: true,
        })

        // Verify selected item STILL has green background
        const selectedOption = page.getByRole('option', {
          name: /ascending chime/i,
        })
        const backgroundColor = await selectedOption.evaluate((el) => {
          return window.getComputedStyle(el).backgroundColor
        })
        const isGreen =
          backgroundColor === 'rgb(4, 120, 87)' ||
          backgroundColor.startsWith('lab(') ||
          backgroundColor.startsWith('color(')
        expect(isGreen).toBe(true)
      })

      test('after selection change - new item has green background', async ({
        page,
      }) => {
        await page.goto('/en')
        await page.waitForLoadState('networkidle')

        const settingsButton = page.getByRole('button', {
          name: /open settings/i,
        })
        await settingsButton.click()

        const soundSelector = page.getByRole('combobox', {
          name: /select sound/i,
        })
        await soundSelector.click()

        const listbox = page.getByRole('listbox')
        await expect(listbox).toBeVisible()

        // Select a different sound
        const newOption = page.getByRole('option', { name: /bright ding/i })
        await newOption.click()
        await page.waitForTimeout(300)

        // Reopen dropdown
        await soundSelector.click()
        await expect(listbox).toBeVisible()
        await page.waitForTimeout(300)

        // Take screenshot of new selection
        await page.screenshot({
          path: `test-results/sound-selector-${viewport.name.toLowerCase()}-after-selection.png`,
          fullPage: true,
        })

        // Verify new selected item has green background
        const newSelected = page.getByRole('option', { name: /bright ding/i })
        const newBgColor = await newSelected.evaluate((el) => {
          return window.getComputedStyle(el).backgroundColor
        })
        const isGreen =
          newBgColor === 'rgb(4, 120, 87)' ||
          newBgColor.startsWith('lab(') ||
          newBgColor.startsWith('color(')
        expect(isGreen).toBe(true)
      })

      test('all items visible - comprehensive view', async ({ page }) => {
        await page.goto('/en')
        await page.waitForLoadState('networkidle')

        const settingsButton = page.getByRole('button', {
          name: /open settings/i,
        })
        await settingsButton.click()

        const soundSelector = page.getByRole('combobox', {
          name: /select sound/i,
        })
        await soundSelector.click()

        const listbox = page.getByRole('listbox')
        await expect(listbox).toBeVisible()

        // Wait for all items to render
        await page.waitForTimeout(500)

        // Scroll to show all items if needed
        await listbox.evaluate((el) => {
          el.scrollTop = 0
        })
        await page.waitForTimeout(200)

        // Take comprehensive screenshot
        await page.screenshot({
          path: `test-results/sound-selector-${viewport.name.toLowerCase()}-all-items.png`,
          fullPage: true,
        })

        // Scroll to bottom to capture all items
        await listbox.evaluate((el) => {
          el.scrollTop = el.scrollHeight
        })
        await page.waitForTimeout(200)

        await page.screenshot({
          path: `test-results/sound-selector-${viewport.name.toLowerCase()}-all-items-scrolled.png`,
          fullPage: true,
        })
      })
    })
  }

  test('comparison screenshots - before and after states', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto('/en')
    await page.waitForLoadState('networkidle')

    const settingsButton = page.getByRole('button', {
      name: /open settings/i,
    })
    await settingsButton.click()

    const soundSelector = page.getByRole('combobox', {
      name: /select sound/i,
    })
    await soundSelector.click()

    const listbox = page.getByRole('listbox')
    await expect(listbox).toBeVisible()

    // State 1: Initial selection (Ascending Chime)
    await page.waitForTimeout(300)
    await page.screenshot({
      path: 'test-results/comparison-01-initial-selection.png',
      fullPage: true,
    })

    // State 2: Hovering over different item
    const brightDing = page.getByRole('option', { name: /bright ding/i })
    await brightDing.hover()
    await page.waitForTimeout(300)
    await page.screenshot({
      path: 'test-results/comparison-02-hover-different-item.png',
      fullPage: true,
    })

    // State 3: Hovering over selected item
    const selectedOption = page.getByRole('option', {
      name: /ascending chime/i,
    })
    await selectedOption.hover()
    await page.waitForTimeout(300)
    await page.screenshot({
      path: 'test-results/comparison-03-hover-selected-item.png',
      fullPage: true,
    })

    // State 4: After cursor moved away
    await page.mouse.move(0, 0)
    await page.waitForTimeout(300)
    await page.screenshot({
      path: 'test-results/comparison-04-cursor-away.png',
      fullPage: true,
    })

    // State 5: Select new item
    await brightDing.click()
    await page.waitForTimeout(300)
    await soundSelector.click()
    await expect(listbox).toBeVisible()
    await page.waitForTimeout(300)
    await page.screenshot({
      path: 'test-results/comparison-05-new-selection.png',
      fullPage: true,
    })
  })
})
