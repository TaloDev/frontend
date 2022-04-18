import api from './api'

export default (gameId, entities) => api.post('/data-exports', { gameId, entities })
