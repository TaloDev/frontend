import { z } from 'zod'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'

export const clearHeadlines = makeValidatedRequest(
  (gameId: number) => api.delete(`/games/${gameId}/headlines`),
  z.object({}),
)
