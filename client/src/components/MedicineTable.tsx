import type { Medicine } from '../api/medicinesApi'
import { formatDate, formatPrice } from '../utils/formatters'

interface MedicineTableProps {
  medicines: Medicine[]
}

export function MedicineTable({ medicines }: MedicineTableProps) {
  if (medicines.length === 0) {
    return <p className="empty">No medicines found.</p>
  }

  return (
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
          {medicines.map((medicine) => (
            <tr key={medicine.id}>
              <td>{medicine.fullName}</td>
              <td>{medicine.brand}</td>
              <td>{formatDate(medicine.expiryDate)}</td>
              <td className="numeric">{medicine.quantity}</td>
              <td className="numeric">{formatPrice(medicine.price)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
