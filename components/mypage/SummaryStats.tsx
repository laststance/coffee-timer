'use client'

import { memo, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'
import { StatCard } from './StatCard'
import type { TimerSessionRecord } from '@/lib/types/timerSession'

interface SummaryStatsProps {
  sessions: TimerSessionRecord[]
}

/**
 * Formats total seconds into a readable time string.
 *
 * @param totalSeconds - Total duration in seconds
 * @param locale - 'en' or 'ja'
 * @returns Formatted string like "18 min" or "1h 45min"
 *
 * @example
 * formatTime(1080, 'en') // => "18 min"
 * formatTime(6300, 'en') // => "1h 45min"
 * formatTime(6300, 'ja') // => "1時間45分"
 */
function formatTime(totalSeconds: number, locale: string): string {
  if (totalSeconds === 0) return locale === 'ja' ? '0分' : '0 min'
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)

  if (locale === 'ja') {
    if (hours > 0) return `${hours}時間${minutes}分`
    return `${minutes}分`
  }
  if (hours > 0) return `${hours}h ${minutes}min`
  return `${minutes} min`
}

/**
 * Calculate stats for sessions in a date range.
 *
 * @param sessions - All sessions
 * @param startDate - Range start (inclusive)
 * @param endDate - Range end (inclusive)
 * @returns Object with totalSeconds and count
 *
 * @example
 * calcRange(sessions, '2026-02-16', '2026-02-16') // => { totalSeconds: 900, count: 3 }
 */
function calcRange(
  sessions: TimerSessionRecord[],
  startDate: Date,
  endDate: Date,
): { totalSeconds: number; count: number } {
  let totalSeconds = 0
  let count = 0
  for (const s of sessions) {
    const d = new Date(s.completedAt)
    if (d >= startDate && d <= endDate) {
      totalSeconds += s.durationSeconds
      count++
    }
  }
  return { totalSeconds, count }
}

/**
 * SummaryStats - Shows today/this week/this month break statistics.
 *
 * @example
 * <SummaryStats sessions={sessions} />
 */
export const SummaryStats = memo(function SummaryStats({
  sessions,
}: SummaryStatsProps) {
  const t = useTranslations('MyPage')
  const locale = useLocale()

  const stats = useMemo(() => {
    const now = new Date()
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    )
    const todayEnd = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
      999,
    )

    // Week start: Monday for JA, Sunday for EN
    const weekStart = new Date(todayStart)
    const dow = weekStart.getDay()
    if (locale === 'ja') {
      weekStart.setDate(weekStart.getDate() - (dow === 0 ? 6 : dow - 1))
    } else {
      weekStart.setDate(weekStart.getDate() - dow)
    }

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

    return {
      today: calcRange(sessions, todayStart, todayEnd),
      week: calcRange(sessions, weekStart, todayEnd),
      month: calcRange(sessions, monthStart, todayEnd),
    }
  }, [sessions, locale])

  const formatCount = (count: number): string => {
    if (count === 0) return t('noBreaksYet')
    if (count === 1) return t('break')
    return t('breaks', { count })
  }

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
      <StatCard
        label={t('today')}
        time={formatTime(stats.today.totalSeconds, locale)}
        count={formatCount(stats.today.count)}
      />
      <StatCard
        label={t('thisWeek')}
        time={formatTime(stats.week.totalSeconds, locale)}
        count={formatCount(stats.week.count)}
      />
      <div className="col-span-2 md:col-span-1">
        <StatCard
          label={t('thisMonth')}
          time={formatTime(stats.month.totalSeconds, locale)}
          count={formatCount(stats.month.count)}
        />
      </div>
    </div>
  )
})
