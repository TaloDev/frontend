import { z } from 'zod'
import { adminApiKeySchema } from '../entities/adminApiKey'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'

export const createAdminApiKey = makeValidatedRequest(
  (gameId: number, name: string, scopes: string[]) =>
    api.post(`/games/${gameId}/admin-api-keys`, { name, scopes }),
  z.object({
    key: z.string(),
    apiKey: adminApiKeySchema,
  }),
)
