declare module 'virtual:tooltips' {
  export interface TooltipData {
    id: string
    title: string
    content: string
  }

  export const tooltips: TooltipData[]
  export function getTooltip(id: string): TooltipData | undefined
}
