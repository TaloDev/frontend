import api from './api'

export default async (gameId, entities) => api.post('/data-exports', { gameId, entities })
