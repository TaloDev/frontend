import api from './api'
import { z } from 'zod'
import makeValidatedRequest from './makeValidatedRequest'
import { Integration, integrationSchema } from '../entities/integration'

const enableIntegration = makeValidatedRequest(
  (gameId: number, data: Pick<Integration, 'type' | 'config'>) => api.post(`/games/${gameId}/integrations`, data),
  z.object({
    integration: integrationSchema
  })
)

export default enableIntegration
