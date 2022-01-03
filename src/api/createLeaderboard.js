import api from './api'

export default (gameId, data) => api.post('/leaderboards', {
  ...data,
  gameId
})
