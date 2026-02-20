import { z } from 'zod'
import { apiKeySchema } from '../entities/apiKey'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'

const createAPIKey = makeValidatedRequest(
  (gameId: number, scopes: string[]) => api.post(`/games/${gameId}/api-keys`, { scopes }),
  z.object({
    token: z.string(),
    apiKey: apiKeySchema,
  }),
)

export default createAPIKey
