import useSWR from 'swr'
import buildError from '../utils/buildError'
import { Game } from '../entities/game'
import makeValidatedGetRequest from './makeValidatedGetRequest'
import { z } from 'zod'
import { eventsVisualisationPayloadSchema } from './useEvents'
import { convertDateToUTC } from '../utils/convertDateToUTC'

export default function useEventBreakdown(activeGame: Game, eventName: string, startDate: string, endDate: string) {
  const fetcher = async ([url]: [string]) => {
    const qs = new URLSearchParams({
      eventName,
      startDate: convertDateToUTC(startDate),
      endDate: convertDateToUTC(endDate)
    }).toString()

    const res = await makeValidatedGetRequest(`${url}?${qs}`, z.object({
      events: z.record(
        z.array(eventsVisualisationPayloadSchema)
      ),
      eventNames: z.array(z.string())
    }))

    return res
  }

  const { data, error } = useSWR(
    activeGame && eventName && startDate && endDate ? [`/games/${activeGame.id}/events/breakdown`, eventName, startDate, endDate] : null,
    fetcher
  )

  return {
    events: data?.events,
    eventNames: data?.eventNames ?? [],
    loading: !data && !error,
    error: error && buildError(error)
  }
}
