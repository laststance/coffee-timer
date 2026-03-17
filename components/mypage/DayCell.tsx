'use client'

import { memo } from 'react'

/**
 * Maps session count to a heatmap intensity level (0-4).
 *
 * @param count - Number of sessions on a given day
 * @returns CSS variable name for the background color
 *
 * @example
 * getHeatmapColor(0) // => 'var(--heatmap-empty)'
 * getHeatmapColor(3) // => 'var(--heatmap-level-2)'
 * getHeatmapColor(6) // => 'var(--heatmap-level-4)'
 */
function getHeatmapColor(count: number): string {
  if (count === 0) return 'var(--heatmap-empty)'
  if (count === 1) return 'var(--heatmap-level-1)'
  if (count <= 3) return 'var(--heatmap-level-2)'
  if (count <= 5) return 'var(--heatmap-level-3)'
  return 'var(--heatmap-level-4)'
}

interface DayCellProps {
  day: number
  dateStr: string
  sessionCount: number
  isSelected: boolean
  isToday: boolean
  onSelect: (dateStr: string) => void
}

/**
 * DayCell - Individual calendar day with heatmap coloring.
 * Shows session intensity and handles click selection.
 *
 * @example
 * <DayCell day={16} dateStr="2026-02-16" sessionCount={3} isSelected={false} isToday={true} onSelect={setDate} />
 */
export const DayCell = memo(function DayCell({
  day,
  dateStr,
  sessionCount,
  isSelected,
  isToday,
  onSelect,
}: DayCellProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(dateStr)}
      className={`
        relative flex items-center justify-center rounded-lg text-sm font-medium
        aspect-square min-h-9 cursor-pointer
        transition-all duration-150
        focus:outline-none focus:ring-2 focus:ring-[var(--heatmap-selected)] focus:ring-offset-1
        ${isSelected ? 'ring-2 ring-[var(--heatmap-selected)] ring-offset-1' : ''}
      `}
      style={{ backgroundColor: getHeatmapColor(sessionCount) }}
      aria-label={`${dateStr}, ${sessionCount} sessions`}
      aria-pressed={isSelected}
    >
      <span
        className={`
          ${isToday ? 'font-bold' : ''}
          ${sessionCount >= 4 ? 'text-white' : 'text-text-primary'}
        `}
      >
        {day}
      </span>
      {isToday && (
        <span className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[var(--heatmap-selected)]" />
      )}
    </button>
  )
})
