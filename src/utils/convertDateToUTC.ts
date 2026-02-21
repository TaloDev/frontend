export function convertDateToUTC(dateString: string, endOfDay = false): string {
  if (!dateString) return ''

  // parse the date string as a local date
  const [year, month, day] = dateString.split('T')[0].split('-').map(Number)

  // create a local date at start or end of day, then convert to UTC
  const localDate = endOfDay
    ? new Date(year, month - 1, day, 23, 59, 59, 999)
    : new Date(year, month - 1, day, 0, 0, 0, 0)

  return localDate.toISOString()
}
