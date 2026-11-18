const currencyFormat = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' })

const dateFormat = new Intl.DateTimeFormat('en-IN', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

const dateTimeFormat = new Intl.DateTimeFormat('en-IN', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

export function formatDateTime(isoDateTime: string) {
  return dateTimeFormat.format(new Date(isoDateTime))
}

export function formatPrice(value: number) {
  return currencyFormat.format(value)
}

export function formatDate(isoDate: string) {
  const [year, month, day] = isoDate.split('-').map(Number)
  return dateFormat.format(new Date(year, month - 1, day))
}
