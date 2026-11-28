/**
 * All Rights Reserved
 *
 * Copyright (c) 2026 taskylizard
 *
 * All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
 */

export class LRUCache<K, V> {
  private max: number
  private cache: Map<K, V>

  constructor(max: number = 10) {
    this.max = max
    this.cache = new Map<K, V>()
  }

  get(key: K): V | undefined {
    let item = this.cache.get(key)

    if (item !== undefined) {
      // Map iteration order tracks recency; reinsert accessed keys at the end.
      this.cache.delete(key)
      this.cache.set(key, item)
    }

    return item
  }

  set(key: K, val: V): void {
    if (this.cache.has(key)) this.cache.delete(key)
    else if (this.cache.size === this.max) this.cache.delete(this.first()!)

    this.cache.set(key, val)
  }

  first(): K | undefined {
    return this.cache.keys().next().value
  }

  clear(): void {
    this.cache.clear()
  }
}
