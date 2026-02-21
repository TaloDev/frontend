import useSWR from 'swr'
import { z } from 'zod'
import { Game } from '../entities/game'
import { gameChannelSchema } from '../entities/gameChannels'
import buildError from '../utils/buildError'
import makeValidatedGetRequest from './makeValidatedGetRequest'

export const channelsSchema = z.object({
  channels: z.array(gameChannelSchema),
  count: z.number(),
  itemsPerPage: z.number(),
  isLastPage: z.boolean(),
})

export default function useChannels(activeGame: Game, search: string, page: number) {
  const fetcher = async ([url]: [string]) => {
    const params = new URLSearchParams({ page: String(page), search })
    const res = await makeValidatedGetRequest(`${url}?${params.toString()}`, channelsSchema)
    return res
  }

  const { data, error, mutate } = useSWR(
    [`/games/${activeGame.id}/game-channels`, search, page],
    fetcher,
  )

  return {
    channels: data?.channels ?? [],
    count: data?.count,
    itemsPerPage: data?.itemsPerPage,
    loading: !data && !error,
    error: error && buildError(error),
    mutate,
  }
}
