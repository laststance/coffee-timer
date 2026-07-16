import { expect, type Page, type TestInfo } from '@playwright/test'
import {
  METICULOUS_RECORDER_QUERY,
  METICULOUS_RECORDER_READY_TIMEOUT_MS,
} from './constants'

/** Opens a route with forced localhost capture and waits until the recorder can accept the journey. @param page Playwright page for this isolated journey. @param path App-relative route, including any existing query. @returns A promise resolved when the page and recorder are ready. @example await openMeticulousRecording(page, '/en') */
export async function openMeticulousRecording(
  page: Page,
  path: string,
): Promise<void> {
  const querySeparator = path.includes('?') ? '&' : '?'

  await page.goto(`${path}${querySeparator}${METICULOUS_RECORDER_QUERY}`)
  await page.waitForLoadState('networkidle')

  await expect
    .poll(
      () =>
        page.evaluate(
          () => typeof window.Meticulous?.record?.flush === 'function',
        ),
      {
        message:
          'Meticulous recorder did not initialize. Check NEXT_PUBLIC_METICULOUS_PROJECT_ID and recorder loading.',
        timeout: METICULOUS_RECORDER_READY_TIMEOUT_MS,
      },
    )
    .toBe(true)
}

/** Flushes buffered capture before Playwright tears down the page and prints its Dashboard URL. @param page Playwright page containing the active recorder. @param testInfo Metadata used to label and attach the resulting session. @returns A promise resolved after Meticulous acknowledges the recording. @example await flushMeticulousRecording(page, testInfo) */
export async function flushMeticulousRecording(
  page: Page,
  testInfo: TestInfo,
): Promise<void> {
  const hasRecorder = await page.evaluate(
    () => typeof window.Meticulous?.record?.flush === 'function',
  )

  // A navigation failure can happen before recorder initialization, so preserve the original test error.
  if (!hasRecorder) return

  const sessionUrl = await page.evaluate(async () => {
    const recorder = window.Meticulous?.record

    if (!recorder) {
      throw new Error('Meticulous recorder is unavailable during flush')
    }

    const currentSessionUrl = recorder.getSessionUrl()
    await recorder.flush()

    return currentSessionUrl
  })

  await testInfo.attach('meticulous-session-url', {
    body: sessionUrl,
    contentType: 'text/plain',
  })
  console.info(`[Meticulous] ${testInfo.title}: ${sessionUrl}`)
}
