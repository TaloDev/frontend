import useSWR from 'swr'
import buildError from '../utils/buildError'
import { stringify } from 'querystring'
import { Game } from '../entities/game'
import makeValidatedGetRequest from './makeValidatedGetRequest'
import { z } from 'zod'
import { Headlines } from '../entities/headline'

const defaultHeadlines: Headlines = {
  new_players: { count: 0 },
  returning_players: { count: 0 },
  events: { count: 0 },
  unique_event_submitters: { count: 0 }
}

export default function useHeadlines(activeGame: Game | null, startDate: string, endDate: string, includeDevData: boolean) {
  const fetcher = async ([url]: [string]) => {
    const qs = stringify({
      startDate,
      endDate
    })

    const headlines: (keyof Headlines)[] = ['new_players', 'returning_players', 'events', 'unique_event_submitters']
    const res = await Promise.all(headlines.map((headline) => makeValidatedGetRequest(`${url}/${headline}?${qs}`, z.object({
      count: z.number()
    }))))

    return headlines.reduce((acc, curr, idx) => ({
      ...acc,
      [curr]: res[idx]
    }), defaultHeadlines)
  }

  const { data, error } = useSWR(
    activeGame && startDate && endDate ? [`/games/${activeGame.id}/headlines`, startDate, endDate, includeDevData] : null,
    fetcher
  )

  return {
    headlines: data ?? defaultHeadlines,
    loading: !data && !error,
    error: error && buildError(error)
  }
}
