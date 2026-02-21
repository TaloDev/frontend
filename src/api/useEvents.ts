import useSWR from 'swr'
import { z } from 'zod'
import { Game } from '../entities/game'
import buildError from '../utils/buildError'
import { convertDateToUTC } from '../utils/convertDateToUTC'
import makeValidatedGetRequest from './makeValidatedGetRequest'

export const eventsVisualisationPayloadSchema = z.object({
  name: z.string(),
  date: z.number(),
  count: z.number(),
  change: z.number(),
})

export default function useEvents(activeGame: Game, startDate: string, endDate: string) {
  const fetcher = async ([url]: [string]) => {
    const qs = new URLSearchParams({
      startDate: convertDateToUTC(startDate),
      endDate: convertDateToUTC(endDate, true),
    }).toString()

    const res = await makeValidatedGetRequest(
      `${url}?${qs}`,
      z.object({
        events: z.record(z.array(eventsVisualisationPayloadSchema)),
        eventNames: z.array(z.string()),
      }),
    )

    return res
  }

  const { data, error } = useSWR(
    activeGame && startDate && endDate
      ? [`/games/${activeGame.id}/events`, startDate, endDate]
      : null,
    fetcher,
  )

  return {
    events: data?.events,
    eventNames: data?.eventNames ?? [],
    loading: !data && !error,
    error: error && buildError(error),
  }
}
