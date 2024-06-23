import { z } from 'zod'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'

const deleteFeedbackCategory = makeValidatedRequest(
  (gameId: number, feedbackCategoryId: number) => api.delete(`/games/${gameId}/game-feedback/categories/${feedbackCategoryId}`),
  z.object({}).strict()
)

export default deleteFeedbackCategory
