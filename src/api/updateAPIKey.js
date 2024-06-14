import api from './api'

export default (gameId, apiKeyId, data) => api.put(`/games/${gameId}/api-keys/${apiKeyId}`, data)
