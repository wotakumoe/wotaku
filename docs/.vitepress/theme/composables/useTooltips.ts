/**
 *  Copyright (c) 2024 taskylizard
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
import { ref } from "vue";
import { getTooltip, type TooltipData } from "virtual:tooltips";

const tooltipCache = ref<Map<string, TooltipData>>(new Map());

export function useTooltips() {
  const getTooltipData = (id: string): TooltipData | null => {
    if (tooltipCache.value.has(id)) {
      return tooltipCache.value.get(id)!;
    }

    const tooltip = getTooltip(id);
    if (tooltip) {
      tooltipCache.value.set(id, tooltip);
      return tooltip;
    }

    console.warn(`Tooltip with id "${id}" not found`);
    return null;
  };

  return {
    getTooltipData,
  };
}

