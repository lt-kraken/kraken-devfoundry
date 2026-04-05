import { useCallback, useEffect, useSyncExternalStore } from 'react'

export type ThemePreference = 'system' | 'dark' | 'light'
export type ResolvedTheme = 'dark' | 'light'

const STORAGE_KEY = 'devfoundry-theme'
const MEDIA_QUERY = '(prefers-color-scheme: dark)'

let listeners: Array<() => void> = []
function emit() {
  listeners.forEach((fn) => fn())
}

function getStoredPreference(): ThemePreference {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'dark' || stored === 'light' || stored === 'system') return stored
  } catch {
    // localStorage unavailable
  }
  return 'system'
}

function getSystemDark(): boolean {
  return window.matchMedia(MEDIA_QUERY).matches
}

function resolve(preference: ThemePreference): ResolvedTheme {
  if (preference === 'system') return getSystemDark() ? 'dark' : 'light'
  return preference
}

function apply(resolved: ResolvedTheme) {
  const root = document.documentElement
  root.classList.toggle('dark', resolved === 'dark')
}

// Apply immediately to prevent flash
apply(resolve(getStoredPreference()))

let currentPreference = getStoredPreference()
let currentResolved = resolve(currentPreference)

function subscribe(callback: () => void) {
  listeners.push(callback)
  return () => {
    listeners = listeners.filter((fn) => fn !== callback)
  }
}

function getSnapshot() {
  return currentResolved
}

// Listen for system preference changes
if (typeof window !== 'undefined') {
  window.matchMedia(MEDIA_QUERY).addEventListener('change', () => {
    if (currentPreference === 'system') {
      currentResolved = resolve('system')
      apply(currentResolved)
      emit()
    }
  })
}

export function useTheme() {
  const resolvedTheme = useSyncExternalStore(subscribe, getSnapshot)

  const setTheme = useCallback((preference: ThemePreference) => {
    currentPreference = preference
    currentResolved = resolve(preference)
    apply(currentResolved)
    try {
      localStorage.setItem(STORAGE_KEY, preference)
    } catch {
      // localStorage unavailable
    }
    emit()
  }, [])

  // Derive current preference for UI display
  const theme = currentPreference

  useEffect(() => {
    // Sync if storage changed from another tab
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        currentPreference = getStoredPreference()
        currentResolved = resolve(currentPreference)
        apply(currentResolved)
        emit()
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  return { theme, resolvedTheme, setTheme } as const
}
