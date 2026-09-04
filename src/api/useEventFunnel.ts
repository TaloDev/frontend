import useSWR from 'swr'
import { z } from 'zod'
import {
  EventFunnel,
  eventFunnelSchema,
  FunnelResultStep,
  funnelResultStepSchema,
} from '../entities/eventFunnel'
import { Game } from '../entities/game'
import buildError from '../utils/buildError'
import { convertDateToUTC } from '../utils/convertDateToUTC'
import makeValidatedGetRequest from './makeValidatedGetRequest'

type EventFunnelData = {
  funnel: EventFunnel
  result?: {
    steps: FunnelResultStep[]
    lastUpdatedAt: number
  }
}

export function useEventFunnel({
  activeGame,
  funnelId,
  startDate,
  endDate,
  initialFunnel,
}: {
  activeGame: Game
  funnelId?: number
  startDate: string
  endDate: string
  initialFunnel?: EventFunnel
}) {
  const fetcher = async ([url]: [string]) => {
    const qs = new URLSearchParams({
      startDate: convertDateToUTC(startDate),
      endDate: convertDateToUTC(endDate, true),
    }).toString()

    const res = await makeValidatedGetRequest(
      `${url}?${qs}`,
      z.object({
        funnel: eventFunnelSchema,
        result: z.object({
          steps: z.array(funnelResultStepSchema),
          lastUpdatedAt: z.number(),
        }),
      }),
    )

    return res
  }

  const { data, error, mutate } = useSWR<EventFunnelData>(
    activeGame && funnelId && startDate && endDate
      ? [`games/${activeGame.id}/event-funnels/${funnelId}`, startDate, endDate]
      : null,
    fetcher,
    {
      keepPreviousData: true,
      fallbackData: initialFunnel ? { funnel: initialFunnel } : undefined,
    },
  )

  return {
    funnel: data?.funnel,
    result: data?.result,
    loading: !data && !error,
    error: error && buildError(error),
    mutate,
  }
}
