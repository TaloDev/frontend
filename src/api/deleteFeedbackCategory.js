import api from './api'

export default (gameId, feedbackCategoryId) => api.delete(`/games/${gameId}/game-feedback/categories/${feedbackCategoryId}`)
