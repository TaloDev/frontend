import useSWR from 'swr'
import buildError from '../utils/buildError'
import { Game } from '../entities/game'
import makeValidatedGetRequest from './makeValidatedGetRequest'
import { z } from 'zod'
import { playerAuthActivitySchema } from '../entities/playerAuthActivity'
import canPerformAction, { PermissionBasedAction } from '../utils/canPerformAction'
import { AuthedUser } from '../state/userState'

export default function usePlayerAuthActivities(activeGame: Game, user: AuthedUser, playerId?: string) {
  const fetcher = async ([url]: [string]) => {
    const res = await makeValidatedGetRequest(url, z.object({
      activities: z.array(playerAuthActivitySchema)
    }))

    return res
  }

  const { data, error } = useSWR(
    canPerformAction(user, PermissionBasedAction.VIEW_PLAYER_AUTH_ACTIVITIES) && playerId
      ? [`/games/${activeGame.id}/players/${playerId}/auth-activities`]
      : null,
    fetcher
  )

  return {
    activities: data?.activities ?? [],
    loading: !data && !error,
    error: error && buildError(error)
  }
}
