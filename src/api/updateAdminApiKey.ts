import { z } from 'zod'
import { adminApiKeySchema } from '../entities/adminApiKey'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'

type UpdateAdminApiKeyData = {
  name?: string
  scopes?: string[]
}

export const updateAdminApiKey = makeValidatedRequest(
  (gameId: number, keyId: number, data: UpdateAdminApiKeyData) =>
    api.put(`/games/${gameId}/admin-api-keys/${keyId}`, data),
  z.object({
    apiKey: adminApiKeySchema,
  }),
)
