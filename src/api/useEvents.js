import useSWR from 'swr'
import buildError from '../utils/buildError'
import api from './api'

const useEvents = (activeGame) => {
  const fetcher = async (url) => {
    const res = await api.get(`${url}?gameId=${activeGame.id}`)
    return res.data
  }

  const { data, error } = useSWR(
    activeGame ? ['/events', activeGame] : null,
    fetcher
  )

  return {
    events: data?.events,
    eventNames: data?.eventNames ?? [],
    loading: !data && !error,
    error: error && buildError(error)
  }
}

export default useEvents
