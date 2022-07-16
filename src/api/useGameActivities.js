import useSWR from 'swr'
import buildError from '../utils/buildError'
import api from './api'

export default function useGameActivities(activeGame) {
  const fetcher = async (url) => {
    const res = await api.get(url)
    return res.data
  }

  const { data, error } = useSWR(
    activeGame ? [`/games/${activeGame.id}/game-activities`] : null,
    fetcher
  )

  return {
    activities: data?.activities ?? [],
    loading: !data && !error,
    error: error && buildError(error)
  }
}
