import api from './api'

export default (gameId, leaderboardId, entryId, data) => {
  return api.patch(`/games/${gameId}/leaderboards/${leaderboardId}/entries/${entryId}`, data)
}
