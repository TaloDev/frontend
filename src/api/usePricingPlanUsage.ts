import useSWR from 'swr'
import buildError from '../utils/buildError'
import makeValidatedGetRequest from './makeValidatedGetRequest'
import { z } from 'zod'
import { pricingPlanUsageSchema } from '../entities/pricingPlan'

export default function usePricingPlanUsage() {
  const fetcher = async ([url]: [string]) => {
    const res = await makeValidatedGetRequest(url, z.object({
      usage: pricingPlanUsageSchema
    }))

    return res
  }

  const { data, error } = useSWR(
    ['/billing/usage'],
    fetcher
  )

  return {
    usage: data?.usage ?? {},
    loading: !data && !error,
    error: error && buildError(error)
  }
}
