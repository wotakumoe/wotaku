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
type EventName =
  | 'pageview'
  | 'Outbound Link: Click'
  | 'File Download'
  | (string & {})

interface Options {
  /**
   * The domain to bind the event to.
   *
   * @default location.hostname
   */
  readonly domain: Location['hostname']
  /**
   * Hostnames to ignore. Useful for development environments.
   *
   * @default ['localhost']
   */
  readonly ignoredHostnames: string[]
}

interface CallbackArgs {
  readonly status: number | null
}

interface EventOptions extends EventProps {
  data?: Partial<EventData>
  /**
   * Callback to be called after the event is sent.
   */
  callback?: (args: CallbackArgs) => void
}

/**
 * Shape of the event options
 */
interface EventProps {
  /**
   * Properties to be bound to the event.
   */
  readonly props?: { readonly [propName: string]: string | number | boolean }
}

/**
 * Shape of the event data
 */
interface EventData {
  /**
   * The URL to bind the event to.
   *
   * @default location.href
   */
  readonly url: Location['href']
  /**
   * The referrer to bind the event to.
   *
   * @default document.referrer
   */
  readonly referrer: Document['referrer'] | null
  /**
   * The current device's width.
   *
   * @default window.innerWidth
   */
  readonly deviceWidth: Window['innerWidth']
}

/**
 * Shape of the event payload
 *
 * @internal
 */
interface EventPayload {
  readonly n: string
  readonly u: Location['href']
  readonly d: Location['hostname']
  readonly r: Document['referrer'] | null
  readonly w: Window['innerWidth']
  readonly h: 1 | 0
  readonly p?: string
}

function createPayload(
  eventName: string,
  _opts: Required<Options>,
  data: EventData,
  options?: EventOptions
): EventPayload {
  const payload: EventPayload = {
    n: eventName,
    u: data.url,
    d: _opts.domain,
    r: data.referrer,
    w: data.deviceWidth,
    h: 0,
    p: options && options.props ? JSON.stringify(options.props) : undefined
  }

  return payload
}

/**
 * Check if the protocol is file
 *
 * @returns - If the protocol is file
 */
function isFile(
  /** The current protocol */
  protocol: string
): boolean {
  return protocol === 'file:'
}
/**
 * Check if the user has excluded themself using `localStorage`.
 *
 * @returns - If the user exclude themself
 */
function isUserSelfExcluded(): boolean {
  // If localStorage is not available, return false
  try {
    return localStorage.getItem('plausible_ignore') === 'true'
  } catch (_error) {
    console.error(_error)
    return false
  }
}

/**
 * Create the event data.
 *
 * @returns - The event data
 */
function createEventData(
  /** The event data */
  data: Partial<EventData> = {}
): EventData {
  const { url, referrer, deviceWidth } = data

  return {
    url: url ?? window.location.href,
    referrer: referrer ?? document.referrer,
    deviceWidth: deviceWidth ?? window.innerWidth
  }
}

/**
 * Send an event to the API.
 */
function _sendEvent(
  endpoint: string,
  payload: EventPayload,
  callback?: (args: CallbackArgs) => void
) {
  return fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain'
    },
    body: JSON.stringify(payload)
  })
    .then((response: Response) => {
      callback?.({ status: response.status })
    })
    .catch(() => {
      /** noop */
    })
}

export function createScienceProvider() {
  if (import.meta.env.SSR) return
  const protocol = window.location.protocol

  const plausibleOptions: Options = {
    domain: window.location.hostname,
    ignoredHostnames: ['localhost']
  }

  const sendEvent = (
    payload: EventPayload,
    callback?: (args: CallbackArgs) => void
  ) => _sendEvent('https://wotaku.tasky.workers.dev/science', payload, callback)

  /**
   * Send a custom event.
   *
   * @param eventName - The event name
   * @param options - The event options
   */
  function trackEvent(eventName: EventName, options?: EventOptions) {
    const data = createEventData(options?.data)
    const payload = createPayload(eventName, plausibleOptions, data, options)

    // Ignore events if the protocol is file, the hostname should be ignored or the user excluded themself.
    if (isFile(protocol) || isUserSelfExcluded()) {
      // Call the callback if it exists since we are not sending the event.
      options?.callback?.({ status: null })
    } else {
      return sendEvent(payload, options?.callback)
    }
  }

  /**
   * Send a pageview event.
   */
  function trackPageview(options?: EventOptions) {
    return trackEvent('pageview', options)
  }
  /**
   * Add Plausible script to the page to enable site verification.
   */
  ;(window as unknown as any).plausible = trackEvent

  /**
   * Encapsulate the pageview event to allow user to update the options at any time.
   */
  function page() {
    trackPageview()
  }

  const originalPushState = history.pushState

  function install() {
    if (originalPushState) {
      history.pushState = function (...args) {
        originalPushState.apply(this, args)
        page()
      }
      window.addEventListener('popstate', page)
    }

    // Initial pageview
    page()
  }

  return install()
}
