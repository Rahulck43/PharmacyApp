import type { Medicine } from '../api/medicinesApi'

export type MedicineStatus = 'expired' | 'expiring' | 'low-stock' | 'normal'

type StatusFlags = Pick<Medicine, 'isExpired' | 'isExpiringSoon' | 'isLowStock'>

export function getMedicineStatus({ isExpired, isExpiringSoon, isLowStock }: StatusFlags): MedicineStatus {
  if (isExpired) return 'expired'
  if (isExpiringSoon) return 'expiring'
  if (isLowStock) return 'low-stock'
  return 'normal'
}

export const statusLabels: Record<Exclude<MedicineStatus, 'normal'>, string> = {
  expired: 'Expired',
  expiring: 'Expiring soon',
  'low-stock': 'Low stock',
}
