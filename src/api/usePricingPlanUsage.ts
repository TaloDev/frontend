import useSWR from 'swr'
import buildError from '../utils/buildError'
import makeValidatedGetRequest from './makeValidatedGetRequest'
import { z } from 'zod'
import { PricingPlanUsage, pricingPlanUsageSchema } from '../entities/pricingPlan'

export default function usePricingPlanUsage(run: boolean = true) {
  const fetcher = async ([url]: [string]) => {
    const res = await makeValidatedGetRequest(url, z.object({
      usage: pricingPlanUsageSchema
    }))

    return res
  }

  const { data, error } = useSWR(
    run ? ['/billing/usage'] : null,
    fetcher
  )

  const limit = data?.usage.limit ?? (typeof data === 'undefined' ? 0 : Infinity)
  const used = data?.usage.used ?? 0

  return {
    usage: { limit, used } satisfies PricingPlanUsage,
    loading: !data && !error,
    error: error && buildError(error)
  }
}
