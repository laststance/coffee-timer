import { test, expect } from '@playwright/test'

/**
 * Background Timer Tests
 *
 * These tests verify that the timer continues to run accurately
 * when the browser tab is inactive (Issue #6).
 *
 * Key behaviors:
 * 1. Timer continues counting in background (tab switched away)
 * 2. Timer completes and triggers notifications while tab is inactive
 * 3. Timer display updates correctly when returning to tab
 * 4. Pause/resume works correctly with tab switching
 */
test.describe('Background Timer Functionality', () => {
  test('timer continues running when tab becomes hidden', async ({
    page,
    context,
  }) => {
    await page.goto('/en')
    await page.waitForLoadState('domcontentloaded')
    await page.waitForTimeout(1000)

    // Set a 5 second timer
    const minutesInput = page.getByRole('spinbutton', { name: /minutes/i })
    const secondsInput = page.getByRole('spinbutton', { name: /seconds/i })

    await minutesInput.fill('0')
    await secondsInput.fill('5')

    // Verify timer is set
    const timerDisplay = page.locator('[role="timer"]')
    await expect(timerDisplay).toContainText('00:05')

    // Start the timer
    const startButton = page.getByRole('button', { name: /start/i })
    await startButton.click()

    // Verify timer started
    await expect(page.getByRole('button', { name: /pause/i })).toBeVisible()

    // Wait 2 seconds while visible
    await page.waitForTimeout(2000)

    // Verify timer is counting down (should show 00:03)
    const displayText = await timerDisplay.textContent()
    expect(displayText).toMatch(/00:03/)

    // Open a new tab (simulates user switching away)
    const newPage = await context.newPage()
    await newPage.goto('/en')
    await newPage.waitForLoadState('domcontentloaded')

    // Wait 2 seconds in the new tab (timer should continue in background)
    await newPage.waitForTimeout(2000)

    // Close new tab and return to timer tab
    await newPage.close()

    // Wait for visibility change to trigger updateTimeRemaining
    await page.waitForTimeout(500)

    // Timer should show approximately 00:01 (5 - 2 - 2 = 1)
    const updatedText = await timerDisplay.textContent()
    expect(updatedText).toMatch(/00:0[01]/) // Allow 00:01 or 00:00
  })

  test('timer completes in background and triggers notification', async ({
    page,
    context,
  }) => {
    await page.goto('/en')
    await page.waitForLoadState('domcontentloaded')
    await page.waitForTimeout(1000)

    // Set a 3 second timer
    const minutesInput = page.getByRole('spinbutton', { name: /minutes/i })
    const secondsInput = page.getByRole('spinbutton', { name: /seconds/i })

    await minutesInput.fill('0')
    await secondsInput.fill('3')

    // Verify timer is set
    const timerDisplay = page.locator('[role="timer"]')
    await expect(timerDisplay).toContainText('00:03')

    // Set up sound request monitoring
    const soundRequestPromise = page.waitForRequest(
      (request) => {
        const url = request.url()
        return url.includes('/sounds/') && url.endsWith('.mp3')
      },
      { timeout: 8000 },
    )

    // Start the timer
    const startButton = page.getByRole('button', { name: /start/i })
    await startButton.click()

    // Verify timer started
    await expect(page.getByRole('button', { name: /pause/i })).toBeVisible()

    // Wait 1 second
    await page.waitForTimeout(1000)

    // Open new tab immediately (timer has 2 seconds remaining)
    const newPage = await context.newPage()
    await newPage.goto('/en')
    await newPage.waitForLoadState('domcontentloaded')

    // Wait 3 seconds for timer to complete in background
    await newPage.waitForTimeout(3000)

    // Sound should have been requested even though tab was inactive
    const soundRequest = await soundRequestPromise
    expect(soundRequest.url()).toMatch(
      /\/sounds\/(ascending-chime|bright-ding|alert-beep|service-bell)\.mp3/,
    )

    // Close new tab and return to timer
    await newPage.close()

    // Wait for visibility change
    await page.waitForTimeout(500)

    // Timer should show 00:00 (completed)
    await expect(timerDisplay).toContainText('00:00')

    // Timer should be stopped (start button visible)
    await expect(page.getByRole('button', { name: /start/i })).toBeVisible()
  })

  test('paused timer does not advance when tab is hidden', async ({
    page,
    context,
  }) => {
    await page.goto('/en')
    await page.waitForLoadState('domcontentloaded')
    await page.waitForTimeout(1000)

    // Set a 10 second timer
    const minutesInput = page.getByRole('spinbutton', { name: /minutes/i })
    const secondsInput = page.getByRole('spinbutton', { name: /seconds/i })

    await minutesInput.fill('0')
    await secondsInput.fill('10')

    const timerDisplay = page.locator('[role="timer"]')
    await expect(timerDisplay).toContainText('00:10')

    // Start the timer
    const startButton = page.getByRole('button', { name: /start/i })
    await startButton.click()

    // Wait 2 seconds
    await page.waitForTimeout(2000)

    // Pause the timer (should show ~00:08)
    const pauseButton = page.getByRole('button', { name: /pause/i })
    await pauseButton.click()

    // Verify paused
    await expect(page.getByRole('button', { name: /start/i })).toBeVisible()

    // Get current time (should be less than 10 seconds after ~2s elapsed)
    const pausedTimeElement = timerDisplay.locator('.font-mono.text-6xl')
    const pausedTime = await pausedTimeElement.textContent()
    expect(pausedTime).toMatch(/00:0[6-9]/) // Should be 00:09, 00:08, 00:07, or 00:06

    // Open new tab and wait
    const newPage = await context.newPage()
    await newPage.goto('/en')
    await newPage.waitForLoadState('domcontentloaded')
    await newPage.waitForTimeout(3000)

    // Close new tab
    await newPage.close()
    await page.waitForTimeout(500)

    // Timer should still show same time (paused doesn't advance)
    const currentTime = await pausedTimeElement.textContent()
    expect(currentTime).toBe(pausedTime)
  })

  test('resuming timer after tab switch continues accurately', async ({
    page,
    context,
  }) => {
    await page.goto('/en')
    await page.waitForLoadState('domcontentloaded')
    await page.waitForTimeout(1000)

    // Set a 5 second timer
    const minutesInput = page.getByRole('spinbutton', { name: /minutes/i })
    const secondsInput = page.getByRole('spinbutton', { name: /seconds/i })

    await minutesInput.fill('0')
    await secondsInput.fill('5')

    const timerDisplay = page.locator('[role="timer"]')

    // Start timer
    const startButton = page.getByRole('button', { name: /start/i })
    await startButton.click()

    // Wait 1 second
    await page.waitForTimeout(1000)

    // Pause (should show ~00:04)
    const pauseButton = page.getByRole('button', { name: /pause/i })
    await pauseButton.click()

    // Open new tab
    const newPage = await context.newPage()
    await newPage.goto('/en')
    await newPage.waitForLoadState('domcontentloaded')

    // Wait 2 seconds
    await newPage.waitForTimeout(2000)

    // Close new tab and return
    await newPage.close()
    await page.waitForTimeout(500)

    // Resume timer
    const resumeButton = page.getByRole('button', { name: /start/i })
    await resumeButton.click()

    // Wait for completion (should take ~4 seconds)
    // Note: Sound playback is tested separately in sound.spec.ts
    await expect(timerDisplay).toContainText('00:00', { timeout: 6000 })

    // Verify reset button is available after completion
    await expect(page.getByRole('button', { name: /reset/i })).toBeVisible()
  })

  test('rapid tab switching maintains timer accuracy', async ({
    page,
    context,
  }) => {
    await page.goto('/en')
    await page.waitForLoadState('domcontentloaded')
    await page.waitForTimeout(1000)

    // Set a 6 second timer
    const minutesInput = page.getByRole('spinbutton', { name: /minutes/i })
    const secondsInput = page.getByRole('spinbutton', { name: /seconds/i })

    await minutesInput.fill('0')
    await secondsInput.fill('6')

    const timerDisplay = page.locator('[role="timer"]')

    // Start timer
    const startButton = page.getByRole('button', { name: /start/i })
    await startButton.click()

    // Create new tab
    const newPage = await context.newPage()
    await newPage.goto('/en')
    await newPage.waitForLoadState('domcontentloaded')

    // Rapid switching simulation
    await newPage.waitForTimeout(1000)
    await newPage.bringToFront()
    await page.waitForTimeout(500)
    await page.bringToFront()
    await page.waitForTimeout(500)
    await newPage.bringToFront()
    await page.waitForTimeout(1000)
    await page.bringToFront()
    await page.waitForTimeout(500)

    // Close new tab
    await newPage.close()

    // Total elapsed: ~3.5 seconds, should show ~00:02 or 00:03
    await page.waitForTimeout(500)
    const displayText = await timerDisplay.textContent()
    expect(displayText).toMatch(/00:0[23]/)

    // Wait for completion
    await page.waitForTimeout(3000)

    // Should complete
    await expect(timerDisplay).toContainText('00:00')
  })

  test('timer state persists in localStorage after page reload', async ({
    page,
  }) => {
    await page.goto('/en')
    await page.waitForLoadState('domcontentloaded')
    await page.waitForTimeout(1000)

    // Set a 10 second timer
    const minutesInput = page.getByRole('spinbutton', { name: /minutes/i })
    const secondsInput = page.getByRole('spinbutton', { name: /seconds/i })

    await minutesInput.fill('0')
    await secondsInput.fill('10')

    const timerDisplay = page.locator('[role="timer"]')
    await expect(timerDisplay).toContainText('00:10')

    // Reload the page (timer not started yet)
    await page.reload()
    await page.waitForLoadState('domcontentloaded')
    await page.waitForTimeout(1000)

    // Timer should still show 00:10 after reload (localStorage persistence)
    await expect(timerDisplay).toContainText('00:10')

    // Timer should be in idle state
    const startButton = page.getByRole('button', { name: /start/i })
    await expect(startButton).toBeVisible()

    // Verify inputs also persisted
    await expect(minutesInput).toHaveValue('0')
    await expect(secondsInput).toHaveValue('10')
  })
})
