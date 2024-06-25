import useSWR from 'swr'
import buildError from '../utils/buildError'
import { Game } from '../entities/game'
import { Player } from '../entities/player'
import { PlayerAlias } from '../entities/playerAlias'
import { Leaderboard } from '../entities/leaderboard'
import makeValidatedGetRequest from './makeValidatedGetRequest'
import { z } from 'zod'
import { leaderboardEntrySchema } from '../entities/leaderboardEntry'

export default function usePlayerLeaderboardEntries(activeGame: Game, leaderboards: Leaderboard[], player: Player | null) {
  const fetcher = async ([activeGame, leaderboards, aliases]: [Game, Leaderboard[], PlayerAlias[]]) => {
    const urls = aliases.flatMap((alias) => {
      return leaderboards.map((leaderboard) => `/games/${activeGame.id}/leaderboards/${leaderboard.id}/entries?aliasId=${alias.id}&page=0`)
    })

    const res = await Promise.all(urls.map((url) => makeValidatedGetRequest(url, z.object({
      entries: z.array(leaderboardEntrySchema)
    }))))

    return res.flatMap((res) => res.entries)
  }

  const { data, error } = useSWR(
    leaderboards && player ? [activeGame, leaderboards, player.aliases] : null,
    fetcher
  )

  return {
    entries: data ?? [],
    loading: !data && !error,
    error: error && buildError(error)
  }
}
