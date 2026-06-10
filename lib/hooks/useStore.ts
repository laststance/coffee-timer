import { useSyncExternalStore } from 'react'
import type { StoreApi, UseBoundStore } from 'zustand'

type PersistAwareStore<State> = UseBoundStore<
  StoreApi<State> & {
    persist: {
      hasHydrated: () => boolean
      onHydrate: (listener: (state: State) => void) => () => void
      onFinishHydration: (listener: (state: State) => void) => () => void
    }
  }
>

/**
 * Returns persisted Zustand state only after hydration finishes so Next.js SSR stays stable for callers using persisted stores.
 * @param store - Persist-enabled Zustand store hook.
 * @param selector - Selector that picks the value each caller needs.
 * @returns
 * - When hydration finished: the selected state slice
 * - During SSR or rehydration: `undefined`
 * @example
 * const bears = useStore(useBearStore, (state) => state.bears)
 */
const useStore = <State, Selected>(
  store: PersistAwareStore<State>,
  selector: (state: State) => Selected,
) => {
  const selectedState = store(selector)
  const hasHydrated = useSyncExternalStore(
    (onStoreChange) => {
      // Listen to both hydration edges so the UI only reveals persisted values at the right time.
      const unsubscribeHydrate = store.persist.onHydrate(() => {
        onStoreChange()
      })
      const unsubscribeFinishHydration = store.persist.onFinishHydration(() => {
        onStoreChange()
      })

      return () => {
        unsubscribeHydrate()
        unsubscribeFinishHydration()
      }
    },
    () => store.persist.hasHydrated(),
    () => false,
  )

  if (!hasHydrated) {
    return undefined
  }

  return selectedState
}

export default useStore
