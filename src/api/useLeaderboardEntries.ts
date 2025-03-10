import useSWR from 'swr'
import buildError from '../utils/buildError'
import { Game } from '../entities/game'
import makeValidatedGetRequest from './makeValidatedGetRequest'
import { z } from 'zod'
import { leaderboardEntrySchema } from '../entities/leaderboardEntry'

export default function useLeaderboardEntries(activeGame: Game, leaderboardId: number | undefined, page: number, withDeleted: boolean = false) {
  const fetcher = async ([url]: [string]) => {
    const params: Record<string, string> = { page: String(page) }
    if (withDeleted) params.withDeleted = '1'
    const qs = new URLSearchParams(params).toString()

    const res = await makeValidatedGetRequest(`${url}?${qs}`, z.object({
      entries: z.array(leaderboardEntrySchema),
      count: z.number(),
      itemsPerPage: z.number()
    }))

    return res
  }

  const { data, error, mutate } = useSWR(
    leaderboardId ? [`/games/${activeGame.id}/leaderboards/${leaderboardId}/entries`, page, withDeleted] : null,
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
