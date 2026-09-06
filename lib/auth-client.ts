import { createAuthClient } from 'better-auth/react'
import { AUTH_REQUEST_TIMEOUT_MS } from '@/lib/constants'

/**
 * Connects React authentication calls to the current site through {@link authClient}.
 *
 * @example
 * const { data: session, isPending } = authClient.useSession()
 *
 * @example
 * await authClient.signIn.email({ email, password })
 */
export const authClient = createAuthClient({
  // The browser derives its own origin, including production and preview domains.
  fetchOptions: { timeout: AUTH_REQUEST_TIMEOUT_MS },
})
