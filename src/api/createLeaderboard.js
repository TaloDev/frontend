import api from './api'

export default (gameId, data) => api.post(`/games/${gameId}/leaderboards`, data)
