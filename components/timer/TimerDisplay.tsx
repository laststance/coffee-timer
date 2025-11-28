'use client'

import { memo } from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { useTheme } from 'next-themes'
import { GlassPanel } from '@/components/ui/GlassPanel'

interface TimerDisplayProps {
  timeRemaining: number // seconds
  isRunning: boolean
  isPaused: boolean
  initialTime: number
}

/**
 * TimerDisplay - Circular progress timer with theme-aware styling
 *
 * For Liquid Glass themes:
 * - Translucent glass container with backdrop blur
 * - Color-coded tints for timer states (green/amber/gray)
 * - Specular highlights for depth
 * - Fluid motion animations
 *
 * For original themes (light/dark/coffee):
 * - Simple layout without glass wrapper
 * - Maintains original visual appearance
 *
 * States:
 * - Running: Green tint with pulse animation
 * - Paused: Amber tint
 * - Complete/Idle: No tint (neutral glass)
 */
export const TimerDisplay = memo(function TimerDisplay({
  timeRemaining,
  isRunning,
  isPaused,
  initialTime,
}: TimerDisplayProps) {
  const t = useTranslations('Timer')
  const { resolvedTheme } = useTheme()

  // Check if current theme is a liquid-glass variant
  const isLiquidGlass = resolvedTheme?.startsWith('liquid-glass') ?? false

  // Format time as MM:SS
  const minutes = Math.floor(timeRemaining / 60)
  const seconds = timeRemaining % 60
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

  // Status for screen readers
  const getTimerStatus = () => {
    if (timeRemaining === 0) return t('timerComplete')
    if (isPaused) return t('timerPaused')
    if (isRunning) return t('timerRunning')
    return t('timerIdle')
  }

  // Calculate progress percentage
  const progress = initialTime > 0 ? (timeRemaining / initialTime) * 100 : 0

  // Determine color based on state
  const getColor = () => {
    if (timeRemaining === 0) return '#9CA3AF' // gray when complete
    if (isPaused) return '#FBBF24' // amber when paused
    if (isRunning) return '#10B981' // green when running
    return '#9CA3AF' // gray when idle
  }

  // Get glass tint based on timer state (only used for liquid-glass themes)
  const getGlassTint = (): 'green' | 'amber' | 'none' => {
    if (timeRemaining === 0) return 'none'
    if (isPaused) return 'amber'
    if (isRunning) return 'green'
    return 'none'
  }

  const color = getColor()
  const glassTint = getGlassTint()

  // SVG circle properties
  const size = 300
  const strokeWidth = 12
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (progress / 100) * circumference

  // Timer content (shared between both modes)
  const timerContent = (
    <motion.div
      className="relative"
      data-testid="timer-display"
      role="timer"
      aria-label={`${t('timeRemaining')}: ${formattedTime}`}
      aria-live="polite"
      aria-atomic="true"
    >
      {/* SVG Circular Progress */}
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
        data-testid="timer-progress-svg"
        aria-hidden="true"
        role="img"
        aria-label={`${t('progress')}: ${Math.round(progress)}%`}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-circle-bg)"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          data-testid="timer-progress-ring"
          role="progressbar"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </svg>

      {/* Timer text in center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span
          className="font-mono text-6xl font-bold drop-shadow-sm"
          data-testid="timer-text"
          style={{ color }}
          animate={
            timeRemaining === 0
              ? { scale: [1, 1.1, 1], opacity: [1, 0.8, 1] }
              : { scale: 1 }
          }
          transition={{ duration: 0.3 }}
        >
          {formattedTime}
        </motion.span>
      </div>

      {/* Screen reader only status */}
      <span className="sr-only">{getTimerStatus()}</span>
    </motion.div>
  )

  // For original themes: simple layout without GlassPanel
  if (!isLiquidGlass) {
    return (
      <div className="flex items-center justify-center">{timerContent}</div>
    )
  }

  // For Liquid Glass themes: full glass effect
  return (
    <div className="flex items-center justify-center p-4">
      <GlassPanel
        variant="elevated"
        tint={glassTint}
        shape="circle"
        highlight
        className="p-6"
        animate={
          isRunning
            ? {
                boxShadow: [
                  'var(--glass-shadow), var(--glass-shadow-inset)',
                  '0 12px 48px rgba(16, 185, 129, 0.25), var(--glass-shadow-inset)',
                  'var(--glass-shadow), var(--glass-shadow-inset)',
                ],
              }
            : undefined
        }
        transition={
          isRunning
            ? {
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }
            : undefined
        }
      >
        {timerContent}
      </GlassPanel>
    </div>
  )
})
