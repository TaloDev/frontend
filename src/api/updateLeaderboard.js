import api from './api'

export default (id, data) => api.patch(`/leaderboards/${id}`, data)
