import useSWR from 'swr'
import buildError from '../utils/buildError'
import api from './api'

const useGroups = (activeGame) => {
  const fetcher = async (url) => {
    const res = await api.get(url)
    return res.data
  }

  const { data, error, mutate } = useSWR(
    activeGame ? [`games/${activeGame.id}/player-groups`] : null,
    fetcher
  )

  return {
    groups: data?.groups ?? [],
    loading: !data && !error,
    error: error && buildError(error),
    mutate
  }
}

export default useGroups
