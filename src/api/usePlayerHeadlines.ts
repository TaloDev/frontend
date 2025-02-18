import useSWR from 'swr'
import buildError from '../utils/buildError'
import { Game } from '../entities/game'
import makeValidatedGetRequest from './makeValidatedGetRequest'
import { z } from 'zod'
import { PlayerHeadlines } from '../entities/playerHeadline'

const defaultHeadlines: PlayerHeadlines = {
  total_players: { count: 0 },
  online_players: { count: 0 }
}

export default function usePlayerHeadlines(activeGame: Game | null, includeDevData: boolean) {
  const fetcher = async ([url]: [string]) => {
    const headlines: (keyof PlayerHeadlines)[] = ['total_players', 'online_players']
    const res = await Promise.all(headlines.map((headline) => makeValidatedGetRequest(`${url}/${headline}`, z.object({
      count: z.number()
    }))))

    return headlines.reduce((acc, curr, idx) => ({
      ...acc,
      [curr]: res[idx]
    }), defaultHeadlines)
  }

  const { data, error } = useSWR(
    activeGame ? [`/games/${activeGame.id}/headlines`, includeDevData] : null,
    fetcher
  )

  return {
    headlines: data ?? defaultHeadlines,
    loading: !data && !error,
    error: error && buildError(error)
  }
}
