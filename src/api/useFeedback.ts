import useSWR from 'swr'
import buildError from '../utils/buildError'
import { stringify } from 'querystring'
import { Game } from '../entities/game'
import makeValidatedGetRequest from './makeValidatedGetRequest'
import { gameFeedbackSchema } from '../entities/gameFeedback'
import { z } from 'zod'

export default function useFeedback(activeGame: Game, feedbackCategoryInternalName: string | null) {
  const fetcher = async ([url]: [string]) => {
    const qs = stringify({ feedbackCategoryInternalName })

    const res = await makeValidatedGetRequest(`${url}?${qs}`, z.object({
      feedback: z.array(gameFeedbackSchema)
    }))

    return res
  }

  const { data, error } = useSWR(
    [`/games/${activeGame.id}/game-feedback`, feedbackCategoryInternalName],
    fetcher
  )

  return {
    feedback: data?.feedback ?? [],
    loading: !data && !error,
    error: error && buildError(error)
  }
}
