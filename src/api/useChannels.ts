import useSWR from 'swr'
import buildError from '../utils/buildError'
import { Game } from '../entities/game'
import makeValidatedGetRequest from './makeValidatedGetRequest'
import { z } from 'zod'
import { gameChannelSchema } from '../entities/gameChannels'

export const channelsSchema = z.object({
  channels: z.array(gameChannelSchema),
  count: z.number(),
  itemsPerPage: z.number(),
  isLastPage: z.boolean()
})

export default function useChannels(activeGame: Game, search: string, page: number) {
  const fetcher = async ([url]: [string]) => {
    const params = new URLSearchParams({ page: String(page), search })
    const res = await makeValidatedGetRequest(`${url}?${params.toString()}`, channelsSchema)
    return res
  }

  const { data, error, mutate } = useSWR(
    [`/games/${activeGame.id}/game-channels`, search, page],
    fetcher
  )

  return {
    channels: data?.channels ?? [],
    count: data?.count,
    itemsPerPage: data?.itemsPerPage,
    loading: !data && !error,
    error: error && buildError(error),
    mutate
  }
}
