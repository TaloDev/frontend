import useSWR from 'swr'
import buildError from '../utils/buildError'
import api from './api'
import { stringify } from 'querystring'

const useDataExports = (activeGame, createdExport) => {
  const fetcher = async (url) => {
    const qs = stringify({
      gameId: activeGame.id
    })

    const res = await api.get(`${url}?${qs}`)
    return res.data
  }

  const { data, error } = useSWR(
    activeGame ? ['/data-exports', activeGame, createdExport] : null,
    fetcher
  )

  return {
    dataExports: data?.dataExports ?? [],
    loading: !data && !error,
    error: error && buildError(error)
  }
}

export default useDataExports
