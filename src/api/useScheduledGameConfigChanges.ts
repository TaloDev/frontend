import useSWR from 'swr'
import { z } from 'zod'
import { Game } from '../entities/game'
import { scheduledGameConfigChangeSchema } from '../entities/scheduledGameConfigChange'
import buildError from '../utils/buildError'
import makeValidatedGetRequest from './makeValidatedGetRequest'

export function useScheduledGameConfigChanges(activeGame: Game) {
  const fetcher = async ([url]: [string]) =>
    makeValidatedGetRequest(
      url,
      z.object({
        changes: z.array(scheduledGameConfigChangeSchema),
      }),
    )

  const { data, error, mutate } = useSWR(
    [`/games/${activeGame.id}/game-config/scheduled-changes`],
    fetcher,
  )

  return {
    changes: data?.changes ?? [],
    loading: !data && !error,
    error: error && buildError(error),
    mutate,
  }
}
