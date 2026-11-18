const BASE_URL = import.meta.env.VITE_API_BASE_URL

export class ApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

interface ProblemDetails {
  title?: string
  detail?: string
  errors?: Record<string, string[]>
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
    const validationMessages = problem?.errors ? Object.values(problem.errors).flat().join(' ') : ''
    throw new ApiError(
      validationMessages || problem?.detail || problem?.title || 'Something went wrong.',
      response.status,
    )
  }

  return response.json() as Promise<T>
}
