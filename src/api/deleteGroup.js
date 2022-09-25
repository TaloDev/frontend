import api from './api'

export default (gameId, groupId) => api.delete(`/games/${gameId}/player-groups/${groupId}`)
