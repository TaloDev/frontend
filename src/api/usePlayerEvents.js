import useSWR from 'swr'
import buildError from '../utils/buildError'
import api from './api'

const usePlayerEvents = (playerId) => {
  const fetcher = async (url) => {
    const res = await api.get(url)
    return res.data.events
  }

  const { data, error } = useSWR(
    playerId ? `players/${playerId}/events` : null,
    fetcher
  )

  return {
    events: data ?? [],
    loading: !data && !error,
    error: error && buildError(error),
    errorStatusCode: error && error.response?.status
  }
}

export default usePlayerEvents
