import { z } from 'zod'
import { ResetMode } from '../constants/resetMode'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'

export const resetFeedbackCategory = makeValidatedRequest(
  (gameId: number, categoryId: number, mode: ResetMode) =>
    api.delete(`/games/${gameId}/game-feedback/categories/${categoryId}/feedback?mode=${mode}`),
  z.object({ deletedCount: z.number() }),
)
