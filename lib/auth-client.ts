import { createAuthClient } from 'better-auth/react'

/**
 * Better Auth client instance for React components.
 * Provides hooks like `useSession` and methods like `signIn`, `signUp`, `signOut`.
 *
 * @example
 * const { data: session, isPending } = authClient.useSession()
 *
 * @example
 * await authClient.signIn.email({ email, password })
 */
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3009',
})
