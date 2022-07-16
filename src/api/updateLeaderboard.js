import api from './api'

export default (gameId, leaderboardId, data) => api.put(`/games/${gameId}/leaderboards/${leaderboardId}`, data)
