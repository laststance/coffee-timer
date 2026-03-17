'use client'

import { memo, useMemo } from 'react'
import { Coffee } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'
import { useTheme } from 'next-themes'
import { useMounted } from '@/lib/hooks/useMounted'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { TimelineEntry } from './TimelineEntry'
import type { TimerSessionRecord } from '@/lib/types/timerSession'
import { AnimatePresence, motion } from 'framer-motion'

interface TimelinePanelProps {
  selectedDate: string
  sessions: TimerSessionRecord[]
  onEdit: (
    id: string,
    updates: { note?: string; durationSeconds?: number },
  ) => void
  onDelete: (id: string) => void
}

/**
 * TimelinePanel - Shows timer sessions for a selected date in chronological order.
 * Animates when the selected date changes.
 *
 * @example
 * <TimelinePanel selectedDate="2026-02-16" sessions={sessions} onEdit={fn} onDelete={fn} />
 */
export const TimelinePanel = memo(function TimelinePanel({
  selectedDate,
  sessions,
  onEdit,
  onDelete,
}: TimelinePanelProps) {
  const t = useTranslations('MyPage')
  const locale = useLocale()
  const { resolvedTheme } = useTheme()
  const mounted = useMounted()
  const isLiquidGlass =
    mounted && (resolvedTheme?.startsWith('liquid-glass') ?? false)

  const dateLabel = useMemo(() => {
    const [y, m, d] = selectedDate.split('-').map(Number)
    const date = new Date(y, m - 1, d)
    return new Intl.DateTimeFormat(locale === 'ja' ? 'ja-JP' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date)
  }, [selectedDate, locale])

  const sortedSessions = useMemo(() => {
    return [...sessions].sort(
      (a, b) =>
        new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime(),
    )
  }, [sessions])

  const timelineContent = (
    <div className="space-y-3">
      <h3 className="text-base font-semibold text-text-primary">
        {t('timeline')}: {dateLabel}
      </h3>

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedDate}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {sortedSessions.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-8 text-text-secondary">
              <Coffee className="h-8 w-8 opacity-40" />
              <p className="text-sm">{t('noSessions')}</p>
            </div>
          ) : (
            <ol className="divide-y-0">
              {sortedSessions.map((s) => (
                <TimelineEntry
                  key={s.id}
                  session={s}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </ol>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )

  if (isLiquidGlass) {
    return (
      <GlassPanel variant="regular" highlight className="p-6">
        {timelineContent}
      </GlassPanel>
    )
  }

  return (
    <div className="rounded-2xl border-2 border-bg-secondary bg-bg-primary p-6 shadow-soft">
      {timelineContent}
    </div>
  )
})
