import api from './api'

export default (gameId) => api.get(`/api-keys?gameId=${gameId}`)
