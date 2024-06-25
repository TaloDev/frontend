import { useState, useEffect } from 'react'
import { format, sub, startOfWeek, startOfMonth, startOfYear, isToday } from 'date-fns'

export type TimePeriod = '7d' | '30d' | 'w' | 'm' | 'y'

export default (timePeriod: TimePeriod | null) => {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  useEffect(() => {
    if (timePeriod) {
      const isStartOfWeekToday = isToday(startOfWeek(new Date()))

      switch (timePeriod) {
        case '7d':
          setStartDate(format(sub(new Date(), { days: 7 }), 'yyyy-MM-dd'))
          break
        case '30d':
          setStartDate(format(sub(new Date(), { days: 30 }), 'yyyy-MM-dd'))
          break
        case 'w':
          if (isStartOfWeekToday) {
            setStartDate(format(sub(new Date(), { days: 7 }), 'yyyy-MM-dd'))
          } else {
            setStartDate(format(startOfWeek(new Date()), 'yyyy-MM-dd'))
          }
          break
        case 'm':
          setStartDate(format(startOfMonth(new Date()), 'yyyy-MM-dd'))
          break
        case 'y':
          setStartDate(format(startOfYear(new Date()), 'yyyy-MM-dd'))
          break
      }

      setEndDate(format(new Date(), 'yyyy-MM-dd'))
    } else {
      setStartDate('')
      setEndDate('')
    }
  }, [timePeriod])

  return {
    startDate,
    endDate
  }
}
