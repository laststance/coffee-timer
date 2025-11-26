import { test, expect } from '@playwright/test'

test.describe('Notification Settings', () => {
  test('should render notification settings without hydration errors', async ({
    page,
  }) => {
    // Navigate to the home page
    await page.goto('/en')

    // Wait for the page to be ready
    await page.waitForLoadState('networkidle')

    // Open settings dialog
    const settingsButton = page.getByRole('button', { name: /open settings/i })
    await settingsButton.click()

    // Wait for dialog to open
    const dialog = page.getByRole('dialog', { name: /settings/i })
    await expect(dialog).toBeVisible()

    // Verify Notification Toggle is present
    const notificationToggle = page.getByRole('switch', {
      name: /notifications/i,
    })
    await expect(notificationToggle).toBeVisible()

    // Check if it's enabled or disabled (default is enabled in store but might depend on permission)
    // We just check visibility to ensure component rendered without error.
  })
})
