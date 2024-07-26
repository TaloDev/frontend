import useSWR from 'swr'
import buildError from '../utils/buildError'
import { Game } from '../entities/game'
import makeValidatedGetRequest from './makeValidatedGetRequest'
import { z } from 'zod'
import { playerAuthActivitySchema } from '../entities/playerAuthActivity'

export default function usePlayerAuthActivities(activeGame: Game, playerId: string) {
  const fetcher = async ([url]: [string]) => {
    const res = await makeValidatedGetRequest(url, z.object({
      activities: z.array(playerAuthActivitySchema)
    }))

    return res
  }

  const { data, error } = useSWR(
    [`/games/${activeGame.id}/players/${playerId}/auth-activities`],
    fetcher
  )

  return {
    activities: data?.activities ?? [],
    loading: !data && !error,
    error: error && buildError(error)
  }
}
