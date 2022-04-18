import api from './api'

export default (playerId, data) => api.patch(`/players/${playerId}`, data)
