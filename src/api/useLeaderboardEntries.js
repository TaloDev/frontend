import useSWR from 'swr'
import buildError from '../utils/buildError'
import api from './api'
import { stringify } from 'querystring'

const useLeaderboardEntries = (activeGame, internalName, page) => {
  const fetcher = async (url) => {
    const qs = stringify({ gameId: activeGame.id, page })

    const res = await api.get(`${url}?${qs}`)
    return res.data
  }

  const { data, error, mutate } = useSWR(
    [`leaderboards/${internalName}/entries`, activeGame, page],
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
