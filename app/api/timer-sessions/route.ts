import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { eq, desc } from 'drizzle-orm'
import { nanoid } from 'nanoid'
import { auth } from '@/lib/auth'
import { db } from '@/db'
import { timerSession } from '@/db/schema'

/**
 * GET /api/timer-sessions - List timer sessions for the authenticated user.
 *
 * @returns JSON array of timer sessions, ordered by completedAt descending
 *
 * @example
 * // Response: [{ id: 'abc', durationSeconds: 300, completedAt: '2026-02-16T09:30:00Z', ... }]
 */
export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const sessions = await db
    .select()
    .from(timerSession)
    .where(eq(timerSession.userId, session.user.id))
    .orderBy(desc(timerSession.completedAt))

  return NextResponse.json(sessions)
}

/**
 * POST /api/timer-sessions - Create a new timer session.
 *
 * @param request - JSON body: { durationSeconds: number, completedAt: string, soundPreset: string }
 * @returns Created timer session
 *
 * @example
 * // Request body:
 * { "durationSeconds": 300, "completedAt": "2026-02-16T09:30:00Z", "soundPreset": "ascending-chime" }
 */
export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: {
    durationSeconds: number
    completedAt: string
    soundPreset: string
  }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (
    typeof body.durationSeconds !== 'number' ||
    !Number.isFinite(body.durationSeconds) ||
    body.durationSeconds <= 0
  ) {
    return NextResponse.json(
      { error: 'Invalid durationSeconds' },
      { status: 400 },
    )
  }

  if (!body.completedAt || isNaN(Date.parse(body.completedAt))) {
    return NextResponse.json({ error: 'Invalid completedAt' }, { status: 400 })
  }

  if (typeof body.soundPreset !== 'string' || body.soundPreset.length === 0) {
    return NextResponse.json({ error: 'Invalid soundPreset' }, { status: 400 })
  }

  const newSession = await db
    .insert(timerSession)
    .values({
      id: nanoid(),
      userId: session.user.id,
      durationSeconds: body.durationSeconds,
      completedAt: new Date(body.completedAt),
      soundPreset: body.soundPreset,
    })
    .returning()

  return NextResponse.json(newSession[0], { status: 201 })
}
