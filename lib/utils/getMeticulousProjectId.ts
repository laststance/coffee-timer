/**
 * Returns the Meticulous project ID when `NEXT_PUBLIC_METICULOUS_PROJECT_ID` is set.
 * Configure in `.env.local` for localhost session recording.
 *
 * @returns Project ID from the Meticulous dashboard, or undefined when not configured
 */
export function getMeticulousProjectId(): string | undefined {
  const projectId = process.env.NEXT_PUBLIC_METICULOUS_PROJECT_ID?.trim()
  return projectId ? projectId : undefined
}
