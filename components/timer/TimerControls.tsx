'use client'

import { memo } from 'react'
import { Play, Pause, RotateCcw } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { GlassPanel, GlassButton } from '@/components/ui/GlassPanel'

interface TimerControlsProps {
  onStart: () => void
  onPause: () => void
  onReset: () => void
  isRunning: boolean
}

/**
 * TimerControls - Floating glass control bar with capsule buttons
 *
 * Features Apple's Liquid Glass design:
 * - Floating glass container with capsule shape
 * - Glass buttons with color tints for state indication
 * - Spring-based hover/tap animations
 * - Specular highlights for depth
 */
export const TimerControls = memo(function TimerControls({
  onStart,
  onPause,
  onReset,
  isRunning,
}: TimerControlsProps) {
  const t = useTranslations('Timer')

  return (
    <GlassPanel
      variant="elevated"
      shape="capsule"
      highlight
      className="px-3 py-3"
    >
      <div className="flex items-center justify-center gap-3">
        {/* Start/Pause Button */}
        {!isRunning ? (
          <GlassButton
            onClick={onStart}
            data-testid="timer-start-button"
            tint="green"
            className="flex items-center gap-2 min-w-[44px] min-h-[44px] px-6 py-3 text-base font-semibold text-primary-green"
          >
            <Play className="h-5 w-5" fill="currentColor" />
            {t('start')}
          </GlassButton>
        ) : (
          <GlassButton
            onClick={onPause}
            data-testid="timer-pause-button"
            tint="amber"
            className="flex items-center gap-2 min-w-[44px] min-h-[44px] px-6 py-3 text-base font-semibold text-accent-amber"
          >
            <Pause className="h-5 w-5" fill="currentColor" />
            {t('pause')}
          </GlassButton>
        )}

        {/* Separator */}
        <div className="h-8 w-px bg-glass-border opacity-50" />

        {/* Reset Button */}
        <GlassButton
          onClick={onReset}
          data-testid="timer-reset-button"
          className="flex items-center gap-2 min-w-[44px] min-h-[44px] px-5 py-3 text-base font-semibold text-text-secondary"
        >
          <RotateCcw className="h-5 w-5" />
          {t('reset')}
        </GlassButton>
      </div>
    </GlassPanel>
  )
})
