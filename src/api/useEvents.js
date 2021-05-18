import useSWR from 'swr'
import buildError from '../utils/buildError'
import api from './api'
import { stringify } from 'querystring'

const useEvents = (activeGame, startDate, endDate) => {
  const fetcher = async (url) => {
    const qs = stringify({
      gameId: activeGame.id,
      startDate,
      endDate
    })

    const res = await api.get(`${url}?${qs}`)
    return res.data
  }

  const { data, error } = useSWR(
    activeGame && startDate && endDate ? ['/events', activeGame, startDate, endDate] : null,
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
