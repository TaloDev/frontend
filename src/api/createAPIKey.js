import api from './api'

export default async (gameId, scopes) => api.post('/api-keys', { gameId, scopes })
