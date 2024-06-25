import useSWR from 'swr'
import buildError from '../utils/buildError'
import makeValidatedGetRequest from './makeValidatedGetRequest'
import { z } from 'zod'
import { pricingPlanProductSchema } from '../entities/pricingPlan'

export default function usePricingPlans() {
  const fetcher = async ([url]: [string]) => {
    const res = await makeValidatedGetRequest(url, z.object({
      pricingPlans: z.array(pricingPlanProductSchema)
    }))

    return res
  }

  const { data, error } = useSWR(
    ['/billing/plans'],
    fetcher
  )

  return {
    plans: data?.pricingPlans ?? [],
    loading: !data && !error,
    error: error && buildError(error)
  }
}
