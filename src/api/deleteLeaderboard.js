import api from './api'

export default (id) => api.delete(`/leaderboards/${id}`)
