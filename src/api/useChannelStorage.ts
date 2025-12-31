import useSWR from 'swr'
import buildError from '../utils/buildError'
import { Game } from '../entities/game'
import makeValidatedGetRequest from './makeValidatedGetRequest'
import { z } from 'zod'
import { channelStoragePropSchema } from '../entities/channelStorageProp'

export const channelStorageSchema = z.object({
  storageProps: z.array(channelStoragePropSchema),
  channelName: z.string(),
  count: z.number(),
  itemsPerPage: z.number()
})

export default function useChannelStorage(activeGame: Game, channelId: number, search: string, page: number) {
  const fetcher = async ([url]: [string]) => {
    const params = new URLSearchParams({ page: String(page), search })
    const res = await makeValidatedGetRequest(`${url}?${params.toString()}`, channelStorageSchema)
    return res
  }

  const { data, error } = useSWR(
    [`/games/${activeGame.id}/game-channels/${channelId}/storage`, search, page],
    fetcher
  )

  return {
    storageProps: data?.storageProps ?? [],
    channelName: data?.channelName,
    count: data?.count,
    itemsPerPage: data?.itemsPerPage,
    loading: !data && !error,
    error: error && buildError(error),
    errorStatusCode: error && error.response?.status
  }
}
