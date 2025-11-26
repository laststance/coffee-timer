import { useEffect } from 'react'
import type { SoundPreset } from '@/lib/stores/settingsStore'
import { audioManager } from '@/lib/audio/audioManager'

/**
 * Custom hook to preload sound when preset changes.
 *
 * @param soundPreset - The current sound preset
 */
export function useSoundPreloader(soundPreset: SoundPreset): void {
  useEffect(() => {
    if (soundPreset !== 'none') {
      audioManager.preload(soundPreset).catch((error) => {
        console.error('[Timer] Failed to preload sound:', error)
      })
    }
  }, [soundPreset])
}
