import useSWR from 'swr'
import { z } from 'zod'
import { PricingPlanUsage } from '../entities/pricingPlan'
import buildError from '../utils/buildError'
import makeValidatedGetRequest from './makeValidatedGetRequest'

export default function usePricingPlanUsage(run: boolean = true) {
  const fetcher = async ([url]: [string]) => {
    const res = await makeValidatedGetRequest(
      url,
      z.object({
        usage: z.object({
          limit: z.number().nullable(),
          used: z.number(),
        }),
      }),
    )

    return res
  }

  const { data, error } = useSWR(run ? ['/billing/usage'] : null, fetcher)

  const limit = data?.usage.limit ?? (typeof data === 'undefined' ? 0 : Infinity)
  const used = data?.usage.used ?? 0

  return {
    usage: { limit, used } satisfies PricingPlanUsage,
    loading: !data && !error,
    error: error && buildError(error),
  }
}
