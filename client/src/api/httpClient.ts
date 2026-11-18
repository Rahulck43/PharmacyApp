const BASE_URL = import.meta.env.VITE_API_BASE_URL

export type FieldErrors = Record<string, string[]>

export class ApiError extends Error {
  readonly status: number
  readonly fieldErrors: FieldErrors

  constructor(message: string, status: number, fieldErrors: FieldErrors = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.fieldErrors = fieldErrors
  }
}

interface ProblemDetails {
  title?: string
  detail?: string
  errors?: FieldErrors
}

function normaliseFieldErrors(errors: FieldErrors = {}): FieldErrors {
  const result: FieldErrors = {}
  for (const [key, messages] of Object.entries(errors)) {
    const name = key.replace(/^\$\./, '')
    const field = name.charAt(0).toLowerCase() + name.slice(1)
    result[field] = [...(result[field] ?? []), ...messages]
  }
  return result
}

export async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...init,
      headers: init.body ? { 'Content-Type': 'application/json' } : undefined,
    })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error
    }
    throw new ApiError('Cannot reach the server. Please check that the API is running.', 0)
  }

  if (!response.ok) {
    const problem: ProblemDetails | null = await response.json().catch(() => null)
    throw new ApiError(
      problem?.detail ?? problem?.title ?? 'Something went wrong.',
      response.status,
      normaliseFieldErrors(problem?.errors),
    )
  }

  return response.json() as Promise<T>
}
