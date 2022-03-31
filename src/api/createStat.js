import api from './api'

export default (gameId, data) => api.post('/game-stats', {
  ...data,
  gameId
})
