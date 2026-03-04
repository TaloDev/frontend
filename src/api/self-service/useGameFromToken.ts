import useSWR from 'swr'
import { z } from 'zod'
import buildError from '../../utils/buildError'
import makeValidatedGetRequest from '../makeValidatedGetRequest'

export function useGameFromToken(token: string) {
  const fetcher = async ([url]: [string]) => {
    return makeValidatedGetRequest(
      url,
      z.object({
        game: z.object({ name: z.string() }),
      }),
    )
  }

  const { data, error } = useSWR([`/public/players/${token}/game`], fetcher)

  return {
    game: data?.game,
    loading: !data && !error,
    error: error && buildError(error),
  }
}
