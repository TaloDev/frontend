import api from './api'

export default (id) => api.get(`/leaderboards/${id}`)
