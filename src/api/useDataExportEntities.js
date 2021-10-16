import useSWR from 'swr'
import buildError from '../utils/buildError'
import api from './api'

const useDataExportEntities = () => {
  const fetcher = async (url) => {
    const res = await api.get(url)
    return res.data
  }

  const { data, error } = useSWR(
    '/data-exports/entities',
    fetcher
  )

  return {
    entities: data?.entities ?? [],
    loading: !data && !error,
    error: error && buildError(error)
  }
}

export default useDataExportEntities
