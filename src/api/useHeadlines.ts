import useSWR from 'swr'
import buildError from '../utils/buildError'
import { Game } from '../entities/game'
import makeValidatedGetRequest from './makeValidatedGetRequest'
import { averageSessionDurationSchema, countSchema, Headlines } from '../entities/headline'
import { convertDateToUTC } from '../utils/convertDateToUTC'

const defaultHeadlines: Headlines = {
  new_players: { count: 0 },
  returning_players: { count: 0 },
  events: { count: 0 },
  unique_event_submitters: { count: 0 },
  total_sessions: { count: 0 },
  average_session_duration: { hours: 0, minutes: 0, seconds: 0 }
}

function getSchema(headline: keyof Headlines) {
  switch (headline) {
    case 'average_session_duration':
      return averageSessionDurationSchema
    default:
      return countSchema
  }
}

export default function useHeadlines(activeGame: Game | null, startDate: string, endDate: string, includeDevData: boolean) {
  const fetcher = async ([url]: [string]) => {
    const qs = new URLSearchParams({
      startDate: convertDateToUTC(startDate),
      endDate: convertDateToUTC(endDate)
    }).toString()

    const headlines: (keyof Headlines)[] = [
      'new_players',
      'returning_players',
      'events',
      'unique_event_submitters',
      'total_sessions',
      'average_session_duration'
    ]
    const res = await Promise.all(headlines.map((headline) => makeValidatedGetRequest(`${url}/${headline}?${qs}`, getSchema(headline))))

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
