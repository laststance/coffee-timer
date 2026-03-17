import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from '@/db'

/**
 * Better Auth server instance.
 * Configured with Drizzle adapter for PostgreSQL and email/password authentication.
 *
 * @example
 * // Server-side session check
 * const session = await auth.api.getSession({ headers: await headers() })
 *
 * @example
 * // API route handler
 * export const { GET, POST } = toNextJsHandler(auth)
 */
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),
  emailAndPassword: {
    enabled: true,
  },
})
