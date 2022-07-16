import api from './api'

export default (gameId, playerId, data) => api.patch(`/games/${gameId}/players/${playerId}`, data)
