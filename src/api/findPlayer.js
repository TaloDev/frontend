import api from './api'

export default async (gameId, playerId) => api.get(`/players?gameId=${gameId}&search=${playerId}`)
