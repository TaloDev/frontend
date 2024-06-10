import useSWR from 'swr'
import buildError from '../utils/buildError'
import api from './api'

export default function useFeedbackCategories(activeGame) {
  const fetcher = async ([url]) => {
    const res = await api.get(url)
    return res.data
  }

  const { data, error, mutate } = useSWR(
    activeGame ? [`/games/${activeGame.id}/game-feedback/categories`] : null,
    fetcher
  )

  return {
    feedbackCategories: data?.feedbackCategories ?? [],
    loading: !data && !error,
    error: error && buildError(error),
    mutate
  }
}
