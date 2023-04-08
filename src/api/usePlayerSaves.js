import useSWR from 'swr'
import buildError from '../utils/buildError'
import api from './api'

const usePlayerEvents = (activeGame, playerId) => {
  const fetcher = async (url) => {
    const res = await api.get(url)
    return res.data
  }

  const { data, error } = useSWR(
    `/games/${activeGame.id}/players/${playerId}/saves`,
    fetcher
  )

  return {
    saves: data?.saves ?? [],
    loading: !data && !error,
    error: error && buildError(error),
    errorStatusCode: error && error.response?.status
  }
}

export default usePlayerEvents
