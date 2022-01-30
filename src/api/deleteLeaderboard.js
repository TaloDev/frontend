import api from './api'

export default (internalName, gameId) => api.delete(`/leaderboards/${internalName}`, {
  data: {
    gameId
  }
})
