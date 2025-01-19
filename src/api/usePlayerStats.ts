import useSWR from 'swr'
import buildError from '../utils/buildError'
import { Game } from '../entities/game'
import makeValidatedGetRequest from './makeValidatedGetRequest'
import { z } from 'zod'
import { playerGameStatSchema } from '../entities/playerGameStat'

const usePlayerStats = (activeGame: Game, playerId: string) => {
  const fetcher = async ([url]: [string]) => {
    const res = await makeValidatedGetRequest(url, z.object({
      stats: z.array(playerGameStatSchema)
    }))

    return res
  }

  const { data, error, mutate } = useSWR(
    [`/games/${activeGame.id}/players/${playerId}/stats`],
    fetcher
  )

  return {
    stats: data?.stats ?? [],
    loading: !data && !error,
    error: error && buildError(error),
    errorStatusCode: error && error.response?.status,
    mutate
  }
}

export default usePlayerStats
