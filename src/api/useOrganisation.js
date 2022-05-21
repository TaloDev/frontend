import useSWR from 'swr'
import buildError from '../utils/buildError'
import api from './api'

const useOrganisation = () => {
  const fetcher = async (url) => {
    const res = await api.get(url)
    return res.data
  }

  const { data, error, mutate } = useSWR(
    '/organisations/current',
    fetcher
  )

  return {
    games: data?.games ?? [],
    members: data?.members ?? [],
    pendingInvites: data?.pendingInvites ?? [],
    loading: !data && !error,
    error: error && buildError(error),
    mutate
  }
}

export default useOrganisation
