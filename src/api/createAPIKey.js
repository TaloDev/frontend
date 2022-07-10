import api from './api'

export default (gameId, scopes) => api.post(`/games/${gameId}/api-keys`, { scopes })
