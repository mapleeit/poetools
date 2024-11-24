import type { MouseProviderInterface } from '../shared/MouseAction.interface'

declare global {
  interface Window {
    mouseApi: MouseProviderInterface
  }
}
