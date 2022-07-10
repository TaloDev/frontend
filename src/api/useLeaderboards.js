import useSWR from 'swr'
import buildError from '../utils/buildError'
import api from './api'

const useLeaderboards = (activeGame) => {
  const fetcher = async (url) => {
    const res = await api.get(url)
    return res.data
  }

  const { data, error, mutate } = useSWR(
    [`/games/${activeGame.id}/leaderboards`],
    fetcher
  )

  return {
    leaderboards: data?.leaderboards ?? [],
    loading: !data && !error,
    error: error && buildError(error),
    mutate
  }
}

export default useLeaderboards
