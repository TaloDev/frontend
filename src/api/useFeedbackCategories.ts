import useSWR from 'swr'
import { z } from 'zod'
import { Game } from '../entities/game'
import { gameFeedbackCategorySchema } from '../entities/gameFeedbackCategory'
import buildError from '../utils/buildError'
import makeValidatedGetRequest from './makeValidatedGetRequest'

export default function useFeedbackCategories(activeGame: Game) {
  const fetcher = async ([url]: [string]) => {
    const res = await makeValidatedGetRequest(
      url,
      z.object({
        feedbackCategories: z.array(gameFeedbackCategorySchema),
      }),
    )

    return res
  }

  const { data, error, mutate } = useSWR(
    [`/games/${activeGame.id}/game-feedback/categories`],
    fetcher,
  )

  return {
    feedbackCategories: data?.feedbackCategories ?? [],
    loading: !data && !error,
    error: error && buildError(error),
    mutate,
  }
}
