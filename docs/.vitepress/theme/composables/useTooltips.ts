/**
 *  All Rights Reserved
 *
 *  Copyright (c) 2025 taskylizard
 *
 *  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
 */
import { getTooltip, type TooltipData } from 'virtual:tooltips'
import { ref } from 'vue'

const tooltipCache = ref<Map<string, TooltipData>>(new Map())

export function useTooltips() {
  const getTooltipData = (id: string): TooltipData | null => {
    if (tooltipCache.value.has(id)) {
      return tooltipCache.value.get(id)!
    }

    const tooltip = getTooltip(id)
    if (tooltip) {
      tooltipCache.value.set(id, tooltip)
      return tooltip
    }

    console.warn(`Tooltip with id "${id}" not found`)
    return null
  }

  return {
    getTooltipData
  }
}
