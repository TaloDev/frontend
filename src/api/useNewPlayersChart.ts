import useSWR from 'swr'
import { z } from 'zod'
import { Game } from '../entities/game'
import buildError from '../utils/buildError'
import { convertDateToUTC } from '../utils/convertDateToUTC'
import makeValidatedGetRequest from './makeValidatedGetRequest'

export const playersChartPayloadSchema = z.object({
  date: z.number(),
  count: z.number(),
  change: z.number(),
})

export function useNewPlayersChart(activeGame: Game, startDate: string, endDate: string) {
  const fetcher = async ([url]: [string]) => {
    const qs = new URLSearchParams({
      startDate: convertDateToUTC(startDate),
      endDate: convertDateToUTC(endDate, true),
    }).toString()

    const res = await makeValidatedGetRequest(
      `${url}?${qs}`,
      z.object({
        data: z.array(playersChartPayloadSchema),
      }),
    )

    return res
  }

  const { data, error } = useSWR(
    activeGame && startDate && endDate
      ? [`/games/${activeGame.id}/charts/new-players`, startDate, endDate]
      : null,
    fetcher,
  )

  return {
    players: data?.data ?? [],
    loading: !data && !error,
    error: error && buildError(error),
  }
}
