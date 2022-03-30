import api from './api'

export default (id, data) => api.patch(`/game-stats/${id}`, data)
