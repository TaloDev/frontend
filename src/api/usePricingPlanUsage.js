import useSWR from 'swr'
import buildError from '../utils/buildError'
import api from './api'

const usePricingPlanUsage = () => {
  const fetcher = async (url) => {
    const res = await api.get(url)
    return res.data
  }

  const { data, error } = useSWR(
    '/billing/usage',
    fetcher
  )

  return {
    usage: data?.usage ?? {},
    loading: !data && !error,
    error: error && buildError(error)
  }
}

export default usePricingPlanUsage
