import useSWR from 'swr'
import { z } from 'zod'
import { Game } from '../entities/game'
import { integrationSchema } from '../entities/integration'
import buildError from '../utils/buildError'
import makeValidatedGetRequest from './makeValidatedGetRequest'

export default function useIntegrations(activeGame: Game) {
  const fetcher = async ([url]: [string]) => {
    const res = await makeValidatedGetRequest(
      url,
      z.object({
        integrations: z.array(integrationSchema),
      }),
    )

    return res
  }

  const { data, error, mutate } = useSWR([`/games/${activeGame.id}/integrations`], fetcher)

  return {
    integrations: data?.integrations ?? [],
    loading: !data && !error,
    error: error && buildError(error),
    mutate,
  }
}
