import useSWR from 'swr'
import buildError from '../utils/buildError'
import api from './api'
import { stringify } from 'querystring'
import { format, isValid } from 'date-fns'

const useEvents = (activeGame, startDate, endDate) => {
  const fetcher = async (url) => {
    if (!isValid(startDate)) throw new Error('Invalid start date')
    if (!isValid(endDate)) throw new Error('Invalid end date')

    const qs = stringify({
      gameId: activeGame.id,
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd')
    })

    const res = await api.get(`${url}?${qs}`)
    return res.data
  }

  const { data, error } = useSWR(
    activeGame ? ['/events', activeGame, startDate, endDate] : null,
    fetcher
  )

  return {
    events: data?.events ?? {},
    eventNames: data?.eventNames ?? [],
    loading: !data && !error,
    error: error && buildError(error)
  }
}

export default useEvents
