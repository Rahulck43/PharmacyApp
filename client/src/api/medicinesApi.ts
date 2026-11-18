import { request } from './httpClient'

export interface Medicine {
  id: string
  fullName: string
  brand: string
  expiryDate: string
  quantity: number
  price: number
  isExpiringSoon: boolean
  isLowStock: boolean
  isExpired: boolean
}

export interface MedicineDetails extends Medicine {
  notes: string | null
  createdAt: string
}

export interface CreateMedicineRequest {
  fullName: string
  brand: string
  notes: string | null
  expiryDate: string
  quantity: number
  price: number
}

export function getMedicines(search = '', signal?: AbortSignal) {
  const term = search.trim()
  const query = term ? `?${new URLSearchParams({ search: term })}` : ''
  return request<Medicine[]>(`/medicines${query}`, { signal })
}

export function createMedicine(data: CreateMedicineRequest) {
  return request<MedicineDetails>('/medicines', { method: 'POST', body: JSON.stringify(data) })
}
