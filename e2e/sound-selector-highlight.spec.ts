import { test, expect } from '@playwright/test'

/**
 * Sound Selector Highlight Behavior Tests
 *
 * These tests verify that the primary highlight:
 * 1. Always shows on the currently selected item
 * 2. Does NOT change based on hover state
 * 3. Persists when cursor moves away from the selected item
 * 4. Shows subtle gray highlight on hover (non-selected items)
 *
 * NOTE: Tests force "light" theme for consistent color assertions.
 * The primary-green color varies by theme:
 * - Light: #047857 → rgb(4, 120, 87)
 * - Dark: #10b981 → rgb(16, 185, 129)
 * - Coffee: #5d4037 → rgb(93, 64, 55)
 */

test.describe('Sound Selector Highlight Behavior', () => {
  test.beforeEach(async ({ page }) => {
    // Set theme to 'light' in localStorage BEFORE navigating
    // This ensures consistent color values for testing regardless of default theme
    await page.addInitScript(() => {
      localStorage.setItem('theme', 'light')
    })

    await page.goto('/en')
    await page.waitForLoadState('networkidle')

    // Open settings dialog
    const settingsButton = page.getByRole('button', { name: /open settings/i })
    await settingsButton.click()

    // Wait for settings dialog to appear
    const dialog = page.getByRole('dialog', { name: /settings/i })
    await expect(dialog).toBeVisible()
  })

  test('selected item has green background that persists', async ({ page }) => {
    // Open sound selector dropdown
    const soundSelector = page.getByRole('combobox', { name: /select sound/i })
    await soundSelector.click()

    // Wait for the listbox to appear
    const listbox = page.getByRole('listbox')
    await expect(listbox).toBeVisible()

    // Get the initially selected item (Ascending Chime is default)
    const selectedOption = page.getByRole('option', {
      name: /ascending chime/i,
    })

    // Verify the selected item has green background using data-state=checked
    await expect(selectedOption).toHaveAttribute('data-state', 'checked')

    // Check computed background color is green
    const backgroundColor = await selectedOption.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor
    })

    // rgb(4, 120, 87) is the primary-green color (#047857 - WCAG AA compliant)
    expect(backgroundColor).toBe('rgb(4, 120, 87)')
  })

  test('green highlight does not change on hover', async ({ page }) => {
    // Open sound selector dropdown
    const soundSelector = page.getByRole('combobox', { name: /select sound/i })
    await soundSelector.click()

    const listbox = page.getByRole('listbox')
    await expect(listbox).toBeVisible()

    // Get the selected item
    const selectedOption = page.getByRole('option', {
      name: /ascending chime/i,
    })

    // Get a non-selected item to hover over
    const nonSelectedOption = page.getByRole('option', {
      name: /bright ding/i,
    })

    // Verify initial state: selected item has green background
    let selectedBgColor = await selectedOption.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor
    })
    expect(selectedBgColor).toBe('rgb(4, 120, 87)') // green

    // Hover over the non-selected item
    await nonSelectedOption.hover()
    await page.waitForTimeout(300) // Wait for any hover effects

    // Verify selected item STILL has green background (not affected by hover)
    selectedBgColor = await selectedOption.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor
    })
    expect(selectedBgColor).toBe('rgb(4, 120, 87)') // still green

    // Verify hovered item has gray background (data-highlighted state)
    const hoveredBgColor = await nonSelectedOption.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor
    })
    // Gray-100 is rgb(243, 244, 246) - Safari may use LAB color space
    const isGray =
      hoveredBgColor === 'rgb(243, 244, 246)' ||
      hoveredBgColor.startsWith('lab(') ||
      hoveredBgColor.startsWith('color(')
    expect(isGray).toBe(true)
  })

  test('green highlight persists when cursor moves away', async ({ page }) => {
    // Open sound selector dropdown
    const soundSelector = page.getByRole('combobox', { name: /select sound/i })
    await soundSelector.click()

    const listbox = page.getByRole('listbox')
    await expect(listbox).toBeVisible()

    const selectedOption = page.getByRole('option', {
      name: /ascending chime/i,
    })

    // Hover over the selected item
    await selectedOption.hover()
    await page.waitForTimeout(300)

    // Get background color while hovering
    let selectedBgColor = await selectedOption.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor
    })
    expect(selectedBgColor).toBe('rgb(4, 120, 87)') // green

    // Move cursor away from the selected item
    await page.mouse.move(0, 0)
    await page.waitForTimeout(300)

    // Verify green background is STILL present (persists)
    selectedBgColor = await selectedOption.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor
    })
    expect(selectedBgColor).toBe('rgb(4, 120, 87)') // still green
  })

  test('selecting new item moves green highlight to that item', async ({
    page,
  }) => {
    // Open sound selector dropdown
    const soundSelector = page.getByRole('combobox', { name: /select sound/i })
    await soundSelector.click()

    const listbox = page.getByRole('listbox')
    await expect(listbox).toBeVisible()

    // Get initial selected item
    const initialSelected = page.getByRole('option', {
      name: /ascending chime/i,
    })

    // Verify it has green background
    let initialBgColor = await initialSelected.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor
    })
    expect(initialBgColor).toBe('rgb(4, 120, 87)')

    // Select a different sound
    const newOption = page.getByRole('option', { name: /bright ding/i })
    await newOption.click()

    // Wait for selection to update
    await page.waitForTimeout(300)

    // Reopen the dropdown to check the new state
    await soundSelector.click()
    await expect(listbox).toBeVisible()

    // Get the newly selected item
    const newSelected = page.getByRole('option', { name: /bright ding/i })

    // Verify new item has green background
    const newBgColor = await newSelected.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor
    })
    expect(newBgColor).toBe('rgb(4, 120, 87)')

    // Verify the originally selected item no longer has green background
    const oldSelected = page.getByRole('option', {
      name: /ascending chime/i,
    })
    const oldBgColor = await oldSelected.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor
    })
    // Should be transparent or white, not green
    expect(oldBgColor).not.toBe('rgb(4, 120, 87)')
  })

  test('non-selected items show gray highlight on hover', async ({ page }) => {
    // Open sound selector dropdown
    const soundSelector = page.getByRole('combobox', { name: /select sound/i })
    await soundSelector.click()

    const listbox = page.getByRole('listbox')
    await expect(listbox).toBeVisible()

    // Get a non-selected item
    const nonSelectedOption = page.getByRole('option', {
      name: /bright ding/i,
    })

    // Check initial background (should be transparent/white)
    let bgColor = await nonSelectedOption.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor
    })
    expect(bgColor).not.toBe('rgb(4, 120, 87)') // not green

    // Hover over the item
    await nonSelectedOption.hover()
    await page.waitForTimeout(300)

    // Verify it has gray background on hover
    bgColor = await nonSelectedOption.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor
    })
    // Gray-100 is rgb(243, 244, 246) - Safari may use LAB color space
    const isGray =
      bgColor === 'rgb(243, 244, 246)' ||
      bgColor.startsWith('lab(') ||
      bgColor.startsWith('color(')
    expect(isGray).toBe(true)

    // Move cursor away
    await page.mouse.move(0, 0)
    await page.waitForTimeout(300)

    // Verify gray background is removed (should be transparent/white)
    bgColor = await nonSelectedOption.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor
    })
    // Should not be gray anymore (could be transparent, white, or rgba(0,0,0,0))
    const isNotGray =
      bgColor !== 'rgb(243, 244, 246)' && !bgColor.includes('244') // LAB version would also contain similar values
    expect(isNotGray).toBe(true)
  })

  test('check mark indicator shows only on selected item', async ({ page }) => {
    // Open sound selector dropdown
    const soundSelector = page.getByRole('combobox', { name: /select sound/i })
    await soundSelector.click()

    const listbox = page.getByRole('listbox')
    await expect(listbox).toBeVisible()

    // Get the selected item
    const selectedOption = page.getByRole('option', {
      name: /ascending chime/i,
    })

    // Verify check mark indicator is visible
    const checkIndicator = selectedOption.locator('svg').first()
    await expect(checkIndicator).toBeVisible()

    // Get a non-selected item
    const nonSelectedOption = page.getByRole('option', {
      name: /bright ding/i,
    })

    // Verify check mark indicator is NOT visible on non-selected item
    const nonSelectedIndicator = nonSelectedOption.locator('svg').first()
    // The indicator exists but should not be visible when not selected
    const isVisible = await nonSelectedIndicator.isVisible().catch(() => false)
    expect(isVisible).toBe(false)
  })
})
