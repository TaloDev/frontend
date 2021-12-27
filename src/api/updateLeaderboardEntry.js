import api from './api'

export default (leaderboardInternalName, entryId, gameId, data) => {
  return api.patch(`/leaderboards/${leaderboardInternalName}/entries/${entryId}?gameId=${gameId}`, data)
}
