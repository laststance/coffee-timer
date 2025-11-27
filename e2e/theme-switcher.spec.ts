import { test, expect } from '@playwright/test'

test.describe('Theme Switcher', () => {
  test('should switch themes correctly', async ({ page }) => {
    await page.goto('/')

    // Verify default theme is Coffee
    // Background for coffee is #EFEBE9 (rgb(239, 235, 233))
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'coffee')
    await expect(page.locator('body')).toHaveCSS(
      'background-color',
      'rgb(239, 235, 233)',
    )

    // Open settings
    await page.getByRole('button', { name: /settings/i }).click()
    await expect(page.getByRole('dialog')).toBeVisible()

    // Locate theme selector
    const themeSelector = page.getByTestId('theme-selector')
    await expect(themeSelector).toBeVisible()

    // Test Dark Theme
    await themeSelector.click()
    await page.getByRole('option', { name: 'Dark', exact: true }).click()

    // Verify HTML attribute
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')

    // Wait for a bit to ensure styles propagate
    await page.waitForTimeout(500)

    // Background for dark is #171717 (rgb(23, 23, 23))
    await expect(page.locator('body')).toHaveCSS(
      'background-color',
      'rgb(23, 23, 23)',
    )
    await page.screenshot({ path: 'test-results/theme-dark.png' })

    // Test Light Theme
    await themeSelector.click()
    await page.getByRole('option', { name: 'Light', exact: true }).click()

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
    await page.waitForTimeout(500)

    // Background for light is #FAF9F6 (rgb(250, 249, 246))
    await expect(page.locator('body')).toHaveCSS(
      'background-color',
      'rgb(250, 249, 246)',
    )
    await page.screenshot({ path: 'test-results/theme-light.png' })

    // Test Switch back to Coffee Theme
    await themeSelector.click()
    await page.getByRole('option', { name: 'Coffee', exact: true }).click()

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'coffee')
    await page.waitForTimeout(500)

    await expect(page.locator('body')).toHaveCSS(
      'background-color',
      'rgb(239, 235, 233)',
    )
    await page.screenshot({ path: 'test-results/theme-coffee.png' })
  })
})
