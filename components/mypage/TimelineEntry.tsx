'use client'

import { memo, useState } from 'react'
import { Pencil, Trash2, MoreHorizontal } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'
import type { TimerSessionRecord } from '@/lib/types/timerSession'

interface TimelineEntryProps {
  session: TimerSessionRecord
  onEdit: (
    id: string,
    updates: { note?: string; durationSeconds?: number },
  ) => void
  onDelete: (id: string) => void
}

/**
 * Formats seconds into a human-readable duration string.
 *
 * @param seconds - Duration in seconds
 * @returns Formatted string like "5:00" or "10:30"
 *
 * @example
 * formatDuration(300) // => "5:00"
 * formatDuration(630) // => "10:30"
 */
function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

/**
 * TimelineEntry - Single timer session row in the timeline.
 * Shows time, duration, and edit/delete actions.
 *
 * @example
 * <TimelineEntry session={session} onEdit={handleEdit} onDelete={handleDelete} />
 */
export const TimelineEntry = memo(function TimelineEntry({
  session,
  onEdit,
  onDelete,
}: TimelineEntryProps) {
  const t = useTranslations('MyPage')
  const locale = useLocale()
  const [showMenu, setShowMenu] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [noteValue, setNoteValue] = useState(session.note ?? '')
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)

  const timeStr = new Intl.DateTimeFormat(locale === 'ja' ? 'ja-JP' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(session.completedAt))

  const saveNote = () => {
    onEdit(session.id, { note: noteValue || undefined })
    setIsEditing(false)
  }

  return (
    <li className="flex items-center gap-4 py-3 border-b border-bg-secondary last:border-b-0">
      {/* Time */}
      <span className="text-sm font-mono text-text-secondary w-12 shrink-0">
        {timeStr}
      </span>

      {/* Duration */}
      <span className="text-sm font-semibold text-text-primary w-14 shrink-0">
        {formatDuration(session.durationSeconds)}
      </span>

      {/* Note or Sound Preset */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={noteValue}
              onChange={(e) => setNoteValue(e.target.value)}
              placeholder={t('notePlaceholder')}
              className="flex-1 rounded-md border border-bg-secondary bg-bg-primary px-2 py-1 text-sm text-text-primary focus:border-primary-green focus:outline-none"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveNote()
                if (e.key === 'Escape') setIsEditing(false)
              }}
            />
            <button
              onClick={saveNote}
              className="text-xs font-medium text-primary-green hover:underline cursor-pointer"
            >
              {t('save')}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="text-xs font-medium text-text-secondary hover:underline cursor-pointer"
            >
              {t('cancel')}
            </button>
          </div>
        ) : (
          <span className="text-sm text-text-secondary truncate block">
            {session.note ?? session.soundPreset}
          </span>
        )}
      </div>

      {/* Actions - Desktop */}
      <div className="hidden md:flex items-center gap-1 shrink-0">
        <button
          onClick={() => setIsEditing(true)}
          className="rounded-full p-2 min-w-9 min-h-9 flex items-center justify-center text-text-secondary hover:bg-bg-secondary hover:text-text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary-green cursor-pointer"
          aria-label={t('edit')}
        >
          <Pencil className="h-4 w-4" />
        </button>
        {showConfirmDelete ? (
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                onDelete(session.id)
                setShowConfirmDelete(false)
              }}
              className="text-xs font-medium text-red-500 hover:underline cursor-pointer px-2 py-1"
            >
              {t('delete')}
            </button>
            <button
              onClick={() => setShowConfirmDelete(false)}
              className="text-xs font-medium text-text-secondary hover:underline cursor-pointer px-2 py-1"
            >
              {t('cancel')}
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowConfirmDelete(true)}
            className="rounded-full p-2 min-w-9 min-h-9 flex items-center justify-center text-text-secondary hover:bg-bg-secondary hover:text-red-500 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-green cursor-pointer"
            aria-label={t('delete')}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Actions - Mobile (overflow menu) */}
      <div className="relative md:hidden shrink-0">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="rounded-full p-2 min-w-9 min-h-9 flex items-center justify-center text-text-secondary hover:bg-bg-secondary transition-colors focus:outline-none cursor-pointer"
          aria-label={t('actions')}
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
        {showMenu && (
          <div className="absolute right-0 top-full z-10 mt-1 rounded-lg border border-bg-secondary bg-bg-primary py-1 shadow-soft min-w-[120px]">
            <button
              onClick={() => {
                setIsEditing(true)
                setShowMenu(false)
              }}
              className="w-full px-4 py-2 text-left text-sm text-text-primary hover:bg-bg-secondary cursor-pointer"
            >
              {t('edit')}
            </button>
            <button
              onClick={() => {
                setShowConfirmDelete(true)
                setShowMenu(false)
              }}
              className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-bg-secondary cursor-pointer"
            >
              {t('delete')}
            </button>
          </div>
        )}
      </div>
    </li>
  )
})
