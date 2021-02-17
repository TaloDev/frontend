import api from './api'

export default async (playerId, data) => api.patch(`/players/${playerId}`, data)
