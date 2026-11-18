import { useState, type ChangeEvent, type FormEvent } from 'react'
import { ApiError } from '../api/httpClient'
import { createMedicine, type MedicineDetails } from '../api/medicinesApi'
import {
  emptyMedicineForm,
  todayIsoDate,
  toCreateMedicineRequest,
  validateMedicine,
  type MedicineFormErrors,
  type MedicineFormValues,
} from '../utils/medicineValidation'

interface MedicineFormProps {
  onCreated: (medicine: MedicineDetails) => void
}

type FieldName = keyof MedicineFormValues

export function MedicineForm({ onCreated }: MedicineFormProps) {
  const [values, setValues] = useState<MedicineFormValues>(emptyMedicineForm)
  const [errors, setErrors] = useState<MedicineFormErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const name = event.target.name as FieldName
    setValues((current) => ({ ...current, [name]: event.target.value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
    setSuccessMessage(null)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError(null)
    setSuccessMessage(null)

    const validationErrors = validateMedicine(values)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setSaving(true)
    try {
      const created = await createMedicine(toCreateMedicineRequest(values))
      setValues(emptyMedicineForm)
      setSuccessMessage(`“${created.fullName}” was added.`)
      onCreated(created)
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : 'Could not save the medicine. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  function fieldProps(name: FieldName) {
    const error = errors[name]
    return {
      id: `medicine-${name}`,
      name,
      value: values[name],
      onChange: handleChange,
      'aria-invalid': error ? true : undefined,
      'aria-describedby': error ? `medicine-${name}-error` : undefined,
    }
  }

  function fieldError(name: FieldName) {
    const error = errors[name]
    return error ? (
      <p id={`medicine-${name}-error`} className="field-error">
        {error}
      </p>
    ) : null
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
          <label htmlFor="medicine-fullName">Name</label>
          <input type="text" maxLength={200} {...fieldProps('fullName')} />
          {fieldError('fullName')}
        </div>

        <div className="field">
          <label htmlFor="medicine-brand">Brand</label>
          <input type="text" maxLength={100} {...fieldProps('brand')} />
          {fieldError('brand')}
        </div>

        <div className="field">
          <label htmlFor="medicine-expiryDate">Expiry date</label>
          <input type="date" min={todayIsoDate()} {...fieldProps('expiryDate')} />
          {fieldError('expiryDate')}
        </div>

        <div className="field">
          <label htmlFor="medicine-quantity">Quantity</label>
          <input type="number" min={0} step={1} inputMode="numeric" {...fieldProps('quantity')} />
          {fieldError('quantity')}
        </div>

        <div className="field">
          <label htmlFor="medicine-price">Price (₹)</label>
          <input type="number" min={0.01} step={0.01} inputMode="decimal" {...fieldProps('price')} />
          {fieldError('price')}
        </div>

        <div className="field field-wide">
          <label htmlFor="medicine-notes">
            Notes <span className="optional">(optional)</span>
          </label>
          <textarea rows={3} maxLength={1000} {...fieldProps('notes')} />
          {fieldError('notes')}
        </div>
      </div>

      <button type="submit" className="button-primary" disabled={saving}>
        {saving ? 'Saving…' : 'Add medicine'}
      </button>
    </form>
  )
}
