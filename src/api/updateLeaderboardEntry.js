import api from './api'

export default (leaderboardId, entryId, data) => {
  return api.patch(`/leaderboards/${leaderboardId}/entries/${entryId}`, data)
}
