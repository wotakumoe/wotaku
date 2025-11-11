/**
 *  All Rights Reserved
 *
 *  Copyright (c) 2025 taskylizard
 *
 *  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
 */
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
