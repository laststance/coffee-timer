'use client'

import { memo } from 'react'
import { Play, Pause, RotateCcw } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'

interface TimerControlsProps {
  onStart: () => void
  onPause: () => void
  onReset: () => void
  isRunning: boolean
}

export const TimerControls = memo(function TimerControls({
  onStart,
  onPause,
  onReset,
  isRunning,
}: TimerControlsProps) {
  const t = useTranslations('Timer')

  return (
    <div className="flex items-center justify-center gap-4">
      {/* Start/Pause Button */}
      {!isRunning ? (
        <motion.button
          onClick={onStart}
          data-testid="timer-start-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 rounded-full bg-primary-green min-w-[44px] min-h-[44px] px-8 py-5 text-lg font-semibold text-white shadow-soft transition-colors hover:bg-primary-green-dark focus:outline-none focus:ring-2 focus:ring-primary-green focus:ring-offset-2"
        >
          <Play className="h-5 w-5" fill="currentColor" />
          {t('start')}
        </motion.button>
      ) : (
        <motion.button
          onClick={onPause}
          data-testid="timer-pause-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 rounded-full bg-accent-amber min-w-[44px] min-h-[44px] px-8 py-5 text-lg font-semibold text-white shadow-soft transition-colors hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-accent-amber focus:ring-offset-2"
        >
          <Pause className="h-5 w-5" fill="currentColor" />
          {t('pause')}
        </motion.button>
      )}

      {/* Reset Button */}
      <motion.button
        onClick={onReset}
        data-testid="timer-reset-button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 rounded-full bg-gray-500 min-w-[44px] min-h-[44px] px-6 py-5 text-lg font-semibold text-white shadow-soft transition-colors hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
      >
        <RotateCcw className="h-5 w-5" />
        {t('reset')}
      </motion.button>
    </div>
  )
})
