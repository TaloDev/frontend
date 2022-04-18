import api from './api'

export default (gameId, playerId) => api.get(`/players?gameId=${gameId}&search=${playerId}`)
