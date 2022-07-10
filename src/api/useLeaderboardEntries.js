import useSWR from 'swr'
import buildError from '../utils/buildError'
import api from './api'
import { stringify } from 'querystring'

const useLeaderboardEntries = (gameId, leaderboardId, page) => {
  const fetcher = async (url) => {
    const qs = stringify({ page })

    const res = await api.get(`${url}?${qs}`)
    return res.data
  }

  const { data, error, mutate } = useSWR(
    [`/games/${gameId}/leaderboards/${leaderboardId}/entries`, page],
    fetcher
  )

  return {
    entries: data?.entries ?? [],
    count: data?.count,
    loading: !data && !error,
    error: error && buildError(error),
    mutate
  }
}

export default useLeaderboardEntries
