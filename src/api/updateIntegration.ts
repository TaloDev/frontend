import { z } from 'zod'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'
import { IntegrationConfig, integrationSchema } from '../entities/integration'

const updateIntegration = makeValidatedRequest(
  (gameId: number, integrationId: number, data: { config: Partial<IntegrationConfig> }) =>
    api.patch(`/games/${gameId}/integrations/${integrationId}`, data),
  z.object({
    integration: integrationSchema
  })
)

export default updateIntegration
