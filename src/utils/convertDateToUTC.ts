export function convertDateToUTC(dateString: string, endOfDay = false): string {
  if (!dateString) return ''

  const [year, month, day] = dateString.split('T')[0].split('-').map(Number)

  const utcDate = endOfDay
    ? new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999))
    : new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0))

  return utcDate.toISOString()
}
