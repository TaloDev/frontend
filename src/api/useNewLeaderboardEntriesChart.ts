import useSWR from 'swr'
import { z } from 'zod'
import { Game } from '../entities/game'
import buildError from '../utils/buildError'
import { convertDateToUTC } from '../utils/convertDateToUTC'
import makeValidatedGetRequest from './makeValidatedGetRequest'

export const newLeaderboardEntriesChartSchema = z.object({
  date: z.number(),
  leaderboards: z.record(z.number()),
  change: z.record(z.number()),
})

export function useNewLeaderboardEntriesChart(
  activeGame: Game,
  startDate: string,
  endDate: string,
) {
  const fetcher = async ([url]: [string]) => {
    const qs = new URLSearchParams({
      startDate: convertDateToUTC(startDate),
      endDate: convertDateToUTC(endDate, true),
    }).toString()

    const res = await makeValidatedGetRequest(
      `${url}?${qs}`,
      z.object({
        data: z.array(newLeaderboardEntriesChartSchema),
        leaderboardNames: z.array(z.string()),
      }),
    )

    return res
  }

  const { data, error } = useSWR(
    activeGame && startDate && endDate
      ? [`/games/${activeGame.id}/charts/new-leaderboard-entries`, startDate, endDate]
      : null,
    fetcher,
  )

  return {
    leaderboards: data?.data ?? [],
    leaderboardNames: data?.leaderboardNames ?? [],
    loading: !data && !error,
    error: error && buildError(error),
  }
}
