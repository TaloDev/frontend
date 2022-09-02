import api from './api'

export default (gameId, integrationId) => api.delete(`/games/${gameId}/integrations/${integrationId}`)
