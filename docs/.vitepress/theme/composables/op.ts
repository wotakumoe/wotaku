import type { App, InjectionKey } from 'vue'
import { Internal } from '../internal/browser'

export const opSymbol: InjectionKey<Internal> = Symbol('op')

export function createOpProvider(app: App) {
  // Disable in dev
  if (import.meta.env.DEV) return

  const op = new Internal({
    clientId: 'e0e39d6b-2692-45a0-9422-4d668f113f70',
    trackScreenViews: true,
    trackOutgoingLinks: true,
    trackAttributes: true,
    trackHashChanges: true
  })

  op.init()

  app.provide(opSymbol, op)
}
