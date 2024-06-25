import useSWR from 'swr'
import buildError from '../utils/buildError'
import { Game } from '../entities/game'
import makeValidatedGetRequest from './makeValidatedGetRequest'
import { z } from 'zod'
import { gameStatSchema } from '../entities/gameStat'

export default function useStats(activeGame: Game | null, includeDevData?: boolean) {
  const fetcher = async ([url]: [string]) => {
    const res = await makeValidatedGetRequest(url, z.object({
      stats: z.array(gameStatSchema)
    }))

    return res
  }

  const { data, error, mutate } = useSWR(
    activeGame ? [`/games/${activeGame.id}/game-stats`, includeDevData] : null,
    fetcher
  )

  return {
    stats: data?.stats ?? [],
    loading: !data && !error,
    error: error && buildError(error),
    mutate
  }
}
