import { z } from 'zod'
import { apiKeySchema } from '../entities/apiKey'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'

type UpdateAPIKeyData = {
  name?: string
  scopes?: string[]
}

export const updateAPIKey = makeValidatedRequest(
  (gameId: number, apiKeyId: number, data: UpdateAPIKeyData) =>
    api.put(`/games/${gameId}/api-keys/${apiKeyId}`, data),
  z.object({
    apiKey: apiKeySchema,
  }),
)
