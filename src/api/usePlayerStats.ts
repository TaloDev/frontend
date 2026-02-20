import useSWR from 'swr'
import { z } from 'zod'
import { Game } from '../entities/game'
import { playerGameStatSchema } from '../entities/playerGameStat'
import buildError from '../utils/buildError'
import makeValidatedGetRequest from './makeValidatedGetRequest'

const usePlayerStats = (activeGame: Game, playerId: string) => {
  const fetcher = async ([url]: [string]) => {
    const res = await makeValidatedGetRequest(
      url,
      z.object({
        stats: z.array(playerGameStatSchema),
      }),
    )

    return res
  }

  const { data, error, mutate } = useSWR(
    [`/games/${activeGame.id}/players/${playerId}/stats`],
    fetcher,
  )

  return {
    stats: data?.stats ?? [],
    loading: !data && !error,
    error: error && buildError(error),
    errorStatusCode: error && error.response?.status,
    mutate,
  }
}

export default usePlayerStats
