import { expect, test } from '@playwright/test'

test.describe('PWA shortcuts', () => {
  test('settings shortcut route opens the English settings dialog', async ({
    page,
  }) => {
    // Arrange and Act
    await page.goto('/shortcuts/settings')

    // Assert
    await expect(page).toHaveURL('http://localhost:3009/en')
    await expect(page.getByRole('dialog', { name: 'Settings' })).toBeVisible()
    await page.getByTestId('settings-done-button').click()
    await expect(page.getByTestId('settings-panel')).toBeHidden()
  })

  test('start shortcut route starts and resets the default five-minute timer', async ({
    page,
  }) => {
    // Arrange and Act
    await page.goto('/shortcuts/start')

    // Assert
    await expect(page).toHaveURL('http://localhost:3009/en')
    await expect(page.getByTestId('timer-pause-button')).toBeVisible()
    await page.getByTestId('timer-reset-button').click()
    await expect(page.getByTestId('timer-display')).toContainText('05:00')
  })
})
