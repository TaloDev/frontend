import api from './api'

export default async (gameId, internalName) => api.get(`/leaderboards/${internalName}?gameId=${gameId}`)
