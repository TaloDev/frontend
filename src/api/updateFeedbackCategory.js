import api from './api'

export default (gameId, feedbackCategoryId, data) => api.put(`/games/${gameId}/game-feedback/categories/${feedbackCategoryId}`, data)
