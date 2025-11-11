import type { LayoutMode, SpotlightStyle } from './constants'

/**
 * Options
 */
export interface Options {
  /**
   * Internationalization configuration
   *
   * When configuring, please configure according to the language code configured in
   * VitePress internationalization configuration. In the following configuration, 'en'
   * and 'zh-CN' are the language codes configured in VitePress internationalization
   * configuration.
   *
   * @default undefined
   * @example
   * ```ts
   * {
   *  locales: {
   *    'en': {
   *      title: {
   *       title: 'Reading Mode',
   *      titleAriaLabel: 'Reading Mode',
   *    },
   *    'zh-CN': {
   *       title: {
   *         title: '阅读模式',
   *         titleAriaLabel: '阅读模式',
   *     },
   *   }
   * }
   * ```
   */
  /**
   * Layout switch configuration
   */
  layoutSwitch?: {
    /**
     * Disable layout switch help tooltip
     *
     * @default false
     */
    disableHelp?: boolean
    /**
     * Default mode for layout switch
     *
     * @default LayoutMode.Original (3)
     */
    defaultMode?: LayoutMode
    /**
     * Disable Layout Switch animation
     */
    disableAnimation?: boolean
    /**
     * Content layout max width slider configuration
     */
    contentLayoutMaxWidth?: {
      /**
       * Disable content layout max width help tooltip
       *
       * @default false
       */
      disableHelp?: boolean
      /**
       * Default percentage of content layout max width
       *
       * @default 80 (80%)
       */
      defaultMaxWidth?: number
      /**
       * Disable Layout Max Width animation
       */
      disableAnimation?: boolean
    }
    /**
     * Page layout max width slider configuration
     */
    pageLayoutMaxWidth?: {
      /**
       * Disable page layout max width help tooltip
       *
       * @default false
       */
      disableHelp?: boolean
      /**
       * Default percentage of page layout max width
       *
       * @default 100 (100%)
       */
      defaultMaxWidth?: number
      /**
       * Disable Layout Max Width animation
       */
      disableAnimation?: boolean
    }
  }
  /**
   * Spotlight configuration
   */
  spotlight?: {
    /**
     * Disable spotlight
     *
     * @default false
     */
    disabled?: boolean
    /**
     * Disable spotlight help tooltip
     *
     * @default false
     */
    disableHelp?: boolean
    /**
     * Spotlight hover block color
     *
     * @default 'rgb(240 197 52 / 10%)'
     */
    hoverBlockColor?: string
    /**
     * Default toggle for spotlight
     *
     * @default false
     */
    defaultToggle?: boolean
    /**
     * Default style for spotlight
     *
     * @default SpotlightStyle.Aside (2)
     */
    defaultStyle?: SpotlightStyle
  }
}
