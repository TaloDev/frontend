import useSWR from 'swr'
import { z } from 'zod'
import { gameSchema } from '../entities/game'
import { inviteSchema } from '../entities/invite'
import { userSchema } from '../entities/user'
import buildError from '../utils/buildError'
import makeValidatedGetRequest from './makeValidatedGetRequest'

export const currentOrganisationSchema = z.object({
  games: z.array(gameSchema),
  members: z.array(userSchema),
  pendingInvites: z.array(inviteSchema),
})

export default function useOrganisation() {
  const fetcher = async ([url]: [string]) => {
    const res = await makeValidatedGetRequest(url, currentOrganisationSchema)

    return res
  }

  const { data, error, mutate } = useSWR(['/organisations/current'], fetcher)

  return {
    games: data?.games ?? [],
    members: data?.members ?? [],
    pendingInvites: data?.pendingInvites ?? [],
    loading: !data && !error,
    error: error && buildError(error),
    mutate,
  }
}
