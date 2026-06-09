import useSWR from 'swr'
import { z } from 'zod'
import { Game } from '../entities/game'
import { verificationKeySchema } from '../entities/verificationKey'
import buildError from '../utils/buildError'
import makeValidatedGetRequest from './makeValidatedGetRequest'

export function useVerificationKeys(activeGame: Game) {
  const fetcher = async ([url]: [string]) => {
    const res = await makeValidatedGetRequest(
      url,
      z.object({
        verificationKeys: z.array(verificationKeySchema),
      }),
    )

    return res
  }

  const { data, error, mutate } = useSWR([`/games/${activeGame.id}/verification-keys`], fetcher)

  return {
    verificationKeys: data?.verificationKeys ?? [],
    loading: !data && !error,
    error: error && buildError(error),
    mutate,
  }
}
