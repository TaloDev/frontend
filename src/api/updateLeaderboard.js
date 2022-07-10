import api from './api'

export default (gameId, leaderboardId, data) => api.patch(`/games/${gameId}/leaderboards/${leaderboardId}`, data)
