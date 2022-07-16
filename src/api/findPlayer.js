import api from './api'

export default (gameId, playerId) => api.get(`/games/${gameId}/players?search=${playerId}`)
