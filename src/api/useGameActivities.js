import useSWR from 'swr'
import buildError from '../utils/buildError'
import api from './api'
import { stringify } from 'querystring'

export default function useGameActivities(activeGame) {
  const fetcher = async (url) => {
    const qs = stringify({
      gameId: activeGame.id
    })

    const res = await api.get(`${url}?${qs}`)
    return res.data
  }

  const { data, error } = useSWR(
    activeGame ? ['/game-activities', activeGame] : null,
    fetcher
  )

  return {
    activities: data?.activities ?? [],
    loading: !data && !error,
    error: error && buildError(error)
  }
}
