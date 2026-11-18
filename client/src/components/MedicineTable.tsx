import type { Medicine } from '../api/medicinesApi'
import { formatDate, formatPrice } from '../utils/formatters'
import { getMedicineStatus, statusLabels } from '../utils/medicineStatus'

interface MedicineTableProps {
  medicines: Medicine[]
  searchTerm?: string
}

export function MedicineTable({ medicines, searchTerm = '' }: MedicineTableProps) {
  if (medicines.length === 0) {
    const term = searchTerm.trim()
    return <p className="empty">{term ? `No results for ‘${term}’.` : 'No medicines found.'}</p>
  }

  return (
    <>
      <ul className="legend" aria-label="Row colour legend">
        <li>
          <span className="legend-swatch row-expiring" aria-hidden="true" />
          {statusLabels.expired} / {statusLabels.expiring.toLowerCase()}
        </li>
        <li>
          <span className="legend-swatch row-low-stock" aria-hidden="true" />
          {statusLabels['low-stock']}
        </li>
      </ul>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Brand</th>
              <th scope="col">Expiry Date</th>
              <th scope="col" className="numeric">Quantity</th>
              <th scope="col" className="numeric">Price</th>
            </tr>
          </thead>
          <tbody>
            {medicines.map((medicine) => {
              const status = getMedicineStatus(medicine)
              return (
                <tr key={medicine.id} className={`row-${status}`}>
                  <td>
                    {medicine.fullName}
                    {status !== 'normal' && (
                      <span className={`badge badge-${status}`}>{statusLabels[status]}</span>
                    )}
                  </td>
                  <td>{medicine.brand}</td>
                  <td>{formatDate(medicine.expiryDate)}</td>
                  <td className="numeric">{medicine.quantity}</td>
                  <td className="numeric">{formatPrice(medicine.price)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}
