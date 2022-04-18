import api from './api'

export default (gameId, scopes) => api.post('/api-keys', { gameId, scopes })
