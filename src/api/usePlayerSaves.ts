import useSWR from 'swr'
import buildError from '../utils/buildError'
import { Game } from '../entities/game'
import makeValidatedGetRequest from './makeValidatedGetRequest'
import { gameSaveSchema } from '../entities/gameSave'
import { z } from 'zod'

export default function usePlayerSaves(activeGame: Game, playerId: string) {
  const fetcher = async ([url]: [string]) => {
    const res = await makeValidatedGetRequest(url, z.object({
      saves: z.array(gameSaveSchema)
    }))

    return res
  }

  const { data, error } = useSWR(
    [`/games/${activeGame.id}/players/${playerId}/saves`],
    fetcher
  )

  return {
    saves: data?.saves ?? [],
    loading: !data && !error,
    error: error && buildError(error),
    errorStatusCode: error && error.response?.status
  }
}
