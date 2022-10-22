import api from './api'

export default (gameId, internalName) => api.get(`/games/${gameId}/leaderboards/search?internalName=${internalName}`)
