import useSWR from 'swr'
import buildError from '../utils/buildError'
import { stringify } from 'querystring'
import { Game } from '../entities/game'
import makeValidatedGetRequest from './makeValidatedGetRequest'
import { z } from 'zod'

export default function useEvents(activeGame: Game, startDate: string, endDate: string) {
  const fetcher = async ([url]: [string]) => {
    const qs = stringify({
      startDate,
      endDate
    })

    const res = await makeValidatedGetRequest(`${url}?${qs}`, z.object({
      events: z.record(
        z.object({
          name: z.string(),
          date: z.number(),
          count: z.number()
        })
      ),
      eventNames: z.array(z.string())
    }))

    return res
  }

  const { data, error } = useSWR(
    activeGame && startDate && endDate ? [`/games/${activeGame.id}/events`, startDate, endDate] : null,
    fetcher
  )

  return {
    events: data?.events,
    eventNames: data?.eventNames ?? [],
    loading: !data && !error,
    error: error && buildError(error)
  }
}
