import { expect, test } from '@playwright/test'

// Each locale exercises the same recovery contract with user-visible text.
for (const locale of [
  {
    path: 'en',
    name: 'Name',
    email: 'Email',
    password: 'Password',
    signUp: 'Sign Up',
    signIn: 'Sign In',
    networkError: 'Unable to connect. Check your connection and try again.',
    serverError: 'Authentication is temporarily unavailable. Please try again.',
  },
  {
    path: 'ja',
    name: '名前',
    email: 'メールアドレス',
    password: 'パスワード',
    signUp: 'サインアップ',
    signIn: 'サインイン',
    networkError:
      '接続できませんでした。通信環境を確認して、もう一度お試しください。',
    serverError:
      '現在認証サービスを利用できません。しばらくしてからもう一度お試しください。',
  },
]) {
  // Sign-in shares the failing network path and must also remain retryable.
  for (const action of ['sign-up', 'sign-in']) {
    test(`${locale.path} ${action} keeps entered details and allows retry after connection and server failures`, async ({
      page,
    }) => {
      // Arrange
      const pageErrors: string[] = []
      page.on('pageerror', (error) => pageErrors.push(error.message))
      await page.route('**/api/auth/get-session**', (route) =>
        route.fulfill({ json: null }),
      )
      await page.route(`**/api/auth/${action}/email`, (route) =>
        route.abort('failed'),
      )
      await page.goto(`/${locale.path}/${action}`)
      if (action === 'sign-up') {
        await page
          .getByLabel(locale.name, { exact: true })
          .fill('Recovery Test')
      }
      await page
        .getByLabel(locale.email, { exact: true })
        .fill('recovery@example.invalid')
      await page
        .getByLabel(locale.password, { exact: true })
        .fill('Test-only-password-2026')
      const submitButton = page.getByRole('button', {
        name: action === 'sign-up' ? locale.signUp : locale.signIn,
        exact: true,
      })

      // Act
      await submitButton.click()

      // Assert
      await expect(
        page.getByRole('alert').filter({ hasText: locale.networkError }),
      ).toBeVisible()
      await expect(submitButton).toBeEnabled()
      await expect(page.getByLabel(locale.email, { exact: true })).toHaveValue(
        'recovery@example.invalid',
      )
      await expect(
        page.getByLabel(locale.password, { exact: true }),
      ).toHaveValue('Test-only-password-2026')
      expect(pageErrors).toEqual([])

      // Arrange: a reachable server can still fail without exposing internal details.
      await page.route(`**/api/auth/${action}/email`, (route) =>
        route.fulfill({
          status: 503,
          json: { message: 'Private database failure details' },
        }),
      )

      // Act
      await submitButton.click()

      // Assert
      await expect(
        page.getByRole('alert').filter({ hasText: locale.serverError }),
      ).toBeVisible()
      await expect(submitButton).toBeEnabled()
      await expect(
        page.getByText('Private database failure details'),
      ).toBeHidden()

      // Arrange: retry the same entered details after the service recovers.
      await page.route(`**/api/auth/${action}/email`, (route) =>
        route.fulfill({
          json: {
            token: null,
            user: { id: 'recovery-test', name: 'Recovery Test' },
          },
        }),
      )

      // Act
      await submitButton.click()

      // Assert
      await expect(page).toHaveURL(`http://localhost:3009/${locale.path}`)
      expect(pageErrors).toEqual([])
    })
  }
}

test('sign-up sends credentials to the page origin instead of a development or canonical host', async ({
  page,
}) => {
  // Arrange
  await page.route('**/api/auth/get-session**', (route) =>
    route.fulfill({ json: null }),
  )
  await page.route('**/api/auth/sign-up/email', (route) =>
    route.fulfill({
      status: 400,
      json: { message: 'Registration rejected for this test' },
    }),
  )
  await page.goto('http://127.0.0.1:3009/en/sign-up')
  await page.getByLabel('Name', { exact: true }).fill('Origin Test')
  await page.getByLabel('Email', { exact: true }).fill('origin@example.invalid')
  await page
    .getByLabel('Password', { exact: true })
    .fill('Test-only-password-2026')
  const signUpRequest = page.waitForRequest('**/api/auth/sign-up/email')

  // Act
  await page.getByRole('button', { name: 'Sign Up', exact: true }).click()

  // Assert
  expect((await signUpRequest).url()).toBe(
    'http://127.0.0.1:3009/api/auth/sign-up/email',
  )
})

test('sign-up stops waiting and permits retry when the server never responds', async ({
  page,
}) => {
  // Arrange
  await page.route('**/api/auth/get-session**', (route) =>
    route.fulfill({ json: null }),
  )
  // Keep the request open to exercise the real browser fetch timeout.
  await page.route('**/api/auth/sign-up/email', () => {})
  await page.goto('/en/sign-up')
  await page.clock.install()
  await page.getByLabel('Name', { exact: true }).fill('Timeout Test')
  await page
    .getByLabel('Email', { exact: true })
    .fill('timeout@example.invalid')
  await page
    .getByLabel('Password', { exact: true })
    .fill('Test-only-password-2026')
  const signUpRequest = page.waitForRequest('**/api/auth/sign-up/email')

  // Act
  await page.getByRole('button', { name: 'Sign Up', exact: true }).click()
  await signUpRequest
  await expect(
    page.getByRole('button', { name: 'Signing up...', exact: true }),
  ).toBeDisabled()
  await page.clock.fastForward(15_000)

  // Assert
  await expect(
    page.getByRole('alert').filter({
      hasText: 'Unable to connect. Check your connection and try again.',
    }),
  ).toBeVisible()
  await expect(
    page.getByRole('button', { name: 'Sign Up', exact: true }),
  ).toBeEnabled()
})
