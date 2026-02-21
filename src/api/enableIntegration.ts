import { z } from 'zod'
import { Integration, integrationSchema } from '../entities/integration'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'

const enableIntegration = makeValidatedRequest(
  (gameId: number, data: Pick<Integration, 'type' | 'config'>) =>
    api.post(`/games/${gameId}/integrations`, data),
  z.object({
    integration: integrationSchema,
  }),
)

export default enableIntegration
