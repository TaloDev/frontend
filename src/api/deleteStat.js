import api from './api'

export default (gameId, statId) => api.delete(`/games/${gameId}/game-stats/${statId}`)
