import { z } from 'zod'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'

export const deleteVerificationKey = makeValidatedRequest(
  (gameId: number, id: number) => api.delete(`/games/${gameId}/verification-keys/${id}`),
  z.literal(''),
)
