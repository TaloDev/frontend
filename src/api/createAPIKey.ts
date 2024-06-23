import { z } from 'zod'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'
import { apiKeySchema } from '../entities/apiKey'

const createAPIKey = makeValidatedRequest(
  (gameId: number, scopes: string[]) => api.post(`/games/${gameId}/api-keys`, { scopes }),
  z.object({
    token: z.string(),
    apiKey: apiKeySchema
  })
)

export default createAPIKey

