import api from './api'

export default (gameId, entities) => api.post(`/games/${gameId}/data-exports`, { entities })
