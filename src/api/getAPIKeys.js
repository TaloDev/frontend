import api from './api'

export default (gameId) => api.get(`/games/${gameId}/api-keys`)
