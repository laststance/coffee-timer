import { randomUUID } from 'node:crypto'
import { expect, test } from '@playwright/test'

// The authentication CI job supplies an isolated database; ordinary UI jobs do not.
test.skip(
  process.env.AUTH_E2E !== 'true',
  'Requires the disposable authentication test database',
)

test('a new account can register, restore its session, save timer history, sign out, and sign back in', async ({
  page,
}) => {
  // Arrange
  const email = `auth-${randomUUID()}@example.invalid`
  await page.goto('/en/sign-up')
  await page.getByLabel('Name', { exact: true }).fill('Authentication QA')
  await page.getByLabel('Email', { exact: true }).fill(email)
  await page
    .getByLabel('Password', { exact: true })
    .fill('Test-only-password-2026')
  const signUpResponse = page.waitForResponse('**/api/auth/sign-up/email')

  // Act
  await page.getByRole('button', { name: 'Sign Up', exact: true }).click()

  // Assert: this reaches Better Auth and Drizzle, catching incompatible account schemas.
  expect((await signUpResponse).status()).toBe(200)
  await expect(page).toHaveURL('http://localhost:3009/en')
  await expect(
    page.getByRole('button', { name: 'Sign Out', exact: true }),
  ).toBeVisible()

  // Act
  await page.reload()

  // Assert
  await expect(
    page.getByRole('button', { name: 'Sign Out', exact: true }),
  ).toBeVisible()

  // Act
  const savedTimer = await page.request.post('/api/timer-sessions', {
    data: {
      durationSeconds: 300,
      completedAt: '2026-09-06T10:00:00.000Z',
      soundPreset: 'gentle-bell',
    },
  })

  // Assert
  expect(savedTimer.status()).toBe(201)
  const timerHistory = await page.request.get('/api/timer-sessions')
  expect(timerHistory.status()).toBe(200)
  expect(await timerHistory.json()).toEqual([
    expect.objectContaining({
      durationSeconds: 300,
      soundPreset: 'gentle-bell',
    }),
  ])

  // Act
  await page.goto('/en/mypage')

  // Assert
  await expect(page).toHaveURL('http://localhost:3009/en/mypage')
  await expect(
    page.getByRole('heading', { name: 'My Page', exact: true }),
  ).toBeVisible()

  // Act
  await page.goto('/en')
  await page.getByRole('button', { name: 'Sign Out', exact: true }).click()
  await expect(
    page.getByRole('link', { name: 'Sign In', exact: true }),
  ).toBeVisible()
  await page.goto('/en/mypage')

  // Assert
  await expect(page).toHaveURL('http://localhost:3009/en/sign-in')

  // Arrange
  await page.getByLabel('Email', { exact: true }).fill(email)
  await page
    .getByLabel('Password', { exact: true })
    .fill('Test-only-password-2026')
  const signInResponse = page.waitForResponse('**/api/auth/sign-in/email')

  // Act
  await page.getByRole('button', { name: 'Sign In', exact: true }).click()

  // Assert
  expect((await signInResponse).status()).toBe(200)
  await expect(page).toHaveURL('http://localhost:3009/en')
  await expect(
    page.getByRole('button', { name: 'Sign Out', exact: true }),
  ).toBeVisible()
})
