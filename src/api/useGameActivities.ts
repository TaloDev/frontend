import useSWR from 'swr'
import buildError from '../utils/buildError'
import { Game } from '../entities/game'
import makeValidatedGetRequest from './makeValidatedGetRequest'
import { z } from 'zod'
import { gameActivitySchema } from '../entities/gameActivity'

export default function useGameActivities(activeGame: Game, page: number) {
  const fetcher = async ([url, page]: [string, number]) => {
    const qs = new URLSearchParams({
      page: String(page)
    }).toString()

    const res = await makeValidatedGetRequest(`${url}?${qs}`, z.object({
      activities: z.array(gameActivitySchema),
      count: z.number(),
      itemsPerPage: z.number(),
      isLastPage: z.boolean()
    }))

    return res
  }

  const { data, error } = useSWR(
    [`/games/${activeGame.id}/game-activities`, page],
    fetcher
  )

  return {
    activities: data?.activities ?? [],
    count: data?.count,
    itemsPerPage: data?.itemsPerPage,
    isLastPage: data?.isLastPage,
    loading: !data && !error,
    error: error && buildError(error)
  }
}
