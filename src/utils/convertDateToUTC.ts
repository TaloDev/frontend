import { parseLocalDate } from './localDate'

export function convertDateToUTC(dateString: string, endOfDay = false): string {
  if (!dateString) return ''

  const date = parseLocalDate(dateString)

  const utcDate = endOfDay
    ? new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999)
    : date

  return utcDate.toISOString()
}
