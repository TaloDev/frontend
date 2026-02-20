import useSWR from 'swr'
import { z } from 'zod'
import { organisationPricingPlanSchema } from '../entities/organisation'
import buildError from '../utils/buildError'
import makeValidatedGetRequest from './makeValidatedGetRequest'

export default function useOrganisationPricingPlan() {
  const fetcher = async ([url]: [string]) => {
    const res = await makeValidatedGetRequest(
      url,
      z.object({
        pricingPlan: organisationPricingPlanSchema,
      }),
    )

    return res
  }

  const { data, error } = useSWR(['/billing/organisation-plan'], fetcher)

  return {
    plan: data?.pricingPlan,
    loading: !data && !error,
    error: error && buildError(error),
  }
}
