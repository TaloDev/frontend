import useSWR from 'swr'
import buildError from '../utils/buildError'
import { Game } from '../entities/game'
import { z } from 'zod'
import { playerSchema } from '../entities/player'
import makeValidatedGetRequest from './makeValidatedGetRequest'

export default function useFindPlayer(activeGame: Game, playerId?: string) {
  const fetcher = async ([url]: [string, string]) => {
    const res = await makeValidatedGetRequest(url, z.object({
      player: playerSchema
    }))

    return res
  }

  const { data, error } = useSWR(
    playerId ? [`games/${activeGame.id}/players/${playerId}`] : null,
    fetcher
  )

  return {
    player: data?.player,
    loading: !data && !error,
    error: error && buildError(error)
  }
}
