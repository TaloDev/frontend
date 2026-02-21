import useSWR from 'swr'
import { z } from 'zod'
import { Game } from '../entities/game'
import { leaderboardSchema } from '../entities/leaderboard'
import buildError from '../utils/buildError'
import makeValidatedGetRequest from './makeValidatedGetRequest'

export default function useLeaderboards(activeGame: Game) {
  const fetcher = async ([url]: [string]) => {
    const res = await makeValidatedGetRequest(
      url,
      z.object({
        leaderboards: z.array(leaderboardSchema),
      }),
    )

    return res
  }

  const { data, error, mutate } = useSWR([`/games/${activeGame.id}/leaderboards`], fetcher)

  return {
    leaderboards: data?.leaderboards ?? [],
    loading: !data && !error,
    error: error && buildError(error),
    mutate,
  }
}
