import { z } from 'zod'
import { GameFeedbackCategory, gameFeedbackCategorySchema } from '../entities/gameFeedbackCategory'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'

type Data = Pick<GameFeedbackCategory, 'internalName' | 'name' | 'description' | 'anonymised'>

const createFeedbackCategory = makeValidatedRequest(
  (gameId: number, data: Data) => api.post(`/games/${gameId}/game-feedback/categories`, data),
  z.object({
    feedbackCategory: gameFeedbackCategorySchema
  })
)

export default createFeedbackCategory
