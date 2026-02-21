import useSWR from 'swr'
import { z } from 'zod'
import { Game } from '../entities/game'
import { Leaderboard } from '../entities/leaderboard'
import { leaderboardEntrySchema } from '../entities/leaderboardEntry'
import { Player } from '../entities/player'
import { PlayerAlias } from '../entities/playerAlias'
import buildError from '../utils/buildError'
import makeValidatedGetRequest from './makeValidatedGetRequest'

export default function usePlayerLeaderboardEntries(
  activeGame: Game,
  leaderboards: Leaderboard[],
  player?: Player,
) {
  const fetcher = async ([activeGame, leaderboards, aliases]: [
    Game,
    Leaderboard[],
    PlayerAlias[],
  ]) => {
    const urls = aliases.flatMap((alias) => {
      return leaderboards.map(
        (leaderboard) =>
          `/games/${activeGame.id}/leaderboards/${leaderboard.id}/entries?aliasId=${alias.id}&page=0`,
      )
    })

    const res = await Promise.all(
      urls.map((url) =>
        makeValidatedGetRequest(
          url,
          z.object({
            entries: z.array(leaderboardEntrySchema),
          }),
        ),
      ),
    )

    return {
      entries: res.flatMap((res) => res.entries),
    }
  }

  const { data, error, mutate } = useSWR(
    leaderboards && player ? [activeGame, leaderboards, player.aliases] : null,
    fetcher,
  )

  return {
    entries: data?.entries ?? [],
    loading: !data && !error,
    error: error && buildError(error),
    mutate,
  }
}
