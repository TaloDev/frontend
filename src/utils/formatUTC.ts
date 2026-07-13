import { format } from 'date-fns'

export function formatUTC(date: Date | number | string, formatStr: string) {
  const d = new Date(date)
  return format(d.getTime() + d.getTimezoneOffset() * 60000, formatStr)
}
