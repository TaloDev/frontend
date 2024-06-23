import useSWR from 'swr'
import buildError from '../utils/buildError'
import { Game } from '../entities/game'
import makeValidatedGetRequest from './makeValidatedGetRequest'
import { z } from 'zod'
import { leaderboardSchema } from '../entities/leaderboard'

export default function useLeaderboards(activeGame: Game) {
  const fetcher = async ([url]: [string]) => {
    const res = await makeValidatedGetRequest(url, z.object({
      leaderboards: z.array(leaderboardSchema)
    }))

    return res
  }

  const { data, error, mutate } = useSWR(
    [`/games/${activeGame.id}/leaderboards`],
    fetcher
  )

  return {
    leaderboards: data?.leaderboards ?? [],
    loading: !data && !error,
    error: error && buildError(error),
    mutate
  }
}
