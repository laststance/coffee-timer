import { useEffect } from 'react'
import type { SoundPreset } from '@/lib/stores/settingsStore'
import { audioManager } from '@/lib/audio/audioManager'

/**
 * Custom hook for SoundSelector component effects.
 * Handles cleanup on unmount and fallback preset selection.
 *
 * @param isValueSupported - Whether the current value is supported
 * @param onChange - Callback to change the preset
 * @param fallbackSound - The fallback sound preset to use
 */
export function useSoundSelectorEffects(
  isValueSupported: boolean,
  onChange: (preset: SoundPreset) => void,
  fallbackSound: SoundPreset,
): void {
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      audioManager.stop()
    }
  }, [])

  // Select fallback if current value is not supported
  useEffect(() => {
    if (!isValueSupported) {
      onChange(fallbackSound)
    }
  }, [isValueSupported, onChange, fallbackSound])
}
