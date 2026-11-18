const currencyFormat = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' })

const dateFormat = new Intl.DateTimeFormat('en-IN', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

export function formatPrice(value: number) {
  return currencyFormat.format(value)
}

export function formatDate(isoDate: string) {
  const [year, month, day] = isoDate.split('-').map(Number)
  return dateFormat.format(new Date(year, month - 1, day))
}
