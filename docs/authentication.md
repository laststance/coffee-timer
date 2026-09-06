# Authentication deployment

The timer can render without authentication infrastructure. Successful page loads
do not establish that account creation works.

## Required configuration

Configure these server-only variables in the `laststance/coffee-timer` Vercel
project, using separate databases and secrets for production and previews:

| Variable             | Value                                                                                                              |
| -------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `DATABASE_URL`       | PostgreSQL connection URL supplied by the database provider, with its required TLS settings                        |
| `BETTER_AUTH_SECRET` | A stable random secret generated with `openssl rand -base64 32`                                                    |
| `BETTER_AUTH_URL`    | The environment's HTTPS application origin; production currently uses `https://coffee-timer-laststance.vercel.app` |

The browser uses the current origin for `/api/auth`. Do not configure a localhost
URL in public production environment variables. Previews must use their own auth
origin and database.

For a **new, empty database**, load `DATABASE_URL` into the deployment shell and
run `pnpm db:migrate` before deploying the application. Drizzle tracks applied
migrations, so rerunning the command is safe. The initial migration creates the
four Better Auth tables and the timer-session table. Environment variables are
configured with `vercel env add <name> production --scope laststance`; redeploy
after changing them.

## Existing databases created with db:push

The initial migration is intended for empty databases. Do not apply it directly
to an existing schema or reset an existing database. Back up the database and
check for duplicate credential accounts before upgrading:

```sql
SELECT provider_id, account_id, count(*)
FROM account
GROUP BY provider_id, account_id
HAVING count(*) > 1;
```

After resolving any duplicates, apply the following migration to an existing
Coffee Timer database. Coffee Timer currently supports only email/password
accounts; those accounts use `local:credential` in Better Auth 1.7.2.

```sql
BEGIN;
ALTER TABLE account ADD COLUMN IF NOT EXISTS issuer text;
ALTER TABLE account ALTER COLUMN issuer DROP NOT NULL;
UPDATE account SET issuer = 'local:credential'
WHERE provider_id = 'credential' AND issuer IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS account_issuer_account_id_uidx
ON account (issuer, account_id);
COMMIT;
```

Before using `pnpm db:migrate` on this existing database, compare **all five tables**
(`user`, `account`, `session`, `verification`, and `timer_session`), their columns,
indexes, and foreign keys with `db/schema.ts` and the initial SQL migration. Resolve
any differences first. Then record the initial migration as already applied; do
not execute its `CREATE TABLE` statements against existing tables.

With the checked database's `DATABASE_URL` exported in the shell, run this baseline
command from the repository root. It checks that all five tables exist and refuses
to replace any existing migration history. The hash and timestamp come from
Drizzle's own migration reader, including the timer-session schema.

```bash
node --input-type=module <<'NODE' && pnpm db:migrate
import { readMigrationFiles } from 'drizzle-orm/migrator';
import pg from 'pg';

const [initialMigration] = readMigrationFiles({ migrationsFolder: './db/migrations' });
const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();
try {
  await client.query('BEGIN');
  const tables = ['user', 'account', 'session', 'verification', 'timer_session'];
  const present = await client.query(
    "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = ANY($1)",
    [tables],
  );
  if (present.rowCount !== tables.length) throw new Error('Missing application tables; baseline aborted');
  await client.query('CREATE SCHEMA IF NOT EXISTS drizzle');
  await client.query('CREATE TABLE IF NOT EXISTS drizzle.__drizzle_migrations (id SERIAL PRIMARY KEY, hash text NOT NULL, created_at bigint)');
  await client.query('LOCK TABLE drizzle.__drizzle_migrations IN EXCLUSIVE MODE');
  const history = await client.query('SELECT id FROM drizzle.__drizzle_migrations LIMIT 1');
  if (history.rowCount !== 0) throw new Error('Migration history already exists; baseline aborted');
  await client.query('INSERT INTO drizzle.__drizzle_migrations (hash, created_at) VALUES ($1, $2)', [initialMigration.hash, initialMigration.folderMillis]);
  await client.query('COMMIT');
} catch (error) {
  await client.query('ROLLBACK');
  throw error;
} finally {
  await client.end();
}
NODE
```

Verify existing account and timer-session records remain present. Future migrations
can now run normally, and the initial migration will not recreate `timer_session`
or any authentication tables.

Better Auth 1.7.0–1.7.2 writes an `issuer` field when registering accounts. Version
1.7.3 removes that requirement. The nullable column supports both versions without
rejecting new accounts after the patch upgrade. See the
[official upgrade guide](https://better-auth.com/docs/guides/1-7-upgrade-guide).
The repository's minimum package release age still applies to dependency updates.

## Verification

`pnpm exec playwright test e2e/auth-recovery.spec.ts` checks English and Japanese
network failure recovery, server failures, retries, timeouts, and request origins
without writing to a database.

The `Authentication E2E` workflow migrates a disposable PostgreSQL database and
runs the real registration, session restoration, timer history, protected My Page,
sign-out, and sign-in journey. To run it locally against an isolated test database,
start the production build with that database's `DATABASE_URL`, then run:

```bash
AUTH_E2E=true pnpm exec playwright test e2e/auth-lifecycle.spec.ts --project="Desktop Chrome"
```

This test creates accounts and timer records. Use only a disposable test database.
Ordinary UI jobs omit it because they do not provision PostgreSQL.

After production configuration and deployment, verify `/api/auth/get-session`
returns HTTP 200, then complete registration, reload, My Page, sign-out, and sign-in
using a dedicated smoke-test account. A successful deployment alone is insufficient.
