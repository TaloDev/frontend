import api from './api'

export default (gameId, apiKeyId) => api.delete(`/games/${gameId}/api-keys/${apiKeyId}`)
