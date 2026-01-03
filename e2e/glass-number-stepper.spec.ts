import { test, expect } from '@playwright/test'

/**
 * GlassNumberStepper E2E Tests
 *
 * Tests for the mouse/trackpad-friendly number stepper component that replaced
 * native number inputs for better Liquid Glass theme support.
 *
 * Key behaviors tested:
 * 1. Single click = single increment/decrement (regression test for double-click bug)
 * 2. Min/max boundary enforcement
 * 3. Keyboard input still works
 * 4. Theme-aware rendering (Liquid Glass vs Original themes)
 */
test.describe('GlassNumberStepper', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en')
    await page.waitForLoadState('networkidle')
    // Clear localStorage to ensure consistent initial state
    await page.evaluate(() => localStorage.clear())
    await page.reload()
    await page.waitForLoadState('networkidle')
  })

  test('single click on + button increments by exactly 1', async ({ page }) => {
    // Get the minutes input and verify initial value
    const minutesInput = page.getByTestId('time-input-minutes')
    await expect(minutesInput).toHaveValue('05')

    // Find and click the + button for minutes (it's the button after the input)
    const minutesStepper = minutesInput.locator('..')
    const incrementButton = minutesStepper.getByRole('button', {
      name: /increase/i,
    })

    // Click once
    await incrementButton.click()

    // Should increment by exactly 1 (05 -> 06), NOT 2
    await expect(minutesInput).toHaveValue('06')

    // Click again to verify consistent behavior
    await incrementButton.click()
    await expect(minutesInput).toHaveValue('07')
  })

  test('single click on - button decrements by exactly 1', async ({ page }) => {
    // Get the minutes input and verify initial value
    const minutesInput = page.getByTestId('time-input-minutes')
    await expect(minutesInput).toHaveValue('05')

    // Find and click the - button for minutes
    const minutesStepper = minutesInput.locator('..')
    const decrementButton = minutesStepper.getByRole('button', {
      name: /decrease/i,
    })

    // Click once
    await decrementButton.click()

    // Should decrement by exactly 1 (05 -> 04), NOT 2
    await expect(minutesInput).toHaveValue('04')

    // Click again to verify consistent behavior
    await decrementButton.click()
    await expect(minutesInput).toHaveValue('03')
  })

  test('seconds stepper respects min boundary (0)', async ({ page }) => {
    // Get the seconds input (default is 0)
    const secondsInput = page.getByTestId('time-input-seconds')
    await expect(secondsInput).toHaveValue('00')

    // Find the - button for seconds
    const secondsStepper = secondsInput.locator('..')
    const decrementButton = secondsStepper.getByRole('button', {
      name: /decrease/i,
    })

    // The decrement button should be disabled at min value
    await expect(decrementButton).toBeDisabled()

    // Click anyway (should have no effect)
    await decrementButton.click({ force: true })

    // Value should still be 00
    await expect(secondsInput).toHaveValue('00')
  })

  test('seconds stepper respects max boundary (59)', async ({ page }) => {
    // Get the seconds input
    const secondsInput = page.getByTestId('time-input-seconds')

    // Type in max value
    await secondsInput.click()
    await secondsInput.fill('59')
    await expect(secondsInput).toHaveValue('59')

    // Find the + button for seconds
    const secondsStepper = secondsInput.locator('..')
    const incrementButton = secondsStepper.getByRole('button', {
      name: /increase/i,
    })

    // The increment button should be disabled at max value
    await expect(incrementButton).toBeDisabled()

    // Click anyway (should have no effect)
    await incrementButton.click({ force: true })

    // Value should still be 59
    await expect(secondsInput).toHaveValue('59')
  })

  test('keyboard input still works for direct value entry', async ({
    page,
  }) => {
    // Get the minutes input
    const minutesInput = page.getByTestId('time-input-minutes')

    // Clear and type a new value
    await minutesInput.click()
    await minutesInput.fill('15')

    // Verify the value changed
    await expect(minutesInput).toHaveValue('15')

    // Verify the timer display also updated
    const timerDisplay = page.locator('[role="timer"]')
    await expect(timerDisplay).toContainText('15:00')
  })

  test('arrow keys increment/decrement value', async ({ page }) => {
    const minutesInput = page.getByTestId('time-input-minutes')
    await expect(minutesInput).toHaveValue('05')

    // Focus the input
    await minutesInput.click()

    // Press ArrowUp to increment
    await page.keyboard.press('ArrowUp')
    await expect(minutesInput).toHaveValue('06')

    // Press ArrowDown to decrement
    await page.keyboard.press('ArrowDown')
    await expect(minutesInput).toHaveValue('05')
  })

  test('timer display syncs with stepper changes', async ({ page }) => {
    const minutesInput = page.getByTestId('time-input-minutes')
    const secondsInput = page.getByTestId('time-input-seconds')
    const timerDisplay = page.locator('[role="timer"]')

    // Initial state
    await expect(timerDisplay).toContainText('05:00')

    // Change minutes using + button
    const minutesStepper = minutesInput.locator('..')
    const minutesIncrement = minutesStepper.getByRole('button', {
      name: /increase/i,
    })
    await minutesIncrement.click()
    await expect(timerDisplay).toContainText('06:00')

    // Change seconds using + button
    const secondsStepper = secondsInput.locator('..')
    const secondsIncrement = secondsStepper.getByRole('button', {
      name: /increase/i,
    })
    await secondsIncrement.click()
    await expect(timerDisplay).toContainText('06:01')
  })

  test('value clamps to valid range when typing invalid values', async ({
    page,
  }) => {
    const minutesInput = page.getByTestId('time-input-minutes')

    // Type a value exceeding max (1440 = 24 hours max)
    await minutesInput.click()
    await minutesInput.fill('2000')

    // Should clamp to max value
    await expect(minutesInput).toHaveValue('1440')

    // Type a negative-like value (just 0 since we can't type negative)
    await minutesInput.fill('0')
    await expect(minutesInput).toHaveValue('00')
  })
})

test.describe('GlassNumberStepper Theme Rendering', () => {
  test('renders correctly on Light theme', async ({ page }) => {
    await page.goto('/en')
    await page.waitForLoadState('networkidle')

    // Set Light theme
    await page.evaluate(() => {
      localStorage.setItem('theme', 'light')
      document.documentElement.setAttribute('data-theme', 'light')
    })
    await page.reload()
    await page.waitForLoadState('networkidle')

    // Verify stepper is visible and functional
    const minutesInput = page.getByTestId('time-input-minutes')
    await expect(minutesInput).toBeVisible()

    // Verify buttons are present
    const minutesStepper = minutesInput.locator('..')
    const incrementButton = minutesStepper.getByRole('button', {
      name: /increase/i,
    })
    const decrementButton = minutesStepper.getByRole('button', {
      name: /decrease/i,
    })

    await expect(incrementButton).toBeVisible()
    await expect(decrementButton).toBeVisible()
  })

  test('renders correctly on Liquid Glass Light theme', async ({ page }) => {
    await page.goto('/en')
    await page.waitForLoadState('networkidle')

    // Set Liquid Glass Light theme
    await page.evaluate(() => {
      localStorage.setItem('theme', 'liquid-glass-light')
      document.documentElement.setAttribute('data-theme', 'liquid-glass-light')
    })
    await page.reload()
    await page.waitForLoadState('networkidle')

    // Verify stepper is visible and functional
    const minutesInput = page.getByTestId('time-input-minutes')
    await expect(minutesInput).toBeVisible()

    // Verify buttons are present
    const minutesStepper = minutesInput.locator('..')
    const incrementButton = minutesStepper.getByRole('button', {
      name: /increase/i,
    })
    const decrementButton = minutesStepper.getByRole('button', {
      name: /decrease/i,
    })

    await expect(incrementButton).toBeVisible()
    await expect(decrementButton).toBeVisible()

    // Click to verify functionality
    await expect(minutesInput).toHaveValue('05')
    await incrementButton.click()
    await expect(minutesInput).toHaveValue('06')
  })
})
