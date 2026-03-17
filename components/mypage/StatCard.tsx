'use client'

import { memo } from 'react'
import { useTheme } from 'next-themes'
import { useMounted } from '@/lib/hooks/useMounted'
import { GlassPanel } from '@/components/ui/GlassPanel'

interface StatCardProps {
  label: string
  time: string
  count: string
}

/**
 * StatCard - Displays a summary statistic (total time + count) in a themed card.
 * Supports both original and Liquid Glass theme variants.
 *
 * @example
 * <StatCard label="Today" time="18 min" count="3 breaks" />
 */
export const StatCard = memo(function StatCard({
  label,
  time,
  count,
}: StatCardProps) {
  const { resolvedTheme } = useTheme()
  const mounted = useMounted()
  const isLiquidGlass =
    mounted && (resolvedTheme?.startsWith('liquid-glass') ?? false)

  const content = (
    <div className="text-center">
      <p className="text-sm font-medium text-text-secondary">{label}</p>
      <p className="mt-1 text-2xl font-bold text-text-primary">{time}</p>
      <p className="mt-0.5 text-sm text-text-secondary">{count}</p>
    </div>
  )

  if (isLiquidGlass) {
    return (
      <GlassPanel variant="regular" className="p-4">
        {content}
      </GlassPanel>
    )
  }

  return (
    <div className="rounded-xl border-2 border-bg-secondary bg-bg-primary p-4 shadow-soft">
      {content}
    </div>
  )
})
