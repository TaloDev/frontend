export function convertDateToUTC(dateString: string): string {
  if (!dateString) return ''

  // parse the date string as a local date
  const [year, month, day] = dateString.split('T')[0].split('-').map(Number)

  // UTC midnight
  const utcDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0))

  return utcDate.toISOString()
}
