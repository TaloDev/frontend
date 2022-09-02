import api from './api'

export default (gameId, integrationId, data) => api.patch(`/games/${gameId}/integrations/${integrationId}`, data)
