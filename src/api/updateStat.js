import api from './api'

export default (gameId, statId, data) => api.put(`/games/${gameId}/game-stats/${statId}`, data)
