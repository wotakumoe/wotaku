interface ApiConfig {
  baseUrl: string
  defaultHeaders?: Record<string, string | Promise<string | null>>
  maxRetries?: number
  initialRetryDelay?: number
}

interface FetchOptions extends RequestInit {
  retries?: number
}

class Api {
  private baseUrl: string
  private headers: Record<string, string | Promise<string | null>>
  private maxRetries: number
  private initialRetryDelay: number

  constructor(config: ApiConfig) {
    this.baseUrl = config.baseUrl
    this.headers = {
      'Content-Type': 'application/json',
      ...config.defaultHeaders
    }
    this.maxRetries = config.maxRetries ?? 3
    this.initialRetryDelay = config.initialRetryDelay ?? 500
  }

  private async resolveHeaders(): Promise<Record<string, string>> {
    const resolvedHeaders: Record<string, string> = {}
    for (const [key, value] of Object.entries(this.headers)) {
      const resolvedValue = await value
      if (resolvedValue !== null) {
        resolvedHeaders[key] = resolvedValue
      }
    }
    return resolvedHeaders
  }

  public addHeader(key: string, value: string | Promise<string | null>) {
    this.headers[key] = value
  }

  private async post<ReqBody, ResBody>(
    url: string,
    data: ReqBody,
    options: FetchOptions,
    attempt: number
  ): Promise<ResBody | null> {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: await this.resolveHeaders(),
        body: JSON.stringify(data ?? {}),
        keepalive: true,
        ...options
      })

      if (response.status === 401) return null

      if (response.status !== 200 && response.status !== 202) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const responseText = await response.text()
      return responseText ? JSON.parse(responseText) : null
    } catch (error) {
      if (attempt < this.maxRetries) {
        const delay = this.initialRetryDelay * 2 ** attempt
        await new Promise((resolve) => setTimeout(resolve, delay))
        return this.post<ReqBody, ResBody>(url, data, options, attempt + 1)
      }
      console.error('Max retries reached:', error)
      return null
    }
  }

  async fetch<ReqBody, ResBody>(
    path: string,
    data: ReqBody,
    options: FetchOptions = {}
  ): Promise<ResBody | null> {
    const url = `${this.baseUrl}${path}`
    return this.post<ReqBody, ResBody>(url, data, options, 0)
  }
}

export type TrackHandlerPayload =
  | {
      type: 'track'
      payload: TrackPayload
    }
  | {
      type: 'increment'
      payload: IncrementPayload
    }
  | {
      type: 'decrement'
      payload: DecrementPayload
    }
  | {
      type: 'alias'
      payload: AliasPayload
    }
  | {
      type: 'identify'
      payload: IdentifyPayload
    }

export type TrackPayload = {
  name: string
  properties?: Record<string, unknown>
  profileId?: string
}

export type TrackProperties = {
  [key: string]: unknown
  profileId?: string
}

export type IdentifyPayload = {
  profileId: string
  firstName?: string
  lastName?: string
  email?: string
  avatar?: string
  properties?: Record<string, unknown>
}

export type AliasPayload = {
  profileId: string
  alias: string
}

export type IncrementPayload = {
  profileId: string
  property: string
  value?: number
}

export type DecrementPayload = {
  profileId: string
  property: string
  value?: number
}

export type InternalOptions = {
  clientId: string
  clientSecret?: string
  apiUrl?: string
  sdk?: string
  sdkVersion?: string
  waitForProfile?: boolean
  filter?: (payload: TrackHandlerPayload) => boolean
  disabled?: boolean
}

export class InternalAPI {
  api: Api
  profileId?: string
  global?: Record<string, unknown>
  queue: TrackHandlerPayload[] = []

  constructor(public options: InternalOptions) {
    const defaultHeaders: Record<string, string> = {
      'openpanel-client-id': options.clientId
    }

    if (options.clientSecret) {
      defaultHeaders['openpanel-client-secret'] = options.clientSecret
    }

    defaultHeaders['openpanel-sdk-name'] = options.sdk || 'node'
    defaultHeaders['openpanel-sdk-version'] =
      options.sdkVersion || process.env.SDK_VERSION!

    this.api = new Api({
      baseUrl: 'https://wotaku.wiki',
      defaultHeaders
    })
  }

  // placeholder for future use
  init() {
    // empty
  }

  ready() {
    this.options.waitForProfile = false
    this.flush()
  }

  async send(payload: TrackHandlerPayload) {
    if (this.options.disabled) {
      return Promise.resolve()
    }

    if (this.options.filter && !this.options.filter(payload)) {
      return Promise.resolve()
    }

    if (this.options.waitForProfile && !this.profileId) {
      this.queue.push(payload)
      return Promise.resolve()
    }
    return this.api.fetch('/icons', payload)
  }

  setGlobalProperties(properties: Record<string, unknown>) {
    this.global = {
      ...this.global,
      ...properties
    }
  }

  async track(name: string, properties?: TrackProperties) {
    return this.send({
      type: 'track',
      payload: {
        name,
        profileId: properties?.profileId ?? this.profileId,
        properties: {
          ...(this.global ?? {}),
          ...(properties ?? {})
        }
      }
    })
  }

  async identify(payload: IdentifyPayload) {
    if (payload.profileId) {
      this.profileId = payload.profileId
      this.flush()
    }

    if (Object.keys(payload).length > 1) {
      return this.send({
        type: 'identify',
        payload: {
          ...payload,
          properties: {
            ...this.global,
            ...payload.properties
          }
        }
      })
    }
  }

  async alias(payload: AliasPayload) {
    return this.send({
      type: 'alias',
      payload
    })
  }

  async increment(payload: IncrementPayload) {
    return this.send({
      type: 'increment',
      payload
    })
  }

  async decrement(payload: DecrementPayload) {
    return this.send({
      type: 'decrement',
      payload
    })
  }

  clear() {
    this.profileId = undefined
  }

  flush() {
    this.queue.forEach((item) => {
      this.send({
        ...item,
        // @ts-expect-error
        payload: {
          ...item.payload,
          profileId: item.payload.profileId ?? this.profileId
        }
      })
    })
    this.queue = []
  }
}
