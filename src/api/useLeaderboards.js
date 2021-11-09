import useSWR from 'swr'
import buildError from '../utils/buildError'
import api from './api'
import { stringify } from 'querystring'

const useLeaderboards = (activeGame) => {
  const fetcher = async (url) => {
    const qs = stringify({ gameId: activeGame.id })

    const res = await api.get(`${url}?${qs}`)
    return res.data
  }

  const { data, error } = useSWR(
    ['leaderboards', activeGame],
    fetcher
  )

  return {
    leaderboards: data?.leaderboards ?? [],
    loading: !data && !error,
    error: error && buildError(error)
  }
}

export default useLeaderboards
