import api from './api'

export default async (gameId) => api.get(`/api-keys?gameId=${gameId}`)
