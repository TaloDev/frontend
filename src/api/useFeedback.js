import useSWR from 'swr'
import buildError from '../utils/buildError'
import api from './api'
import { stringify } from 'querystring'

export default function useFeedback(activeGame, feedbackCategoryInternalName) {
  const fetcher = async ([url]) => {
    const qs = stringify({ feedbackCategoryInternalName })
    const res = await api.get(`${url}?${qs}`)
    return res.data
  }

  const { data, error } = useSWR(
    activeGame ? [`/games/${activeGame.id}/game-feedback`, feedbackCategoryInternalName] : null,
    fetcher
  )

  return {
    feedback: data?.feedback ?? [],
    loading: !data && !error,
    error: error && buildError(error)
  }
}
