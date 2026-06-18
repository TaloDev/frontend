import useSWR from 'swr'
import { z } from 'zod'
import { Game } from '../entities/game'
import buildError from '../utils/buildError'
import makeValidatedGetRequest from './makeValidatedGetRequest'

export default function useGameSettings(activeGame: Game) {
  const fetcher = async ([url]: [string]) => {
    const res = await makeValidatedGetRequest(
      url,
      z.object({
        settings: z.object({
          purgeDevPlayers: z.boolean(),
          purgeLivePlayers: z.boolean(),
          purgeDevPlayersRetention: z.number(),
          purgeLivePlayersRetention: z.number(),
          blockAliasIdentifierProfanity: z.boolean(),
          blockPropsProfanity: z.boolean(),
          verifyRequests: z.boolean(),
          displayNamePropKey: z.string().nullable(),
          website: z.string().nullable(),
          logoUrl: z.string().nullable(),
          gameToken: z.string(),
        }),
      }),
    )

    return res
  }

  const { data, error, mutate } = useSWR([`/games/${activeGame.id}/settings`], fetcher)

  return {
    settings: data?.settings,
    loading: !data && !error,
    error: error && buildError(error),
    mutate,
  }
}
