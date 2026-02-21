import useSWR from 'swr'
import { z } from 'zod'
import { Game } from '../entities/game'
import { playerSchema } from '../entities/player'
import buildError from '../utils/buildError'
import makeValidatedGetRequest from './makeValidatedGetRequest'

export default function useFindPlayer(activeGame: Game, playerId?: string) {
  const fetcher = async ([url]: [string, string]) => {
    const res = await makeValidatedGetRequest(
      url,
      z.object({
        player: playerSchema,
      }),
    )

    return res
  }

  const { data, error } = useSWR(
    playerId ? [`games/${activeGame.id}/players/${playerId}`] : null,
    fetcher,
  )

  return {
    player: data?.player,
    loading: !data && !error,
    error: error && buildError(error),
  }
}
