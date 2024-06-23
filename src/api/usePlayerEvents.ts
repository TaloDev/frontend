import useSWR from 'swr'
import buildError from '../utils/buildError'
import { Game } from '../entities/game'
import makeValidatedGetRequest from './makeValidatedGetRequest'
import { eventSchema } from '../entities/event'
import { z } from 'zod'

export default function usePlayerEvents(activeGame: Game, playerId: string, search: string, page: number) {
  const fetcher = async ([url]: [string]) => {
    const qs = new URLSearchParams({ search, page: String(page) }).toString()

    const res = await makeValidatedGetRequest(`${url}?${qs}`, z.object({
      events: z.array(eventSchema),
      count: z.number()
    }))

    return res
  }

  const { data, error } = useSWR(
    [`/games/${activeGame.id}/players/${playerId}/events`, search, page],
    fetcher
  )

  return {
    events: data?.events ?? [],
    count: data?.count,
    loading: !data && !error,
    error: error && buildError(error),
    errorStatusCode: error && error.response?.status
  }
}
