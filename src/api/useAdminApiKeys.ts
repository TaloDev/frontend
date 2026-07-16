import useSWR from 'swr'
import { z } from 'zod'
import { adminApiKeySchema } from '../entities/adminApiKey'
import { Game } from '../entities/game'
import buildError from '../utils/buildError'
import makeValidatedGetRequest from './makeValidatedGetRequest'

export function useAdminApiKeys(activeGame: Game) {
  const fetcher = async ([url]: [string]) => {
    const { apiKeys } = await makeValidatedGetRequest(
      url,
      z.object({
        apiKeys: z.array(adminApiKeySchema),
      }),
    )
    const { scopes } = await makeValidatedGetRequest(
      `${url}/scopes`,
      z.object({
        scopes: z.record(z.array(z.string())),
      }),
    )

    return {
      apiKeys,
      scopes,
    }
  }

  const { data, error, mutate } = useSWR([`/games/${activeGame.id}/admin-api-keys`], fetcher)

  return {
    apiKeys: data?.apiKeys ?? [],
    scopes: data?.scopes ?? {},
    loading: !data && !error,
    error: error && buildError(error),
    mutate,
  }
}
