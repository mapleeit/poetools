import type { MouseProviderInterface } from '../shared/MouseAction.interface'
import type { KeyboardProviderInterface } from '../shared/KeyboardAction.interface'

declare global {
  interface Window {
    mouseApi: MouseProviderInterface,
    keyboardApi: KeyboardProviderInterface,
    ioApi: {
      send: (event: string, data: unknown) => void
      saveData: (key: string, data: unknown) => Promise<{ success: boolean; error?: string }>
      loadData: (key: string) => Promise<{ success: boolean; data?: unknown; error?: string }>
    }
  }
}
