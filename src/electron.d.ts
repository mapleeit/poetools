import type { MouseProviderInterface } from '../shared/MouseAction.interface'
import type { KeyboardProviderInterface } from '../shared/KeyboardAction.interface'

declare global {
  interface Window {
    mouseApi: MouseProviderInterface,
    keyboardApi: KeyboardProviderInterface,
    ioApi: {
      send: (event: string, data: unknown) => void
    }
  }
}
