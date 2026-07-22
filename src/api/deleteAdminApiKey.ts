import { z } from 'zod'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'

export const deleteAdminApiKey = makeValidatedRequest(
  (gameId: number, keyId: number) => api.delete(`/games/${gameId}/admin-api-keys/${keyId}`),
  z.literal(''),
)
