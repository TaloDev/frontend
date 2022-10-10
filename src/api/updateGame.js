import api from './api'

export default (gameId, data) => api.patch(`/games/${gameId}`, data)
