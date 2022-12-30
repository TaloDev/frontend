import useSWR from 'swr'
import buildError from '../utils/buildError'
import api from './api'
import { stringify } from 'querystring'

const usePlayers = (activeGame, search, page) => {
  const fetcher = async ([url]) => {
    const qs = stringify({
      search,
      page
    })

    const res = await api.get(`${url}?${qs}`)
    return res.data
  }

  const { data, error } = useSWR(
    activeGame ? [`games/${activeGame.id}/players`, search, page] : null,
    fetcher
  )

  return {
    players: data?.players ?? [],
    count: data?.count,
    loading: !data && !error,
    error: error && buildError(error)
  }
}

export default usePlayers
