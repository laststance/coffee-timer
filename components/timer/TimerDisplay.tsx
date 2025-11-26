'use client'

import { memo } from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'

interface TimerDisplayProps {
  timeRemaining: number // seconds
  isRunning: boolean
  isPaused: boolean
  initialTime: number
}

export const TimerDisplay = memo(function TimerDisplay({
  timeRemaining,
  isRunning,
  isPaused,
  initialTime,
}: TimerDisplayProps) {
  const t = useTranslations('Timer')

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

  const color = getColor()

  // SVG circle properties
  const size = 300
  const strokeWidth = 12
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className="flex items-center justify-center">
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
            className="font-mono text-6xl font-bold"
            data-testid="timer-text"
            style={{ color }}
            animate={
              timeRemaining === 0 ? { scale: [1, 1.1, 1] } : { scale: 1 }
            }
            transition={{ duration: 0.3 }}
          >
            {formattedTime}
          </motion.span>
        </div>

        {/* Screen reader only status */}
        <span className="sr-only">{getTimerStatus()}</span>
      </motion.div>
    </div>
  )
})
