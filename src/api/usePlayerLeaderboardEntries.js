import useSWR from 'swr'
import buildError from '../utils/buildError'
import api from './api'

const usePlayerLeaderboardEntries = (activeGame, leaderboards, player) => {
  const fetcher = async (activeGame, leaderboards, aliases) => {
    const urls = aliases.flatMap((alias) => {
      return leaderboards.map((leaderboard) => `/games/${activeGame.id}/leaderboards/${leaderboard.id}/entries?aliasId=${alias.id}&page=0`)
    })

    const res = await Promise.all(urls.map((url) => api.get(url)))
    return res.flatMap((res) => res.data.entries)
  }

  const { data, error } = useSWR(
    leaderboards && player ? [activeGame, leaderboards, player.aliases] : null,
    fetcher
  )

  return {
    entries: data ?? [],
    loading: !data && !error,
    error: error && buildError(error)
  }
}

export default usePlayerLeaderboardEntries
