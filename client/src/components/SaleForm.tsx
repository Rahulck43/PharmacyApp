import { useState, type FormEvent } from 'react'
import { ApiError } from '../api/httpClient'
import type { Medicine } from '../api/medicinesApi'
import { createSale, type Sale } from '../api/salesApi'
import { formatPrice } from '../utils/formatters'

interface SaleFormProps {
  medicines: Medicine[]
  loading: boolean
  onSold: (sale: Sale) => void
}

interface SaleFormErrors {
  medicineId?: string
  quantity?: string
}

export function SaleForm({ medicines, loading, onSold }: SaleFormProps) {
  const [medicineId, setMedicineId] = useState('')
  const [quantity, setQuantity] = useState('1')
  const [errors, setErrors] = useState<SaleFormErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const sellable = medicines.filter((m) => !m.isExpired && m.quantity > 0)
  const selected = sellable.find((m) => m.id === medicineId)
  const quantityNumber = /^\d+$/.test(quantity.trim()) ? Number(quantity) : 0
  const total = selected ? Math.round(selected.price * 100 * quantityNumber) / 100 : 0

  function clearMessages() {
    setFormError(null)
    setSuccessMessage(null)
  }

  function validate(): SaleFormErrors {
    const result: SaleFormErrors = {}
    if (!selected) result.medicineId = 'Choose a medicine.'
    if (!/^\d+$/.test(quantity.trim()) || Number(quantity) < 1) {
      result.quantity = 'Quantity must be a whole number of 1 or more.'
    }
    return result
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    clearMessages()

    const validationErrors = validate()
    setErrors(validationErrors)
    if (!selected || Object.keys(validationErrors).length > 0) return

    setSaving(true)
    try {
      const sale = await createSale({ medicineId: selected.id, quantity: quantityNumber })
      setMedicineId('')
      setQuantity('1')
      setSuccessMessage(
        `Sold ${sale.quantity} × ${sale.medicineName} for ${formatPrice(sale.totalAmount)}.`,
      )
      onSold(sale)
    } catch (err) {
      if (err instanceof ApiError) {
        const quantityErrors = err.fieldErrors.quantity
        if (quantityErrors?.length) setErrors({ quantity: quantityErrors.join(' ') })
        setFormError(err.message)
      } else {
        setFormError('Could not record the sale. Please try again.')
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      {formError && (
        <p role="alert" className="alert alert-error">
          {formError}
        </p>
      )}
      {successMessage && (
        <p role="status" className="alert alert-success">
          {successMessage}
        </p>
      )}

      <div className="form-grid">
        <div className="field">
          <label htmlFor="sale-medicine">Medicine</label>
          <select
            id="sale-medicine"
            value={selected ? medicineId : ''}
            onChange={(event) => {
              setMedicineId(event.target.value)
              setErrors((current) => ({ ...current, medicineId: undefined }))
              clearMessages()
            }}
            disabled={loading && sellable.length === 0}
            aria-invalid={errors.medicineId ? true : undefined}
            aria-describedby={errors.medicineId ? 'sale-medicine-error' : undefined}
          >
            <option value="">
              {sellable.length === 0 && !loading ? 'No medicines available to sell' : 'Select a medicine'}
            </option>
            {sellable.map((m) => (
              <option key={m.id} value={m.id}>
                {m.fullName} ({m.brand}) · {formatPrice(m.price)} · {m.quantity} in stock
              </option>
            ))}
          </select>
          {errors.medicineId && (
            <p id="sale-medicine-error" className="field-error">
              {errors.medicineId}
            </p>
          )}
        </div>

        <div className="field">
          <label htmlFor="sale-quantity">Quantity</label>
          <input
            id="sale-quantity"
            type="number"
            min={1}
            step={1}
            inputMode="numeric"
            value={quantity}
            onChange={(event) => {
              setQuantity(event.target.value)
              setErrors((current) => ({ ...current, quantity: undefined }))
              clearMessages()
            }}
            aria-invalid={errors.quantity ? true : undefined}
            aria-describedby={errors.quantity ? 'sale-quantity-error' : 'sale-quantity-hint'}
          />
          {errors.quantity ? (
            <p id="sale-quantity-error" className="field-error">
              {errors.quantity}
            </p>
          ) : (
            selected && (
              <p id="sale-quantity-hint" className="field-hint">
                {selected.quantity} in stock
              </p>
            )
          )}
        </div>

        <div className="field">
          <span className="field-label">Total</span>
          <output className="sale-total" htmlFor="sale-medicine sale-quantity" aria-live="polite">
            {formatPrice(total)}
          </output>
        </div>
      </div>

      <button type="submit" className="button-primary" disabled={saving}>
        {saving ? 'Recording…' : 'Record sale'}
      </button>
    </form>
  )
}
