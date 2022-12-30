import useSWR from 'swr'
import buildError from '../utils/buildError'
import api from './api'
import { stringify } from 'querystring'

const usePlayerEvents = (activeGame, playerId, search, page) => {
  const fetcher = async ([url]) => {
    const qs = stringify({ search, page })

    const res = await api.get(`${url}?${qs}`)
    return res.data
  }

  const { data, error } = useSWR(
    [`/games/${activeGame.id}/players/${playerId}/events`, search, page],
    fetcher
  )

  return {
    events: data?.events ?? [],
    count: data?.count,
    loading: !data && !error,
    error: error && buildError(error),
    errorStatusCode: error && error.response?.status
  }
}

export default usePlayerEvents
