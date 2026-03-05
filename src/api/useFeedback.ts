import useSWR from 'swr'
import { z } from 'zod'
import { Game } from '../entities/game'
import { gameFeedbackSchema } from '../entities/gameFeedback'
import buildError from '../utils/buildError'
import makeValidatedGetRequest from './makeValidatedGetRequest'

export default function useFeedback(
  activeGame: Game,
  feedbackCategoryInternalName: string | null,
  search: string,
  page: number,
  withDeleted: boolean,
) {
  const fetcher = async ([url]: [string]) => {
    const params = new URLSearchParams({ page: String(page), search })
    if (feedbackCategoryInternalName) {
      params.append('feedbackCategoryInternalName', feedbackCategoryInternalName)
    }
    if (withDeleted) {
      params.append('withDeleted', '1')
    }

    const res = await makeValidatedGetRequest(
      `${url}?${params.toString()}`,
      z.object({
        feedback: z.array(gameFeedbackSchema),
        count: z.number(),
        itemsPerPage: z.number(),
      }),
    )

    return res
  }

  const { data, error, mutate } = useSWR(
    [
      `/games/${activeGame.id}/game-feedback`,
      feedbackCategoryInternalName,
      search,
      page,
      withDeleted,
    ],
    fetcher,
  )

  return {
    feedback: data?.feedback ?? [],
    count: data?.count,
    itemsPerPage: data?.itemsPerPage,
    loading: !data && !error,
    error: error && buildError(error),
    mutate,
  }
}
