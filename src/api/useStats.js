import useSWR from 'swr'
import buildError from '../utils/buildError'
import api from './api'
import { stringify } from 'querystring'

const useStats = (activeGame, includeDevData) => {
  const fetcher = async (url) => {
    const qs = stringify({ gameId: activeGame.id })

    const res = await api.get(`${url}?${qs}`)
    return res.data
  }

  const { data, error, mutate } = useSWR(
    ['game-stats', activeGame, includeDevData],
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
