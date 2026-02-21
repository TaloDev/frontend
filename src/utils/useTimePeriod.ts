import { format, sub, startOfWeek, startOfMonth, startOfYear, isToday, startOfDay } from 'date-fns'
import { useState, useEffect } from 'react'

export type TimePeriod = '1d' | '7d' | '30d' | 'w' | 'm' | 'y'

export default (timePeriod: TimePeriod | null) => {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  useEffect(() => {
    if (timePeriod) {
      const now = new Date()
      const isStartOfWeekToday = isToday(startOfWeek(now))

      switch (timePeriod) {
        case '1d':
          setStartDate(format(startOfDay(now), 'yyyy-MM-dd'))
          break
        case '7d':
          setStartDate(format(sub(now, { days: 7 }), 'yyyy-MM-dd'))
          break
        case '30d':
          setStartDate(format(sub(now, { days: 30 }), 'yyyy-MM-dd'))
          break
        case 'w':
          if (isStartOfWeekToday) {
            setStartDate(format(sub(now, { days: 7 }), 'yyyy-MM-dd'))
          } else {
            setStartDate(format(startOfWeek(now), 'yyyy-MM-dd'))
          }
          break
        case 'm':
          setStartDate(format(startOfMonth(now), 'yyyy-MM-dd'))
          break
        case 'y':
          setStartDate(format(startOfYear(now), 'yyyy-MM-dd'))
          break
      }

      setEndDate(format(now, 'yyyy-MM-dd'))
    } else {
      setStartDate('')
      setEndDate('')
    }
  }, [timePeriod])

  return {
    startDate,
    endDate,
  }
}
