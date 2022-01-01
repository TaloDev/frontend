import api from './api'

export default (internalName, gameId, data) => api.patch(`/leaderboards/${internalName}`, {
  ...data,
  gameId
})
