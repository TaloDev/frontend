import useSWR from 'swr'
import buildError from '../utils/buildError'
import api from './api'

const usePlayers = (activeGame, search) => {
  const fetcher = async (url) => {
    const res = await api.get(`${url}?gameId=${activeGame.id}&search=${search}`)
    return res.data.players
  }

  const { data, error } = useSWR(
    activeGame ? ['/players', activeGame, search] : null,
    fetcher
  )

  return {
    players: data,
    loading: !data && !error,
    error: error && buildError(error)
  }
}

export default usePlayers
