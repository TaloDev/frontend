import useSWR from 'swr'
import { z } from 'zod'
import { eventFunnelSchema } from '../entities/eventFunnel'
import { Game } from '../entities/game'
import buildError from '../utils/buildError'
import makeValidatedGetRequest from './makeValidatedGetRequest'

export function useEventFunnels(activeGame: Game) {
  const fetcher = async ([url]: [string]) => {
    const res = await makeValidatedGetRequest(
      url,
      z.object({
        funnels: z.array(eventFunnelSchema),
      }),
    )

    return res
  }

  const { data, error, mutate } = useSWR([`games/${activeGame.id}/event-funnels`], fetcher)

  return {
    funnels: data?.funnels ?? [],
    loading: !data && !error,
    error: error && buildError(error),
    mutate,
  }
}
