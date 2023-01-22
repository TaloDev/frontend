import useSWR from 'swr'
import buildError from '../utils/buildError'
import api from './api'

const useDataExports = (activeGame, createdExport) => {
  const fetcher = async ([url]) => {
    const res = await api.get(url)
    return res.data
  }

  const { data, error } = useSWR(
    activeGame ? [`/games/${activeGame.id}/data-exports`, createdExport] : null,
    fetcher
  )

  return {
    dataExports: data?.dataExports ?? [],
    loading: !data && !error,
    error: error && buildError(error)
  }
}

export default useDataExports
