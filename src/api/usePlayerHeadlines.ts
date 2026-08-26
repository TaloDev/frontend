import useSWR from 'swr'
import { Game } from '../entities/game'
import { playerHeadlinesSchema, PlayerHeadlines } from '../entities/playerHeadline'
import buildError from '../utils/buildError'
import makeValidatedGetRequest from './makeValidatedGetRequest'

const defaultHeadlines: PlayerHeadlines = {
  total_players: { count: 0, lastUpdatedAt: 0 },
  online_players: { count: 0, lastUpdatedAt: 0 },
}

export function usePlayerHeadlines(activeGame: Game | null, includeDevData: boolean) {
  const fetcher = async ([url]: [string]) => {
    const headlines: (keyof PlayerHeadlines)[] = ['total_players', 'online_players']
    const res = await Promise.all(
      headlines.map((headline) =>
        makeValidatedGetRequest(`${url}/${headline}`, playerHeadlinesSchema.shape[headline]),
      ),
    )

    return headlines.reduce(
      (acc, curr, idx) => ({
        ...acc,
        [curr]: res[idx],
      }),
      defaultHeadlines,
    )
  }

  const { data, error, mutate } = useSWR(
    activeGame ? [`/games/${activeGame.id}/headlines`, includeDevData] : null,
    fetcher,
  )

  return {
    headlines: data ?? defaultHeadlines,
    loading: !data && !error,
    error: error && buildError(error),
    mutate,
  }
}
