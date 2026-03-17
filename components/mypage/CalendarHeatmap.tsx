'use client'

import { memo, useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'
import { useTheme } from 'next-themes'
import { useMounted } from '@/lib/hooks/useMounted'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { DayCell } from './DayCell'
import { HeatmapLegend } from './HeatmapLegend'

interface CalendarHeatmapProps {
  currentMonth: Date
  onMonthChange: (date: Date) => void
  selectedDate: string
  onDateSelect: (dateStr: string) => void
  sessionCountByDate: Map<string, number>
}

/**
 * CalendarHeatmap - Monthly calendar with GitHub-style heatmap coloring.
 * Each day cell shows intensity based on coffee break count.
 * Week start: Sunday for EN, Monday for JA.
 *
 * @example
 * <CalendarHeatmap
 *   currentMonth={new Date(2026, 1)}
 *   selectedDate="2026-02-16"
 *   sessionCountByDate={new Map([['2026-02-16', 3]])}
 *   onMonthChange={setMonth}
 *   onDateSelect={setDate}
 * />
 */
export const CalendarHeatmap = memo(function CalendarHeatmap({
  currentMonth,
  onMonthChange,
  selectedDate,
  onDateSelect,
  sessionCountByDate,
}: CalendarHeatmapProps) {
  const t = useTranslations('MyPage')
  const locale = useLocale()
  const { resolvedTheme } = useTheme()
  const mounted = useMounted()
  const isLiquidGlass =
    mounted && (resolvedTheme?.startsWith('liquid-glass') ?? false)

  // Week starts on Monday for JA, Sunday for EN
  const weekStartsOnMonday = locale === 'ja'

  const monthLabel = useMemo(() => {
    return new Intl.DateTimeFormat(locale === 'ja' ? 'ja-JP' : 'en-US', {
      year: 'numeric',
      month: 'long',
    }).format(currentMonth)
  }, [currentMonth, locale])

  const dayHeaders = useMemo(() => {
    const formatter = new Intl.DateTimeFormat(
      locale === 'ja' ? 'ja-JP' : 'en-US',
      { weekday: 'narrow' },
    )
    // Generate headers for Sun(0) through Sat(6)
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(2026, 0, 4 + i) // 2026-01-04 is a Sunday
      return formatter.format(d)
    })
    if (weekStartsOnMonday) {
      // Rotate: [Sun, Mon, ..., Sat] → [Mon, ..., Sat, Sun]
      const [sun, ...rest] = days
      return [...rest, sun]
    }
    return days
  }, [locale, weekStartsOnMonday])

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()

    // Day of week for first day (0=Sun, 6=Sat)
    let startDow = firstDay.getDay()
    if (weekStartsOnMonday) {
      startDow = startDow === 0 ? 6 : startDow - 1
    }

    const cells: Array<{ day: number; dateStr: string } | null> = []
    // Leading empty cells
    for (let i = 0; i < startDow; i++) {
      cells.push(null)
    }
    // Day cells
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      cells.push({ day: d, dateStr })
    }
    return cells
  }, [currentMonth, weekStartsOnMonday])

  const todayStr = useMemo(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  }, [])

  const calendarContent = (
    <div className="space-y-4">
      {/* Month Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            const d = new Date(currentMonth)
            d.setMonth(d.getMonth() - 1)
            onMonthChange(d)
          }}
          className="rounded-full p-2 min-w-11 min-h-11 flex items-center justify-center text-text-secondary hover:bg-bg-secondary hover:text-text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary-green cursor-pointer"
          aria-label={t('previousMonth')}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h2 className="text-lg font-semibold text-text-primary">
          {monthLabel}
        </h2>
        <button
          onClick={() => {
            const d = new Date(currentMonth)
            d.setMonth(d.getMonth() + 1)
            onMonthChange(d)
          }}
          className="rounded-full p-2 min-w-11 min-h-11 flex items-center justify-center text-text-secondary hover:bg-bg-secondary hover:text-text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary-green cursor-pointer"
          aria-label={t('nextMonth')}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-1">
        {dayHeaders.map((day, i) => (
          <div
            key={i}
            className="text-center text-xs font-medium text-text-secondary py-1"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1" role="grid">
        {calendarDays.map((cell, i) => {
          if (!cell) {
            return <div key={`empty-${i}`} aria-hidden="true" />
          }
          return (
            <DayCell
              key={cell.dateStr}
              day={cell.day}
              dateStr={cell.dateStr}
              sessionCount={sessionCountByDate.get(cell.dateStr) ?? 0}
              isSelected={cell.dateStr === selectedDate}
              isToday={cell.dateStr === todayStr}
              onSelect={onDateSelect}
            />
          )
        })}
      </div>

      {/* Legend */}
      <HeatmapLegend />
    </div>
  )

  if (isLiquidGlass) {
    return (
      <GlassPanel variant="regular" highlight className="p-6">
        {calendarContent}
      </GlassPanel>
    )
  }

  return (
    <div className="rounded-2xl border-2 border-bg-secondary bg-bg-primary p-6 shadow-soft">
      {calendarContent}
    </div>
  )
})
