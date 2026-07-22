import { z } from 'zod'
import { apiKeySchema } from '../entities/apiKey'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'

export const updateAPIKey = makeValidatedRequest(
  (gameId: number, apiKeyId: number, data: { scopes: string[] }) =>
    api.put(`/games/${gameId}/api-keys/${apiKeyId}`, data),
  z.object({
    apiKey: apiKeySchema,
  }),
)
