import api from './api'

export default (gameId, integrationId) => api.post(`/games/${gameId}/integrations/${integrationId}/sync-stats`)
