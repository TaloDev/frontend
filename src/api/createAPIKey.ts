import { z } from 'zod'
import { apiKeySchema } from '../entities/apiKey'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'

export const createAPIKey = makeValidatedRequest(
  (gameId: number, name: string, scopes: string[]) =>
    api.post(`/games/${gameId}/api-keys`, { name, scopes }),
  z.object({
    token: z.string(),
    apiKey: apiKeySchema,
  }),
)
