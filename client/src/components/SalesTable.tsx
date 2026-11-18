import type { Sale } from '../api/salesApi'
import { formatDateTime, formatPrice } from '../utils/formatters'

interface SalesTableProps {
  sales: Sale[]
}

export function SalesTable({ sales }: SalesTableProps) {
  if (sales.length === 0) {
    return <p className="empty">No sales recorded yet.</p>
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th scope="col">Date / time</th>
            <th scope="col">Medicine</th>
            <th scope="col" className="numeric">Quantity</th>
            <th scope="col" className="numeric">Unit price</th>
            <th scope="col" className="numeric">Total</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((sale) => (
            <tr key={sale.id}>
              <td>{formatDateTime(sale.soldAt)}</td>
              <td>{sale.medicineName}</td>
              <td className="numeric">{sale.quantity}</td>
              <td className="numeric">{formatPrice(sale.unitPrice)}</td>
              <td className="numeric">{formatPrice(sale.totalAmount)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
