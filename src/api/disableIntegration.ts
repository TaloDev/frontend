import api from './api'
import { z } from 'zod'
import makeValidatedRequest from './makeValidatedRequest'

const disableIntegration = makeValidatedRequest(
  (gameId: number, integrationId: number) => api.delete(`/games/${gameId}/integrations/${integrationId}`),
  z.object({}).strict()
)

export default disableIntegration
