import type { Medicine } from '../api/medicinesApi'

export type MedicineStatus = 'expiring' | 'low-stock' | 'normal'

type StatusFlags = Pick<Medicine, 'isExpiringSoon' | 'isLowStock'>

export function getMedicineStatus({ isExpiringSoon, isLowStock }: StatusFlags): MedicineStatus {
  if (isExpiringSoon) return 'expiring'
  if (isLowStock) return 'low-stock'
  return 'normal'
}

export const statusLabels: Record<Exclude<MedicineStatus, 'normal'>, string> = {
  expiring: 'Expiring soon',
  'low-stock': 'Low stock',
}
