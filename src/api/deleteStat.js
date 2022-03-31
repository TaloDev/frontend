import api from './api'

export default (id) => api.delete(`/game-stats/${id}`)
