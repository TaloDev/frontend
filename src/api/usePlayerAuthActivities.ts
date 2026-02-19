import useSWR from 'swr'
import buildError from '../utils/buildError'
import { Game } from '../entities/game'
import makeValidatedGetRequest from './makeValidatedGetRequest'
import { z } from 'zod'
import { playerAuthActivitySchema } from '../entities/playerAuthActivity'
import canPerformAction, { PermissionBasedAction } from '../utils/canPerformAction'
import { AuthedUser } from '../state/userState'

export default function usePlayerAuthActivities(activeGame: Game, user: AuthedUser, playerId: string | undefined, page: number) {
  const fetcher = async ([url, page]: [string, number]) => {
    const qs = new URLSearchParams({
      page: String(page)
    }).toString()

    const res = await makeValidatedGetRequest(`${url}?${qs}`, z.object({
      activities: z.array(playerAuthActivitySchema),
      count: z.number(),
      itemsPerPage: z.number(),
      isLastPage: z.boolean()
    }))

    return res
  }

  const { data, error } = useSWR(
    canPerformAction(user, PermissionBasedAction.VIEW_PLAYER_AUTH_ACTIVITIES) && playerId
      ? [`/games/${activeGame.id}/players/${playerId}/auth-activities`, page]
      : null,
    fetcher
  )

  return {
    activities: data?.activities ?? [],
    count: data?.count,
    itemsPerPage: data?.itemsPerPage,
    isLastPage: data?.isLastPage,
    loading: !data && !error,
    error: error && buildError(error)
  }
}
