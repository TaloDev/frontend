import { z } from 'zod'
import { gameFeedbackSchema } from '../entities/gameFeedback'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'

export const toggleFeedbackArchived = makeValidatedRequest(
  (gameId: number, feedbackId: number, archived: boolean) =>
    api.patch(`/games/${gameId}/game-feedback/${feedbackId}/toggle-archived`, { archived }),
  z.object({
    feedback: gameFeedbackSchema,
  }),
)
