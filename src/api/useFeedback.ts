import useSWR from 'swr'
import buildError from '../utils/buildError'
import { Game } from '../entities/game'
import makeValidatedGetRequest from './makeValidatedGetRequest'
import { gameFeedbackSchema } from '../entities/gameFeedback'
import { z } from 'zod'

export default function useFeedback(activeGame: Game, feedbackCategoryInternalName: string | null, search: string, page: number) {
  const fetcher = async ([url]: [string]) => {
    const params = new URLSearchParams({ page: String(page), search })
    if (feedbackCategoryInternalName) {
      params.append('feedbackCategoryInternalName', feedbackCategoryInternalName)
    }

    const res = await makeValidatedGetRequest(`${url}?${params.toString()}`, z.object({
      feedback: z.array(gameFeedbackSchema),
      count: z.number(),
      itemsPerPage: z.number()
    }))

    return res
  }

  const { data, error } = useSWR(
    [`/games/${activeGame.id}/game-feedback`, feedbackCategoryInternalName, search, page],
    fetcher
  )

  return {
    feedback: data?.feedback ?? [],
    count: data?.count,
    itemsPerPage: data?.itemsPerPage,
    loading: !data && !error,
    error: error && buildError(error)
  }
}
