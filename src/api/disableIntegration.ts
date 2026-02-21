import { z } from 'zod'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'

const disableIntegration = makeValidatedRequest(
  (gameId: number, integrationId: number) =>
    api.delete(`/games/${gameId}/integrations/${integrationId}`),
  z.literal(''),
)

export default disableIntegration
