import useSWR from 'swr'
import buildError from '../utils/buildError'
import { Game } from '../entities/game'
import makeValidatedGetRequest from './makeValidatedGetRequest'
import { z } from 'zod'
import { leaderboardEntrySchema } from '../entities/leaderboardEntry'

export default function useLeaderboardEntries(activeGame: Game, leaderboardId: number | undefined, page: number) {
  const fetcher = async ([url]: [string]) => {
    const qs = new URLSearchParams({ page: String(page) }).toString()

    const res = await makeValidatedGetRequest(`${url}?${qs}`, z.object({
      entries: z.array(leaderboardEntrySchema),
      count: z.number(),
      itemsPerPage: z.number()
    }))

    return res
  }

  const { data, error, mutate } = useSWR(
    leaderboardId ? [`/games/${activeGame.id}/leaderboards/${leaderboardId}/entries`, page] : null,
    fetcher
  )

  return {
    entries: data?.entries ?? [],
    count: data?.count,
    itemsPerPage: data?.itemsPerPage,
    loading: !data && !error,
    error: error && buildError(error),
    mutate
  }
}
