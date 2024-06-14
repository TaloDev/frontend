import useSWR from 'swr'
import buildError from '../utils/buildError'
import api from './api'

export default function useAPIKeys(activeGame) {
  const fetcher = async ([url]) => {
    const keysRes = await api.get(url)
    const scopesRes = await api.get(`${url}/scopes`)

    return {
      apiKeys: keysRes.data.apiKeys,
      scopes: scopesRes.data.scopes
    }
  }

  const { data, error, mutate } = useSWR(
    activeGame ? [`/games/${activeGame.id}/api-keys`] : null,
    fetcher
  )

  return {
    apiKeys: data?.apiKeys ?? [],
    scopes: data?.scopes ?? [],
    loading: !data && !error,
    error: error && buildError(error),
    mutate
  }
}
