import useSWR from 'swr'
import buildError from '../utils/buildError'
import api from './api'
import { stringify } from 'querystring'

const usePlayers = (activeGame, search) => {
  const fetcher = async (url) => {
    const qs = stringify({
      gameId: activeGame.id,
      search
    })

    const res = await api.get(`${url}?${qs}`)
    return res.data.players
  }

  const { data, error } = useSWR(
    activeGame ? ['/players', activeGame, search] : null,
    fetcher
  )

  return {
    players: data ?? [],
    loading: !data && !error,
    error: error && buildError(error)
  }
}

export default usePlayers
