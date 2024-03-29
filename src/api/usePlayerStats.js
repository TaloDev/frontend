import useSWR from 'swr'
import buildError from '../utils/buildError'
import api from './api'

const usePlayerStats = (activeGame, playerId) => {
  const fetcher = async (url) => {
    const res = await api.get(url)
    return res.data
  }

  const { data, error } = useSWR(
    `/games/${activeGame.id}/players/${playerId}/stats`,
    fetcher
  )

  return {
    stats: data?.stats ?? [],
    loading: !data && !error,
    error: error && buildError(error),
    errorStatusCode: error && error.response?.status
  }
}

export default usePlayerStats
