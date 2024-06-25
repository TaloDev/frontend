import useSWR from 'swr'
import buildError from '../utils/buildError'
import { Game } from '../entities/game'
import makeValidatedGetRequest from './makeValidatedGetRequest'
import { z } from 'zod'
import { gameActivitySchema } from '../entities/gameActivity'

export default function useGameActivities(activeGame: Game) {
  const fetcher = async ([url]: [string]) => {
    const res = await makeValidatedGetRequest(url, z.object({
      activities: z.array(gameActivitySchema)
    }))

    return res
  }

  const { data, error } = useSWR(
    [`/games/${activeGame.id}/game-activities`],
    fetcher
  )

  return {
    activities: data?.activities ?? [],
    loading: !data && !error,
    error: error && buildError(error)
  }
}
