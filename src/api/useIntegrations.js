import useSWR from 'swr'
import buildError from '../utils/buildError'
import api from './api'

const useIntegrations = (activeGame) => {
  const fetcher = async (url) => {
    const res = await api.get(url)
    return res.data
  }

  const { data, error, mutate } = useSWR(
    activeGame ? [`/games/${activeGame.id}/integrations`] : null,
    fetcher
  )

  return {
    integrations: data?.integrations ?? [],
    loading: !data && !error,
    error: error && buildError(error),
    mutate
  }
}

export default useIntegrations
