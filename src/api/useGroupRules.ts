import useSWR from 'swr'
import { z } from 'zod'
import { Game } from '../entities/game'
import {
  availablePlayerGroupFieldSchema,
  playerGroupRuleOptionSchema,
} from '../entities/playerGroup'
import buildError from '../utils/buildError'
import makeValidatedGetRequest from './makeValidatedGetRequest'

export default function useGroupRules(activeGame: Game) {
  const fetcher = async ([url]: [string]) => {
    const res = await makeValidatedGetRequest(
      url,
      z.object({
        availableRules: z.array(playerGroupRuleOptionSchema),
        availableFields: z.array(availablePlayerGroupFieldSchema),
      }),
    )

    return res
  }

  const { data, error } = useSWR([`games/${activeGame.id}/player-groups/rules`], fetcher)

  return {
    availableRules: data?.availableRules ?? [],
    availableFields: data?.availableFields ?? [],
    loading: !data && !error,
    error: error && buildError(error),
  }
}
