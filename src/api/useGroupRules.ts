import useSWR from 'swr'
import buildError from '../utils/buildError'
import { Game } from '../entities/game'
import makeValidatedGetRequest from './makeValidatedGetRequest'
import { z } from 'zod'
import { availablePlayerGroupFieldSchema, playerGroupRuleOptionSchema } from '../entities/playerGroup'

export default function useGroupRules(activeGame: Game) {
  const fetcher = async ([url]: [string]) => {
    const res = await makeValidatedGetRequest(url, z.object({
      availableRules: z.array(playerGroupRuleOptionSchema),
      availableFields: z.array(availablePlayerGroupFieldSchema)
    }))

    return res
  }

  const { data, error } = useSWR(
    [`games/${activeGame.id}/player-groups/rules`],
    fetcher
  )

  return {
    availableRules: data?.availableRules ?? [],
    availableFields: data?.availableFields ?? [],
    loading: !data && !error,
    error: error && buildError(error)
  }
}
