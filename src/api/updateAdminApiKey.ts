import { z } from 'zod'
import { adminApiKeySchema } from '../entities/adminApiKey'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'

export const updateAdminApiKey = makeValidatedRequest(
  (gameId: number, keyId: number, data: { scopes: string[] }) =>
    api.put(`/games/${gameId}/admin-api-keys/${keyId}`, data),
  z.object({
    apiKey: adminApiKeySchema,
  }),
)
