import useSWR from 'swr'
import buildError from '../utils/buildError'
import { Game } from '../entities/game'
import { z } from 'zod'
import { playerSchema } from '../entities/player'
import makeValidatedGetRequest from './makeValidatedGetRequest'

export default function usePlayers(activeGame: Game, search: string, page: number) {
  const fetcher = async ([url, search, page]: [string, string, number]) => {
    const qs = new URLSearchParams({
      search,
      page: String(page)
    }).toString()

    const res = await makeValidatedGetRequest(`${url}?${qs}`, z.object({
      players: z.array(playerSchema),
      count: z.number(),
      itemsPerPage: z.number()
    }))

    return res
  }

  const { data, error } = useSWR(
    [`games/${activeGame.id}/players`, search, page],
    fetcher
  )

  return {
    players: data?.players ?? [],
    count: data?.count,
    itemsPerPage: data?.itemsPerPage,
    loading: !data && !error,
    error: error && buildError(error)
  }
}
