import { z } from 'zod'
import { GameFeedbackCategory, gameFeedbackCategorySchema } from '../entities/gameFeedbackCategory'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'

type Data = Pick<GameFeedbackCategory, 'internalName' | 'name' | 'description' | 'anonymised'>

const updateFeedbackCategory = makeValidatedRequest(
  (gameId: number, feedbackCategoryId: number, data: Data) =>
    api.put(`/games/${gameId}/game-feedback/categories/${feedbackCategoryId}`, data),
  z.object({
    feedbackCategory: gameFeedbackCategorySchema,
  }),
)

export default updateFeedbackCategory
