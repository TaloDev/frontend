import useSWR from 'swr'
import buildError from '../utils/buildError'
import { Game } from '../entities/game'
import { z } from 'zod'
import { apiKeySchema } from '../entities/apiKey'
import makeValidatedGetRequest from './makeValidatedGetRequest'

export default function useAPIKeys(activeGame: Game) {
  const fetcher = async ([url]: [string]) => {
    const { apiKeys } = await makeValidatedGetRequest(url, z.object({
      apiKeys: z.array(apiKeySchema)
    }))
    const { scopes } = await makeValidatedGetRequest(`${url}/scopes`, z.object({
      scopes: z.record(z.array(z.string()))
    }))

    return {
      apiKeys,
      scopes
    }
  }

  const { data, error, mutate } = useSWR(
    [`/games/${activeGame.id}/api-keys`],
    fetcher
  )

  return {
    apiKeys: data?.apiKeys ?? [],
    scopes: data?.scopes ?? {},
    loading: !data && !error,
    error: error && buildError(error),
    mutate
  }
}
