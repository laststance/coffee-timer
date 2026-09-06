import { existsSync } from 'node:fs'
import { defineConfig } from 'drizzle-kit'

// Match Next.js local env precedence while preserving variables supplied by CI.
for (const environmentFile of ['.env.local', '.env']) {
  if (existsSync(environmentFile)) process.loadEnvFile(environmentFile)
}

export default defineConfig({
  schema: './db/schema.ts',
  out: './db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
