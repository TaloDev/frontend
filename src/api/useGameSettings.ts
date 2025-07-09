import useSWR from 'swr'
import buildError from '../utils/buildError'
import { Game } from '../entities/game'
import makeValidatedGetRequest from './makeValidatedGetRequest'
import { z } from 'zod'

export default function useGameSettings(activeGame: Game) {
  const fetcher = async ([url]: [string]) => {
    const res = await makeValidatedGetRequest(url, z.object({
      settings: z.object({
        purgeDevPlayers: z.boolean(),
        purgeLivePlayers: z.boolean(),
        purgeDevPlayersRetention: z.number(),
        purgeLivePlayersRetention: z.number(),
        website: z.string().nullable()
      })
    }))

    return res
  }

  const { data, error } = useSWR(
    [`/games/${activeGame.id}/settings`],
    fetcher
  )

  return {
    settings: data?.settings,
    loading: !data && !error,
    error: error && buildError(error)
  }
}
