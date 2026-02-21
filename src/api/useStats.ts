import useSWR from 'swr'
import { z } from 'zod'
import { Game } from '../entities/game'
import { gameStatSchema } from '../entities/gameStat'
import buildError from '../utils/buildError'
import { convertDateToUTC } from '../utils/convertDateToUTC'
import makeValidatedGetRequest from './makeValidatedGetRequest'

export default function useStats(
  activeGame: Game | null,
  includeDevData?: boolean,
  metricsStartDate: string = '',
  metricsEndDate: string = '',
) {
  const fetcher = async ([url]: [string]) => {
    const qs = new URLSearchParams({
      withMetrics: metricsStartDate || metricsEndDate ? '1' : '0',
      // the backend prefers the dashboard to send yyyy-mm-dd dates for metrics
      // so that the start date and end date can be set consistently
      metricsStartDate: convertDateToUTC(metricsStartDate).split('T')[0],
      metricsEndDate: convertDateToUTC(metricsEndDate).split('T')[0],
    }).toString()

    const res = await makeValidatedGetRequest(
      `${url}?${qs}`,
      z.object({
        stats: z.array(gameStatSchema),
      }),
    )

    return res
  }

  const { data, error, mutate } = useSWR(
    activeGame
      ? [`/games/${activeGame.id}/game-stats`, includeDevData, metricsStartDate, metricsEndDate]
      : null,
    fetcher,
  )

  return {
    stats: data?.stats ?? [],
    loading: !data && !error,
    error: error && buildError(error),
    mutate,
  }
}
