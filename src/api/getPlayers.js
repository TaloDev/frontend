import api from './api'

export default async (gameId) => api.get(`/players?gameId=${gameId}`)
