import useSWR from 'swr'
import buildError from '../utils/buildError'
import { Game } from '../entities/game'
import makeValidatedGetRequest from './makeValidatedGetRequest'
import { z } from 'zod'
import { gameStatSchema } from '../entities/gameStat'
import { convertDateToUTC } from '../utils/convertDateToUTC'

export default function useStats(
  activeGame: Game | null,
  includeDevData?: boolean,
  metricsStartDate: string = '',
  metricsEndDate: string = ''
) {
  const fetcher = async ([url]: [string]) => {
    const qs = new URLSearchParams({
      withMetrics: (metricsStartDate || metricsEndDate) ? '1' : '0',
      metricsStartDate: convertDateToUTC(metricsStartDate),
      metricsEndDate: convertDateToUTC(metricsEndDate)
    }).toString()

    const res = await makeValidatedGetRequest(`${url}?${qs}`, z.object({
      stats: z.array(gameStatSchema)
    }))

    return res
  }

  const { data, error, mutate } = useSWR(
    activeGame ? [`/games/${activeGame.id}/game-stats`, includeDevData, metricsStartDate, metricsEndDate] : null,
    fetcher
  )

  return {
    stats: data?.stats ?? [],
    loading: !data && !error,
    error: error && buildError(error),
    mutate
  }
}
