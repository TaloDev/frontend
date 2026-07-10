export function parseLocalDate(dateString: string) {
  return new Date(`${dateString.split('T')[0]}T00:00:00`)
}

export function formatLocalDate(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
