import useSWR from 'swr'
import buildError from '../utils/buildError'
import api from './api'

const usePricingPlans = () => {
  const fetcher = async (url) => {
    const res = await api.get(url)
    return res.data
  }

  const { data, error } = useSWR(
    '/billing/plans',
    fetcher
  )

  return {
    plans: data?.pricingPlans ?? [],
    loading: !data && !error,
    error: error && buildError(error)
  }
}

export default usePricingPlans
