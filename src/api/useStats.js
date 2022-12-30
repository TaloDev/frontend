import useSWR from 'swr'
import buildError from '../utils/buildError'
import api from './api'

const useStats = (activeGame, includeDevData) => {
  const fetcher = async ([url]) => {
    const res = await api.get(url)
    return res.data
  }

  const { data, error, mutate } = useSWR(
    activeGame ? [`/games/${activeGame.id}/game-stats`, includeDevData] : null,
    fetcher
  )

  return {
    stats: data?.stats ?? [],
    loading: !data && !error,
    error: error && buildError(error),
    mutate
  }
}

export default useStats
