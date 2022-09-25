import api from './api'

export default (gameId, groupId, data) => api.put(`/games/${gameId}/player-groups/${groupId}`, data)
