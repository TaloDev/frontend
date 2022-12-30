import useSWR from 'swr'
import buildError from '../utils/buildError'
import api from './api'

const useGroupRules = (activeGame) => {
  const fetcher = async (url) => {
    const res = await api.get(url)
    return res.data
  }

  const { data, error } = useSWR(
    activeGame ? `games/${activeGame.id}/player-groups/rules` : null,
    fetcher
  )

  return {
    availableRules: data?.availableRules ?? [],
    availableFields: data?.availableFields ?? [],
    loading: !data && !error,
    error: error && buildError(error)
  }
}

export default useGroupRules
