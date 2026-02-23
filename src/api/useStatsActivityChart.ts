import useSWR from 'swr'
import { z } from 'zod'
import { Game } from '../entities/game'
import buildError from '../utils/buildError'
import { convertDateToUTC } from '../utils/convertDateToUTC'
import makeValidatedGetRequest from './makeValidatedGetRequest'

export const statsActivityChartSchema = z.object({
  date: z.number(),
  stats: z.record(z.number()),
  change: z.record(z.number()),
})

export function useStatsActivityChart(activeGame: Game, startDate: string, endDate: string) {
  const fetcher = async ([url]: [string]) => {
    const qs = new URLSearchParams({
      startDate: convertDateToUTC(startDate),
      endDate: convertDateToUTC(endDate, true),
    }).toString()

    const res = await makeValidatedGetRequest(
      `${url}?${qs}`,
      z.object({
        data: z.array(statsActivityChartSchema),
        statNames: z.array(z.string()),
      }),
    )

    return res
  }

  const { data, error } = useSWR(
    activeGame && startDate && endDate
      ? [`/games/${activeGame.id}/charts/stats-activity`, startDate, endDate]
      : null,
    fetcher,
  )

  return {
    stats: data?.data ?? [],
    statNames: data?.statNames ?? [],
    loading: !data && !error,
    error: error && buildError(error),
  }
}
