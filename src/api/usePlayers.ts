import useSWR from 'swr'
import buildError from '../utils/buildError'
import { stringify } from 'querystring'
import { Game } from '../entities/game'
import { z } from 'zod'
import { playerSchema } from '../entities/player'
import makeValidatedGetRequest from './makeValidatedGetRequest'

export default function usePlayers(activeGame: Game, search: string, page: number) {
  const fetcher = async ([url, search, page]: [string, string, number]) => {
    const qs = stringify({
      search,
      page
    })

    const res = await makeValidatedGetRequest(`${url}?${qs}`, z.object({
      players: z.array(playerSchema),
      count: z.number()
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
    loading: !data && !error,
    error: error && buildError(error)
  }
}
