import api from './api'

export default (gameId, leaderboardId) => api.get(`/games/${gameId}/leaderboards/${leaderboardId}`)
