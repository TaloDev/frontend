import useSWR from 'swr'
import buildError from '../utils/buildError'
import { Game } from '../entities/game'
import makeValidatedGetRequest from './makeValidatedGetRequest'
import { z } from 'zod'
import { convertDateToUTC } from '../utils/convertDateToUTC'

export const playersChartPayloadSchema = z.object({
  date: z.number(),
  count: z.number(),
  change: z.number()
})

export function useNewPlayersChart(activeGame: Game, startDate: string, endDate: string) {
  const fetcher = async ([url]: [string]) => {
    const qs = new URLSearchParams({
      startDate: convertDateToUTC(startDate),
      endDate: convertDateToUTC(endDate)
    }).toString()

    const res = await makeValidatedGetRequest(`${url}?${qs}`, z.object({
      data: z.array(playersChartPayloadSchema)
    }))

    return res
  }

  const { data, error } = useSWR(
    activeGame && startDate && endDate ? [`/games/${activeGame.id}/charts/new-players`, startDate, endDate] : null,
    fetcher
  )

  return {
    players: data?.data ?? [],
    loading: !data && !error,
    error: error && buildError(error)
  }
}
