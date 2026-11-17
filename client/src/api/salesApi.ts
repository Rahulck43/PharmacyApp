import { request } from './httpClient'

export interface Sale {
  id: string
  medicineId: string
  medicineName: string
  quantity: number
  unitPrice: number
  totalAmount: number
  soldAt: string
}

export interface CreateSaleRequest {
  medicineId: string
  quantity: number
}

export function getSales(signal?: AbortSignal) {
  return request<Sale[]>('/sales', { signal })
}

export function createSale(data: CreateSaleRequest) {
  return request<Sale>('/sales', { method: 'POST', body: JSON.stringify(data) })
}
