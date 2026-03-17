import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

/**
 * Drizzle ORM client instance with typed schema.
 * Uses node-postgres Pool for connection management.
 *
 * @example
 * const users = await db.select().from(schema.user)
 */
export const db = drizzle(pool, { schema })
