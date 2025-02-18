import type { App, InjectionKey, } from "vue";
import { OpenPanel } from '@openpanel/web'

export const opSymbol: InjectionKey<OpenPanel> = Symbol('op')

export function createOpProvider(app: App) {
  if (import.meta.env.SSR) return

  const op = new OpenPanel({
    apiUrl: 'https://wotaku.tasky.workers.dev/op',
    clientId: 'cd00637d-393c-498e-8017-26682651013d',
    trackScreenViews: true,
    trackOutgoingLinks: true,
    trackAttributes: true
  })

  op.init()
  // expose on window for debugging
  // @ts-expect-error uhhh
  window.__op = op

  app.provide(opSymbol, op)
}
