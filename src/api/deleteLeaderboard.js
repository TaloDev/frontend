import api from './api'

export default (gameId, leaderboardId) => api.delete(`/games/${gameId}/leaderboards/${leaderboardId}`)
