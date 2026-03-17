import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { eq, and } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { db } from '@/db'
import { timerSession } from '@/db/schema'

/**
 * PATCH /api/timer-sessions/[id] - Update a timer session.
 * Only allows updating note and durationSeconds.
 *
 * @param request - JSON body: { note?: string, durationSeconds?: number }
 * @returns Updated timer session
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  let body: { note?: string; durationSeconds?: number }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const updated = await db
    .update(timerSession)
    .set({
      ...(body.note !== undefined && { note: body.note }),
      ...(body.durationSeconds !== undefined && {
        durationSeconds: body.durationSeconds,
      }),
      updatedAt: new Date(),
    })
    .where(
      and(eq(timerSession.id, id), eq(timerSession.userId, session.user.id)),
    )
    .returning()

  if (updated.length === 0) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json(updated[0])
}

/**
 * DELETE /api/timer-sessions/[id] - Delete a timer session.
 *
 * @returns 204 No Content on success
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  const deleted = await db
    .delete(timerSession)
    .where(
      and(eq(timerSession.id, id), eq(timerSession.userId, session.user.id)),
    )
    .returning()

  if (deleted.length === 0) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return new NextResponse(null, { status: 204 })
}
