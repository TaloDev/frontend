import useSWR from 'swr'
import buildError from '../utils/buildError'
import { Game } from '../entities/game'
import makeValidatedGetRequest from './makeValidatedGetRequest'
import { playerGroupSchema } from '../entities/playerGroup'
import { z } from 'zod'

export default function useGroups(activeGame: Game) {
  const fetcher = async ([url]: [string]) => {
    const res = await makeValidatedGetRequest(url, z.object({
      groups: z.array(playerGroupSchema)
    }))

    return res
  }

  const { data, error, mutate } = useSWR(
    [`games/${activeGame.id}/player-groups`],
    fetcher
  )

  return {
    groups: data?.groups ?? [],
    loading: !data && !error,
    error: error && buildError(error),
    mutate
  }
}
