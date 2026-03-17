'use client'

import { memo } from 'react'
import { useTranslations } from 'next-intl'

/**
 * HeatmapLegend - Shows the color scale from "Less" to "More".
 *
 * @example
 * <HeatmapLegend />
 */
export const HeatmapLegend = memo(function HeatmapLegend() {
  const t = useTranslations('MyPage')

  return (
    <div className="flex items-center justify-end gap-1 text-xs text-text-secondary">
      <span>{t('heatmapLess')}</span>
      <div
        className="h-3 w-3 rounded-sm"
        style={{ backgroundColor: 'var(--heatmap-empty)' }}
      />
      <div
        className="h-3 w-3 rounded-sm"
        style={{ backgroundColor: 'var(--heatmap-level-1)' }}
      />
      <div
        className="h-3 w-3 rounded-sm"
        style={{ backgroundColor: 'var(--heatmap-level-2)' }}
      />
      <div
        className="h-3 w-3 rounded-sm"
        style={{ backgroundColor: 'var(--heatmap-level-3)' }}
      />
      <div
        className="h-3 w-3 rounded-sm"
        style={{ backgroundColor: 'var(--heatmap-level-4)' }}
      />
      <span>{t('heatmapMore')}</span>
    </div>
  )
})
