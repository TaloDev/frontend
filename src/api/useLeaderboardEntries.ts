import useSWR from 'swr'
import { z } from 'zod'
import { Game } from '../entities/game'
import { leaderboardEntrySchema } from '../entities/leaderboardEntry'
import buildError from '../utils/buildError'
import { convertDateToUTC } from '../utils/convertDateToUTC'
import makeValidatedGetRequest from './makeValidatedGetRequest'

export default function useLeaderboardEntries({
  activeGame,
  leaderboardId,
  page,
  withDeleted = false,
  startDate,
  endDate,
}: {
  activeGame: Game
  leaderboardId: number | undefined
  page: number
  withDeleted: boolean
  startDate: string
  endDate: string
}) {
  const fetcher = async ([url]: [string]) => {
    const params: Record<string, string> = { page: String(page) }
    if (withDeleted) params.withDeleted = '1'
    params.startDate = convertDateToUTC(startDate)
    params.endDate = convertDateToUTC(endDate)
    const qs = new URLSearchParams(params).toString()

    const res = await makeValidatedGetRequest(
      `${url}?${qs}`,
      z.object({
        entries: z.array(leaderboardEntrySchema),
        count: z.number(),
        itemsPerPage: z.number(),
      }),
    )

    return res
  }

  const { data, error, mutate } = useSWR(
    leaderboardId
      ? [
          `/games/${activeGame.id}/leaderboards/${leaderboardId}/entries`,
          page,
          withDeleted,
          startDate,
          endDate,
        ]
      : null,
    fetcher,
  )

  return {
    entries: data?.entries ?? [],
    count: data?.count,
    itemsPerPage: data?.itemsPerPage,
    loading: !data && !error,
    error: error && buildError(error),
    mutate,
  }
}
