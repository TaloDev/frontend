import { z } from 'zod'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'

const deleteAPIKey = makeValidatedRequest(
  (gameId: number, apiKeyId: number) => api.delete(`/games/${gameId}/api-keys/${apiKeyId}`),
  z.literal(''),
)

export default deleteAPIKey
