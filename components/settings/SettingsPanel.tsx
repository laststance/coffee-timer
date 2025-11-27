'use client'

import { memo } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { useSettingsStore } from '@/lib/stores/settingsStore'
import useStore from '@/lib/hooks/useStore'
import { SoundSelector } from './SoundSelector'
import { VolumeControl } from './VolumeControl'
import { NotificationToggle } from './NotificationToggle'
import { ThemeSelector } from './ThemeSelector'
import { GlassButton } from '@/components/ui/GlassPanel'

interface SettingsPanelProps {
  isOpen: boolean
  onClose: () => void
}

/**
 * SettingsPanel - Glass-styled settings dialog
 *
 * Features Apple's Liquid Glass design:
 * - Translucent glass overlay with backdrop blur
 * - Glass container with elevated shadow
 * - Specular highlights for depth
 * - Smooth spring animations
 */
export const SettingsPanel = memo(function SettingsPanel({
  isOpen,
  onClose,
}: SettingsPanelProps) {
  const t = useTranslations('Settings')
  const settingsState = useStore(useSettingsStore, (state) => state)
  const soundPreset = settingsState?.soundPreset ?? 'ascending-chime'
  const volume = settingsState?.volume ?? 70
  const setSoundPreset = settingsState?.setSoundPreset ?? (() => {})
  const setVolume = settingsState?.setVolume ?? (() => {})

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <AnimatePresence>
        {isOpen && (
          <Dialog.Portal forceMount>
            {/* Glass Overlay */}
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 bg-black/20 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            </Dialog.Overlay>

            {/* Glass Dialog Content */}
            <Dialog.Content asChild>
              <motion.div
                data-testid="settings-panel"
                className="fixed left-[50%] top-[50%] flex max-h-[85vh] w-[90vw] max-w-md flex-col overflow-hidden rounded-3xl glass glass-elevated glass-highlight focus:outline-none"
                initial={{ opacity: 0, scale: 0.95, x: '-50%', y: '-48%' }}
                animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
                exit={{ opacity: 0, scale: 0.95, x: '-50%', y: '-48%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-6 pb-4">
                  <Dialog.Title className="text-2xl font-bold text-text-primary">
                    {t('title')}
                  </Dialog.Title>
                  <Dialog.Close asChild>
                    <motion.button
                      data-testid="settings-close-button"
                      className="rounded-full p-3 min-w-[44px] min-h-[44px] flex items-center justify-center glass glass-highlight text-text-secondary transition-colors hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-green/50"
                      aria-label={t('close')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <X className="h-5 w-5" />
                    </motion.button>
                  </Dialog.Close>
                </div>

                {/* Settings Content - Scrollable */}
                <div className="flex-1 overflow-y-auto px-6">
                  <div className="space-y-6">
                    <ThemeSelector />
                    <NotificationToggle />
                    <SoundSelector
                      value={soundPreset}
                      onChange={setSoundPreset}
                    />
                    <VolumeControl value={volume} onChange={setVolume} />
                  </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end px-6 pt-4 pb-6">
                  <Dialog.Close asChild>
                    <GlassButton
                      data-testid="settings-done-button"
                      tint="green"
                      className="px-6 py-3 min-h-[44px] font-semibold text-primary-green"
                    >
                      {t('done')}
                    </GlassButton>
                  </Dialog.Close>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
})
