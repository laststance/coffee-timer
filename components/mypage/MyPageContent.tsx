'use client'

import { memo, useState, useCallback, useMemo } from 'react'
import { ArrowLeft, Settings } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { LanguageToggle } from '@/components/LanguageToggle'
import { SettingsPanel } from '@/components/settings/SettingsPanel'
import { CalendarHeatmap } from './CalendarHeatmap'
import { TimelinePanel } from './TimelinePanel'
import { SummaryStats } from './SummaryStats'
import { useTimerSessions } from '@/lib/hooks/useTimerSessions'

/**
 * Convert a date value to local YYYY-MM-DD string.
 * Ensures consistent local-day bucketing regardless of timezone.
 *
 * @param value - Date string (ISO) or Date object
 * @returns Local date string like "2026-02-16"
 *
 * @example
 * toLocalDateStr('2026-02-16T23:59:00Z') // => "2026-02-17" (in UTC+9)
 * toLocalDateStr(new Date()) // => "2026-02-16"
 */
function toLocalDateStr(value: string | Date): string {
  const date = new Date(value)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

/**
 * Get today's date as YYYY-MM-DD string.
 *
 * @returns Local date string for today
 * @example
 * getTodayStr() // => "2026-02-16"
 */
function getTodayStr(): string {
  return toLocalDateStr(new Date())
}

/**
 * MyPageContent - Main client component for the My Page dashboard.
 * Orchestrates calendar heatmap, timeline, and summary stats.
 * Fetches session data from the API via useTimerSessions hook.
 *
 * @example
 * <MyPageContent />
 */
export const MyPageContent = memo(function MyPageContent() {
  const t = useTranslations('MyPage')
  const tSettings = useTranslations('Settings')
  const { sessions, isLoading, editSession, deleteSession } = useTimerSessions()
  const [selectedDate, setSelectedDate] = useState(getTodayStr)
  const [currentMonth, setCurrentMonth] = useState(
    () => new Date(new Date().getFullYear(), new Date().getMonth()),
  )
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  // Semantic handlers for calendar navigation
  const handleMonthChange = useCallback((date: Date) => {
    setCurrentMonth(date)
  }, [])

  const handleDateSelect = useCallback((dateStr: string) => {
    setSelectedDate(dateStr)
  }, [])

  const handleCloseSettings = useCallback(() => {
    setIsSettingsOpen(false)
  }, [])

  // Pre-compute session count by date for heatmap
  const sessionCountByDate = useMemo(() => {
    const map = new Map<string, number>()
    for (const s of sessions) {
      const dateStr = toLocalDateStr(s.completedAt)
      map.set(dateStr, (map.get(dateStr) ?? 0) + 1)
    }
    return map
  }, [sessions])

  // Filter sessions for the selected date
  const selectedDateSessions = useMemo(() => {
    return sessions.filter(
      (s) => toLocalDateStr(s.completedAt) === selectedDate,
    )
  }, [sessions, selectedDate])

  return (
    <main className="flex min-h-screen flex-col items-center p-8 pt-4">
      <div className="mx-auto w-full max-w-2xl space-y-8">
        {/* Header */}
        <div className="space-y-2">
          {/* Controls Row */}
          <div className="flex items-center justify-between">
            {/* Back + Language Toggle - Left Side */}
            <div className="flex items-center gap-1">
              <Link
                href="/"
                className="rounded-full p-3 min-w-11 min-h-11 flex items-center justify-center text-text-secondary hover:bg-bg-secondary hover:text-text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary-green"
                aria-label={t('back')}
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <LanguageToggle />
            </div>

            {/* Settings - Right Side */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="rounded-full p-3 min-w-11 min-h-11 flex items-center justify-center text-text-secondary transition-colors hover:bg-bg-secondary hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-green cursor-pointer"
              aria-label={tSettings('openSettings')}
            >
              <Settings className="h-6 w-6" />
            </button>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-text-primary text-center">
            {t('title')}
          </h1>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-green border-t-transparent" />
          </div>
        ) : (
          <>
            {/* Calendar Heatmap */}
            <CalendarHeatmap
              currentMonth={currentMonth}
              onMonthChange={handleMonthChange}
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              sessionCountByDate={sessionCountByDate}
            />

            {/* Timeline */}
            <TimelinePanel
              selectedDate={selectedDate}
              sessions={selectedDateSessions}
              onEdit={editSession}
              onDelete={deleteSession}
            />

            {/* Summary Stats */}
            <SummaryStats sessions={sessions} />
          </>
        )}
      </div>

      {/* Settings Panel */}
      <SettingsPanel isOpen={isSettingsOpen} onClose={handleCloseSettings} />
    </main>
  )
})
