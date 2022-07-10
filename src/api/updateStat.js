import api from './api'

export default (gameId, statId, data) => api.patch(`/games/${gameId}/game-stats/${statId}`, data)
