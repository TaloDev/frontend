import api from './api'

export default (gameId, data) => api.post(`/games/${gameId}/game-feedback/categories`, data)
