import type { CreateMedicineRequest } from '../api/medicinesApi'

export interface MedicineFormValues {
  fullName: string
  brand: string
  notes: string
  expiryDate: string
  quantity: string
  price: string
}

export type MedicineFormErrors = Partial<Record<keyof MedicineFormValues, string>>

export const emptyMedicineForm: MedicineFormValues = {
  fullName: '',
  brand: '',
  notes: '',
  expiryDate: '',
  quantity: '',
  price: '',
}

export function todayIsoDate(now = new Date()) {
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

export function validateMedicine(values: MedicineFormValues, today = todayIsoDate()): MedicineFormErrors {
  const errors: MedicineFormErrors = {}

  const fullName = values.fullName.trim()
  if (!fullName) errors.fullName = 'Name is required.'
  else if (fullName.length > 200) errors.fullName = 'Name must be 200 characters or fewer.'

  const brand = values.brand.trim()
  if (!brand) errors.brand = 'Brand is required.'
  else if (brand.length > 100) errors.brand = 'Brand must be 100 characters or fewer.'

  if (values.notes.trim().length > 1000) errors.notes = 'Notes must be 1000 characters or fewer.'

  if (!values.expiryDate) errors.expiryDate = 'Expiry date is required.'
  else if (values.expiryDate < today) errors.expiryDate = 'Expiry date cannot be in the past.'

  if (values.quantity.trim() === '') errors.quantity = 'Quantity is required.'
  else if (!/^\d+$/.test(values.quantity.trim())) errors.quantity = 'Quantity must be a whole number of 0 or more.'

  const price = values.price.trim()
  if (price === '') errors.price = 'Price is required.'
  else if (!/^\d+(\.\d{1,2})?$/.test(price)) errors.price = 'Price must be a number with at most 2 decimal places.'
  else if (Number(price) < 0.01 || Number(price) > 1_000_000) errors.price = 'Price must be between 0.01 and 1,000,000.'

  return errors
}

export function toCreateMedicineRequest(values: MedicineFormValues): CreateMedicineRequest {
  const notes = values.notes.trim()
  return {
    fullName: values.fullName.trim(),
    brand: values.brand.trim(),
    notes: notes || null,
    expiryDate: values.expiryDate,
    quantity: Number(values.quantity),
    price: Number(values.price),
  }
}
