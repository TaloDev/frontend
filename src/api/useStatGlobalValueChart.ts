import useSWR from 'swr'
import { z } from 'zod'
import { Game } from '../entities/game'
import buildError from '../utils/buildError'
import { convertDateToUTC } from '../utils/convertDateToUTC'
import makeValidatedGetRequest from './makeValidatedGetRequest'

export const statGlobalValueChartSchema = z.object({
  date: z.number(),
  value: z.number(),
  change: z.number(),
})

export function useStatGlobalValueChart(
  activeGame: Game,
  internalName: string,
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
        data: z.array(statGlobalValueChartSchema),
      }),
    )

    return res
  }

  const { data, error } = useSWR(
    activeGame && internalName && startDate && endDate
      ? [`/games/${activeGame.id}/charts/global-stats/${internalName}`, startDate, endDate]
      : null,
    fetcher,
  )

  return {
    dataPoints: data?.data ?? [],
    loading: !data && !error,
    error: error && buildError(error),
  }
}
