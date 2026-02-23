import useSWR from 'swr'
import { z } from 'zod'
import { Game } from '../entities/game'
import { gameSaveSchema } from '../entities/gameSave'
import buildError from '../utils/buildError'
import makeValidatedGetRequest from './makeValidatedGetRequest'

export function usePlayerSaves(activeGame: Game, playerId: string) {
  const fetcher = async ([url]: [string]) => {
    const res = await makeValidatedGetRequest(
      url,
      z.object({
        saves: z.array(gameSaveSchema),
      }),
    )

    return res
  }

  const { data, error } = useSWR([`/games/${activeGame.id}/players/${playerId}/saves`], fetcher)

  return {
    saves: data?.saves ?? [],
    loading: !data && !error,
    error: error && buildError(error),
    errorStatusCode: error && error.response?.status,
  }
}
