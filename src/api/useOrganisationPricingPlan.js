import useSWR from 'swr'
import buildError from '../utils/buildError'
import api from './api'

const useOrganisationPricingPlan = () => {
  const fetcher = async (url) => {
    const res = await api.get(url)
    return res.data
  }

  const { data, error } = useSWR(
    '/billing/organisation-plan',
    fetcher
  )

  return {
    plan: data?.pricingPlan ?? {},
    loading: !data && !error,
    error: error && buildError(error)
  }
}

export default useOrganisationPricingPlan
